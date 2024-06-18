import { useState, useLayoutEffect } from "react";

const useTheme = () => {
  const getPreferredTheme = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  const setTheme = (theme: string) => {
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
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setThemeState(newTheme);
  };

  console.log(theme);

  return { theme, toggleTheme };
};

export default useTheme;
