import { useState, useLayoutEffect, useEffect } from "react";

const useTheme = () => {
  const getStoredTheme = (): string | null =>
    typeof window !== "undefined" ? localStorage.getItem("theme") : null;
  const setStoredTheme = (theme: string): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
    }
  };
  const getPreferredTheme = (): string => {
    const storedTheme = getStoredTheme();
    if (storedTheme) {
      return storedTheme;
    }
    return typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };
  const setTheme = (theme: string): void => {
    if (typeof window !== "undefined") {
      if (theme === "auto") {
        document.documentElement.setAttribute(
          "data-bs-theme",
          window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
        );
      } else {
        document.documentElement.setAttribute("data-bs-theme", theme);
      }
    }
  };
  const [theme, setThemeState] = useState<string>(getPreferredTheme());
  useLayoutEffect(() => {
    setTheme(theme);
    setStoredTheme(theme);
  }, [theme]);
  useEffect(() => {
    const storedTheme = getStoredTheme();
    if (storedTheme && storedTheme !== theme) {
      setThemeState(storedTheme);
    }
  }, []);
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setThemeState(newTheme);
  };
  return { theme, toggleTheme };
};
export default useTheme;
