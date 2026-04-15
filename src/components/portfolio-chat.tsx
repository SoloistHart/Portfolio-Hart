"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, MessageSquare, Send, Sparkles, X } from "lucide-react";
import { siteContent } from "@/lib/portfolio-data";
import { type ChatLinkSuggestion } from "@/lib/portfolio-chat";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
  suggestions?: ChatLinkSuggestion[];
};

const initialMessage: ChatMessage = {
  id: "intro",
  role: "assistant",
  content: siteContent.chatbot.description,
  suggestions: [
    { label: "About", href: "/about" },
    { label: "Project archive", href: "/projects" },
  ],
};

export function PortfolioChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const messageId = useRef(1);

  const starterPrompts = useMemo(() => siteContent.chatbot.starterPrompts, []);

  async function sendMessage(rawMessage: string) {
    const message = rawMessage.trim();
    if (!message || pending) return;

    const userMessage: ChatMessage = {
      id: `user-${messageId.current++}`,
      role: "user",
      content: message,
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setPending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const payload = (await response.json()) as {
        answer?: string;
        suggestions?: ChatLinkSuggestion[];
        error?: string;
      };

      const assistantMessage: ChatMessage = {
        id: `assistant-${messageId.current++}`,
        role: "assistant",
        content:
          response.ok && payload.answer
            ? payload.answer
            : payload.error || "Something went wrong while generating a reply.",
        suggestions: payload.suggestions,
      };

      setMessages((current) => [...current, assistantMessage]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: `assistant-${messageId.current++}`,
          role: "assistant",
          content: "The portfolio guide is temporarily unavailable. Please try again in a moment.",
        },
      ]);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-4 z-50 sm:inset-x-auto sm:right-5 sm:bottom-5">
      <div className="ml-auto flex w-full max-w-[22rem] flex-col items-end gap-2.5">
        <AnimatePresence>
          {open ? (
            <motion.section
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto panel w-full overflow-hidden rounded-[1.5rem] shadow-[var(--shadow-lg)]"
              aria-label={siteContent.chatbot.title}
            >
              <div className="flex items-start justify-between gap-3 border-b border-line px-4 py-3.5">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {siteContent.chatbot.title}
                  </p>
                  <p className="mt-1 max-w-[16rem] text-xs leading-5 text-muted">
                    {siteContent.chatbot.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-surface hover:bg-surface-strong"
                  aria-label="Close portfolio chat"
                >
                  <X className="h-4 w-4 text-foreground" />
                </button>
              </div>

              <div className="scrollbar-hidden max-h-[22rem] space-y-3.5 overflow-y-auto px-4 py-3.5">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl px-3.5 py-3 text-sm leading-6 ${
                        message.role === "user"
                          ? "bg-foreground text-background"
                          : "bg-surface text-foreground ring-1 ring-line"
                      }`}
                    >
                      <p>{message.content}</p>

                      {message.suggestions?.length ? (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {message.suggestions.map((suggestion) => (
                            <Link
                              key={`${message.id}-${suggestion.href}`}
                              href={suggestion.href}
                              className="inline-flex items-center gap-1 rounded-full border border-line-strong bg-background/50 px-2.5 py-1 text-[0.72rem] font-medium text-foreground hover:bg-surface-strong"
                            >
                              {suggestion.label}
                              <ArrowUpRight className="h-3 w-3" />
                            </Link>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}

                {!messages.some((message) => message.role === "user") ? (
                  <div className="flex flex-wrap gap-2">
                    {starterPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => void sendMessage(prompt)}
                        className="rounded-full border border-line bg-surface px-3 py-2 text-left text-xs text-foreground hover:bg-surface-strong"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                ) : null}

                {pending ? (
                  <div className="flex justify-start">
                    <div className="rounded-2xl bg-surface px-3.5 py-3 text-sm text-muted ring-1 ring-line">
                      Thinking through the portfolio...
                    </div>
                  </div>
                ) : null}
              </div>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  void sendMessage(input);
                }}
                className="border-t border-line px-4 py-3.5"
              >
                <div className="flex items-end gap-2 rounded-[1.25rem] border border-line bg-surface px-3 py-2.5">
                  <textarea
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        void sendMessage(input);
                      }
                    }}
                    rows={1}
                    placeholder="Ask about projects, AI integrations, or experience"
                    className="max-h-28 min-h-9 flex-1 resize-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
                  />
                  <button
                    type="submit"
                    disabled={pending || !input.trim()}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Send message"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </motion.section>
          ) : null}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="pointer-events-auto inline-flex h-13 items-center gap-2 rounded-full border border-line-strong bg-surface-strong px-3.5 text-sm font-medium text-foreground shadow-[var(--shadow-md)] backdrop-blur-xl hover:bg-surface sm:px-4"
          aria-expanded={open}
          aria-label={open ? "Close portfolio chat" : "Open portfolio chat"}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background">
            {open ? <X className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
          </span>
          <span className="hidden flex-col items-start leading-tight sm:flex">
            <span>Ask AI</span>
            <span className="text-xs font-normal text-muted">Portfolio guide</span>
          </span>
          <MessageSquare className="hidden h-4 w-4 text-muted sm:block" />
        </button>
      </div>
    </div>
  );
}
