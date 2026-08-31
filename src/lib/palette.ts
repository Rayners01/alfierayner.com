import type { Theme } from "./theme";

/**
 * The design tokens from `globals.css`, as plain hex values.
 *
 * WebGL and canvas surfaces (the globe) cannot read Tailwind classes or CSS
 * variables, so they read from here instead. Keep in sync with the `@theme`
 * block and its `[data-theme="fun"]` override.
 */
export type Palette = {
  frame: string;
  ink: string;
  muted: string;
  surface: string;
  raised: string;
  accent: string;
  ocean: string;
};

export const palettes: Record<Theme, Palette> = {
  mature: {
    frame: "#DCD3C1",
    ink: "#FDF9F0",
    muted: "#BFB9A9",
    surface: "#1E4B5E",
    raised: "#2A6377",
    accent: "#E3B76B",
    ocean: "#16506B",
  },
  fun: {
    frame: "#15803d",
    ink: "#14532d",
    muted: "#22c55e",
    surface: "#d9f99d",
    raised: "#ecfccb",
    accent: "#facc15",
    ocean: "#0b3d91",
  },
};
