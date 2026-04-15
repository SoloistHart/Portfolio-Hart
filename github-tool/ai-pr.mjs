import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
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

const promptForApproval = async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  try {
    const answer = await rl.question("Create PR with this title/body? (y/N): ");
    return answer.trim().toLowerCase() === "y";
  } finally {
    rl.close();
  }
};

const ensureGh = () => {
  try {
    run("gh", ["--version"]);
  } catch (error) {
    console.error("GitHub CLI (gh) is required. Install it and login with 'gh auth login'.");
    process.exit(1);
  }
};

const getBranch = () => run("git", ["branch", "--show-current"]);

const getDefaultBase = () => {
  const branch = getBranch();
  if (branch.startsWith("feature/")) return "dev";
  return "main";
};

const getArgValue = (name) => {
  const index = process.argv.indexOf(`--${name}`);
  if (index === -1) return null;
  return process.argv[index + 1] ?? null;
};

const fetchBase = (base) => {
  try {
    run("git", ["fetch", "origin", base]);
  } catch (error) {
    console.error(`Failed to fetch origin/${base}.`);
    process.exit(1);
  }
};

const resolveBaseRef = (base) => {
  const remoteRef = `origin/${base}`;
  try {
    run("git", ["rev-parse", "--verify", remoteRef]);
    return remoteRef;
  } catch {
    return base;
  }
};

const getCommits = (base, head) => {
  return run("git", ["log", "--oneline", `${base}..${head}`]);
};

const getDiffStat = (base, head) => {
  return run("git", ["diff", "--stat", `${base}...${head}`]);
};

const buildPrompt = ({ base, head, commits, diffStat }) => {
  return `You are an expert engineer writing a pull request title and body.
Return ONLY this format:

TITLE: <title>
BODY:
## Summary
- bullet
- bullet

## Testing
- test command(s) or "Not run (explain)"

Rules:
- Title must be <= 72 characters, Conventional Commit style if possible.
- Summary bullets should be concise and based on the diff.
- Do not invent tests. If none found, say "Not run".

Base: ${base}
Head: ${head}

Commits:
${commits}

Diff stat:
${diffStat}
`;
};

const parseResponse = (text) => {
  const cleaned = text.trim();
  const titleMatch = cleaned.match(/^TITLE:\s*(.+)$/m);
  const bodyMatch = cleaned.match(/^BODY:\s*([\s\S]+)$/m);
  if (!titleMatch || !bodyMatch) return null;
  return {
    title: titleMatch[1].trim(),
    body: bodyMatch[1].trim(),
  };
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
  ensureGh();

  const base = getArgValue("base") ?? process.env.PR_BASE_BRANCH ?? getDefaultBase();
  const head = getBranch();
  if (!head) {
    console.error("Unable to determine current git branch.");
    process.exit(1);
  }

  fetchBase(base);
  const baseRef = resolveBaseRef(base);
  const commits = getCommits(baseRef, head);
  const diffStat = getDiffStat(baseRef, head);
  if (!commits && !diffStat) {
    console.error("No changes found between base and head.");
    process.exit(1);
  }

  const prompt = buildPrompt({ base: baseRef, head, commits, diffStat });

  const providers = getProviderOrder();
  const system = "You write concise PR titles and summaries.";
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
  const parsed = parseResponse(rawMessage);
  if (!parsed) {
    console.error("LLM response was not in the expected format.");
    process.exit(1);
  }

  console.log("\nProposed PR title:\n");
  console.log(parsed.title);
  console.log("\nProposed PR body:\n");
  console.log(parsed.body);
  console.log("");

  const approved = await promptForApproval();
  if (!approved) {
    console.log("PR creation cancelled.");
    process.exit(0);
  }

  const result = spawnSync(
    "gh",
    [
      "pr",
      "create",
      "--base",
      base,
      "--head",
      head,
      "--title",
      parsed.title,
      "--body",
      parsed.body,
    ],
    { stdio: "inherit" }
  );

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});