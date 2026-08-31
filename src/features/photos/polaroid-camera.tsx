"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { FILM_SCALE, framePadding, frameSize } from "./frame";
import { useViewportSize } from "./use-viewport-size";

/** Resting offset of the camera body, in pixels above centre. */
const CAMERA_Y = -100;
/**
 * Offset that leaves the film sitting in the camera's output slot.
 */
const SLOT_Y = -120;

type Stage = "arrive" | "flash" | "eject" | "expand";

/**
 * When each stage begins, in milliseconds from mount.
 */
const SEQUENCE: { at: number; stage: Stage }[] = [
  { at: 1000, stage: "flash" },
  { at: 1500, stage: "eject" },
  { at: 2700, stage: "expand" },
];
const COMPLETE_AT = 3600;

const SETTLE = [0.22, 1, 0.36, 1] as const;

/**
 * Every variant declares every value it touches.
 */
const cameraVariants: Variants = {
  arrive: {
    y: CAMERA_Y,
    opacity: 1,
    rotate: 0,
    transition: { duration: 1, ease: SETTLE },
  },
  // Recoil on the shutter
  flash: {
    y: CAMERA_Y - 12,
    opacity: 1,
    rotate: -1.5,
    transition: { duration: 0.16, ease: "easeOut" },
  },
  eject: {
    y: CAMERA_Y,
    opacity: 1,
    rotate: 0,
    transition: { duration: 0.5, ease: SETTLE },
  },
  expand: {
    y: CAMERA_Y - 260,
    opacity: 0,
    rotate: -6,
    transition: { duration: 0.5, ease: "easeIn" },
  },
};

export function PolaroidCamera({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState<Stage>("arrive");
  const viewport = useViewportSize();
  const reduceMotion = useReducedMotion();

  const finish = useRef(onComplete);
  finish.current = onComplete;

  useEffect(() => {
    if (reduceMotion === null) return;

    if (reduceMotion) {
      finish.current();
      return;
    }

    const timers = SEQUENCE.map(({ at, stage: next }) =>
      setTimeout(() => setStage(next), at),
    );
    timers.push(setTimeout(() => finish.current(), COMPLETE_AT));

    return () => timers.forEach(clearTimeout);
  }, [reduceMotion]);

  useEffect(() => {
    const skip = () => finish.current();
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, []);

  if (!viewport) return null;

  const frame = frameSize(viewport);
  const padding = framePadding(frame.width);
  const filmHeight = frame.height / FILM_SCALE;
  const filmWidth = frame.width / FILM_SCALE;

  const tuckedY = CAMERA_Y - filmHeight;
  const centredY = SLOT_Y - filmHeight / 2;

  const filmY =
    stage === "expand" ? centredY : stage === "eject" ? SLOT_Y : tuckedY;

  return (
    <div className="relative flex h-screen items-center justify-center overflow-hidden">
      {stage === "flash" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.45, times: [0, 0.12, 1] }}
          className="pointer-events-none absolute inset-0 z-20 bg-white"
        />
      )}

      <div className="z-10 w-60">
        <motion.img
          src="/assets/polaroid-dark.svg"
          alt="Polaroid camera"
          initial={{ y: -320, opacity: 0, rotate: -6 }}
          animate={stage}
          variants={cameraVariants}
          className="relative z-10 w-full"
        />

        <motion.div
          initial={{ y: tuckedY, opacity: 0 }}
          animate={{
            y: filmY,
            opacity: stage === "arrive" || stage === "flash" ? 0 : 1,
            scale: stage === "expand" ? FILM_SCALE : 1,
          }}
          transition={{
            y: { duration: stage === "expand" ? 0.9 : 1.1, ease: SETTLE },
            opacity: { duration: 0.3, ease: "easeOut" },
            scale: { duration: 0.9, ease: [0.65, 0, 0.35, 1] },
          }}
          className="absolute right-0 left-0 z-0 mx-auto rounded-xs bg-white shadow-lg"
          style={{
            width: filmWidth,
            height: filmHeight,
            paddingTop: padding.top / FILM_SCALE,
            paddingLeft: padding.side / FILM_SCALE,
            paddingRight: padding.side / FILM_SCALE,
            paddingBottom: padding.bottom / FILM_SCALE,
            transformOrigin: "center center",
          }}
        >
          <div className="h-full w-full bg-black" />
        </motion.div>
      </div>
    </div>
  );
}
