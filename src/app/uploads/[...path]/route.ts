import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { CONTENT_TYPES, resolveUpload } from "@/lib/uploads";

/**
 * Serves an uploaded image from disk.
 *
 * In production nginx intercepts `/uploads/` and this never runs for browser
 * traffic. It still matters for two things: local `next start` where there is
 * no nginx, and next/image — the optimizer fetches the source over the app's
 * own port, so it bypasses nginx and needs Next itself to be able to read the
 * file.
 */
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;
  const file = resolveUpload(segments);

  if (!file) return new Response("Not found", { status: 404 });

  const extension = path.extname(file).slice(1).toLowerCase();
  const contentType = CONTENT_TYPES[extension];

  if (!contentType) return new Response("Not found", { status: 404 });

  try {
    const info = await stat(file);
    if (!info.isFile()) return new Response("Not found", { status: 404 });

    const bytes = await readFile(file);

    return new Response(new Uint8Array(bytes), {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(info.size),
        // Filenames are UUIDs and their contents never change, so this can be
        // cached hard — unlike Next's `max-age=0` default for public assets.
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
