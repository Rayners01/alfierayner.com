import Image from "next/image";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export function PhotoLibraryTile({
  className,
  onOpen,
}: {
  className?: string;
  onOpen: () => void;
}) {
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
      <p>Photo Library</p>
      <Image
        src="/assets/polaroid-dark.svg"
        alt=""
        width={30}
        height={30}
        aria-hidden
      />
    </Card>
  );
}
