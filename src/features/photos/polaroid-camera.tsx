"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useViewportHeight } from "./use-viewport-height";

/** Fraction of the viewport the developed photo eventually fills. */
const FILM_VIEWPORT_FRACTION = 0.9;
/** How much smaller the film is before it scales up to fill the screen. */
const FILM_SCALE = 4;
/** Resting offset of the camera body, in pixels. */
const CAMERA_Y = -100;

type Stage = "arriving" | "flashed" | "ejected" | "centred";

/**
 * The camera drops in, fires a flash, spits out a film, and the film grows to
 * fill the screen — at which point `onComplete` hands over to the developing
 * view. Each stage is driven by the previous stage's animation finishing.
 */
export function PolaroidCamera({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState<Stage>("arriving");
  const [flash, setFlash] = useState(false);
  const viewportHeight = useViewportHeight();

  // Measured rather than assumed, because the film's travel is expressed in
  // pixels for Framer Motion.
  if (viewportHeight === null) return null;

  const filmHeight = Math.ceil(viewportHeight * FILM_VIEWPORT_FRACTION) / FILM_SCALE;
  const ejectedY = -120 - filmHeight / 2;
  const ejected = stage === "ejected" || stage === "centred";

  return (
    <div className="relative flex h-screen items-center justify-center overflow-hidden">
      {flash && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 z-20 bg-white"
        />
      )}

      <div className="z-10 w-60">
        <motion.img
          src="/assets/polaroid.svg"
          alt="Polaroid camera"
          initial={{ y: -300, opacity: 0 }}
          animate={{ y: CAMERA_Y, opacity: ejected ? 0 : 1 }}
          transition={{
            y: { duration: 1 },
            opacity: { duration: ejected ? 0.5 : 1 },
          }}
          onAnimationComplete={() => {
            if (stage !== "arriving") return;
            setStage("flashed");
            setTimeout(() => setFlash(true), 300);
          }}
          className="relative z-10 w-full"
        />

        {stage !== "arriving" && (
          <motion.div
            initial={{ y: -300 }}
            animate={{
              y: ejected ? ejectedY : -50,
              scale: stage === "centred" ? FILM_SCALE : 1,
            }}
            transition={{
              y: {
                delay: ejected ? 0 : 1,
                duration: ejected ? 1.2 : 1,
                ease: ejected ? "easeInOut" : "easeOut",
              },
              scale: {
                duration: stage === "centred" ? 1.2 : 0,
                ease: "easeInOut",
              },
            }}
            onAnimationComplete={() => {
              if (stage === "flashed") setTimeout(() => setStage("ejected"), 500);
              else if (stage === "ejected") setTimeout(() => setStage("centred"), 200);
              else setTimeout(onComplete, 500);
            }}
            className="absolute right-0 left-0 z-0 mx-auto flex w-40 items-center justify-center rounded-xs bg-white pt-2 pr-2 pb-6 pl-2 shadow-lg"
            style={{ height: filmHeight, transformOrigin: "center center" }}
          >
            <div className="h-full w-full bg-black" />
          </motion.div>
        )}
      </div>
    </div>
  );
}
