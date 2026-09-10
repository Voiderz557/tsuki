import type { AnimeSummary } from "@/types/anime";
import { AnimeCard } from "@/components/anime/AnimeCard";
import { EmptyState } from "@/components/feedback/EmptyState";

export function RecommendationsTab({ recommendations }: { recommendations: AnimeSummary[] }) {
  if (recommendations.length === 0) {
    return (
      <EmptyState title="No recommendations yet" message="AniList doesn't have enough recommendation data for this title yet." />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {recommendations.map((anime) => (
        <AnimeCard key={anime.id} anime={anime} />
      ))}
    </div>
  );
}
