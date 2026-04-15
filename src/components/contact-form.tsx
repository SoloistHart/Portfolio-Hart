"use client";

import { useCallback, useRef, useState } from "react";
import { ArrowRight, Check } from "lucide-react";

const WEB3FORMS_KEY = "8dd9d4da-fa97-48d3-bc7a-6d73d802f99e";

type FormState = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState("");
  const loadTime = useRef(Date.now());

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setState("sending");
      setError("");

      const form = e.currentTarget;
      const data = new FormData(form);
      const name = data.get("name") as string;
      const email = data.get("email") as string;
      const message = data.get("message") as string;
      const honeypot = data.get("_honeypot") as string;

      if (!name.trim() || !email.trim() || !message.trim()) {
        setError("Please fill in all fields.");
        setState("idle");
        return;
      }

      // Anti-spam: honeypot check
      if (honeypot) {
        setState("sent");
        return;
      }

      // Anti-spam: time-based check (reject if < 3s)
      if (Date.now() - loadTime.current < 3000) {
        setState("sent");
        return;
      }

      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            name: name.trim(),
            email: email.trim(),
            message: message.trim().slice(0, 2000),
            subject: `Portfolio contact from ${name.trim()}`,
            from_name: "Portfolio Contact Form",
          }),
        });

        const result = await res.json();
        if (!result.success) throw new Error("Failed to send");

        setState("sent");
        form.reset();
      } catch {
        setError("Something went wrong. You can also reach me via email directly.");
        setState("error");
      }
    },
    [],
  );

  if (state === "sent") {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/20 text-accent">
          <Check className="h-6 w-6" />
        </span>
        <p className="text-lg font-semibold text-foreground">Message sent!</p>
        <p className="text-sm text-muted">
          I&apos;ll get back to you as soon as I can.
        </p>
        <button
          onClick={() => {
            setState("idle");
            loadTime.current = Date.now();
          }}
          className="mt-2 text-sm font-medium text-accent hover:text-foreground"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Honeypot — hidden from humans, bots will fill it */}
      <div className="absolute -left-[9999px]" aria-hidden="true" tabIndex={-1}>
        <input type="text" name="_honeypot" autoComplete="off" tabIndex={-1} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Your name"
            className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-foreground">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          placeholder="Tell me about your project or idea..."
          className="w-full resize-none rounded-xl border border-line bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-500">{error}</p>
      )}

      <button
        type="submit"
        disabled={state === "sending"}
        className="button-primary w-full disabled:opacity-60 sm:w-auto"
      >
        {state === "sending" ? "Sending..." : "Send message"}
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}
