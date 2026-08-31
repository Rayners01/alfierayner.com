import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { query, queryOne } from "@/lib/db";
import {
  ACCEPTED_TYPES,
  MAX_UPLOAD_BYTES,
  UPLOADS_DIR,
  UPLOADS_URL,
} from "@/lib/uploads";
import type { Photo } from "@/lib/photos.types";

type PhotoRow = {
  id: string;
  filename: string;
  caption: string;
  created_at: Date;
};

function toPhoto(row: PhotoRow): Photo {
  return {
    id: row.id,
    url: `${UPLOADS_URL}/${row.filename}`,
    caption: row.caption,
    createdAt: row.created_at.toISOString(),
  };
}

export async function listPhotos(): Promise<Photo[]> {
  const rows = await query<PhotoRow>(
    `select id, filename, caption, created_at
       from photos
      order by created_at desc, id desc`,
  );
  return rows.map(toPhoto);
}

/**
 * Confirms the bytes really are the image type they claim to be.
 *
 * `File.type` is supplied by the browser and is trivially spoofed, so the
 * magic number is checked before anything is written to disk.
 */
function sniff(bytes: Buffer): string | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }
  if (bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return "image/png";
  }
  if (
    bytes.subarray(0, 4).toString("ascii") === "RIFF" &&
    bytes.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return "image/webp";
  }
  if (["GIF87a", "GIF89a"].includes(bytes.subarray(0, 6).toString("ascii"))) {
    return "image/gif";
  }
  return null;
}

export type UploadFailure =
  | "empty"
  | "too-large"
  | "unsupported-type"
  | "missing-caption";

export type UploadResult =
  | { ok: true; photo: Photo }
  | { ok: false; reason: UploadFailure };

export async function createPhoto({
  file,
  caption,
  userId,
}: {
  file: File;
  caption: string;
  userId: string;
}): Promise<UploadResult> {
  const trimmed = caption.trim();
  if (!trimmed) return { ok: false, reason: "missing-caption" };
  if (file.size === 0) return { ok: false, reason: "empty" };
  if (file.size > MAX_UPLOAD_BYTES) return { ok: false, reason: "too-large" };

  const bytes = Buffer.from(await file.arrayBuffer());
  const mimeType = sniff(bytes);
  if (!mimeType) return { ok: false, reason: "unsupported-type" };

  // A generated name, never the client's: it removes any path traversal or
  // collision question, and stops uploads overwriting each other.
  const filename = `${randomUUID()}.${ACCEPTED_TYPES[mimeType]}`;

  await mkdir(UPLOADS_DIR, { recursive: true });
  await writeFile(path.join(UPLOADS_DIR, filename), bytes);

  try {
    const row = await queryOne<PhotoRow>(
      `insert into photos (filename, caption, mime_type, byte_size, uploaded_by)
            values ($1, $2, $3, $4, $5)
         returning id, filename, caption, created_at`,
      [filename, trimmed, mimeType, bytes.length, userId],
    );

    return { ok: true, photo: toPhoto(row!) };
  } catch (error) {
    // Do not leave an orphaned file behind if the row could not be written.
    await unlink(path.join(UPLOADS_DIR, filename)).catch(() => {});
    throw error;
  }
}

/** Removes the row and the file. Returns false if the photo did not exist. */
export async function deletePhoto(id: string): Promise<boolean> {
  const row = await queryOne<{ filename: string }>(
    `delete from photos where id = $1 returning filename`,
    [id],
  );

  if (!row) return false;

  // The row is the source of truth; a file that is already gone is not an
  // error worth failing the request over.
  await unlink(path.join(UPLOADS_DIR, row.filename)).catch(() => {});
  return true;
}
