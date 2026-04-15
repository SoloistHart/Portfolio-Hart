"use client";

import { useCallback, useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark" | "system";

function applyTheme(t: Theme) {
  const root = document.documentElement;
  root.classList.add("theme-transitioning");
  root.classList.remove("light", "dark");
  if (t !== "system") {
    root.classList.add(t);
  }
  setTimeout(() => root.classList.remove("theme-transitioning"), 450);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored === "dark" || stored === "light") {
      setTheme(stored);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    applyTheme(theme);
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  const cycle = useCallback(() => {
    setTheme((prev) =>
      prev === "system" ? "dark" : prev === "dark" ? "light" : "system",
    );
  }, []);

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      mounted &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <button
      onClick={cycle}
      className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface backdrop-blur-xl hover:bg-surface-strong"
      aria-label={`Theme: ${theme}. Click to change.`}
    >
      {isDark ? (
        <Moon className="h-4 w-4 text-foreground" />
      ) : (
        <Sun className="h-4 w-4 text-foreground" />
      )}
    </button>
  );
}
