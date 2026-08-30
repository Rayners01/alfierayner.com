/**
 * The design tokens from `globals.css`, as plain hex values.
 *
 * WebGL and canvas surfaces (the globe) cannot read Tailwind classes, so they
 * read from here instead. Keep in sync with the `@theme` block.
 */
export const palette = {
  frame: "#15803d",
  ink: "#14532d",
  muted: "#22c55e",
  surface: "#d9f99d",
  raised: "#ecfccb",
  accent: "#facc15",
  ocean: "#0b3d91",
} as const;
