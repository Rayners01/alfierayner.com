/**
 * The site ships two complete looks.
 *
 * `mature` is the default: a dark, muted palette. `fun` is the original lime
 * and green one, kept because it is half the site's personality.
 */
export const THEMES = ["mature", "fun"] as const;

export type Theme = (typeof THEMES)[number];

export const DEFAULT_THEME: Theme = "mature";

/** Key the choice is remembered under, shared with the pre-paint script. */
export const THEME_STORAGE_KEY = "theme";

export function isTheme(value: unknown): value is Theme {
  return THEMES.includes(value as Theme);
}

export function otherTheme(theme: Theme): Theme {
  return theme === "mature" ? "fun" : "mature";
}

/**
 * Assets that exist in both looks ship as a pair: `x.svg` for `fun` and
 * `x-dark.svg` for `mature`. Content stores the plain path and the theme layer
 * derives the other, so nothing outside here needs to know the convention.
 */
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
