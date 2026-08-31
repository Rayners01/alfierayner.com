"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Markdown } from "./markdown";
import { usePostEditor } from "./use-post-editor";
import type { Post } from "@/lib/posts.types";
import { slugify } from "@/lib/posts.types";
import { cn } from "@/lib/cn";

const FIELD =
  "w-full rounded-md border-2 border-frame bg-raised px-3 py-2 text-frame outline-none focus:border-accent";

export function PostEditor({ post }: { post: Post | null }) {
  const { form, update, save, error, busy } = usePostEditor(post);
  const [preview, setPreview] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  // An untouched slug tracks the title; once edited by hand it stops.
  const slugPinned = useRef(post !== null);

  /** Inserts text where the cursor is, rather than at the end. */
  function insertIntoBody(snippet: string) {
    const area = bodyRef.current;
    if (!area) {
      update("body", `${form.body}\n${snippet}\n`);
      return;
    }

    const { selectionStart: from, selectionEnd: to } = area;
    const next = `${form.body.slice(0, from)}${snippet}${form.body.slice(to)}`;
    update("body", next);

    requestAnimationFrame(() => {
      area.focus();
      area.selectionStart = area.selectionEnd = from + snippet.length;
    });
  }

  async function uploadImage(file: File, asCover: boolean) {
    setUploading(true);
    setUploadError(null);

    const body = new FormData();
    body.append("file", file);
    // Doubles as the alt text in the inserted Markdown.
    body.append("caption", file.name.replace(/\.[^.]+$/, ""));
    body.append("kind", "post");

    try {
      const res = await fetch("/api/photos", { method: "POST", body });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setUploadError(data.error ?? "Upload failed.");
        return;
      }

      if (asCover) update("coverUrl", data.photo.url);
      else insertIntoBody(`![${data.photo.caption}](${data.photo.url})`);
    } catch {
      setUploadError("Could not reach the server.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        save();
      }}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm">
          Title
          <input
            value={form.title}
            onChange={(event) => {
              update("title", event.target.value);
              if (!slugPinned.current) update("slug", slugify(event.target.value));
            }}
            required
            className={FIELD}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Slug
          <input
            value={form.slug}
            onChange={(event) => {
              slugPinned.current = true;
              update("slug", event.target.value);
            }}
            placeholder="auto-generated-from-the-title"
            className={cn(FIELD, "font-mono text-sm")}
          />
          <span className="text-xs text-muted">/blog/{form.slug || "…"}</span>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Summary
          <textarea
            value={form.summary}
            onChange={(event) => update("summary", event.target.value)}
            rows={2}
            placeholder="Shown on the index. Left blank, the opening of the post is used."
            className={FIELD}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Tags
          <input
            value={form.tags.join(", ")}
            onChange={(event) =>
              update(
                "tags",
                event.target.value.split(",").map((tag) => tag.trim()),
              )
            }
            placeholder="next.js, postgres"
            className={FIELD}
          />
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(event) => update("published", event.target.checked)}
              className="size-4 accent-[var(--color-accent)]"
            />
            Published
          </label>

          {form.coverUrl && (
            <span className="flex items-center gap-2 text-xs text-muted">
              Cover set
              <button
                type="button"
                onClick={() => update("coverUrl", null)}
                className="underline hover:text-accent"
              >
                remove
              </button>
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col overflow-hidden rounded-md border-2 border-frame/40">
        <div className="flex flex-wrap items-center gap-2 border-b-2 border-frame/30 bg-raised/40 px-3 py-2.5">
          <Button
            type="button"
            onClick={() => setPreview((on) => !on)}
            className="px-3 py-1 text-sm"
          >
            {preview ? "Write" : "Preview"}
          </Button>

          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) uploadImage(file, event.target.dataset.cover === "true");
            }}
          />

          <Button
            type="button"
            disabled={uploading}
            onClick={() => {
              if (!fileRef.current) return;
              fileRef.current.dataset.cover = "false";
              fileRef.current.click();
            }}
            className="px-3 py-1 text-sm"
          >
            {uploading ? "Uploading…" : "Insert image"}
          </Button>

          <Button
            type="button"
            disabled={uploading}
            onClick={() => {
              if (!fileRef.current) return;
              fileRef.current.dataset.cover = "true";
              fileRef.current.click();
            }}
            className="px-3 py-1 text-sm"
          >
            Set cover
          </Button>

          {uploadError && (
            <span role="alert" className="text-xs text-accent">
              {uploadError}
            </span>
          )}
        </div>

        {preview ? (
          <div className="min-h-[26rem] px-4 py-4">
            {form.body.trim() ? (
              <Markdown>{form.body}</Markdown>
            ) : (
              <p className="text-sm text-muted">Nothing to preview yet.</p>
            )}
          </div>
        ) : (
          <textarea
            ref={bodyRef}
            value={form.body}
            onChange={(event) => update("body", event.target.value)}
            required
            spellCheck
            placeholder="Write in Markdown…"
            className="min-h-[26rem] w-full resize-y bg-transparent p-4 font-mono text-sm leading-relaxed text-frame outline-none"
          />
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t-2 border-frame/25 pt-4">
        <Button type="submit" disabled={busy} className="px-4 py-2">
          {busy ? "Saving…" : post ? "Save changes" : "Create post"}
        </Button>

        {error ? (
          <span role="alert" className="text-sm text-accent">
            {error}
          </span>
        ) : (
          <span className="text-xs text-muted">
            {form.published
              ? "Visible to everyone once saved."
              : "Saved as a draft."}
          </span>
        )}
      </div>
    </form>
  );
}
