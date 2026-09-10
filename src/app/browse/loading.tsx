import { AnimeGridSkeleton } from "@/components/anime/AnimeCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function BrowseLoading() {
  return (
    <div className="tsuki-container py-8 md:py-10">
      <Skeleton className="mb-6 h-8 w-40 bg-surface-elevated" />
      <Skeleton className="mb-6 h-32 w-full bg-surface-elevated" />
      <AnimeGridSkeleton count={24} />
    </div>
  );
}
