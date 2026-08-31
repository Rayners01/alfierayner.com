import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { CONTENT_TYPES, resolveUpload } from "@/lib/uploads";

/**
 * Serves an uploaded image from disk.
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
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
