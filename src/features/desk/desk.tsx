"use client";

import { useCallback, useState } from "react";
import { GlobeView } from "@/features/globe/globe-view";
import { PolaroidCamera } from "@/features/photos/polaroid-camera";
import { PolaroidDeveloping } from "@/features/photos/polaroid-developing";
import { DeskGrid } from "./desk-grid";
import { useFlyAway } from "./use-fly-away";

/**
 * The desk and the two places you can leave it for.
 *
 * `globe` is reached by flying the plane off the travel tile; `camera` and
 * `photos` are the two halves of the polaroid sequence behind the photo
 * library tile. Only one view is mounted at a time.
 */
type View = "desk" | "globe" | "camera" | "photos";

export function Desk() {
  const [view, setView] = useState<View>("desk");

  const { offset, launch, recall } = useFlyAway({
    onEscape: useCallback(() => setView("globe"), []),
  });

  const returnFromGlobe = useCallback(() => {
    setView("desk");
    recall();
  }, [recall]);

  return (
    <div className="h-screen overflow-hidden bg-[url('/assets/tortoise-shell.svg')]">
      {view === "desk" && (
        <DeskGrid
          offset={offset}
          onLaunch={launch}
          onOpenPhotos={() => setView("camera")}
        />
      )}

      {view === "globe" && <GlobeView onBack={returnFromGlobe} />}

      {view === "camera" && (
        <PolaroidCamera onComplete={() => setView("photos")} />
      )}

      {view === "photos" && (
        <PolaroidDeveloping onClose={() => setView("desk")} />
      )}
    </div>
  );
}
