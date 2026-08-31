create table users (
  id            bigint generated always as identity primary key,
  email         text        not null unique,
  display_name  text        not null,
  -- "scrypt$<salt hex>$<derived key hex>"
  password_hash text        not null,
  created_at    timestamptz not null default now()
);

create table sessions (
  token_hash text        primary key,
  user_id    bigint      not null references users (id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index sessions_user_id_idx on sessions (user_id);
create index sessions_expires_at_idx on sessions (expires_at);

create table photos (
  id          bigint generated always as identity primary key,
  filename    text        not null unique,
  caption     text        not null,
  mime_type   text        not null,
  byte_size   integer     not null check (byte_size > 0),
  uploaded_by bigint      references users (id) on delete set null,
  created_at  timestamptz not null default now()
);

create index photos_created_at_idx on photos (created_at desc, id desc);
