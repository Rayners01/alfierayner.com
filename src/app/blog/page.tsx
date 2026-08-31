import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { listPosts } from "@/features/blog/post-store";
import { BlogShell } from "@/features/blog/blog-shell";
import { PostMeta } from "@/features/blog/post-meta";
import { site } from "@/content/site";
import { getSessionUser } from "@/lib/session";

export const metadata: Metadata = {
  title: `Blog | ${site.title}`,
  description: "Writing about what I'm building.",
};

// Drafts are visible only when signed in, so the page cannot be cached.
export const dynamic = "force-dynamic";

export default async function BlogIndexPage() {
  const user = await getSessionUser();
  const posts = await listPosts(Boolean(user));

  return (
    <BlogShell
      fill
      backHref="/"
      actions={
        user && (
          <ButtonLink
            href="/blog/new"
            target="_self"
            className="px-3 py-1.5 text-sm"
          >
            New post
          </ButtonLink>
        )
      }
    >
      {posts.length === 0 ? (
        <p className="text-sm text-muted">Nothing written yet.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {posts.map((post) => (
            <li key={post.slug}>
              <Card padded={false} className="bg-raised">
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex gap-4 p-6 max-md:p-4"
                >
                  {post.coverUrl && (
                    <span className="relative hidden h-24 w-32 shrink-0 overflow-hidden rounded-md sm:block">
                      <Image
                        src={post.coverUrl}
                        alt=""
                        fill
                        sizes="128px"
                        className="object-cover"
                      />
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block text-lg font-semibold text-ink transition-colors group-hover:text-accent">
                      {post.title}
                    </span>
                    <PostMeta post={post} className="mt-1.5" />
                    <span className="mt-2.5 line-clamp-3 block text-sm">
                      {post.summary}
                    </span>
                  </span>
                </Link>
              </Card>
            </li>
          ))}
        </ul>
      )}

    </BlogShell>
  );
}
