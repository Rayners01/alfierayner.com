"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PhotoLibrary } from "./photo-library";

/** Shared padding so the developing film and the library sit in the same frame. */
const FILM_FRAME = "rounded-lg bg-white pt-8 pr-8 pb-24 pl-8 shadow-lg";

/** The ejected film shakes itself dry, fading from black into the library. */
export function PolaroidDeveloping({ onClose }: { onClose: () => void }) {
  const [developing, setDeveloping] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDeveloping(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex h-screen items-center justify-center overflow-hidden">
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: developing ? [0, -5, 5, -3, 3, 0] : 0 }}
        transition={{ rotate: { repeat: developing ? 3 : 0, duration: 0.4 } }}
        className={`relative h-[90dvh] w-160 ${FILM_FRAME}`}
      >
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: developing ? 0 : 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="h-full w-full bg-black"
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: developing ? 1 : 0 }}
          transition={{ delay: 1, duration: 2 }}
          className={`absolute inset-0 flex flex-col overflow-hidden ${FILM_FRAME}`}
        >
          <PhotoLibrary onClose={onClose} />
        </motion.div>
      </motion.div>
    </div>
  );
}
