import { ConstellationLoader } from "@/components/effects/ConstellationLoader";
import { Skeleton } from "@/components/ui/skeleton";

export default function MangaDetailLoading() {
  return (
    <div className="tsuki-container py-8 md:py-10">
      <div className="flex flex-col gap-6 sm:flex-row">
        <Skeleton className="aspect-[2/3] w-36 shrink-0 rounded-[10px] bg-surface-elevated sm:w-44" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-8 w-2/3 bg-surface-elevated" />
          <Skeleton className="h-4 w-1/3 bg-surface-elevated" />
        </div>
      </div>
      <ConstellationLoader label="Loading manga…" />
    </div>
  );
}
