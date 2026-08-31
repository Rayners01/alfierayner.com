/**
 * The design tokens from `globals.css`, as plain hex values.
 *
 * WebGL and canvas surfaces (the globe) cannot read Tailwind classes, so they
 * read from here instead. Keep in sync with the `@theme` block.
 */
export const palette = {
  frame: "#DCD3C1",
  ink: "#FDF9F0",
  muted: "#BFB9A9",
  surface: "#1E4B5E",
  raised: "#2A6377",
  accent: "#E3B76B",
  ocean: "#16506B",
} as const;


/*export const palette = {
  frame: "#15803d",
  ink: "#14532d",
  muted: "#22c55e",
  surface: "#d9f99d",
  raised: "#ecfccb",
  accent: "#facc15",
  ocean: "#0b3d91",
} as const;*/