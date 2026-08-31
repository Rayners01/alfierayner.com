"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Photo } from "@/lib/photos.types";
import { cn } from "@/lib/cn";

/** Mirrors the allowlist enforced server-side in photo-store.ts. */
const ACCEPT = "image/jpeg,image/png,image/webp,image/gif";

export function UploadForm({
  onUploaded,
  onCancel,
}: {
  onUploaded: (photo: Photo) => void;
  onCancel: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [caption, setCaption] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const file = fileRef.current?.files?.[0];

    if (!file) {
      setError("Choose an image first.");
      return;
    }

    setBusy(true);
    setError(null);

    const body = new FormData();
    body.append("file", file);
    body.append("caption", caption);

    try {
      const res = await fetch("/api/photos", { method: "POST", body });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error ?? "Upload failed.");
        return;
      }

      onUploaded(data.photo);
      setCaption("");
      if (fileRef.current) fileRef.current.value = "";
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="flex flex-col gap-2 border-b-2 border-frame/30 px-4 pb-3 max-md:px-3"
    >
      <input
        ref={fileRef}
        type="file"
        accept={ACCEPT}
        required
        className={cn(
          "text-xs text-ink",
          "file:mr-2 file:rounded file:border-2 file:border-frame file:bg-surface",
          "file:px-2 file:py-1 file:text-xs file:text-frame",
        )}
      />

      <div className="flex gap-2">
        <input
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Caption"
          required
          maxLength={120}
          className="min-w-0 flex-1 rounded border-2 border-frame bg-white/80 px-2 py-1 text-sm text-neutral-800 outline-none focus:border-accent"
        />
        <Button type="submit" disabled={busy} className="px-3 py-1 text-sm">
          {busy ? "Adding…" : "Add"}
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          disabled={busy}
          className="px-3 py-1 text-sm"
        >
          Cancel
        </Button>
      </div>

      {error && (
        <p role="alert" className="text-xs text-accent">
          {error}
        </p>
      )}
    </form>
  );
}
