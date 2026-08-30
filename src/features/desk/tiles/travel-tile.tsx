"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Card } from "@/components/ui/card";
import { PlaneIcon } from "@/components/icons/plane-icon";
import { LAUNCH_MS, type Vector } from "@/features/desk/use-fly-away";
import { animate, easeIn, prefersReducedMotion } from "@/lib/animation";
import { cn } from "@/lib/cn";

const ORBIT_RADIUS = 0.3;
const ORBIT_PERIOD_MS = 10_500;

const FLIGHT_TRAVEL = 0.85;
const FLIGHT_SCALE = 0.35;
const FADE_FROM = 0.55;

type Props = {
  className?: string;
  onLaunch: (direction: Vector) => void;
};

export function TravelTile({ className, onLaunch }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [launched, setLaunched] = useState(false);

  const heading = useRef(0);
  const launchedRef = useRef(false);
  const cancel = useRef<(() => void) | null>(null);

  const orient = useCallback((degrees: number, scale = 1) => {
    if (bodyRef.current) {
      bodyRef.current.style.transform = `translate(-50%, -50%) rotate(${degrees}deg) scale(${scale})`;
    }
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    let frame = requestAnimationFrame(function step(now) {
      frame = requestAnimationFrame(step);
      if (launchedRef.current) return;

      const angle = ((now % ORBIT_PERIOD_MS) / ORBIT_PERIOD_MS) * Math.PI * 2;

      if (mapRef.current) {
        const x = 0.5 + ORBIT_RADIUS * Math.cos(angle);
        const y = 0.5 + ORBIT_RADIUS * Math.sin(angle);
        mapRef.current.style.backgroundPosition = `${x * 100}% ${y * 100}%`;
      }

      heading.current = (angle + Math.PI / 2) * (180 / Math.PI);
      orient(heading.current);
    });

    return () => cancelAnimationFrame(frame);
  }, [orient]);

  useEffect(() => () => cancel.current?.(), []);

  const handleClick = useCallback(() => {
    if (launchedRef.current || !planeRef.current) return;

    const radians = (heading.current * Math.PI) / 180;
    const direction = { x: Math.cos(radians), y: Math.sin(radians) };

    launchedRef.current = true;
    onLaunch(direction);

    if (prefersReducedMotion()) return;

    const rect = planeRef.current.getBoundingClientRect();
    const from = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
    const distance =
      Math.hypot(window.innerWidth, window.innerHeight) * FLIGHT_TRAVEL;

    setLaunched(true);

    cancel.current = animate({
      duration: LAUNCH_MS,
      ease: easeIn,
      onFrame: (eased, progress) => {
        const node = planeRef.current;
        if (!node) return;

        const x = from.x + direction.x * distance * eased;
        const y = from.y + direction.y * distance * eased;
        node.style.transform = `translate3d(${x}px, ${y}px, 0)`;

        orient(heading.current, 1 - (1 - FLIGHT_SCALE) * eased);
        node.style.opacity = `${
          progress < FADE_FROM ? 1 : 1 - (progress - FADE_FROM) / (1 - FADE_FROM)
        }`;
      },
    });
  }, [onLaunch, orient]);

  const plane = (
    <div
      ref={planeRef}
      className={cn(
        "z-50 will-change-transform",
        launched ? "fixed top-0 left-0" : "absolute top-1/2 left-1/2",
      )}
    >
      <div ref={bodyRef} className="will-change-transform">
        <PlaneIcon className="h-10 w-10 fill-white" />
      </div>
    </div>
  );

  return (
    <Card
      padded={false}
      className={cn("relative cursor-pointer bg-black", className)}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="Show the countries I have visited"
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") handleClick();
      }}
    >
      <div
        ref={mapRef}
        className="absolute inset-0 rounded-md bg-[url('/assets/world-map.jpg')] bg-[length:400%] bg-no-repeat opacity-80"
        style={{ backgroundPosition: "80% 50%" }}
      />
      {launched ? createPortal(plane, document.body) : plane}
    </Card>
  );
}
