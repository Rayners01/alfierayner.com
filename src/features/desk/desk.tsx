"use client";

import { useCallback, useState } from "react";
import { GlobeView } from "@/features/globe/globe-view";
import { PolaroidCamera } from "@/features/photos/polaroid-camera";
import { PolaroidDeveloping } from "@/features/photos/polaroid-developing";
import { ThemeToggle } from "@/features/theme/theme-toggle";
import { DeskGrid } from "./desk-grid";
import { useFlyAway } from "./use-fly-away";

type View = "desk" | "globe" | "camera" | "photos";

export function Desk() {
  const [view, setView] = useState<View>("desk");

  const { deskRef, launch, recall } = useFlyAway({
    onEscape: useCallback(() => setView("globe"), []),
  });

  const returnFromGlobe = useCallback(() => {
    setView("desk");
    recall();
  }, [recall]);

  return (
    <div className="h-screen overflow-hidden bg-[image:var(--art-page)] max-md:h-auto max-md:min-h-dvh max-md:overflow-visible">
      <ThemeToggle />
      {view === "desk" && (
        <DeskGrid
          deskRef={deskRef}
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
