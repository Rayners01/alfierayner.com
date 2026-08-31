/**
 * The library itself now lives in Postgres — see `db/migrations` and
 * `src/features/photos/photo-store.ts`. The original hard-coded list was moved
 * across by `npm run db:seed`.
 */
export const PHOTOS_PER_PAGE = 6;
