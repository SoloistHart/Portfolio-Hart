import { NextResponse } from "next/server";
import {
  buildLocalChatReply,
  buildPortfolioChatContext,
  findSuggestedLinks,
  getAllowedSuggestions,
  type ChatReply,
} from "@/lib/portfolio-chat";

type GeminiGenerateContentResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
};

function parseReply(content: string, message: string): ChatReply {
  const cleaned = content.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();

  try {
    const parsed = JSON.parse(cleaned) as Partial<ChatReply>;
    const allowed = new Map(getAllowedSuggestions().map((item) => [item.href, item]));
    const suggestions = Array.isArray(parsed.suggestions)
      ? parsed.suggestions
          .map((item) => (item?.href ? allowed.get(item.href) : undefined))
          .filter((item): item is NonNullable<typeof item> => Boolean(item))
          .slice(0, 3)
      : findSuggestedLinks(message);

    if (typeof parsed.answer === "string" && parsed.answer.trim()) {
      return {
        answer: parsed.answer.trim(),
        suggestions,
      };
    }
  } catch {
    return buildLocalChatReply(message);
  }

  return buildLocalChatReply(message);
}

async function generateAiReply(message: string) {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) return null;

  const prompt = `You are an AI guide for a developer portfolio website. Answer only from the provided portfolio context. Do not invent projects, metrics, technologies, or experience. If the answer is not supported by the context, say that directly and redirect the user to the contact section for clarification. Keep responses concise, polished, and specific.\n\nReturn valid JSON with this exact shape:\n{\n  "answer": "string",\n  "suggestions": [\n    { "label": "string", "href": "string" }\n  ]\n}\n\nOnly use suggestion href values from this list:\n${getAllowedSuggestions()
    .map((item) => `- ${item.href} (${item.label})`)
    .join("\n")}\n\nPortfolio context:\n${buildPortfolioChatContext()}`;

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: prompt }],
      },
      generationConfig: {
        temperature: 0.3,
        responseMimeType: "application/json",
      },
      contents: [
        {
          role: "user",
          parts: [{ text: message }],
        },
      ],
    }),
    },
  );

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as GeminiGenerateContentResponse;
  const content = data.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("").trim();

  if (!content) {
    return null;
  }

  return parseReply(content, message);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { message?: string } | null;
  const message = body?.message?.trim();

  if (!message) {
    return NextResponse.json({ error: "A message is required." }, { status: 400 });
  }

  const reply = (await generateAiReply(message)) || buildLocalChatReply(message);

  return NextResponse.json(reply);
}
