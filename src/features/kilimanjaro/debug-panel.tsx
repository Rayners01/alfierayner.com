"use client";

import { useState } from "react";
import { kilimanjaro } from "@/content/kilimanjaro";

type Props = {
  raised: number;
  onRaisedChange: (value: number) => void;
  hour: number;
  onHourChange: (value: number) => void;
};

/**
 * Scrubbers for the donation total and the time of day, so the artwork and the
 * route can be checked without waiting for real donations or nightfall.
 */
export function DebugPanel({
  raised,
  onRaisedChange,
  hour,
  onHourChange,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="absolute bottom-[3%] left-[3%] z-40 flex flex-col items-start gap-1">
      {open && (
        <div className="w-[22vmin] min-w-[130px] border-[0.2vmin] border-white/20 bg-black/60 p-[1.5vmin] text-[min(1vmin,10px)] uppercase">
          <div className="mb-3 flex flex-col gap-2">
            <label className="text-white/50" htmlFor="debug-altitude">
              Altitude
            </label>
            <input
              id="debug-altitude"
              type="range"
              min={0}
              max={kilimanjaro.totalSteps}
              step={0.01}
              value={raised}
              onChange={(event) => onRaisedChange(parseFloat(event.target.value))}
              className="pixel-slider h-[0.6vmin] w-full cursor-pointer appearance-none bg-white/10"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-white/50" htmlFor="debug-hour">
              Time
            </label>
            <input
              id="debug-hour"
              type="range"
              min={0}
              max={23}
              value={hour}
              onChange={(event) => onHourChange(parseInt(event.target.value))}
              className="pixel-slider h-[0.6vmin] w-full cursor-pointer appearance-none bg-white/10"
            />
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? "Hide debug controls" : "Show debug controls"}
        className="flex h-[3.5vmin] w-[3.5vmin] min-h-[22px] min-w-[22px] items-center justify-center border-[0.15vmin] border-white/20 bg-black/40 transition-colors hover:bg-black/50"
      >
        {open ? "v" : "^"}
      </button>
    </div>
  );
}
