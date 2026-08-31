"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { DownloadIcon } from "@/components/icons/download-icon";
import { LatestPost } from "@/features/blog/latest-post";
import { useTheme } from "@/features/theme/theme-provider";
import { cv, profile, socials } from "@/content/profile";
import { themedAsset } from "@/lib/theme";
import { cn } from "@/lib/cn";

export function IntroTile({ className }: { className?: string }) {
  const { theme } = useTheme();

  // Stacks on phones, portrait first — `flex-col-reverse` puts the photo above
  // the copy without reordering the markup.
  return (
    <Card className={cn("flex flex-row max-md:flex-col-reverse", className)}>
      <div className="m-4 flex w-2/3 flex-col justify-between max-md:m-0 max-md:w-full max-md:gap-4">
        <div>
          <p className="text-muted">{profile.greeting}</p>
          <p>
            Hi, I&rsquo;m <strong>{profile.name}</strong>, {profile.headline}.
          </p>
        </div>

        <LatestPost className="max-md:mt-2" />

        <div className="flex h-10 w-full flex-row gap-4">
          {socials.map((social) => (
            <ButtonLink
              key={social.label}
              href={social.href}
              className="w-1/5 max-md:w-auto max-md:flex-1"
            >
              <Image
                src={themedAsset(social.icon, theme)}
                width={20}
                height={20}
                alt={`${social.label} logo`}
              />
            </ButtonLink>
          ))}
          <ButtonLink
            href={cv.href}
            download={cv.filename}
            className="w-1/5 gap-1.5 text-sm font-semibold max-md:w-auto max-md:flex-1"
          >
            <DownloadIcon className="h-4 w-4" />
            {cv.label}
          </ButtonLink>
        </div>
      </div>

      <div className="flex w-1/3 items-center justify-center p-4 max-md:w-full max-md:pb-2">
        <Image
          src={profile.portrait.src}
          alt={profile.portrait.alt}
          width={220}
          height={220}
          priority
          className="rounded-full border-4 border-frame hover:border-accent max-md:h-32 max-md:w-32"
        />
      </div>
    </Card>
  );
}
