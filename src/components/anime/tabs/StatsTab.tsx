import type { AnimeDetail } from "@/types/anime";
import { StatCard } from "@/components/stats/StatCard";
import { ScoreDistributionChart } from "@/components/stats/ScoreDistributionChart";
import { StatusDistributionChart } from "@/components/stats/StatusDistributionChart";
import { EmptyState } from "@/components/feedback/EmptyState";
import { formatCompactNumber, formatScore } from "@/lib/format";

export function StatsTab({ anime }: { anime: AnimeDetail }) {
  const hasDistributions = anime.scoreDistribution.length > 0 || anime.statusDistribution.length > 0;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Average Score" value={formatScore(anime.averageScore) ?? "—"} />
        <StatCard label="Mean Score" value={formatScore(anime.meanScore) ?? "—"} />
        <StatCard label="Popularity" value={formatCompactNumber(anime.popularity) ?? "—"} />
        <StatCard label="Favourites" value={formatCompactNumber(anime.favourites) ?? "—"} />
      </div>

      {hasDistributions ? (
        <div className="grid gap-8 md:grid-cols-2">
          {anime.scoreDistribution.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-medium text-foreground-secondary">Score Distribution</h3>
              <ScoreDistributionChart data={anime.scoreDistribution} />
            </div>
          )}
          {anime.statusDistribution.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-medium text-foreground-secondary">Status Distribution</h3>
              <StatusDistributionChart data={anime.statusDistribution} />
            </div>
          )}
        </div>
      ) : (
        <EmptyState title="No distribution data" message="AniList hasn't published detailed stats for this title yet." />
      )}
    </div>
  );
}
