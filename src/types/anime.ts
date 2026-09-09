/**
 * Shared media types for TSUKI.
 *
 * These shapes intentionally mirror the fields AniList's GraphQL API exposes
 * so that swapping placeholder data for real `src/lib/anilist` queries later
 * (Milestone 2) requires no changes to components that consume them.
 */

export type AnimeFormat =
  | "TV"
  | "TV_SHORT"
  | "MOVIE"
  | "OVA"
  | "ONA"
  | "SPECIAL"
  | "MUSIC";

export type MediaStatus =
  | "FINISHED"
  | "RELEASING"
  | "NOT_YET_RELEASED"
  | "CANCELLED"
  | "HIATUS";

export type UserListStatus =
  | "WATCHING"
  | "COMPLETED"
  | "PLANNING"
  | "PAUSED"
  | "DROPPED"
  | "REPEATING";

export type MangaFormat = "MANGA" | "NOVEL" | "ONE_SHOT";

export type UserMangaListStatus =
  | "READING"
  | "COMPLETED"
  | "PLANNING"
  | "PAUSED"
  | "DROPPED"
  | "REREADING";

export interface MediaTitle {
  english: string | null;
  romaji: string;
  native: string | null;
}

/** A symbolic, meaningful Japanese word used for generated poster placeholders. */
export type PosterGlyph = "月" | "星" | "夜" | "空" | "光" | "夢" | "花" | "雪";

export interface AnimeSummary {
  id: number;
  title: MediaTitle;
  /** Real cover URL when available; omitted while using generated placeholders. */
  coverImage?: string | null;
  bannerImage?: string | null;
  posterGlyph: PosterGlyph;
  /** Community score, 0-100. */
  averageScore: number | null;
  episodes: number | null;
  /** Average episode duration in minutes — used for watch-time math later. */
  duration?: number | null;
  format: AnimeFormat | null;
  status: MediaStatus | null;
  season?: string | null;
  seasonYear?: number | null;
  genres: string[];
  /** Present only for the signed-in user's list entries. */
  userProgress?: number | null;
  userScore?: number | null;
  userStatus?: UserListStatus | null;
}

export interface MangaSummary {
  id: number;
  title: MediaTitle;
  coverImage?: string | null;
  posterGlyph: PosterGlyph;
  averageScore: number | null;
  chapters: number | null;
  volumes: number | null;
  format: MangaFormat | null;
  status: MediaStatus | null;
  genres: string[];
  userProgressChapters?: number | null;
  userProgressVolumes?: number | null;
  userScore?: number | null;
  userStatus?: UserMangaListStatus | null;
}

export interface ContinueWatchingEntry {
  anime: AnimeSummary;
  episodeProgress: number;
  totalEpisodes: number;
}
