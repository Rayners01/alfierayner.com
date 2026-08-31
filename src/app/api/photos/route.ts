import { NextResponse } from "next/server";
import {
  MAX_UPLOAD_BYTES,
  createPhoto,
  listPhotos,
  type UploadFailure,
} from "@/features/photos/photo-store";
import { getSessionUser } from "@/lib/session";

export const dynamic = "force-dynamic";

/** The library is public. */
export async function GET() {
  const photos = await listPhotos();
  return NextResponse.json(
    { photos },
    { headers: { "Cache-Control": "no-store" } },
  );
}

const FAILURE_MESSAGES: Record<UploadFailure, string> = {
  empty: "That file is empty.",
  "too-large": `Images must be under ${MAX_UPLOAD_BYTES / 1024 / 1024}MB.`,
  "unsupported-type": "Only JPEG, PNG, WebP and GIF images are accepted.",
  "missing-caption": "A caption is required.",
};

/** Uploading requires a session. */
export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Malformed upload" }, { status: 400 });
  }

  const file = form.get("file");
  const caption = form.get("caption");

  if (!(file instanceof File) || typeof caption !== "string") {
    return NextResponse.json(
      { error: "A file and a caption are required." },
      { status: 400 },
    );
  }

  const result = await createPhoto({ file, caption, userId: user.id });

  if (!result.ok) {
    return NextResponse.json(
      { error: FAILURE_MESSAGES[result.reason] },
      { status: 400 },
    );
  }

  return NextResponse.json({ photo: result.photo }, { status: 201 });
}
