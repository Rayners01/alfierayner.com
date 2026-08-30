"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  animate,
  easeIn,
  easeOut,
  lerp,
  magnitude,
  prefersReducedMotion,
} from "@/lib/animation";

export type Vector = { x: number; y: number };

const ORIGIN: Vector = { x: 0, y: 0 };

/** Travel distance, as a multiple of the viewport diagonal. */
const TRAVEL = 1.15;

export const LAUNCH_MS = 900;
const RETURN_MS = 1100;

/** Scale and fade at full travel, so the desk recedes rather than just slides. */
const DEPTH_SCALE = 0.08;
const DEPTH_FADE = 0.5;

/**
 * Flies the desk off-screen along a launch direction, and back again.
 *
 * The transform is written straight to the node rather than held in state:
 * this runs every frame, and re-rendering eleven tiles sixty times a second to
 * move one element is what made the original stutter. React only hears about
 * the journey when it ends, via `onEscape`.
 */
export function useFlyAway({ onEscape }: { onEscape: () => void }) {
  const element = useRef<HTMLDivElement | null>(null);
  /** Where the desk came to rest off-screen, so `recall` can retrace it. */
  const exit = useRef<Vector>(ORIGIN);
  const cancel = useRef<(() => void) | null>(null);
  /** Work deferred until the desk remounts — see `deskRef`. */
  const pending = useRef<(() => void) | null>(null);

  const onEscapeRef = useRef(onEscape);
  onEscapeRef.current = onEscape;

  const paint = useCallback((offset: Vector, depth: number) => {
    const node = element.current;
    if (!node) return;

    const scale = 1 - DEPTH_SCALE * depth;
    node.style.transform = `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})`;
    node.style.opacity = `${1 - DEPTH_FADE * depth}`;
  }, []);

  const launch = useCallback(
    (direction: Vector) => {
      cancel.current?.();

      // The desk slides opposite the plane, so the two separate on screen as
      // though the camera were following it.
      const length = magnitude(direction.x, direction.y);
      const distance =
        Math.hypot(window.innerWidth, window.innerHeight) * TRAVEL;

      exit.current = {
        x: (-direction.x / length) * distance,
        y: (-direction.y / length) * distance,
      };

      if (prefersReducedMotion()) {
        onEscapeRef.current();
        return;
      }

      const { x, y } = exit.current;
      cancel.current = animate({
        duration: LAUNCH_MS,
        ease: easeIn,
        onFrame: (eased) =>
          paint({ x: lerp(0, x, eased), y: lerp(0, y, eased) }, eased),
        onDone: () => onEscapeRef.current(),
      });
    },
    [paint],
  );

  const recall = useCallback(() => {
    cancel.current?.();
    const from = exit.current;

    const run = () => {
      if (prefersReducedMotion()) {
        paint(ORIGIN, 0);
        return;
      }

      // Placed at the exit point before the browser paints, so the desk never
      // flashes at centre for a frame before flying back in.
      paint(from, 1);

      cancel.current = animate({
        duration: RETURN_MS,
        ease: easeOut,
        onFrame: (eased) =>
          paint(
            { x: lerp(from.x, 0, eased), y: lerp(from.y, 0, eased) },
            1 - eased,
          ),
        onDone: () => paint(ORIGIN, 0),
      });
    };

    // `recall` is called in the same handler that remounts the desk, so the
    // node does not exist yet; the ref callback below flushes this.
    if (element.current) run();
    else pending.current = run;
  }, [paint]);

  const deskRef = useCallback((node: HTMLDivElement | null) => {
    element.current = node;
    if (!node) return;

    const run = pending.current;
    pending.current = null;
    run?.();
  }, []);

  useEffect(() => () => cancel.current?.(), []);

  return { deskRef, launch, recall };
}
