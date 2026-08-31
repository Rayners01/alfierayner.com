"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { course } from "@/content/course";

/** Percentage of the way through my degree, to two decimal places. */
function elapsedPercent(): number {
  const start = new Date(course.startedOn).getTime();
  const end = new Date(course.graduatesOn).getTime();
  const fraction = (Date.now() - start) / (end - start);

  return Math.round(Math.min(Math.max(fraction, 0), 1) * 10_000) / 100;
}

export function CourseProgressTile({ className }: { className?: string }) {
  // Computed on mount rather than at module scope so the bar cannot be frozen
  // at build time.
  const progress = useMemo(elapsedPercent, []);

  return (
    <Card className={className}>
      <div className="flex h-full w-full flex-col justify-center p-2">
        <div className="mb-2 flex items-end justify-between">
          <h3 className="text-[10px] font-bold tracking-widest">
            {course.label}
          </h3>
          <span className="font-mono text-xs font-bold text-muted">
            {progress}%
          </span>
        </div>

        <div className="h-2 w-full rounded-md border border-muted/20 bg-black/50">
          <div className="h-full w-full overflow-hidden rounded-md">
            <div
              className="h-full bg-muted transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-2 flex justify-between text-[9px] font-bold tracking-tighter text-gray-400 uppercase opacity-60">
          <span>{course.startLabel}</span>
          <span>{course.endLabel}</span>
        </div>
      </div>
    </Card>
  );
}
