"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Card } from "@/components/ui/card";
import { PlaneIcon } from "@/components/icons/plane-icon";
import type { Vector } from "@/features/desk/use-fly-away";
import { cn } from "@/lib/cn";

/** Radius of the plane's orbit, as a fraction of the tile. */
const ORBIT_RADIUS = 0.3;
/** Radians advanced per frame while circling. */
const ORBIT_SPEED = 0.01;
/** Launch speed, in viewport-widths per frame. */
const LAUNCH_SPEED = 0.005;

type Props = {
  className?: string;
  /** Called with the launch vector when the plane leaves the tile. */
  onLaunch: (velocity: Vector) => void;
};

/**
 * A world map with a plane circling it. Clicking the tile sends the plane out
 * of the tile and across the page — the desk follows it, and the globe view
 * takes over once both have cleared the viewport.
 */
export function TravelTile({ className, onLaunch }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const [launched, setLaunched] = useState(false);

  // Animation state lives in refs and is written straight to the DOM: at 60fps
  // a React state update per frame would re-render the whole desk.
  const heading = useRef(0);
  const velocity = useRef<Vector>({ x: 0, y: 0 });
  const flightPosition = useRef<Vector>({ x: 0, y: 0 });
  const launchedRef = useRef(false);

  useEffect(() => {
    let frame: number;
    let angle = 0;

    const draw = () => {
      frame = requestAnimationFrame(draw);

      if (!launchedRef.current) {
        angle += ORBIT_SPEED;
        const x = 0.5 + ORBIT_RADIUS * Math.cos(angle);
        const y = 0.5 + ORBIT_RADIUS * Math.sin(angle);

        if (mapRef.current) {
          mapRef.current.style.backgroundPosition = `${x * 100}% ${y * 100}%`;
        }

        // The plane's nose follows the tangent of the orbit.
        heading.current = (angle + Math.PI / 2) * (180 / Math.PI);

        if (planeRef.current) {
          planeRef.current.style.transform = `translate(-50%, -50%) rotate(${heading.current}deg)`;
        }
        return;
      }

      flightPosition.current = {
        x: flightPosition.current.x + velocity.current.x * window.innerWidth,
        y: flightPosition.current.y + velocity.current.y * window.innerHeight,
      };

      if (planeRef.current) {
        planeRef.current.style.left = `${flightPosition.current.x}px`;
        planeRef.current.style.top = `${flightPosition.current.y}px`;
      }
    };

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleClick = useCallback(() => {
    if (launchedRef.current || !planeRef.current) return;

    const radians = (heading.current * Math.PI) / 180;
    velocity.current = {
      x: Math.cos(radians) * LAUNCH_SPEED,
      y: Math.sin(radians) * LAUNCH_SPEED,
    };

    const rect = planeRef.current.getBoundingClientRect();
    flightPosition.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };

    launchedRef.current = true;
    setLaunched(true);
    onLaunch(velocity.current);
  }, [onLaunch]);

  const plane = (
    <div
      ref={planeRef}
      className={cn("z-50", launched ? "fixed" : "absolute top-1/2 left-1/2")}
      style={
        launched
          ? {
              left: flightPosition.current.x,
              top: flightPosition.current.y,
              transform: `translate(-50%, -50%) rotate(${heading.current}deg)`,
            }
          : undefined
      }
    >
      <PlaneIcon className="h-10 w-10 fill-white" />
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
      />
      {launched ? createPortal(plane, document.body) : plane}
    </Card>
  );
}
