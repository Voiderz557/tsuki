import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  title?: string;
  message: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ title = "Nothing here yet", message, icon, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center gap-3 px-6 py-14 text-center", className)}>
      <div className="flex size-12 items-center justify-center rounded-full bg-surface-elevated text-moonlight">
        {icon ?? <Sparkles className="size-5" aria-hidden="true" />}
      </div>
      <p className="text-base font-medium text-foreground">{title}</p>
      <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
      {action}
    </div>
  );
}
