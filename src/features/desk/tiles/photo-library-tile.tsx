"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { useTheme } from "@/features/theme/theme-provider";
import { themedAsset } from "@/lib/theme";
import { cn } from "@/lib/cn";

export function PhotoLibraryTile({
  className,
  onOpen,
}: {
  className?: string;
  onOpen: () => void;
}) {
  const { theme } = useTheme();

  return (
    <Card
      className={cn(
        "flex h-full cursor-pointer flex-row items-center justify-center gap-4",
        className,
      )}
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") onOpen();
      }}
    >
      <p>Photo Gallery</p>
      <Image
        src={themedAsset("/assets/polaroid.svg", theme)}
        alt=""
        width={30}
        height={30}
        aria-hidden
      />
    </Card>
  );
}
