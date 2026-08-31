"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import NextLink from "next/link";
import { Button } from "@/components/ui/button";
import { PHOTOS_PER_PAGE } from "@/content/photos";
import { site } from "@/content/site";
import { useSession } from "@/features/auth/use-session";
import { lora } from "@/lib/fonts";
import type { Photo } from "@/lib/photos.types";
import { cn } from "@/lib/cn";
import { UploadForm } from "./upload-form";
import { usePhotos } from "./use-photos";

/**
 * Fixed per-index tilts, so cards look casually scattered but never shuffle
 * between renders the way `Math.random()` would.
 */
const TILTS = [-2.5, 1.8, -1.2, 2.2, -1.9, 1.4];

function PolaroidCard({
  photo,
  tilt,
  onOpen,
}: {
  photo: Photo;
  tilt: number;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      style={{ rotate: `${tilt}deg` }}
      className={cn(
        "group flex flex-col rounded-[3px] bg-white p-2 pb-1 shadow-md",
        "transition-[transform,box-shadow] duration-300 ease-out",
        "hover:z-10 hover:scale-[1.06] hover:rotate-0 hover:shadow-xl",
        "focus-visible:z-10 focus-visible:scale-[1.06] focus-visible:rotate-0",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-frame",
      )}
    >
      <span className="relative block w-full flex-1 overflow-hidden bg-neutral-100">
        <Image
          src={photo.url}
          alt={photo.caption}
          fill
          sizes="(min-width: 640px) 200px, 40vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </span>
      <span
        className={cn(
          "mt-2 mb-1 block truncate text-center text-[13px] text-neutral-700",
          lora.className,
        )}
      >
        {photo.caption}
      </span>
    </button>
  );
}

type Props = {
  onClose: () => void;
  /** False while the film is still developing, so nothing is clickable early. */
  interactive?: boolean;
};

/** A paginated wall of polaroids, with a click-to-expand detail view. */
export function PhotoLibrary({ onClose, interactive = true }: Props) {
  const { photos, loading, error, add, remove } = usePhotos();
  const { user } = useSession();

  const [page, setPage] = useState(0);
  const [expandedAt, setExpandedAt] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  const expanded = expandedAt === null ? null : (photos[expandedAt] ?? null);
  const totalPages = Math.max(1, Math.ceil(photos.length / PHOTOS_PER_PAGE));

  const step = useCallback(
    (by: number) => {
      setExpandedAt((current) =>
        current === null || photos.length === 0
          ? null
          : (current + by + photos.length) % photos.length,
      );
    },
    [photos.length],
  );

  // Uploads and deletes change the length under us; keep the page in range.
  useEffect(() => {
    setPage((current) => Math.min(current, totalPages - 1));
  }, [totalPages]);

  // Escape backs out one level; arrows page through the expanded photo.
  useEffect(() => {
    if (!interactive) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (expandedAt !== null) setExpandedAt(null);
        else onClose();
        return;
      }
      if (expandedAt === null) return;
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expandedAt, interactive, onClose, step]);

  const start = page * PHOTOS_PER_PAGE;
  const visible = photos.slice(start, start + PHOTOS_PER_PAGE);

  // Padded to a full page so the grid keeps its shape on the last page, which
  // would otherwise collapse to a single short row.
  const slots: (Photo | null)[] = [
    ...visible,
    ...Array<null>(Math.max(0, PHOTOS_PER_PAGE - visible.length)).fill(null),
  ];

  async function handleDelete() {
    if (expanded && (await remove(expanded.id))) setExpandedAt(null);
  }

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col bg-[image:var(--art-paper)]",
        !interactive && "pointer-events-none",
      )}
      aria-hidden={!interactive}
    >
      <header className="flex items-center justify-between gap-2 px-4 pt-4 pb-3 max-md:px-3 max-md:pt-3 max-md:pb-2">
        <h1 className="truncate text-xl font-semibold text-ink max-md:text-base">
          {expanded ? expanded.caption : "Photo Library"}
        </h1>

        <div className="flex shrink-0 items-center gap-2">
          {user && !expanded && (
            <Button
              onClick={() => setUploading((open) => !open)}
              className="px-3 py-1 text-sm max-md:px-3 max-md:py-2"
            >
              {uploading ? "Close" : "Add"}
            </Button>
          )}
          <Button
            onClick={() => (expanded ? setExpandedAt(null) : onClose())}
            className="px-3 py-1 text-sm max-md:px-3 max-md:py-2"
          >
            {expanded ? "Back to Library" : "Back"}
          </Button>
        </div>
      </header>

      {user && uploading && !expanded && (
        <UploadForm
          onUploaded={(photo) => {
            add(photo);
            setUploading(false);
            setPage(0);
          }}
          onCancel={() => setUploading(false)}
        />
      )}

      {expanded ? (
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-4">
          <div className="rounded-[3px] bg-white p-3 pb-2 shadow-xl">
            <div className="relative aspect-[3/4] h-[min(50vh,360px)] overflow-hidden bg-neutral-100">
              <Image
                src={expanded.url}
                alt={expanded.caption}
                fill
                sizes="360px"
                className="object-contain"
              />
            </div>
            <p
              className={cn(
                "mt-3 mb-1 text-center text-neutral-700",
                lora.className,
              )}
            >
              {expanded.caption}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => step(-1)}
              className="px-3 py-1 text-sm max-md:px-4 max-md:py-2"
            >
              Previous
            </Button>
            <p className="text-sm text-ink">
              {expandedAt! + 1} of {photos.length}
            </p>
            <Button
              onClick={() => step(1)}
              className="px-3 py-1 text-sm max-md:px-4 max-md:py-2"
            >
              Next
            </Button>
            {user && (
              <Button
                onClick={handleDelete}
                className="px-3 py-1 text-sm max-md:px-4 max-md:py-2"
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      ) : (
        // Three across is too narrow on a phone; two columns of three still
        // fits a full page of six.
        <div className="grid min-h-0 flex-1 grid-cols-3 grid-rows-2 gap-3 px-4 max-md:grid-cols-2 max-md:grid-rows-3 max-md:gap-2 max-md:px-3">
          {loading || error || photos.length === 0 ? (
            <p className="col-span-full row-span-full flex items-center justify-center text-center text-sm text-ink">
              {loading
                ? "Loading…"
                : (error ?? "No photos yet.")}
            </p>
          ) : (
            slots.map((photo, index) =>
              photo ? (
                <PolaroidCard
                  key={photo.id}
                  photo={photo}
                  tilt={TILTS[index % TILTS.length]}
                  onOpen={() => setExpandedAt(start + index)}
                />
              ) : (
                <div key={`empty-${index}`} aria-hidden />
              ),
            )
          )}
        </div>
      )}

      <footer className="flex flex-col items-center gap-2 px-4 pt-3 pb-4">
        {!expanded && totalPages > 1 && (
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setPage((current) => current - 1)}
              disabled={page === 0}
              className="px-3 py-1 text-sm max-md:px-4 max-md:py-2"
            >
              Previous
            </Button>
            <p className="text-sm text-ink">
              Page {page + 1} of {totalPages}
            </p>
            <Button
              onClick={() => setPage((current) => current + 1)}
              disabled={page === totalPages - 1}
              className="px-3 py-1 text-sm max-md:px-4 max-md:py-2"
            >
              Next
            </Button>
          </div>
        )}

        <p className="text-xs text-ink/70">
          &copy; {site.copyrightYear} {site.title}
          {!user && (
            <>
              {" · "}
              <NextLink href="/login" className="underline hover:text-accent">
                Sign in
              </NextLink>
            </>
          )}
        </p>
      </footer>
    </div>
  );
}
