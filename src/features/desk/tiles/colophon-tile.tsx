import { Card } from "@/components/ui/card";
import { ExternalLink } from "@/components/ui/external-link";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

export function ColophonTile({ className }: { className?: string }) {
  return (
    <Card className={cn("text-sm", className)}>
      <p>
        &copy; {site.copyrightYear} {site.title}
      </p>
      <p>
        Created with <ExternalLink href="https://nextjs.org">Next.js</ExternalLink>
      </p>
    </Card>
  );
}
