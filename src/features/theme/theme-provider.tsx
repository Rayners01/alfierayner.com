"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  DEFAULT_THEME,
  THEMED_ASSETS,
  THEME_STORAGE_KEY,
  type Theme,
  isTheme,
  otherTheme,
  themedAsset,
} from "@/lib/theme";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: DEFAULT_THEME,
  setTheme: () => {},
  toggle: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME);

  useEffect(() => {
    const applied = document.documentElement.dataset.theme;
    if (isTheme(applied)) setThemeState(applied);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
    }
  }, []);

  const toggle = useCallback(
    () => setTheme(otherTheme(theme)),
    [setTheme, theme],
  );

  useEffect(() => {
    const next = otherTheme(theme);
    for (const asset of THEMED_ASSETS) {
      const image = new window.Image();
      image.src = themedAsset(asset, next);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
