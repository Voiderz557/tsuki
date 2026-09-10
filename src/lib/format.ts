import type { AnimeFormat, MangaFormat, MediaSeason, MediaTitle } from "@/types/anime";

/** Preferred display title: English falls back to Romaji. */
export function displayTitle(title: MediaTitle): string {
  return title.english ?? title.romaji;
}

/** Community score is stored 0-100; display as a single decimal, e.g. 9.3. */
export function formatScore(score: number | null | undefined): string | null {
  if (score === null || score === undefined) return null;
  return (score / 10).toFixed(1);
}

const ANIME_FORMAT_LABELS: Record<AnimeFormat, string> = {
  TV: "TV",
  TV_SHORT: "TV Short",
  MOVIE: "Movie",
  OVA: "OVA",
  ONA: "ONA",
  SPECIAL: "Special",
  MUSIC: "Music",
};

const MANGA_FORMAT_LABELS: Record<MangaFormat, string> = {
  MANGA: "Manga",
  NOVEL: "Novel",
  ONE_SHOT: "One Shot",
};

export function formatFormatLabel(format: AnimeFormat | MangaFormat | null | undefined): string | null {
  if (!format) return null;
  return ANIME_FORMAT_LABELS[format as AnimeFormat] ?? MANGA_FORMAT_LABELS[format as MangaFormat] ?? format;
}

export function formatEpisodeCount(episodes: number | null | undefined): string | null {
  if (episodes === null || episodes === undefined) return null;
  return `${episodes} Episode${episodes === 1 ? "" : "s"}`;
}

export function formatChapterCount(chapters: number | null | undefined): string | null {
  if (chapters === null || chapters === undefined) return null;
  return `${chapters} Chapter${chapters === 1 ? "" : "s"}`;
}

export function formatDuration(minutesPerEpisode: number | null | undefined): string | null {
  if (minutesPerEpisode === null || minutesPerEpisode === undefined) return null;
  return `${minutesPerEpisode} min`;
}

const STATUS_LABELS: Record<string, string> = {
  FINISHED: "Finished",
  RELEASING: "Releasing",
  NOT_YET_RELEASED: "Not Yet Released",
  CANCELLED: "Cancelled",
  HIATUS: "Hiatus",
};

export function formatStatusLabel(status: string | null | undefined): string | null {
  if (!status) return null;
  return STATUS_LABELS[status] ?? status;
}

const SOURCE_LABELS: Record<string, string> = {
  ORIGINAL: "Original",
  MANGA: "Manga",
  LIGHT_NOVEL: "Light Novel",
  VISUAL_NOVEL: "Visual Novel",
  VIDEO_GAME: "Video Game",
  OTHER: "Other",
  NOVEL: "Novel",
  DOUJINSHI: "Doujinshi",
  ANIME: "Anime",
  WEB_NOVEL: "Web Novel",
  LIVE_ACTION: "Live Action",
  GAME: "Game",
  COMIC: "Comic",
  MULTIMEDIA_PROJECT: "Multimedia Project",
  PICTURE_BOOK: "Picture Book",
};

export function formatSourceLabel(source: string | null | undefined): string | null {
  if (!source) return null;
  return SOURCE_LABELS[source] ?? source;
}

export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

export function formatSeasonLabel(season: MediaSeason | null | undefined, year: number | null | undefined): string | null {
  if (!season || !year) return year ? String(year) : null;
  return `${capitalize(season)} ${year}`;
}

/** Strips AniList's occasional inline HTML from plain-text-rendered descriptions. */
export function stripHtml(html: string | null | undefined): string | null {
  if (!html) return null;
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?i>/gi, "")
    .replace(/<\/?b>/gi, "")
    .replace(/<[^>]+>/g, "")
    .trim();
}

export function formatCompactNumber(value: number | null | undefined): string | null {
  if (value === null || value === undefined) return null;
  return Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}
