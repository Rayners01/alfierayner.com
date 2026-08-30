"use client";

/* eslint-disable @next/next/no-img-element -- The artwork frames are swapped
   imperatively by `useClimb` and cross-faded by hour; next/image's wrapper
   would fight both, and these are already sized pixel-art PNGs. */

import { useEffect, useState } from "react";
import { kilimanjaro } from "@/content/kilimanjaro";
import { pixel } from "@/lib/fonts";
import { ClimbHud } from "./climb-hud";
import { DebugPanel } from "./debug-panel";
import { useClimb } from "./use-climb";
import { frameForHour, useMountainHour } from "./use-mountain-hour";

/** A 16:9 window onto the mountain, letterboxed into whatever space it gets. */
const VIEWPORT =
  "relative aspect-video h-auto w-[90dvw] max-w-[calc(90dvh*16/9)] max-h-[90dvh] overflow-hidden border-[0.5vmin] border-neutral-200 bg-neutral-800 shadow-2xl";

/** Cross-fading artwork layer. `z` keeps foliage in front of the hiker. */
function Layer({
  kind,
  frame,
  z,
  faded,
  onLoad,
}: {
  kind: "bg" | "trees";
  frame: number;
  z: string;
  faded?: boolean;
  onLoad?: () => void;
}) {
  return (
    <img
      src={`/assets/kili/${kind}_${frame}.png`}
      alt=""
      onLoad={onLoad}
      className={`absolute inset-0 h-full w-full object-cover ${z} ${
        faded === undefined
          ? ""
          : `transition-opacity duration-700 ease-in-out ${faded ? "opacity-0" : "opacity-100"}`
      } ${kind === "trees" ? "pointer-events-none" : ""}`}
    />
  );
}

export function MountainScene() {
  const { hour, previousHour, transitioning, goTo, settle } = useMountainHour();
  const { refs, target, climbTo } = useClimb();
  const [hudOpen, setHudOpen] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/donation-total", { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => climbTo(data?.total ?? 0))
      .catch((error) => {
        if (error?.name !== "AbortError") console.error(error);
      });

    return () => controller.abort();
  }, [climbTo]);

  // Nothing to draw until the client has resolved the local hour.
  if (hour === null) {
    return <main className="fixed inset-0 bg-neutral-950" />;
  }

  const frame = frameForHour(hour);
  const previousFrame = previousHour === null ? null : frameForHour(previousHour);

  return (
    <main
      className={`fixed inset-0 flex items-center justify-center overflow-hidden bg-neutral-950 p-4 text-white ${pixel.className}`}
    >
      <div className={VIEWPORT}>
        {previousFrame !== null && (
          <Layer kind="bg" frame={previousFrame} z="z-0" />
        )}
        <Layer
          key={`bg-${frame}`}
          kind="bg"
          frame={frame}
          z="z-[1]"
          faded={transitioning}
          onLoad={settle}
        />

        <ClimbHud
          open={hudOpen}
          onToggle={() => setHudOpen(!hudOpen)}
          altitudeRef={refs.altitudeRef}
          raisedRef={refs.raisedRef}
          progressRef={refs.progressRef}
        />

        <img
          ref={refs.hikerRef}
          alt=""
          className="absolute z-[10] h-auto w-[4.5%] -translate-x-1/2 -translate-y-full"
          style={{ imageRendering: "pixelated" }}
        />

        {previousFrame !== null && (
          <Layer kind="trees" frame={previousFrame} z="z-[11]" />
        )}
        <Layer
          key={`trees-${frame}`}
          kind="trees"
          frame={frame}
          z="z-[12]"
          faded={transitioning}
        />

        <div className="absolute bottom-[6%] left-1/2 z-30 -translate-x-1/2">
          <a
            href={kilimanjaro.donateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block border-[0.3vmin] border-black bg-yellow-300 px-[2vmin] py-[1vmin] text-center text-[min(2vmin,16px)] text-black uppercase shadow-[0.4vmin_0.4vmin_0_0_#000] active:translate-y-[0.4vmin] active:shadow-none"
          >
            Donate!
          </a>
        </div>

        <DebugPanel
          raised={target}
          onRaisedChange={climbTo}
          hour={hour}
          onHourChange={goTo}
        />
      </div>

      <p className="pointer-events-none absolute bottom-[2dvh] w-full px-4 text-center text-[min(1.5vmin,10px)] tracking-tight text-white/30 uppercase">
        {kilimanjaro.credit}
      </p>
    </main>
  );
}
