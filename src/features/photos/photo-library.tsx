"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PHOTOS_PER_PAGE, photos, type Photo } from "@/content/photos";
import { site } from "@/content/site";

function Copyright() {
  return (
    <div className="mt-2 text-center text-sm text-ink">
      &copy; {site.copyrightYear} {site.title}
    </div>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full flex-col bg-[url('/assets/zig-zag.svg')] p-4">
      {children}
    </div>
  );
}

function Header({
  title,
  action,
}: {
  title: string;
  action: React.ReactNode;
}) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <h1 className="text-xl font-semibold text-ink">{title}</h1>
      {action}
    </div>
  );
}

/** A paginated grid of photos, with a click-to-expand detail view. */
export function PhotoLibrary({ onClose }: { onClose: () => void }) {
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<Photo | null>(null);

  const totalPages = Math.ceil(photos.length / PHOTOS_PER_PAGE);
  const visible = photos.slice(
    (page - 1) * PHOTOS_PER_PAGE,
    page * PHOTOS_PER_PAGE,
  );

  if (expanded) {
    return (
      <Frame>
        <Header
          title="Photo"
          action={
            <Button onClick={() => setExpanded(null)} className="px-4 py-2">
              Back to Library
            </Button>
          }
        />

        <div className="flex flex-1 flex-col items-center justify-center gap-4 overflow-auto">
          <Card className="flex w-full max-w-md flex-col items-center bg-raised shadow-md">
            <div className="relative h-[300px] w-[300px]">
              <Image
                src={expanded.src}
                alt={expanded.alt}
                fill
                sizes="300px"
                className="rounded-md object-contain"
              />
            </div>
            <p className="mt-4 text-center text-ink">{expanded.alt}</p>
          </Card>
        </div>

        <Copyright />
      </Frame>
    );
  }

  return (
    <Frame>
      <Header
        title="Photo Library"
        action={
          <Button onClick={onClose} className="px-3 py-1">
            Back
          </Button>
        }
      />

      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {visible.map((photo) => (
            <Card
              key={photo.src}
              padded={false}
              className="flex cursor-pointer flex-col items-center bg-raised p-2 shadow-md"
              onClick={() => setExpanded(photo)}
            >
              <div className="relative aspect-square w-full">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 640px) 33vw, 50vw"
                  className="rounded-md object-contain"
                />
              </div>
              <p className="mt-2 text-center text-sm text-ink">{photo.alt}</p>
            </Card>
          ))}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-2 flex justify-center gap-2">
          <Button
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page === 1}
            className="px-3 py-1"
          >
            Previous
          </Button>
          <p className="self-center text-ink">
            Page {page} of {totalPages}
          </p>
          <Button
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={page === totalPages}
            className="px-3 py-1"
          >
            Next
          </Button>
        </div>
      )}

      <Copyright />
    </Frame>
  );
}
