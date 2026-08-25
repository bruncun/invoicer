import { createContext, createElement, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";

export type Theme = "light" | "dark";
type ThemeContextValue = { theme: Theme; toggleTheme: () => void };
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const getSystemTheme = (): Theme =>
  typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

export const ThemeProvider = ({ children, initialTheme }: PropsWithChildren<{ initialTheme?: Theme }>) => {
  const [theme, setTheme] = useState<Theme>(initialTheme ?? getSystemTheme);

  useEffect(() => {
    document.documentElement.dataset.bsTheme = theme;
    document.cookie = `theme=${theme}; Path=/; SameSite=Lax`;
  }, [theme]);

  useEffect(() => {
    if (initialTheme) return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event: MediaQueryListEvent) => setTheme(event.matches ? "dark" : "light");
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [initialTheme]);

  const value = useMemo(() => ({
    theme,
    toggleTheme: () => setTheme((current) => current === "dark" ? "light" : "dark"),
  }), [theme]);

  return createElement(ThemeContext.Provider, { value }, children);
};

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
};

export default useTheme;
