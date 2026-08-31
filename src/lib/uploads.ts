import path from "node:path";

export const UPLOADS_DIR =
  process.env.UPLOADS_DIR ?? path.join(process.cwd(), "var", "uploads");

export const UPLOADS_URL = "/uploads";

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export const ACCEPTED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

export function resolveUpload(segments: string[]): string | null {
  const resolved = path.resolve(UPLOADS_DIR, ...segments);
  const root = path.resolve(UPLOADS_DIR);

  return resolved === root || resolved.startsWith(root + path.sep)
    ? resolved
    : null;
}
