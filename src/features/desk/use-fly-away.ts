"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type Vector = { x: number; y: number };

const ORIGIN: Vector = { x: 0, y: 0 };

/** Viewport-widths travelled per frame, per unit of launch velocity. */
const PAN_SPEED = 1.5;

/**
 * Clamps a coordinate at zero once it has crossed it, so the desk settles
 * exactly on centre rather than overshooting and jittering.
 */
function stopAtOrigin(value: number, direction: number): number {
  if (direction > 0 && value > 0) return 0;
  if (direction < 0 && value < 0) return 0;
  return value;
}

type Phase = "resting" | "leaving" | "returning";

/**
 * Slides the desk off-screen along a launch vector and back again.
 *
 * Clicking the plane on the travel tile launches it; once the desk has cleared
 * the viewport `onEscape` fires (which swaps in the globe) and the offset is
 * reset. `recall` replays the journey in reverse from where it left off.
 */
export function useFlyAway({ onEscape }: { onEscape: () => void }) {
  const [offset, setOffset] = useState<Vector>(ORIGIN);

  const phase = useRef<Phase>("resting");
  const velocity = useRef<Vector>(ORIGIN);
  // Where the desk was when it cleared the viewport, so `recall` can fly back
  // in along the same line.
  const exitOffset = useRef<Vector>(ORIGIN);
  const frame = useRef<number | null>(null);
  const position = useRef<Vector>(ORIGIN);

  // Held in a ref so the animation loop never needs re-creating.
  const onEscapeRef = useRef(onEscape);
  onEscapeRef.current = onEscape;

  const commit = useCallback((next: Vector) => {
    position.current = next;
    setOffset(next);
  }, []);

  const settle = useCallback(
    (next: Vector) => {
      phase.current = "resting";
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = null;
      commit(next);
    },
    [commit],
  );

  const step = useCallback(() => {
    const { innerWidth: width, innerHeight: height } = window;
    const { x: vx, y: vy } = velocity.current;
    const { x, y } = position.current;

    if (phase.current === "leaving") {
      const next = {
        x: x - vx * width * PAN_SPEED,
        y: y - vy * height * PAN_SPEED,
      };

      if (Math.abs(next.x) > width || Math.abs(next.y) > height) {
        exitOffset.current = next;
        settle(ORIGIN);
        onEscapeRef.current();
        return;
      }

      commit(next);
    } else {
      const next = {
        x: stopAtOrigin(x + vx * width * PAN_SPEED, vx),
        y: stopAtOrigin(y + vy * height * PAN_SPEED, vy),
      };

      if (next.x === 0 && next.y === 0) {
        exitOffset.current = ORIGIN;
        velocity.current = ORIGIN;
        settle(ORIGIN);
        return;
      }

      commit(next);
    }

    frame.current = requestAnimationFrame(step);
  }, [commit, settle]);

  const start = useCallback(
    (next: Phase) => {
      phase.current = next;
      if (frame.current === null) frame.current = requestAnimationFrame(step);
    },
    [step],
  );

  const launch = useCallback(
    (v: Vector) => {
      velocity.current = v;
      start("leaving");
    },
    [start],
  );

  const recall = useCallback(() => {
    commit(exitOffset.current);
    start("returning");
  }, [commit, start]);

  useEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    },
    [],
  );

  return { offset, launch, recall };
}
