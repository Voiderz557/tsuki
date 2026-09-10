import type { AniListMediaSort } from "./types";

/**
 * AniList's genre list is a small, stable, well-documented set
 * (https://docs.anilist.co) — hardcoding it avoids an extra `GenreCollection`
 * round-trip just to populate a filter dropdown.
 */
export const ANILIST_GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Ecchi",
  "Fantasy",
  "Horror",
  "Mahou Shoujo",
  "Mecha",
  "Music",
  "Mystery",
  "Psychological",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Supernatural",
  "Thriller",
] as const;

export const ANIME_FORMATS = ["TV", "TV_SHORT", "MOVIE", "OVA", "ONA", "SPECIAL", "MUSIC"] as const;

export const MEDIA_STATUSES = ["FINISHED", "RELEASING", "NOT_YET_RELEASED", "CANCELLED", "HIATUS"] as const;

export const BROWSE_SORT_OPTIONS: { value: AniListMediaSort; label: string }[] = [
  { value: "TRENDING_DESC", label: "Trending" },
  { value: "POPULARITY_DESC", label: "Popularity" },
  { value: "SCORE_DESC", label: "Highest Rated" },
  { value: "START_DATE_DESC", label: "Newest" },
  { value: "START_DATE", label: "Oldest" },
  { value: "TITLE_ROMAJI", label: "Title" },
];

export const SEASONAL_SORT_OPTIONS: { value: AniListMediaSort; label: string }[] = [
  { value: "TRENDING_DESC", label: "Trending" },
  { value: "POPULARITY_DESC", label: "Popularity" },
  { value: "SCORE_DESC", label: "Score" },
];

export const MIN_SCORE_OPTIONS = [50, 60, 70, 80, 90] as const;
