import { useMemo, useSyncExternalStore } from "react";

export type ResolvedTheme = "light" | "dark";
export type Theme = ResolvedTheme | "system";

type ThemeListener = () => void;

export type UseThemeReturn = {
  readonly theme: Theme;
  readonly resolvedTheme: ResolvedTheme;
  readonly updateTheme: (mode: Theme) => void;
};

const listeners = new Set<ThemeListener>();
let currentTheme: Theme = "system";
let systemDark = false;

function notify(): void {
  listeners.forEach((listener) => {
    listener();
  });
}

function setCookie(name: string, value: string, days = 365): void {
  if (typeof document === "undefined") {
    return;
  }

  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
}

function getStoredTheme(): Theme {
  if (typeof window === "undefined") {
    return "system";
  }

  return (localStorage.getItem("theme") as Theme) || "system";
}

function isDarkMode(theme: Theme): boolean {
  return theme === "dark" || (theme === "system" && systemDark);
}

function applyTheme(theme: Theme): void {
  if (typeof document === "undefined") {
    return;
  }

  const isDark = isDarkMode(theme);
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.style.colorScheme = isDark ? "dark" : "light";
}

function subscribe(callback: ThemeListener): () => void {
  listeners.add(callback);

  return () => {
    listeners.delete(callback);
  };
}

export function initializeTheme(): void {
  if (typeof window === "undefined") {
    return;
  }

  const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
  const storedTheme = localStorage.getItem("theme");
  systemDark = matchMedia.matches;

  if (!storedTheme) {
    localStorage.setItem("theme", "system");
    setCookie("theme", "system");
  }

  currentTheme = (storedTheme as Theme) || "system";
  applyTheme(currentTheme);

  matchMedia.addEventListener("change", (event) => {
    systemDark = event.matches;
    applyTheme(currentTheme);
    notify();
  });
}

export function useTheme(): UseThemeReturn {
  const theme = useSyncExternalStore(
    subscribe,
    () => currentTheme,
    () => "system" as const,
  );

  const isSystemDark = useSyncExternalStore(
    subscribe,
    () => systemDark,
    () => false,
  );

  const resolvedTheme: ResolvedTheme = useMemo(() => {
    return theme === "dark" || (theme === "system" && isSystemDark)
      ? "dark"
      : "light";
  }, [theme, isSystemDark]);

  const updateTheme = (mode: Theme): void => {
    currentTheme = mode;

    if (typeof window !== "undefined") {
      localStorage.setItem("theme", mode);
      setCookie("theme", mode);
    }

    applyTheme(mode);
    notify();
  };

  return {
    theme,
    resolvedTheme,
    updateTheme,
  };
}
