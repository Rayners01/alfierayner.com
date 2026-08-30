"use client";

import type { RefObject } from "react";
import { kilimanjaro } from "@/content/kilimanjaro";

type Props = {
  open: boolean;
  onToggle: () => void;
  altitudeRef: RefObject<HTMLSpanElement | null>;
  raisedRef: RefObject<HTMLSpanElement | null>;
  progressRef: RefObject<HTMLDivElement | null>;
};

/** Altitude, amount raised, and a progress bar — all written to by `useClimb`. */
export function ClimbHud({
  open,
  onToggle,
  altitudeRef,
  raisedRef,
  progressRef,
}: Props) {
  return (
    <div className="pointer-events-none absolute top-[3%] left-1/2 z-20 w-[60%] max-w-[420px] -translate-x-1/2">
      <button
        onClick={onToggle}
        aria-label={open ? "Hide climb stats" : "Show climb stats"}
        className="pointer-events-auto absolute top-0 right-full -mr-[0.1vmin] flex h-[3vmin] max-h-[3vmin] w-[3vmin] min-h-[16px] min-w-[16px] items-center justify-center border-[0.15vmin] border-white/20 bg-black/40 text-xs transition-colors hover:bg-black/50"
      >
        {open ? "<" : ">"}
      </button>

      {open && (
        <div className="pointer-events-auto w-full border-[0.2vmin] border-white/20 bg-black/30 p-[1.5vmin]">
          <div className="mb-[0.8vmin] flex justify-between text-[min(1.2vmin,14px)] tracking-tighter uppercase">
            <div className="flex flex-col gap-1">
              <span className="text-white/50">Altitude</span>
              <span>
                <span ref={altitudeRef}>0m</span>
                <span className="ml-1 text-white/50">
                  {" "}
                  / {kilimanjaro.summitHeight}m
                </span>
              </span>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-white/50">Raised</span>
              <span className="text-yellow-400" ref={raisedRef}>
                £0.00
              </span>
            </div>
          </div>

          <div className="mb-[0.8vmin] h-[1vmin] min-h-[4px] border-[0.1vmin] border-white/20 bg-black/50 p-[0.2vmin]">
            <div ref={progressRef} className="h-full w-0 bg-green-500/80" />
          </div>

          <p className="text-center text-[min(1vmin,11px)] leading-tight text-green-300/80 uppercase">
            {kilimanjaro.conversionNote}
          </p>
        </div>
      )}
    </div>
  );
}
