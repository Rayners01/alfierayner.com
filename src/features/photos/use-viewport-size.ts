"use client";

import { useEffect, useState } from "react";

export type ViewportSize = { width: number; height: number };

/**
 * The viewport size, measured after mount and kept current on resize.
 */
export function useViewportSize(): ViewportSize | null {
  const [size, setSize] = useState<ViewportSize | null>(null);

  useEffect(() => {
    const measure = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return size;
}
