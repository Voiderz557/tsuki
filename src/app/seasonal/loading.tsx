import { AnimeGridSkeleton } from "@/components/anime/AnimeCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function SeasonalLoading() {
  return (
    <div className="tsuki-container py-8 md:py-10">
      <div className="mb-6 flex items-center justify-between gap-3">
        <Skeleton className="h-4 w-20 bg-surface-elevated" />
        <Skeleton className="h-7 w-40 bg-surface-elevated" />
        <Skeleton className="h-4 w-20 bg-surface-elevated" />
      </div>
      <div className="mb-6 flex justify-between gap-3">
        <Skeleton className="h-8 w-64 bg-surface-elevated" />
        <Skeleton className="h-8 w-40 bg-surface-elevated" />
      </div>
      <AnimeGridSkeleton count={18} />
    </div>
  );
}
