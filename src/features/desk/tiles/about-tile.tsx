import { Card } from "@/components/ui/card";
import { about } from "@/content/profile";
import { cn } from "@/lib/cn";

export function AboutTile({ className }: { className?: string }) {
  return (
    <Card className={cn("text-sm", className)}>
      <h2 className="mb-2 text-xl font-semibold">About me</h2>

      {about.intro.map((paragraph) => (
        <p key={paragraph} className="mb-4">
          {paragraph}
        </p>
      ))}

      <p className="mb-2">{about.interestsLead}</p>
      <ul className="mb-4 ml-4 list-disc">
        {about.interests.map((interest) => (
          <li key={interest}>{interest}</li>
        ))}
      </ul>

      {about.outro.map((paragraph, index) => (
        <p key={paragraph} className={index < about.outro.length - 1 ? "mb-4" : undefined}>
          {paragraph}
        </p>
      ))}
    </Card>
  );
}
