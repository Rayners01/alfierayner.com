import path from "node:path";

/**
 * Where uploaded bytes live on disk.
 *
 * Deliberately *outside* `public/`. `next start` serves `public/` from a
 * snapshot taken at build time, so anything written there at runtime is
 * invisible to it — `next dev` reads from disk, which is what made this look
 * fine in development. Files here are served by the `/uploads/[...path]` route
 * handler instead, which reads from disk on every request.
 *
 * Override with UPLOADS_DIR to put the store on another volume; the default
 * keeps it beside the app but out of both the build output and git.
 */
export const UPLOADS_DIR =
  process.env.UPLOADS_DIR ?? path.join(process.cwd(), "var", "uploads");

/** Public path the bytes are served from, by nginx or the route handler. */
export const UPLOADS_URL = "/uploads";

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

/** Accepted image types, and the extension each is stored under. */
export const ACCEPTED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

/** Extension back to content type, for serving. */
export const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

/**
 * Resolves a requested path inside the uploads directory, or null if it
 * escapes — filenames are generated UUIDs, but the check costs nothing and
 * this handler takes its input straight from the URL.
 */
export function resolveUpload(segments: string[]): string | null {
  const resolved = path.resolve(UPLOADS_DIR, ...segments);
  const root = path.resolve(UPLOADS_DIR);

  return resolved === root || resolved.startsWith(root + path.sep)
    ? resolved
    : null;
}
