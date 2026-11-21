"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Moon, Leaf } from "lucide-react";

type Theme = "soft" | "dark";

const THEME_KEY = "gearnest-theme";
const THEME_EVENT = "gearnest-theme-change";

function subscribe(callback: () => void) {
  window.addEventListener(THEME_EVENT, callback);
  window.addEventListener("storage", callback);

  const observer = new MutationObserver(callback);

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  return () => {
    window.removeEventListener(THEME_EVENT, callback);
    window.removeEventListener("storage", callback);
    observer.disconnect();
  };
}

function getSnapshot(): Theme {
  return document.documentElement.classList.contains("dark")
    ? "dark"
    : "soft";
}

function getServerSnapshot(): Theme {
  return "soft";
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const isDark = theme === "dark";

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_KEY) as Theme | null;

      if (savedTheme === "soft" || savedTheme === "dark") {
        document.documentElement.classList.toggle(
          "dark",
          savedTheme === "dark",
        );
      }
    } catch {
      // The theme still works without browser storage.
    }
  }, []);

  function toggleTheme() {
    const nextTheme: Theme = isDark ? "soft" : "dark";

    document.documentElement.classList.toggle(
      "dark",
      nextTheme === "dark",
    );

    try {
      localStorage.setItem(THEME_KEY, nextTheme);
    } catch {
      // The theme still works without browser storage.
    }

    window.dispatchEvent(new Event(THEME_EVENT));
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label="Dark theme"
      title={isDark ? "Switch to Nature Mist" : "Switch to Midnight"}
      className="relative inline-flex h-9 w-[72px] shrink-0 items-center rounded-full border border-border bg-secondary transition-all duration-300 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Leaf
        size={15}
        aria-hidden="true"
        className="absolute left-3 text-secondary-foreground"
      />

      <Moon
        size={15}
        aria-hidden="true"
        className="absolute right-3 text-secondary-foreground"
      />

      <span
        aria-hidden="true"
        className={`absolute left-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform duration-300 motion-reduce:transition-none ${
          isDark ? "translate-x-9" : "translate-x-0"
        }`}
      >
        {isDark ? <Moon size={15} /> : <Leaf size={15} />}
      </span>
    </button>
  );
}

export { ThemeToggle };
