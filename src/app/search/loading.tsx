import { AnimeGridSkeleton } from "@/components/anime/AnimeCardSkeleton";
import { ConstellationLoader } from "@/components/effects/ConstellationLoader";
import { Skeleton } from "@/components/ui/skeleton";

export default function SearchLoading() {
  return (
    <div className="tsuki-container py-8 md:py-10">
      <Skeleton className="mb-6 h-8 w-56 bg-surface-elevated" />
      <Skeleton className="mb-8 h-12 w-full bg-surface-elevated" />
      <ConstellationLoader label="Searching…" className="py-8" />
      <AnimeGridSkeleton count={12} />
    </div>
  );
}
