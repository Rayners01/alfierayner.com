import "server-only";
import { query, queryOne } from "@/lib/db";
import {
  type Post,
  type PostInput,
  type PostSummary,
  excerpt,
  readingMinutes,
} from "@/lib/posts.types";

type PostRow = {
  slug: string;
  title: string;
  summary: string;
  body: string;
  tags: string[];
  cover_url: string | null;
  author: string | null;
  published_at: Date | null;
  updated_at: Date;
};

function toSummary(row: PostRow): PostSummary {
  return {
    slug: row.slug,
    title: row.title,
    summary: row.summary || excerpt(row.body),
    tags: row.tags,
    coverUrl: row.cover_url,
    author: row.author,
    publishedAt: row.published_at?.toISOString() ?? null,
    updatedAt: row.updated_at.toISOString(),
    readingMinutes: readingMinutes(row.body),
  };
}

function toPost(row: PostRow): Post {
  return { ...toSummary(row), body: row.body };
}

const SELECT = `
  select p.slug, p.title, p.summary, p.body, p.tags, p.cover_url,
         u.display_name as author, p.published_at, p.updated_at
    from posts p
    left join users u on u.id = p.author_id
`;

/**
 * Posts for the index.
 *
 * `includeDrafts` is only ever true for a signed-in reader — an unpublished
 * post must not leak through the public listing.
 */
export async function listPosts(includeDrafts: boolean): Promise<PostSummary[]> {
  const rows = await query<PostRow>(
    `${SELECT}
      ${includeDrafts ? "" : "where p.published_at is not null"}
      order by coalesce(p.published_at, p.updated_at) desc`,
  );
  return rows.map(toSummary);
}

export async function getPost(
  slug: string,
  includeDrafts: boolean,
): Promise<Post | null> {
  const row = await queryOne<PostRow>(
    `${SELECT}
      where p.slug = $1
        ${includeDrafts ? "" : "and p.published_at is not null"}`,
    [slug],
  );
  return row ? toPost(row) : null;
}

export async function slugExists(slug: string): Promise<boolean> {
  return (await queryOne(`select 1 from posts where slug = $1`, [slug])) !== null;
}

export async function createPost(
  input: PostInput,
  authorId: string,
): Promise<Post> {
  const row = await queryOne<PostRow>(
    `with inserted as (
       insert into posts (slug, title, summary, body, tags, cover_url,
                          author_id, published_at)
            values ($1, $2, $3, $4, $5, $6, $7, case when $8 then now() end)
         returning *
     )
     select i.slug, i.title, i.summary, i.body, i.tags, i.cover_url,
            u.display_name as author, i.published_at, i.updated_at
       from inserted i
       left join users u on u.id = i.author_id`,
    [
      input.slug,
      input.title,
      input.summary,
      input.body,
      input.tags,
      input.coverUrl,
      authorId,
      input.published,
    ],
  );

  return toPost(row!);
}

/**
 * Updates a post, optionally moving it to a new slug.
 *
 * `published_at` is set the first time a post is published and preserved
 * afterwards, so editing a live post does not reorder the index.
 */
export async function updatePost(
  slug: string,
  input: PostInput,
): Promise<Post | null> {
  const row = await queryOne<PostRow>(
    `with updated as (
       update posts
          set slug = $2,
              title = $3,
              summary = $4,
              body = $5,
              tags = $6,
              cover_url = $7,
              published_at = case
                when not $8 then null
                else coalesce(published_at, now())
              end,
              updated_at = now()
        where slug = $1
     returning *
     )
     select u2.slug, u2.title, u2.summary, u2.body, u2.tags, u2.cover_url,
            u.display_name as author, u2.published_at, u2.updated_at
       from updated u2
       left join users u on u.id = u2.author_id`,
    [
      slug,
      input.slug,
      input.title,
      input.summary,
      input.body,
      input.tags,
      input.coverUrl,
      input.published,
    ],
  );

  return row ? toPost(row) : null;
}

export async function deletePost(slug: string): Promise<boolean> {
  const row = await queryOne(`delete from posts where slug = $1 returning slug`, [
    slug,
  ]);
  return row !== null;
}
