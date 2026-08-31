import { NextResponse } from "next/server";
import {
  deletePost,
  getPost,
  slugExists,
  updatePost,
} from "@/features/blog/post-store";
import { getSessionUser } from "@/lib/session";
import { validatePost } from "../validate";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const user = await getSessionUser();
  const { slug } = await params;
  const post = await getPost(slug, Boolean(user));

  if (!post) {
    return NextResponse.json({ error: "Unknown post" }, { status: 404 });
  }

  return NextResponse.json(
    { post },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { slug } = await params;

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request" }, { status: 400 });
  }

  const result = validatePost(payload);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  // Renaming is allowed, but not onto a slug another post already holds.
  if (result.input.slug !== slug && (await slugExists(result.input.slug))) {
    return NextResponse.json(
      { error: `"${result.input.slug}" is already taken.` },
      { status: 409 },
    );
  }

  const post = await updatePost(slug, result.input);
  if (!post) {
    return NextResponse.json({ error: "Unknown post" }, { status: 404 });
  }

  return NextResponse.json({ post });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { slug } = await params;
  if (!(await deletePost(slug))) {
    return NextResponse.json({ error: "Unknown post" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
