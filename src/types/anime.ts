/**
 * Shared media types for TSUKI.
 *
 * These shapes intentionally mirror the fields AniList's GraphQL API exposes
 * so that `src/lib/anilist` mapping functions have a stable, app-level shape
 * to map into. Components never see raw AniList types directly.
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

export type MediaKind = "ANIME" | "MANGA";

export type MediaSeason = "WINTER" | "SPRING" | "SUMMER" | "FALL";

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
  /** Real cover URL when available; falls back to a generated placeholder when null/missing. */
  coverImage?: string | null;
  bannerImage?: string | null;
  posterGlyph: PosterGlyph;
  /** Community score, 0-100. */
  averageScore: number | null;
  popularity?: number | null;
  episodes: number | null;
  /** Average episode duration in minutes — used for watch-time math later. */
  duration?: number | null;
  format: AnimeFormat | null;
  status: MediaStatus | null;
  season?: MediaSeason | null;
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
  popularity?: number | null;
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

/* ------------------------------------------------------------------ */
/* Detail-page types (Milestone 2)                                    */
/* ------------------------------------------------------------------ */

export interface Studio {
  id: number;
  name: string;
  isMain: boolean;
}

export interface MediaTag {
  name: string;
  isSpoiler: boolean;
}

export interface VoiceActorSummary {
  id: number;
  name: string;
  image: string | null;
  language: string | null;
}

export interface CharacterSummary {
  id: number;
  name: string;
  role: "MAIN" | "SUPPORTING" | "BACKGROUND";
  image: string | null;
  voiceActor: VoiceActorSummary | null;
}

export interface StaffSummary {
  id: number;
  name: string;
  role: string | null;
  image: string | null;
}

export interface RelatedMedia {
  id: number;
  mediaType: MediaKind;
  relationType: string;
  title: MediaTitle;
  coverImage: string | null;
  posterGlyph: PosterGlyph;
  format: AnimeFormat | MangaFormat | null;
}

export interface ScoreDistributionEntry {
  score: number;
  amount: number;
}

export interface StatusDistributionEntry {
  status: string;
  amount: number;
}

export interface Trailer {
  id: string;
  site: string;
}

export interface AnimeDetail extends AnimeSummary {
  description: string | null;
  meanScore: number | null;
  favourites: number | null;
  source: string | null;
  studios: Studio[];
  tags: MediaTag[];
  characters: CharacterSummary[];
  staff: StaffSummary[];
  recommendations: AnimeSummary[];
  relations: RelatedMedia[];
  scoreDistribution: ScoreDistributionEntry[];
  statusDistribution: StatusDistributionEntry[];
  trailer: Trailer | null;
}

export interface MangaDetail extends MangaSummary {
  description: string | null;
  meanScore: number | null;
  favourites: number | null;
  source: string | null;
  studios: Studio[];
  tags: MediaTag[];
  characters: CharacterSummary[];
  staff: StaffSummary[];
  recommendations: MangaSummary[];
  relations: RelatedMedia[];
  scoreDistribution: ScoreDistributionEntry[];
  statusDistribution: StatusDistributionEntry[];
}

/** A single row in global/search results — anime and manga side by side. */
export interface MediaSearchResult {
  id: number;
  mediaType: MediaKind;
  title: MediaTitle;
  coverImage: string | null;
  posterGlyph: PosterGlyph;
  format: AnimeFormat | MangaFormat | null;
  year: number | null;
  averageScore: number | null;
}
