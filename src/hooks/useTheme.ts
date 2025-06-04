import { useEffect, useState } from "react";
import { DARK_MODE_CLASS } from "../constants/editorConfig";
import type { Theme } from "../types/editor";

export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    const prefersDark = window.matchMedia?.(
      "(prefers-color-scheme: dark)"
    ).matches;
    if (saved) setTheme(saved);
    else if (prefersDark) setTheme("dark");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle(
      DARK_MODE_CLASS,
      theme === "dark"
    );
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return [theme, toggle];
}
