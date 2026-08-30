import Image from "next/image";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { profile, socials } from "@/content/profile";
import { cn } from "@/lib/cn";

export function IntroTile({ className }: { className?: string }) {
  return (
    <Card className={cn("flex flex-row", className)}>
      <div className="m-4 flex w-2/3 flex-col justify-between">
        <div>
          <p className="text-muted">{profile.greeting}</p>
          <p>
            Hi, I&rsquo;m <strong>{profile.name}</strong>, {profile.headline}.
          </p>
        </div>

        <div className="flex h-10 w-full flex-row gap-4">
          {socials.map((social) => (
            <ButtonLink key={social.label} href={social.href} className="w-1/5">
              <Image
                src={social.icon}
                width={20}
                height={20}
                alt={`${social.label} logo`}
              />
            </ButtonLink>
          ))}
        </div>
      </div>

      <div className="flex w-1/3 items-center justify-center p-4">
        <Image
          src={profile.portrait.src}
          alt={profile.portrait.alt}
          width={220}
          height={220}
          priority
          className="rounded-full border-4 border-frame"
        />
      </div>
    </Card>
  );
}
