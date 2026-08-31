export type Easing = (t: number) => number;

/** Accelerating from rest — for motion that leaves the screen. */
export const easeIn: Easing = (t) => t * t * t;

/** Decelerating to rest — for motion that arrives and settles. */
export const easeOut: Easing = (t) => 1 - (1 - t) ** 3;

export function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t;
}

/** Length of a vector, used to normalise launch directions. */
export function magnitude(x: number, y: number): number {
  return Math.hypot(x, y) || 1;
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

type AnimateOptions = {
  duration: number;
  ease: Easing;
  /** Called each frame with the eased value and the raw 0-1 progress. */
  onFrame: (eased: number, progress: number) => void;
  onDone?: () => void;
};

export function animate({
  duration,
  ease,
  onFrame,
  onDone,
}: AnimateOptions): () => void {
  const start = performance.now();
  let frame = requestAnimationFrame(function step(now) {
    const progress = duration <= 0 ? 1 : Math.min((now - start) / duration, 1);
    onFrame(ease(progress), progress);

    if (progress < 1) frame = requestAnimationFrame(step);
    else onDone?.();
  });

  return () => cancelAnimationFrame(frame);
}
