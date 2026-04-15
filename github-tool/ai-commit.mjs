import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import readline from "node:readline/promises";

const run = (command, args) => {
  return execFileSync(command, args, { encoding: "utf8" }).trimEnd();
};

const loadEnvFile = (filePath) => {
  if (!fs.existsSync(filePath)) return;
  const envContent = fs.readFileSync(filePath, "utf8");
  envContent.split("\n").forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (!match) return;
    const key = match[1];
    let value = match[2] || "";
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    if (process.env[key] === undefined || process.env[key] === "") {
      process.env[key] = value;
    }
  });
};

const loadEnvFiles = () => {
  loadEnvFile(path.resolve(process.cwd(), ".env.local"));
  loadEnvFile(path.resolve(process.cwd(), ".env"));
};

const parseList = (value) => {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const uniqueProviders = (providers) => {
  const seen = new Set();
  return providers.filter((provider) => {
    if (seen.has(provider)) return false;
    seen.add(provider);
    return true;
  });
};

const getProviderOrder = () => {
  const primary = process.env.AI_PROVIDER ?? "openai";
  const fallbacks = parseList(process.env.AI_FALLBACK_PROVIDERS);
  return uniqueProviders([primary, ...fallbacks]);
};

const hasStagedChanges = () => {
  const staged = run("git", ["diff", "--staged"]);
  return staged.trim().length > 0;
};

const getDiff = () => run("git", ["diff", "--staged"]);

const getStatus = () => run("git", ["status", "--porcelain"]);

const getStagedFiles = () => {
  const output = run("git", ["diff", "--staged", "--name-only"]);
  return output.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
};

const stripCodeFences = (message) => {
  if (!message) return message;
  const trimmed = message.trim();
  if (trimmed.startsWith("```") && trimmed.endsWith("```")) {
    return trimmed.replace(/^```[a-zA-Z]*\n?/, "").replace(/```$/, "").trim();
  }
  return trimmed;
};

const promptForApproval = async (message) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  try {
    const answer = await rl.question("Use this commit message? (y/N): ");
    return answer.trim().toLowerCase() === "y";
  } finally {
    rl.close();
  }
};

const writeMessageFile = (message) => {
  const filePath = path.join(os.tmpdir(), `ai-commit-${Date.now()}.txt`);
  fs.writeFileSync(filePath, message, "utf8");
  return filePath;
};

const commitWithMessageFile = (filePath) => {
  const result = spawnSync("git", ["commit", "-F", filePath], {
    stdio: "inherit",
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

const buildPrompt = (status, diff) => {
  return `You are an expert engineer writing a Conventional Commit message.
Return ONLY the commit message, no extra text.

Format:
<type>(<scope>): <summary>

<body paragraph explaining WHY>

<bullet list of key changes>

Do NOT include a "BREAKING CHANGE:" paragraph unless the diff explicitly includes a breaking change marker (e.g., literal "BREAKING CHANGE" text, or a major-version bump, or removal of a public API documented in the diff). If unsure, omit it.
Ensure every line is 100 characters or fewer.

Status:
${status}

Diff:
${diff}
`;
};

const isDocsOnly = (files) => {
  if (!files.length) return false;
  return files.every((file) => file.startsWith("docs/") || file === "README.md");
};

const isCiOnly = (files) => {
  if (!files.length) return false;
  return files.every((file) => file.startsWith(".github/"));
};

const isToolingOnly = (files) => {
  if (!files.length) return false;
  const allowedFiles = new Set([
    "package.json",
    "package-lock.json",
    "pnpm-lock.yaml",
    "yarn.lock",
    "commitlint.config.cjs",
    "vite.config.js",
    "docker-compose.yml",
  ]);
  return files.every((file) =>
    file.startsWith("github-tool/") ||
    file.startsWith("scripts/") ||
    file.startsWith(".husky/") ||
    file.startsWith("tools/") ||
    file.startsWith("configs/") ||
    file.startsWith("config/") ||
    file.startsWith("docs/") ||
    allowedFiles.has(file)
  );
};

const hasCommitToolingFiles = (files) => {
  const commitFiles = new Set([
    "commitlint.config.cjs",
    "package.json",
    "package-lock.json",
    "github-tool/ai-commit.mjs",
    "scripts/ai-commit.mjs",
    "docs/COMMIT_WORKFLOW.md",
  ]);
  return files.some((file) => file.startsWith(".husky/") || commitFiles.has(file));
};

const forcedTypeForFiles = (files) => {
  if (isDocsOnly(files)) return "docs";
  if (isCiOnly(files)) return "ci";
  if (isToolingOnly(files)) return "chore";
  return null;
};

const enforceCommitType = (message, files) => {
  const forcedType = forcedTypeForFiles(files);
  if (!forcedType) return message;

  const lines = message.split(/\r?\n/);
  if (!lines.length) return message;
  const header = lines[0].trim();
  const match = header.match(/^(\w+)(\([^)]*\))?:\s+(.+)$/);
  if (!match) return message;

  const currentType = match[1];
  const currentScope = match[2] ?? "";
  const subject = match[3];
  if (currentType === forcedType) return message;

  let nextScope = currentScope;
  if (!nextScope && forcedType === "chore" && hasCommitToolingFiles(files)) {
    nextScope = "(commit)";
  }

  const nextHeader = `${forcedType}${nextScope}: ${subject}`;
  return [nextHeader, ...lines.slice(1)].join("\n");
};

const wrapText = (text, width, firstPrefix = "", nextPrefix = "") => {
  const words = text.split(/\s+/).filter(Boolean);
  if (!words.length) return [firstPrefix.trimEnd()];

  const lines = [];
  let current = firstPrefix;
  for (const word of words) {
    const separator = current.trim().length ? " " : "";
    if ((current + separator + word).length > width) {
      lines.push(current.trimEnd());
      current = nextPrefix + word;
    } else {
      current = current + separator + word;
    }
  }
  lines.push(current.trimEnd());
  return lines;
};

const normalizeLineLengths = (message, width = 100) => {
  const lines = message.split(/\r?\n/);
  if (!lines.length) return message;

  const header = lines[0];
  const result = [header];
  let inCodeBlock = false;

  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      result.push(line);
      continue;
    }

    if (inCodeBlock) {
      result.push(line);
      continue;
    }

    if (!trimmed) {
      result.push("");
      continue;
    }

    if (trimmed.startsWith("- ")) {
      const bulletText = trimmed.slice(2);
      const wrapped = wrapText(bulletText, width, "- ", "  ");
      result.push(...wrapped);
      continue;
    }

    if (trimmed.startsWith("BREAKING CHANGE:")) {
      const breakingText = trimmed.slice("BREAKING CHANGE:".length).trim();
      const wrapped = wrapText(breakingText, width, "BREAKING CHANGE: ", "  ");
      result.push(...wrapped);
      continue;
    }

    const wrapped = wrapText(trimmed, width);
    result.push(...wrapped);
  }

  return result.join("\n");
};

const requestOpenAICompatible = async ({ apiKey, baseUrl, model, prompt, system }) => {
  if (!apiKey) throw new Error("Missing API key for OpenAI-compatible provider.");
  const normalizedBase = (baseUrl ?? "https://api.openai.com/v1").replace(/\/$/, "");
  const url = normalizedBase.endsWith("/v1")
    ? `${normalizedBase}/chat/completions`
    : `${normalizedBase}/v1/chat/completions`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI-compatible request failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content ?? "";
};

const requestGemini = async ({ apiKey, baseUrl, model, prompt, system }) => {
  if (!apiKey) throw new Error("Missing GEMINI_API_KEY.");
  if (!model) throw new Error("Missing GEMINI_MODEL.");

  const normalizedBase = (baseUrl ?? "https://generativelanguage.googleapis.com/v1beta")
    .replace(/\/$/, "");
  const url = `${normalizedBase}/models/${model}:generateContent?key=${apiKey}`;
  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  };
  if (system) {
    body.systemInstruction = { parts: [{ text: system }] };
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini request failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("") ?? "";
  return text;
};

const callProvider = async ({ provider, prompt, system }) => {
  if (provider === "openai") {
    return requestOpenAICompatible({
      apiKey: process.env.OPENAI_API_KEY,
      baseUrl: process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1",
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      prompt,
      system,
    });
  }

  if (provider === "kimi") {
    return requestOpenAICompatible({
      apiKey: process.env.KIMI_API_KEY ?? process.env.MOONSHOT_API_KEY,
      baseUrl: process.env.KIMI_BASE_URL ?? "https://api.moonshot.ai",
      model: process.env.KIMI_MODEL,
      prompt,
      system,
    });
  }

  if (provider === "gemini") {
    return requestGemini({
      apiKey: process.env.GEMINI_API_KEY,
      baseUrl: process.env.GEMINI_BASE_URL,
      model: process.env.GEMINI_MODEL,
      prompt,
      system,
    });
  }

  throw new Error(`Unsupported AI provider: ${provider}`);
};

const main = async () => {
  loadEnvFiles();

  if (!hasStagedChanges()) {
    console.error("No staged changes found. Stage files first (git add).");
    process.exit(1);
  }

  const status = getStatus();
  const diff = getDiff();
  const stagedFiles = getStagedFiles();
  const prompt = buildPrompt(status, diff);

  const providers = getProviderOrder();
  const system = "You write high-quality git commit messages.";
  let rawMessage = "";
  let lastError = null;
  for (const provider of providers) {
    try {
      rawMessage = await callProvider({ provider, prompt, system });
      if (rawMessage) break;
    } catch (error) {
      lastError = error;
      console.warn(`[WARN] ${provider} failed: ${error.message}`);
    }
  }

  if (!rawMessage) {
    console.error(lastError ?? new Error("LLM returned an empty message."));
    process.exit(1);
  }
  const message = normalizeLineLengths(
    enforceCommitType(stripCodeFences(rawMessage), stagedFiles),
    100
  );

  if (!message) {
    console.error("LLM returned an empty message.");
    process.exit(1);
  }

  console.log("\nProposed commit message:\n");
  console.log(message);
  console.log("");

  const approved = await promptForApproval(message);
  if (!approved) {
    console.log("Commit cancelled.");
    process.exit(0);
  }

  const messageFile = writeMessageFile(message);
  commitWithMessageFile(messageFile);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});