export type PostSummary = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  coverUrl: string | null;
  author: string | null;
  /** ISO date, or null for a draft. */
  publishedAt: string | null;
  updatedAt: string;
  readingMinutes: number;
};

export type Post = PostSummary & {
  body: string;
};

export type PostInput = {
  slug: string;
  title: string;
  summary: string;
  body: string;
  tags: string[];
  coverUrl: string | null;
  published: boolean;
};

/** Roughly 200 words a minute, rounded up, never zero. */
export function readingMinutes(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function slugify(title: string): string {
  return title
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function excerpt(body: string, limit = 200): string {
  const text = body
    .replace(/^---[\s\S]*?---/, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return text.length <= limit ? text : `${text.slice(0, limit).trimEnd()}…`;
}
