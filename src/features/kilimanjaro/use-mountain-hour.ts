"use client";

import { useCallback, useEffect, useState } from "react";
import { kilimanjaro } from "@/content/kilimanjaro";

const CLOCK_INTERVAL_MS = 60_000;
/** Artwork frame 1 is 06:00 local, so hours are rotated by 18. */
const FRAME_OFFSET = 18;

function currentHour(): number {
  return parseInt(
    new Intl.DateTimeFormat("en-GB", {
      hour: "numeric",
      hourCycle: "h23",
      timeZone: kilimanjaro.timeZone,
    }).format(new Date()),
  );
}

/** Maps a local hour onto its background artwork frame (1-24). */
export function frameForHour(hour: number): number {
  return (hour + FRAME_OFFSET) % 24 || 24;
}

/**
 * The hour on the mountain, plus the hour we are cross-fading away from.
 *
 * Two frames are held at once so the scene can dissolve between them; the
 * outgoing frame is dropped when the incoming image reports it has loaded.
 */
export function useMountainHour() {
  // Resolved on the client only — the server has no idea what time it is where
  // the visitor's mountain is, and guessing would flash the wrong artwork.
  const [hour, setHour] = useState<number | null>(null);
  const [previousHour, setPreviousHour] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);

  const goTo = useCallback((next: number) => {
    setHour((current) => {
      if (current === next) return current;
      setPreviousHour(current);
      setTransitioning(true);
      return next;
    });
  }, []);

  useEffect(() => {
    setHour(currentHour());

    const clock = setInterval(() => goTo(currentHour()), CLOCK_INTERVAL_MS);
    return () => clearInterval(clock);
  }, [goTo]);

  const settle = useCallback(() => setTransitioning(false), []);

  return { hour, previousHour, transitioning, goTo, settle };
}
