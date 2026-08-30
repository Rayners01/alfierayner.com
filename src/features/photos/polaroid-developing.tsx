"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { PhotoLibrary } from "./photo-library";
import { FRAME_PADDING, frameSize } from "./frame";
import { useViewportSize } from "./use-viewport-size";

const DEVELOPED_AT_MS = 2200;

/**
 * Film shakes and the image emerges.
 */
export function PolaroidDeveloping({ onClose }: { onClose: () => void }) {
  const [developing, setDeveloping] = useState(false);
  const [developed, setDeveloped] = useState(false);
  const viewport = useViewportSize();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion === null) return;

    if (reduceMotion) {
      setDeveloping(true);
      setDeveloped(true);
      return;
    }

    const start = setTimeout(() => setDeveloping(true), 300);
    const done = setTimeout(() => setDeveloped(true), DEVELOPED_AT_MS);
    return () => {
      clearTimeout(start);
      clearTimeout(done);
    };
  }, [reduceMotion]);

  if (!viewport) return null;

  const frame = frameSize(viewport);

  return (
    <div className="relative flex h-screen items-center justify-center overflow-hidden">
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: developing ? [0, -4, 4, -2.5, 2.5, 0] : 0 }}
        transition={{ rotate: { repeat: 2, duration: 0.45, ease: "easeInOut" } }}
        className="relative rounded-lg bg-white shadow-2xl"
        style={{
          width: frame.width,
          height: frame.height,
          paddingTop: FRAME_PADDING.top,
          paddingLeft: FRAME_PADDING.side,
          paddingRight: FRAME_PADDING.side,
          paddingBottom: FRAME_PADDING.bottom,
        }}
      >
        <div className="relative h-full w-full overflow-hidden">
          <PhotoLibrary onClose={onClose} interactive={developed} />

          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: developing ? 0 : 1 }}
            transition={{ delay: 0.9, duration: 1.6, ease: "easeOut" }}
            className="pointer-events-none absolute inset-0 bg-amber-100/70 mix-blend-screen"
          />

          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: developing ? 0 : 1 }}
            transition={{ delay: 0.4, duration: 1.4, ease: "easeInOut" }}
            className="pointer-events-none absolute inset-0 bg-black"
          />
        </div>
      </motion.div>
    </div>
  );
}
