import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/button";
import { getPost } from "@/features/blog/post-store";
import { BlogShell } from "@/features/blog/blog-shell";
import { Markdown } from "@/features/blog/markdown";
import { PostMeta } from "@/features/blog/post-meta";
import { DeletePostButton } from "@/features/blog/delete-post-button";
import { site } from "@/content/site";
import { getSessionUser } from "@/lib/session";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug, false);

  if (!post) return { title: `Not found | ${site.title}` };

  return {
    title: `${post.title} | ${site.title}`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.publishedAt ?? undefined,
      images: post.coverUrl ? [post.coverUrl] : undefined,
    },
  };
}

export default async function PostPage({ params }: Params) {
  const user = await getSessionUser();
  const { slug } = await params;
  const post = await getPost(slug, Boolean(user));

  if (!post) notFound();

  return (
    <BlogShell
      backHref="/blog"
      actions={
        user && (
          <>
            <ButtonLink
              href={`/blog/${post.slug}/edit`}
              target="_self"
              className="px-3 py-1.5 text-sm"
            >
              Edit
            </ButtonLink>
            <DeletePostButton slug={post.slug} />
          </>
        )
      }
    >
      <article>
        <h1 className="text-3xl font-semibold text-ink">{post.title}</h1>
        <PostMeta post={post} className="mt-2" />

        {post.coverUrl && (
          <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-md border-2 border-frame/40">
            <Image
              src={post.coverUrl}
              alt=""
              fill
              sizes="(min-width: 768px) 768px, 92vw"
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="mt-7">
          <Markdown>{post.body}</Markdown>
        </div>
      </article>
    </BlogShell>
  );
}
