"use client";

import { useEffect, useState } from "react";
import NextLink from "next/link";
import { ButtonLink } from "@/components/ui/button";
import type { PostSummary } from "@/lib/posts.types";
import { cn } from "@/lib/cn";
import { formatPublished } from "./post-meta";

export function LatestPost({ className }: { className?: string }) {
  const [post, setPost] = useState<PostSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/posts", { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        setPost(data.posts?.[0] ?? null);
        setLoading(false);
      })
      .catch((error) => {
        if (error?.name !== "AbortError") setLoading(false);
      });

    return () => controller.abort();
  }, []);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-center gap-5">
        <p className="w-[calc(50%+20px)] text-xs tracking-wider text-muted uppercase max-md:w-auto max-md:flex-1">
          Latest post
        </p>
        <ButtonLink
          href="/blog"
          target="_self"
          className="w-1/4 px-2 py-1 text-xs max-md:w-1/3"
        >
          All posts
        </ButtonLink>
      </div>

      {post ? (
        <NextLink
          href={`/blog/${post.slug}`}
          className="group block max-w-[calc(75%+40px)] max-md:max-w-none"
        >
          <p className="font-semibold text-ink transition-colors group-hover:text-accent">
            {post.title}
          </p>
          <p className="text-xs text-muted">
            {formatPublished(post.publishedAt)} · {post.readingMinutes} min read
          </p>
        </NextLink>
      ) : (
        <p className="text-sm text-muted">
          {loading ? "Loading…" : "Nothing published yet."}
        </p>
      )}
    </div>
  );
}
