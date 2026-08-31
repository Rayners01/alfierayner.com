import { NextResponse } from "next/server";
import { queryOne } from "@/lib/db";
import { verifyPassword } from "@/lib/password.mjs";
import { createSession, pruneExpiredSessions } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let email: unknown;
  let password: unknown;

  try {
    ({ email, password } = await request.json());
  } catch {
    return NextResponse.json({ error: "Malformed request" }, { status: 400 });
  }

  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 },
    );
  }

  const user = await queryOne<{ id: string; password_hash: string }>(
    `select id, password_hash from users where email = $1`,
    [email.trim().toLowerCase()],
  );

  // Hash even when the account does not exist, so response timing does not
  // reveal which addresses are registered.
  const valid = await verifyPassword(
    password,
    user?.password_hash ?? "scrypt$00$00",
  );

  if (!user || !valid) {
    return NextResponse.json(
      { error: "Incorrect email or password" },
      { status: 401 },
    );
  }

  await createSession(user.id);
  await pruneExpiredSessions();

  return NextResponse.json({ ok: true });
}
