"use client";

import { useEffect, useState } from "react";

/**
 * The viewport height, measured after mount.
 *
 * Returns `null` on the server and the first client render, so callers must
 * hold off until it resolves — reading `window` during render would break
 * server rendering and cause a hydration mismatch.
 */
export function useViewportHeight(): number | null {
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => setHeight(window.innerHeight), []);

  return height;
}
