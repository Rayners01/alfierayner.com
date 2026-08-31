/**
 * The photo shape that crosses the server/client boundary.
 *
 * Kept apart from the store so client components can import the type without
 * pulling `server-only`, `pg` and `node:fs` into their import graph.
 */
export type Photo = {
  id: string;
  /** Public path the bytes are served from. */
  url: string;
  caption: string;
  createdAt: string;
};
