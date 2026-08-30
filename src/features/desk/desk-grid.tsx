"use client";

import type { RefCallback } from "react";
import { projects } from "@/content/projects";
import type { Vector } from "./use-fly-away";
import { AboutTile } from "./tiles/about-tile";
import { ClockTile } from "./tiles/clock-tile";
import { ColophonTile } from "./tiles/colophon-tile";
import { ContactTile } from "./tiles/contact-tile";
import { CourseProgressTile } from "./tiles/course-progress-tile";
import { IntroTile } from "./tiles/intro-tile";
import { NowPlayingTile } from "./tiles/now-playing-tile";
import { PhotoLibraryTile } from "./tiles/photo-library-tile";
import { ProjectTile } from "./tiles/project-tile";
import { TravelTile } from "./tiles/travel-tile";

type Props = {
  /** Attaches the node that `useFlyAway` animates. */
  deskRef: RefCallback<HTMLDivElement>;
  onLaunch: (direction: Vector) => void;
  onOpenPhotos: () => void;
};

/**
 * The 12x8 tile grid. Tiles flow in source order, so the spans below are the
 * layout — reordering this list reorders the page.
 */
export function DeskGrid({ deskRef, onLaunch, onOpenPhotos }: Props) {
  return (
    <div
      ref={deskRef}
      className="flex h-screen transform-gpu items-center justify-center overflow-hidden text-frame will-change-[transform,opacity]"
    >
      <div className="grid h-[90%] w-3/4 grid-cols-12 grid-rows-8 gap-4">
        <IntroTile className="col-span-9 row-span-4" />
        <AboutTile className="col-span-3 row-span-6" />
        <ContactTile className="col-span-3 row-span-4" />
        <ClockTile className="col-span-3 row-span-1" />
        <TravelTile className="col-span-3 row-span-1" onLaunch={onLaunch} />
        <NowPlayingTile className="col-span-3 row-span-2" />
        <ProjectTile
          project={projects.kilimanjaro}
          className="col-span-3 row-span-2"
        />
        <CourseProgressTile className="col-span-3 row-span-1" />
        <PhotoLibraryTile
          className="col-span-3 row-span-1"
          onOpen={onOpenPhotos}
        />
        <ProjectTile
          project={projects.firstChair}
          className="col-span-3 row-span-1 bg-white"
          frameClassName="px-[5%]"
          imageClassName="object-contain"
        />
        <ColophonTile className="col-span-3 row-span-1" />
      </div>
    </div>
  );
}
