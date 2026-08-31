import "server-only";
import { Pool, type QueryResultRow } from "pg";

/**
 * Cached on `globalThis` because `next dev` re-evaluates modules on every
 * edit; without this each save would open another pool until Postgres starts
 * refusing connections.
 */
const globalForPg = globalThis as unknown as { pool?: Pool };

function createPool(): Pool {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. See .env.example for the expected value.",
    );
  }

  return new Pool({ connectionString, max: 10, idleTimeoutMillis: 30_000 });
}

export const pool: Pool = globalForPg.pool ?? createPool();

if (process.env.NODE_ENV !== "production") globalForPg.pool = pool;

/** Runs a parameterised query and returns the rows. */
export async function query<T extends QueryResultRow>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  const result = await pool.query<T>(text, params);
  return result.rows;
}

/** Runs a query expected to match at most one row. */
export async function queryOne<T extends QueryResultRow>(
  text: string,
  params: unknown[] = [],
): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}
