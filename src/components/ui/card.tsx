import React from "react";
import { cn } from "@/lib/cn";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Set to false for tiles whose content should bleed to the border. */
  padded?: boolean;
  /**
   * Whether the border lifts to the accent colour on hover.
   */
  hoverable?: boolean;
};

/** The bordered tile every panel on the site is built from. */
export function Card({
  className,
  padded = true,
  hoverable = true,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border-2 border-frame bg-surface",
        hoverable && "hover:border-accent",
        padded && "p-4",
        className,
      )}
      {...props}
    />
  );
}
