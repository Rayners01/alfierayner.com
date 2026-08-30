import { Card } from "@/components/ui/card";
import { Clock } from "@/components/ui/clock";
import { cn } from "@/lib/cn";

export function ClockTile({ className }: { className?: string }) {
  return (
    <Card className={cn("flex items-center justify-center", className)}>
      <Clock />
    </Card>
  );
}
