import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { BlogShell } from "@/features/blog/blog-shell";
import { PostEditor } from "@/features/blog/post-editor";
import { getPost } from "@/features/blog/post-store";
import { getSessionUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Edit post",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!(await getSessionUser())) redirect("/login");

  const { slug } = await params;
  // Drafts included: editing one is the whole point.
  const post = await getPost(slug, true);
  if (!post) notFound();

  return (
    <BlogShell wide heading="Edit post" backHref="/blog">
      <PostEditor post={post} />
    </BlogShell>
  );
}
