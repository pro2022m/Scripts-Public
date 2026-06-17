import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
  hint?: string;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, hint, className }: Props) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden border-dashed bg-card/40 p-10 text-center",
        "animate-fade-in",
        className,
      )}
    >
      <div className="pointer-events-none absolute -top-24 left-1/2 size-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative mx-auto flex max-w-xl flex-col items-center gap-5">
        <div className="grid size-14 place-items-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
          <Icon className="size-6" />
        </div>
        <div className="space-y-2">
          <Badge variant="muted" className="uppercase tracking-wider">
            Coming soon
          </Badge>
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>
        {hint && (
          <p className="rounded-md border border-border/70 bg-background/40 px-3 py-2 text-xs text-muted-foreground">
            {hint}
          </p>
        )}
      </div>
    </Card>
  );
}
