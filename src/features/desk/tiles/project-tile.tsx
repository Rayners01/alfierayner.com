import Image from "next/image";
import NextLink from "next/link";
import { Card } from "@/components/ui/card";
import type { Project } from "@/content/projects";
import { cn } from "@/lib/cn";

type Props = {
  project: Project;
  className?: string;
  /**
   * Applied to the image — pick an `object-fit` here, and inset a logo with
   * padding.
   *
   * Insetting has to happen on the image, not on a wrapper: the image is
   * `fill`, so it is absolutely positioned against the wrapper's *padding*
   * box, and padding there leaves it exactly where it was. Padding on the
   * image does work, because `object-fit` sizes against the content box.
   */
  imageClassName?: string;
};

export function ProjectTile({ project, className, imageClassName }: Props) {
  const isExternal = project.href.startsWith("http");
  const frame = "relative block h-full w-full";

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
