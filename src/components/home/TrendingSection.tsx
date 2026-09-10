import Link from "next/link";

import type { AnimeSummary } from "@/types/anime";
import { AnimeCard } from "@/components/anime/AnimeCard";

export function TrendingSection({ anime }: { anime: AnimeSummary[] }) {
  return (
    <section className="tsuki-container py-8 md:py-10">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-xl font-semibold text-foreground md:text-2xl">Trending Now</h2>
        <Link href="/browse?sort=TRENDING_DESC" className="text-sm text-foreground-secondary hover:text-foreground">
          View All →
        </Link>
      </div>

      {anime.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {anime.map((item) => (
            <AnimeCard key={item.id} anime={item} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No trending anime right now.</p>
      )}
    </section>
  );
}
