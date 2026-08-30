import Image from "next/image";
import NextLink from "next/link";
import { Card } from "@/components/ui/card";
import type { Project } from "@/content/projects";
import { cn } from "@/lib/cn";

type Props = {
  project: Project;
  className?: string;
  frameClassName?: string;
  imageClassName?: string;
};

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
