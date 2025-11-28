'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { themes } from './themes';

type Theme = typeof themes[number]['value'];

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
}>({ theme: 'cyber', setTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('cyber');

  useEffect(() => {
    const saved = localStorage.getItem('alsham-theme') as Theme;
    if (saved && themes.find(t => t.value === saved)) {
      setTheme(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('alsham-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    const t = themes.find(t => t.value === theme);
    if (t) {
      document.documentElement.style.setProperty('--primary', t.primary);
      document.documentElement.style.setProperty('--bg', t.bg);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);