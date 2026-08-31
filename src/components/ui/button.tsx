import React from "react";
import { cn } from "@/lib/cn";

const pressableSurface = cn(
  "flex items-center justify-center rounded-lg",
  "border-t-2 border-l-2 border-b-4 border-r-4 border-frame",
  "bg-surface text-frame",
  "hover:border-accent",
  "active:translate-x-[2px] active:translate-y-[2px] active:border-r-2 active:border-b-2",
  "disabled:pointer-events-none disabled:opacity-50",
);

export function Button({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cn(pressableSurface, className)} {...props} />;
}

export function ButtonLink({
  className,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={cn(pressableSurface, className)}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  );
}
