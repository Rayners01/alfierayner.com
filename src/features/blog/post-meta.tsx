import { cn } from "@/lib/cn";
import type { PostSummary } from "@/lib/posts.types";

export function formatPublished(iso: string | null): string {
  if (!iso) return "Draft";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function PostMeta({
  post,
  className,
}: {
  post: PostSummary;
  className?: string;
}) {
  return (
    <p className={cn("flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted", className)}>
      {!post.publishedAt && (
        <span className="rounded border border-accent px-1.5 py-0.5 text-accent">
          Draft
        </span>
      )}
      <span>{formatPublished(post.publishedAt)}</span>
      <span aria-hidden>·</span>
      <span>{post.readingMinutes} min read</span>
      {post.author && (
        <>
          <span aria-hidden>·</span>
          <span>{post.author}</span>
        </>
      )}
      {post.tags.length > 0 && (
        <>
          <span aria-hidden>·</span>
          <span className="flex flex-wrap gap-1">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded bg-raised px-1.5 py-0.5 text-frame"
              >
                {tag}
              </span>
            ))}
          </span>
        </>
      )}
    </p>
  );
}
