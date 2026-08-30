import Image from "next/image";
import NextLink from "next/link";
import { Card } from "@/components/ui/card";
import type { Project } from "@/content/projects";
import { cn } from "@/lib/cn";

type Props = {
  project: Project;
  /** Grid placement. */
  className?: string;
  /** Applied to the link filling the tile — use for padding around a logo. */
  frameClassName?: string;
  /** Applied to the image — use to pick an `object-fit`. */
  imageClassName?: string;
};

/** A tile that is nothing but a clickable piece of artwork. */
export function ProjectTile({
  project,
  className,
  frameClassName,
  imageClassName,
}: Props) {
  const isExternal = project.href.startsWith("http");
  const frame = cn("relative block h-full w-full", frameClassName);

  const artwork = (
    <Image
      src={project.image.src}
      alt={project.image.alt}
      fill
      sizes="25vw"
      className={cn("rounded-md", imageClassName)}
    />
  );

  return (
    <Card padded={false} className={cn("overflow-hidden", className)}>
      {isExternal ? (
        <a
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={project.name}
          className={frame}
        >
          {artwork}
        </a>
      ) : (
        <NextLink href={project.href} aria-label={project.name} className={frame}>
          {artwork}
        </NextLink>
      )}
    </Card>
  );
}
