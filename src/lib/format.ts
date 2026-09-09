import type { AnimeFormat, MediaTitle } from "@/types/anime";

/** Preferred display title: English falls back to Romaji. */
export function displayTitle(title: MediaTitle): string {
  return title.english ?? title.romaji;
}

/** Community score is stored 0-100; display as a single decimal, e.g. 9.3. */
export function formatScore(score: number | null | undefined): string | null {
  if (score === null || score === undefined) return null;
  return (score / 10).toFixed(1);
}

const FORMAT_LABELS: Record<AnimeFormat, string> = {
  TV: "TV",
  TV_SHORT: "TV Short",
  MOVIE: "Movie",
  OVA: "OVA",
  ONA: "ONA",
  SPECIAL: "Special",
  MUSIC: "Music",
};

export function formatFormatLabel(format: AnimeFormat | null | undefined): string | null {
  if (!format) return null;
  return FORMAT_LABELS[format];
}

export function formatEpisodeCount(episodes: number | null | undefined): string | null {
  if (episodes === null || episodes === undefined) return null;
  return `${episodes} Episode${episodes === 1 ? "" : "s"}`;
}
