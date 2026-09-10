"use client";

import { useRouter } from "next/navigation";
import { TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

/**
 * TSUKI-styled error surface. Never renders raw stack traces — callers pass
 * a clean, already-friendly `message` (see `AniListError` in
 * `src/lib/anilist/client.ts`).
 */
export function ErrorState({ title = "Something went wrong", message, onRetry, className }: ErrorStateProps) {
  const router = useRouter();

  return (
    <div
      className={cn("tsuki-card flex flex-col items-center gap-3 px-6 py-14 text-center", className)}
      role="alert"
    >
      <TriangleAlert className="size-8 text-sunset" aria-hidden="true" />
      <p className="text-base font-medium text-foreground">{title}</p>
      <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
      <Button variant="secondary" size="sm" onClick={() => (onRetry ? onRetry() : router.refresh())}>
        Try Again
      </Button>
    </div>
  );
}
