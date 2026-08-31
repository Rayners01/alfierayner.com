"use client";

import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "@/components/icons/theme-icons";
import { cn } from "@/lib/cn";
import { useTheme } from "./theme-provider";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const switchingToFun = theme === "mature";

  return (
    <Button
      onClick={toggle}
      aria-label={
        switchingToFun ? "Switch to the bright theme" : "Switch to the dark theme"
      }
      title={switchingToFun ? "Bright theme" : "Dark theme"}
      className={cn(
        "fixed right-4 bottom-4 z-40 h-11 w-11 md:top-4 md:bottom-auto",
        className,
      )}
    >
      {switchingToFun ? (
        <SunIcon className="h-5 w-5" />
      ) : (
        <MoonIcon className="h-5 w-5" />
      )}
    </Button>
  );
}
