import { Hero } from "@/components/home/Hero";
import { ContinueWatching } from "@/components/home/ContinueWatching";
import { TrendingSection } from "@/components/home/TrendingSection";
import { SeasonalSection } from "@/components/home/SeasonalSection";
import { SectionError } from "@/components/home/SectionError";
import { continueWatching } from "@/data/placeholder-media";
import { getTrendingAnime, getSeasonalAnime } from "@/lib/anilist/anime";
import { getCurrentSeason, seasonLabel } from "@/lib/anilist/season";

// Revalidate the whole route hourly — trending/seasonal data doesn't need
// to be any fresher than that, and it keeps AniList request volume low.
export const revalidate = 3600;

export default async function Home() {
  const currentSeason = getCurrentSeason();

  const [trendingResult, seasonalResult] = await Promise.allSettled([
    getTrendingAnime(18),
    getSeasonalAnime({ season: currentSeason.season, seasonYear: currentSeason.year, perPage: 12 }),
  ]);

  return (
    <>
      <Hero />
      <ContinueWatching entries={continueWatching} />

      {trendingResult.status === "fulfilled" ? (
        <TrendingSection anime={trendingResult.value} />
      ) : (
        <SectionError title="Trending Now" error={trendingResult.reason} />
      )}

      {seasonalResult.status === "fulfilled" ? (
        <SeasonalSection anime={seasonalResult.value.items} seasonLabel={seasonLabel(currentSeason)} />
      ) : (
        <SectionError title={seasonLabel(currentSeason)} error={seasonalResult.reason} />
      )}
    </>
  );
}
