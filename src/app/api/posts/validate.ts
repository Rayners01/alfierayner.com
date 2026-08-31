import { SLUG_PATTERN, type PostInput, slugify } from "@/lib/posts.types";

const MAX_TITLE = 200;
const MAX_SUMMARY = 400;

export type Validated =
  | { ok: true; input: PostInput }
  | { ok: false; error: string };

/**
 * Checks and normalises what the editor sent.
 */
export function validatePost(payload: unknown): Validated {
  if (typeof payload !== "object" || payload === null) {
    return { ok: false, error: "Malformed request." };
  }

  const body = payload as Record<string, unknown>;

  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title) return { ok: false, error: "A title is required." };
  if (title.length > MAX_TITLE) {
    return { ok: false, error: `Titles must be under ${MAX_TITLE} characters.` };
  }

  const markdown = typeof body.body === "string" ? body.body.trim() : "";
  if (!markdown) return { ok: false, error: "The post is empty." };

  const slug =
    typeof body.slug === "string" && body.slug.trim()
      ? body.slug.trim().toLowerCase()
      : slugify(title);

  if (!SLUG_PATTERN.test(slug)) {
    return {
      ok: false,
      error: "Slugs may only contain lowercase letters, numbers and hyphens.",
    };
  }

  const summary = typeof body.summary === "string" ? body.summary.trim() : "";
  if (summary.length > MAX_SUMMARY) {
    return {
      ok: false,
      error: `Summaries must be under ${MAX_SUMMARY} characters.`,
    };
  }

  const tags = Array.isArray(body.tags)
    ? [
        ...new Set(
          body.tags
            .filter((tag): tag is string => typeof tag === "string")
            .map((tag) => tag.trim().toLowerCase())
            .filter(Boolean),
        ),
      ].slice(0, 10)
    : [];

  const coverUrl =
    typeof body.coverUrl === "string" && body.coverUrl.trim()
      ? body.coverUrl.trim()
      : null;

  return {
    ok: true,
    input: {
      slug,
      title,
      summary,
      body: markdown,
      tags,
      coverUrl,
      published: body.published === true,
    },
  };
}
