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

const TRAVEL = 1.15;

export const LAUNCH_MS = 900;
const RETURN_MS = 1100;

const DEPTH_SCALE = 0.08;
const DEPTH_FADE = 0.5;

/**
 * Flies the desk off-screen along a launch direction, and back again.
 */
export function useFlyAway({ onEscape }: { onEscape: () => void }) {
  const element = useRef<HTMLDivElement | null>(null);
  const exit = useRef<Vector>(ORIGIN);
  const cancel = useRef<(() => void) | null>(null);
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
