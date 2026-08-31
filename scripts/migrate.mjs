/**
 * Applies any migration in db/migrations that has not run yet.
 *
 *   npm run db:migrate
 *
 * Each file runs inside a transaction alongside the insert that records it, so
 * a failure leaves neither a half-applied schema nor a false record of it.
 */
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { Client } from "pg";

const MIGRATIONS_DIR = path.join(process.cwd(), "db", "migrations");

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. See .env.example.");
  }

  const client = new Client({ connectionString });
  await client.connect();

  try {
    await client.query(`
      create table if not exists schema_migrations (
        name       text primary key,
        applied_at timestamptz not null default now()
      )
    `);

    const applied = new Set(
      (
        await client.query(
          `select name from schema_migrations`,
        )
      ).rows.map((row) => row.name),
    );

    const files = (await readdir(MIGRATIONS_DIR))
      .filter((name) => name.endsWith(".sql"))
      .sort();

    const pending = files.filter((name) => !applied.has(name));

    if (pending.length === 0) {
      console.log("Nothing to apply — the schema is up to date.");
      return;
    }

    for (const name of pending) {
      const sql = await readFile(path.join(MIGRATIONS_DIR, name), "utf8");

      await client.query("begin");
      try {
        await client.query(sql);
        await client.query(
          `insert into schema_migrations (name) values ($1)`,
          [name],
        );
        await client.query("commit");
        console.log(`applied ${name}`);
      } catch (error) {
        await client.query("rollback");
        throw new Error(`${name} failed: ${error.message}`);
      }
    }
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
