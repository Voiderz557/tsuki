import { ConstellationLoader } from "@/components/effects/ConstellationLoader";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnimeDetailLoading() {
  return (
    <>
      <div className="relative h-52 w-full overflow-hidden sm:h-72 md:h-96">
        <Skeleton className="h-full w-full rounded-none bg-surface-elevated" />
      </div>
      <div className="tsuki-container relative -mt-16 sm:-mt-24 md:-mt-28">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
          <Skeleton className="aspect-[2/3] w-32 shrink-0 rounded-[10px] bg-surface-elevated sm:w-40 md:w-48" />
          <div className="flex-1 space-y-3 pb-2">
            <Skeleton className="h-8 w-2/3 bg-surface-elevated" />
            <Skeleton className="h-4 w-1/3 bg-surface-elevated" />
          </div>
        </div>
        <ConstellationLoader label="Loading anime…" />
      </div>
    </>
  );
}
