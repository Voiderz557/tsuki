import { Skeleton } from "@/components/ui/skeleton";

/** Matches AnimeCard's dimensions exactly so grids don't jump when content loads. */
export function AnimeCardSkeleton() {
  return (
    <div className="tsuki-card overflow-hidden" aria-hidden="true">
      <Skeleton className="aspect-[2/3] w-full rounded-none bg-surface-elevated" />
      <div className="space-y-2 p-3">
        <Skeleton className="h-3.5 w-full bg-surface-elevated" />
        <Skeleton className="h-3 w-2/3 bg-surface-elevated" />
      </div>
    </div>
  );
}

export function AnimeGridSkeleton({ count = 12, className }: { count?: number; className?: string }) {
  return (
    <div
      className={className ?? "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"}
      role="status"
      aria-label="Loading anime"
    >
      {Array.from({ length: count }).map((_, i) => (
        <AnimeCardSkeleton key={i} />
      ))}
    </div>
  );
}
