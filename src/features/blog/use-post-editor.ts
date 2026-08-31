"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import type { Post, PostInput } from "@/lib/posts.types";

/**
 * Form state and submission for the editor.
 */
export function usePostEditor(post: Post | null) {
  const router = useRouter();

  const [form, setForm] = useState<PostInput>({
    slug: post?.slug ?? "",
    title: post?.title ?? "",
    summary: post?.summary ?? "",
    body: post?.body ?? "",
    tags: post?.tags ?? [],
    coverUrl: post?.coverUrl ?? null,
    published: Boolean(post?.publishedAt),
  });

  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const update = useCallback(
    <K extends keyof PostInput>(key: K, value: PostInput[K]) => {
      setForm((current) => ({ ...current, [key]: value }));
    },
    [],
  );

  const save = useCallback(async () => {
    setBusy(true);
    setError(null);

    const editing = post !== null;
    const res = await fetch(
      editing ? `/api/posts/${post.slug}` : "/api/posts",
      {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      },
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error ?? "Could not save the post.");
      setBusy(false);
      return;
    }

    router.push(`/blog/${data.post.slug}`);
    router.refresh();
  }, [form, post, router]);

  return { form, update, save, error, busy };
}
