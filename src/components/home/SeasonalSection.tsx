import Link from "next/link";

import type { AnimeSummary } from "@/types/anime";
import { AnimeCard } from "@/components/anime/AnimeCard";

export function SeasonalSection({ anime, seasonLabel }: { anime: AnimeSummary[]; seasonLabel: string }) {
  return (
    <section className="tsuki-container py-8 md:py-10">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-xl font-semibold text-foreground md:text-2xl">{seasonLabel}</h2>
        <Link href="/seasonal" className="text-sm text-foreground-secondary hover:text-foreground">
          View All →
        </Link>
      </div>

      {anime.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {anime.map((item) => (
            <AnimeCard key={item.id} anime={item} showGenres />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No seasonal anime found for this season.</p>
      )}
    </section>
  );
}
