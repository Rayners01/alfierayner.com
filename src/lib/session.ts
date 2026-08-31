import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { query, queryOne } from "./db";

export const SESSION_COOKIE = "session";

/** How long a login lasts before it has to be repeated. */
const SESSION_DAYS = 30;

export type SessionUser = {
  id: string;
  email: string;
  displayName: string;
};

/**
 * The cookie carries a random token; the database stores only its SHA-256.
 * A dumped `sessions` table therefore cannot be replayed as a live login.
 */
function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Issues a session for `userId` and sets the cookie. */
export async function createSession(userId: string): Promise<void> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86_400_000);

  await query(
    `insert into sessions (token_hash, user_id, expires_at) values ($1, $2, $3)`,
    [hashToken(token), userId, expiresAt],
  );

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

/** Resolves the signed-in user, or null. Safe to call anywhere on the server. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const row = await queryOne<{
    id: string;
    email: string;
    display_name: string;
  }>(
    `select u.id, u.email, u.display_name
       from sessions s
       join users u on u.id = s.user_id
      where s.token_hash = $1
        and s.expires_at > now()`,
    [hashToken(token)],
  );

  if (!row) return null;
  return { id: row.id, email: row.email, displayName: row.display_name };
}

/** Deletes the current session, both in the database and in the browser. */
export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;

  if (token) {
    await query(`delete from sessions where token_hash = $1`, [
      hashToken(token),
    ]);
  }

  store.delete(SESSION_COOKIE);
}

/** Clears sessions that have already lapsed. Called opportunistically. */
export async function pruneExpiredSessions(): Promise<void> {
  await query(`delete from sessions where expires_at <= now()`);
}
