import React from "react";
import { cn } from "@/lib/cn";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Set to false for tiles whose content should bleed to the border. */
  padded?: boolean;
};

/** The bordered lime tile every panel on the desk is built from. */
export function Card({ className, padded = true, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border-2 border-frame bg-surface hover:border-accent",
        padded && "p-4",
        className,
      )}
      {...props}
    />
  );
}
