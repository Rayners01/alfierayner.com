create table posts (
  slug         text        primary key,
  title        text        not null,
  summary      text        not null default '',
  body         text        not null,
  tags         text[]      not null default '{}',
  cover_url    text,
  author_id    bigint      references users (id) on delete set null,
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index posts_published_at_idx on posts (published_at desc nulls first);

alter table photos
  add column kind text not null default 'library'
    check (kind in ('library', 'post'));

create index photos_kind_idx on photos (kind, created_at desc);
