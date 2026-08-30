import React from "react";
import { cn } from "@/lib/cn";

/** An anchor to somewhere off-site, opened in a new tab. */
export function ExternalLink({
  className,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={cn("hover:text-accent", className)}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  );
}
