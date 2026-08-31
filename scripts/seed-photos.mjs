/**
 * Moves the photo library that used to live in src/content/photos.ts into the
 * database, copying each file into the uploads directory.
 *
 *   npm run db:seed
 *
 * Safe to re-run: it skips any caption already present.
 */
import { copyFile, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { Client } from "pg";

const SEED = [
  { file: "IMG_7008.jpg", caption: "Camps Bay" },
  { file: "IMG_7011.jpg", caption: "Mokoro" },
  { file: "IMG_7013.jpg", caption: "Victoria Falls" },
  { file: "IMG_7015.jpg", caption: "Vic Falls Bridge" },
  { file: "IMG_7009.jpg", caption: "Table Mountain" },
  { file: "IMG_7012.jpg", caption: "Elephants" },
  { file: "IMG_7010.jpg", caption: "Safari Car" },
  { file: "IMG_7017.jpg", caption: "Elephant Skull" },
];

const SOURCE_DIR = path.join(process.cwd(), "public", "assets", "images");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. See .env.example.");
  }

  const client = new Client({ connectionString });
  await client.connect();
  await mkdir(UPLOADS_DIR, { recursive: true });

  try {
    const owner = await client.query(`select id from users order by id limit 1`);
    const uploadedBy = owner.rows[0]?.id ?? null;

    for (const { file, caption } of SEED) {
      const exists = await client.query(
        `select 1 from photos where caption = $1`,
        [caption],
      );
      if (exists.rowCount) {
        console.log(`skipped ${caption} — already present`);
        continue;
      }

      const source = path.join(SOURCE_DIR, file);
      const { size } = await stat(source);
      const filename = `${randomUUID()}.jpg`;

      await copyFile(source, path.join(UPLOADS_DIR, filename));
      await client.query(
        `insert into photos (filename, caption, mime_type, byte_size, uploaded_by)
              values ($1, $2, 'image/jpeg', $3, $4)`,
        [filename, caption, size, uploadedBy],
      );

      console.log(`seeded ${caption}`);
    }
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
