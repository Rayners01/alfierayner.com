'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function PolaroidTransition({ onComplete }: { onComplete: () => void }) {
  const [cameraIn, setCameraIn] = useState(false);
  const [flash, setFlash] = useState(false);
  const [moved, setMoved] = useState(false);
  const [centered, setCentered] = useState(false);
  
  const fullFilmHeight = Math.ceil(window.innerHeight * 0.9);
  const filmHeight = fullFilmHeight / 4;

  const zeroY = 30*4;
  const topY = -zeroY - (filmHeight / 2)

  return (
    <div className="relative flex justify-center items-center h-screen overflow-hidden">
      {flash && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 bg-white z-20"
        />
      )}

      <div className="w-60 z-10">
        <motion.img
          src="/assets/polaroid.svg"
          alt="Polaroid camera"
          initial={{ y: -300, opacity: 0 }}
          animate={{
            y: -100,
            opacity: moved ? 0 : 1
          }}
          transition={{
            y: { duration: 1 },
            opacity: { duration: moved ? 0.5 : 1 }
          }}
          onAnimationComplete={() => {
            if (!cameraIn) {
              setCameraIn(true);
              setTimeout(() => setFlash(true), 300);
            }
          }}
          className="w-full relative z-10"
        />

        {cameraIn && (
          <motion.div
            initial={{ y: -300 }}
            animate={{
              y: moved ? topY : -50,
              scale: centered ? 4 : 1,
            }}
            transition={{
              y: {
                delay: moved ? 0 : 1,
                duration: moved ? 1.2 : 1,
                ease: moved ? "easeInOut" : "easeOut"
              },
              scale: {
                delay: centered ? 0 : 0,
                duration: centered ? 1.2 : 0,
                ease: "easeInOut"
              },
            }}
            onAnimationComplete={() => {
              if (!moved) {
                setTimeout(() => setMoved(true), 500);
              } else if (moved && !centered) {
                setTimeout(() => setCentered(true), 200);
              } else if (centered) {
                setTimeout(() => onComplete(), 500);
              }
            }}
            className={`absolute left-0 right-0 mx-auto w-40 bg-white rounded-xs shadow-lg flex justify-center items-center z-0
              pt-2 pr-2 pb-6 pl-2`}
            style={{
              height: `${filmHeight}px`,
              transformOrigin: 'center center'
            }}
          >
            <div className="w-full h-full bg-black" />
          </motion.div>
        )}
      </div>
    </div>
  );
}