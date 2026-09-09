import { Hero } from "@/components/home/Hero";
import { ContinueWatching } from "@/components/home/ContinueWatching";
import { TrendingSection } from "@/components/home/TrendingSection";
import { SeasonalSection } from "@/components/home/SeasonalSection";
import { continueWatching, currentSeasonLabel, seasonalAnime, trendingAnime } from "@/data/placeholder-media";

export default function Home() {
  return (
    <>
      <Hero />
      <ContinueWatching entries={continueWatching} />
      <TrendingSection anime={trendingAnime} />
      <SeasonalSection anime={seasonalAnime} seasonLabel={currentSeasonLabel} />
    </>
  );
}
