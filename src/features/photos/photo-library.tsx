"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PHOTOS_PER_PAGE, photos, type Photo } from "@/content/photos";
import { site } from "@/content/site";
import { lora } from "@/lib/fonts";
import { cn } from "@/lib/cn";

const TILTS = [-2.5, 1.8, -1.2, 2.2, -1.9, 1.4];

const TOTAL_PAGES = Math.ceil(photos.length / PHOTOS_PER_PAGE);

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
          src={photo.src}
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
  interactive?: boolean;
};

export function PhotoLibrary({ onClose, interactive = true }: Props) {
  const [page, setPage] = useState(0);
  const [expandedAt, setExpandedAt] = useState<number | null>(null);

  const expanded = expandedAt === null ? null : photos[expandedAt];

  const step = useCallback((by: number) => {
    setExpandedAt((current) =>
      current === null
        ? null
        : (current + by + photos.length) % photos.length,
    );
  }, []);

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

  const slots: (Photo | null)[] = [
    ...visible,
    ...Array<null>(PHOTOS_PER_PAGE - visible.length).fill(null),
  ];

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col bg-[url('/assets/zig-zag-dark.svg')]",
        !interactive && "pointer-events-none",
      )}
      aria-hidden={!interactive}
    >
      <header className="flex items-center justify-between gap-2 px-4 pt-4 pb-3 max-md:px-3 max-md:pt-3 max-md:pb-2">
        <h1 className="truncate text-xl font-semibold text-ink max-md:text-base">
          {expanded ? expanded.caption : "Photo Library"}
        </h1>
        <Button
          onClick={() => (expanded ? setExpandedAt(null) : onClose())}
          className="shrink-0 px-3 py-1 text-sm max-md:px-3 max-md:py-2"
        >
          {expanded ? "Back to Library" : "Back"}
        </Button>
      </header>

      {expanded ? (
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-4">
          <div className="rounded-[3px] bg-white p-3 pb-2 shadow-xl">
            <div className="relative aspect-[3/4] h-[min(50vh,360px)] overflow-hidden bg-neutral-100">
              <Image
                src={expanded.src}
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
            <Button onClick={() => step(-1)} className="px-3 py-1 text-sm max-md:px-4 max-md:py-2">
              Previous
            </Button>
            <p className="text-sm text-ink">
              {expandedAt! + 1} of {photos.length}
            </p>
            <Button onClick={() => step(1)} className="px-3 py-1 text-sm max-md:px-4 max-md:py-2">
              Next
            </Button>
          </div>
        </div>
      ) : (
        // Three across is too narrow on a phone; two columns of three still
        // fits a full page of six.
        <div className="grid min-h-0 flex-1 grid-cols-3 grid-rows-2 gap-3 px-4 max-md:grid-cols-2 max-md:grid-rows-3 max-md:gap-2 max-md:px-3">
          {slots.map((photo, index) =>
            photo ? (
              <PolaroidCard
                key={photo.src}
                photo={photo}
                tilt={TILTS[index % TILTS.length]}
                onOpen={() => setExpandedAt(start + index)}
              />
            ) : (
              <div key={`empty-${index}`} aria-hidden />
            ),
          )}
        </div>
      )}

      <footer className="flex flex-col items-center gap-2 px-4 pt-3 pb-4">
        {!expanded && TOTAL_PAGES > 1 && (
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setPage((current) => current - 1)}
              disabled={page === 0}
              className="px-3 py-1 text-sm max-md:px-4 max-md:py-2"
            >
              Previous
            </Button>
            <p className="text-sm text-ink">
              Page {page + 1} of {TOTAL_PAGES}
            </p>
            <Button
              onClick={() => setPage((current) => current + 1)}
              disabled={page === TOTAL_PAGES - 1}
              className="px-3 py-1 text-sm max-md:px-4 max-md:py-2"
            >
              Next
            </Button>
          </div>
        )}
        <p className="text-xs text-ink/70">
          &copy; {site.copyrightYear} {site.title}
        </p>
      </footer>
    </div>
  );
}
