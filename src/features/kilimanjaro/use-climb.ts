"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PATH_WAYPOINTS, kilimanjaro, type Waypoint } from "@/content/kilimanjaro";

/** Position on the route, in percentages of the scene. */
type Position = { x: number; y: number; facing: "left" | "right" };

/** Finds the leg of the route containing `step`. */
function legAt(step: number): [Waypoint, Waypoint] {
  for (let i = 0; i < PATH_WAYPOINTS.length - 1; i++) {
    if (step >= PATH_WAYPOINTS[i].atStep && step <= PATH_WAYPOINTS[i + 1].atStep) {
      return [PATH_WAYPOINTS[i], PATH_WAYPOINTS[i + 1]];
    }
  }
  return [PATH_WAYPOINTS[0], PATH_WAYPOINTS[PATH_WAYPOINTS.length - 1]];
}

/** Interpolates the hiker's position along the route. */
function positionAt(step: number, ascending: boolean): Position {
  const [start, end] = legAt(step);
  const span = end.atStep - start.atStep;
  const progress = span === 0 ? 0 : (step - start.atStep) / span;

  const climbingLeft = ascending ? end.x <= start.x : end.x > start.x;

  return {
    x: start.x + (end.x - start.x) * progress,
    y: start.y + (end.y - start.y) * progress,
    facing: climbingLeft ? "left" : "right",
  };
}

/**
 * Walks the hiker towards a donation total.
 *
 * The scene is animated by writing to DOM nodes directly rather than through
 * React state: this runs every frame, and re-rendering the whole page 60 times
 * a second to move one sprite would be wasteful.
 */
export function useClimb() {
  const hikerRef = useRef<HTMLImageElement>(null);
  const altitudeRef = useRef<HTMLSpanElement>(null);
  const raisedRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const currentStep = useRef(0);
  const targetStep = useRef(0);
  const frame = useRef<number | null>(null);

  /** Mirrors `targetStep` for the debug slider, which needs a controlled value. */
  const [target, setTarget] = useState(0);

  const paint = useCallback((step: number, ascending: boolean) => {
    const { x, y, facing } = positionAt(step, ascending);

    if (hikerRef.current) {
      hikerRef.current.style.left = `${x}%`;
      hikerRef.current.style.top = `${y}%`;
      hikerRef.current.src = `/assets/kili/hiker_${facing}.png`;
    }
    if (altitudeRef.current) {
      const metres = (step / kilimanjaro.totalSteps) * kilimanjaro.summitHeight;
      altitudeRef.current.textContent = `${Math.floor(metres)}m`;
    }
    if (raisedRef.current) {
      raisedRef.current.textContent = `£${step.toFixed(2)}`;
    }
    if (progressRef.current) {
      const percent = (step / kilimanjaro.totalSteps) * 100;
      progressRef.current.style.width = `${Math.min(percent, 100)}%`;
    }
  }, []);

  const advance = useCallback(() => {
    const remaining = targetStep.current - currentStep.current;
    const ascending = remaining > 0;

    if (Math.abs(remaining) <= kilimanjaro.climbSpeed) {
      currentStep.current = targetStep.current;
      paint(currentStep.current, ascending);
      frame.current = null;
      return;
    }

    currentStep.current += Math.sign(remaining) * kilimanjaro.climbSpeed;
    paint(currentStep.current, ascending);
    frame.current = requestAnimationFrame(advance);
  }, [paint]);

  const climbTo = useCallback(
    (step: number) => {
      const clamped = Math.max(0, step);
      targetStep.current = clamped;
      setTarget(clamped);
      if (frame.current === null) frame.current = requestAnimationFrame(advance);
    },
    [advance],
  );

  useEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    },
    [],
  );

  return {
    refs: { hikerRef, altitudeRef, raisedRef, progressRef },
    target,
    climbTo,
  };
}
