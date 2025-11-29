import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "quantum" | "military" | "cyberpunk" | "aurora" | "sunset" | "ocean" | "matrix" | "dracula" | "synthwave" | string;

interface ThemeContextType {
  theme: Theme;
  toggleTheme?: () => void;
  switchable: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  switchable?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
  switchable = false,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (switchable) {
      const stored = localStorage.getItem("theme");
      return (stored as Theme) || defaultTheme;
    }
    return defaultTheme;
  });

  useEffect(() => {
    const root = document.documentElement;
    // Remove old classes if any
    root.classList.remove("light", "dark");
    // Set data-theme attribute for CSS variables
    root.setAttribute("data-theme", theme);
    // Also add class for Tailwind dark mode compatibility if needed
    if (theme === "dark" || theme === "quantum" || theme === "cyberpunk" || theme === "military" || theme === "matrix" || theme === "dracula" || theme === "synthwave") {
      root.classList.add("dark");
    }

    if (switchable) {
      localStorage.setItem("theme", theme);
    }
  }, [theme, switchable]);

  const toggleTheme = switchable
    ? () => {
      setTheme(prev => (prev === "light" ? "dark" : "light"));
    }
    : undefined;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, switchable }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
