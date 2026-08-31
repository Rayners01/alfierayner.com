import { NextResponse } from "next/server";
import {
  createPost,
  listPosts,
  slugExists,
} from "@/features/blog/post-store";
import { getSessionUser } from "@/lib/session";
import { validatePost } from "./validate";

export const dynamic = "force-dynamic";

/** Drafts are only listed for a signed-in reader. */
export async function GET() {
  const user = await getSessionUser();
  const posts = await listPosts(Boolean(user));

  return NextResponse.json(
    { posts },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

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

  if (await slugExists(result.input.slug)) {
    return NextResponse.json(
      { error: `"${result.input.slug}" is already taken.` },
      { status: 409 },
    );
  }

  const post = await createPost(result.input, user.id);
  return NextResponse.json({ post }, { status: 201 });
}
