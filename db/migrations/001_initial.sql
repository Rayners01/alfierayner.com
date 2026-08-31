-- Users, sessions and the photo library.
--
-- There is deliberately no public signup: accounts are created with
-- `npm run user:create`. The photo library is world-readable but only an
-- authenticated user may upload.

create table users (
  id            bigint generated always as identity primary key,
  email         text        not null unique,
  display_name  text        not null,
  -- "scrypt$<salt hex>$<derived key hex>" — see src/lib/password.ts
  password_hash text        not null,
  created_at    timestamptz not null default now()
);

create table sessions (
  -- SHA-256 of the cookie value, never the value itself: a leaked database
  -- dump then cannot be replayed as a live session.
  token_hash text        primary key,
  user_id    bigint      not null references users (id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index sessions_user_id_idx on sessions (user_id);
create index sessions_expires_at_idx on sessions (expires_at);

create table photos (
  id          bigint generated always as identity primary key,
  -- Basename within the uploads directory. The bytes live on disk; storing
  -- them base64 in the row would bloat every query that does not want them.
  filename    text        not null unique,
  caption     text        not null,
  mime_type   text        not null,
  byte_size   integer     not null check (byte_size > 0),
  -- Kept if the uploader is ever deleted; the photo is not theirs to take.
  uploaded_by bigint      references users (id) on delete set null,
  created_at  timestamptz not null default now()
);

create index photos_created_at_idx on photos (created_at desc, id desc);
