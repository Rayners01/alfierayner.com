"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { ExternalLink } from "@/components/ui/external-link";
import type { NowPlaying } from "@/lib/spotify.types";
import { formatDuration } from "@/lib/format";

const POLL_INTERVAL_MS = 15_000;

export function NowPlayingTile({ className }: { className?: string }) {
  const [track, setTrack] = useState<NowPlaying | null>(null);
  const [loading, setLoading] = useState(true);
  const [elapsed, setElapsed] = useState(0);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/now-playing");
      const data: NowPlaying | null = res.ok ? await res.json() : null;
      setTrack(data);
      setElapsed(data?.progressMs ?? 0);
    } catch {
      setTrack(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const poll = setInterval(refresh, POLL_INTERVAL_MS);
    return () => clearInterval(poll);
  }, [refresh]);

  // Tick the progress bar locally between polls so it moves smoothly, then
  // re-sync once the track should have finished.
  const refreshRef = useRef(refresh);
  refreshRef.current = refresh;

  useEffect(() => {
    if (!track?.isPlaying) return;

    const tick = setInterval(() => {
      setElapsed((previous) => {
        const next = previous + 1000;
        if (next >= track.durationMs) {
          refreshRef.current();
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(tick);
  }, [track]);

  if (loading) {
    return (
      <Card className={className}>
        <p className="text-sm">Loading&hellip;</p>
      </Card>
    );
  }

  if (!track) {
    return (
      <Card className={className}>
        <p className="text-sm">Unable to connect to Spotify.</p>
      </Card>
    );
  }

  const percent = track.durationMs
    ? (elapsed / track.durationMs) * 100
    : 0;

  return (
    <Card className={className}>
      <div className="text-sm">
        <p className="mb-4 text-lg">
          {track.isPlaying ? "Currently listening to:" : "Recently listened to:"}
        </p>

        <div className="flex items-center gap-3">
          {track.albumArtUrl && (
            <Image
              src={track.albumArtUrl}
              alt={`${track.album} album art`}
              width={48}
              height={48}
              className="h-12 w-12 shrink-0 rounded"
              unoptimized
            />
          )}

          <div className="flex w-full max-w-[180px] flex-col overflow-hidden sm:max-w-[220px]">
            <p className="truncate font-semibold">{track.title}</p>
            <p className="truncate">{track.artist}</p>
            <ExternalLink
              href={track.trackUrl}
              className="mt-1 text-xs text-muted hover:underline"
            >
              Open in Spotify
            </ExternalLink>
          </div>
        </div>

        {track.isPlaying && (
          <>
            <div className="mt-2 h-2 w-full overflow-hidden rounded bg-green-100">
              <div
                className="h-full bg-muted transition-[width] duration-1000 ease-linear"
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>{formatDuration(elapsed)}</span>
              <span>{formatDuration(track.durationMs)}</span>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
