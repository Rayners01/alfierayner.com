import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BlogShell } from "@/features/blog/blog-shell";
import { PostEditor } from "@/features/blog/post-editor";
import { getSessionUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "New post",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  if (!(await getSessionUser())) redirect("/login");

  return (
    <BlogShell wide heading="New post" backHref="/blog">
      <PostEditor post={null} />
    </BlogShell>
  );
}
