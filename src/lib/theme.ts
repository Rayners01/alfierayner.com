export const THEMES = ["mature", "fun"] as const;

export type Theme = (typeof THEMES)[number];

export const DEFAULT_THEME: Theme = "mature";

export const THEME_STORAGE_KEY = "theme";

export function isTheme(value: unknown): value is Theme {
  return THEMES.includes(value as Theme);
}

export function otherTheme(theme: Theme): Theme {
  return theme === "mature" ? "fun" : "mature";
}

export const THEMED_ASSETS = [
  "/assets/github.svg",
  "/assets/linkedin.svg",
  "/assets/polaroid.svg",
  "/assets/tortoise-shell.svg",
  "/assets/zig-zag.svg",
] as const;

export function themedAsset(path: string, theme: Theme): string {
  return theme === "mature" ? path.replace(/\.svg$/, "-dark.svg") : path;
}
