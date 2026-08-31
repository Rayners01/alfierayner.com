import { NextResponse } from "next/server";
import { deletePhoto } from "@/features/photos/photo-store";
import { getSessionUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { id } = await params;
  if (!/^\d+$/.test(id)) {
    return NextResponse.json({ error: "Unknown photo" }, { status: 404 });
  }

  const removed = await deletePhoto(id);
  if (!removed) {
    return NextResponse.json({ error: "Unknown photo" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
