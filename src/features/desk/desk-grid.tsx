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
  deskRef: RefCallback<HTMLDivElement>;
  onLaunch: (direction: Vector) => void;
  onOpenPhotos: () => void;
};

export function DeskGrid({ deskRef, onLaunch, onOpenPhotos }: Props) {
  return (
    <div
      ref={deskRef}
      className="flex h-screen transform-gpu items-center justify-center overflow-hidden text-frame will-change-[transform,opacity] max-md:h-auto max-md:min-h-dvh max-md:items-start max-md:overflow-visible"
    >
      <div className="desk-grid grid h-[90%] w-3/4 grid-cols-12 grid-rows-8 gap-4 max-md:h-auto max-md:w-[92%] max-md:grid-cols-1 max-md:grid-rows-none max-md:gap-3 max-md:py-5">
        <IntroTile className="col-span-9 row-span-4" />
        <AboutTile className="col-span-3 row-span-6" />
        <ContactTile className="col-span-3 row-span-4" />
        <ClockTile className="col-span-3 row-span-1" />
        {/* Tiles whose content is absolutely positioned or `h-full` have no
            intrinsic height, so they need an explicit one once the phone
            layout drops the fixed grid rows. */}
        <TravelTile
          className="col-span-3 row-span-1 max-md:h-28"
          onLaunch={onLaunch}
        />
        <NowPlayingTile className="col-span-3 row-span-2" />
        <ProjectTile
          project={projects.kilimanjaro}
          className="col-span-3 row-span-2 max-md:h-44"
        />
        <CourseProgressTile className="col-span-3 row-span-1" />
        <PhotoLibraryTile
          className="col-span-3 row-span-1"
          onOpen={onOpenPhotos}
        />
        <ProjectTile
          project={projects.firstChair}
          className="col-span-3 row-span-1 bg-white max-md:h-24"
          frameClassName="px-[5%]"
          imageClassName="object-contain"
        />
        <ColophonTile className="col-span-3 row-span-1" />
      </div>
    </div>
  );
}
