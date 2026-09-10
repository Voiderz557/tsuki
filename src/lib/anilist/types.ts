/**
 * Raw AniList GraphQL API shapes.
 *
 * These intentionally mirror AniList's schema field-for-field (see
 * https://docs.anilist.co) and stay separate from our app-level domain
 * types in `src/types/anime.ts`. `src/lib/anilist/anime.ts` and
 * `manga.ts` map between the two.
 */

export interface AniListGraphQLError {
  message: string;
  status?: number;
  locations?: { line: number; column: number }[];
}

export interface AniListGraphQLResponse<TData> {
  data: TData | null;
  errors?: AniListGraphQLError[];
}

export type AniListMediaType = "ANIME" | "MANGA";

export type AniListMediaFormat =
  | "TV"
  | "TV_SHORT"
  | "MOVIE"
  | "SPECIAL"
  | "OVA"
  | "ONA"
  | "MUSIC"
  | "MANGA"
  | "NOVEL"
  | "ONE_SHOT";

export type AniListMediaStatus =
  | "FINISHED"
  | "RELEASING"
  | "NOT_YET_RELEASED"
  | "CANCELLED"
  | "HIATUS";

export type AniListMediaSeason = "WINTER" | "SPRING" | "SUMMER" | "FALL";

export type AniListMediaSource =
  | "ORIGINAL"
  | "MANGA"
  | "LIGHT_NOVEL"
  | "VISUAL_NOVEL"
  | "VIDEO_GAME"
  | "OTHER"
  | "NOVEL"
  | "DOUJINSHI"
  | "ANIME"
  | "WEB_NOVEL"
  | "LIVE_ACTION"
  | "GAME"
  | "COMIC"
  | "MULTIMEDIA_PROJECT"
  | "PICTURE_BOOK";

export type AniListMediaSort =
  | "TRENDING_DESC"
  | "POPULARITY_DESC"
  | "SCORE_DESC"
  | "START_DATE_DESC"
  | "START_DATE"
  | "TITLE_ROMAJI"
  | "FAVOURITES_DESC";

export type AniListCharacterRole = "MAIN" | "SUPPORTING" | "BACKGROUND";

export interface AniListPageInfo {
  total: number;
  currentPage: number;
  lastPage: number;
  hasNextPage: boolean;
  perPage: number;
}

export interface AniListMediaTitle {
  english: string | null;
  romaji: string | null;
  native: string | null;
}

export interface AniListCoverImage {
  extraLarge: string | null;
  large: string | null;
  medium: string | null;
  color: string | null;
}

export interface AniListFuzzyDate {
  year: number | null;
  month: number | null;
  day: number | null;
}

export interface AniListMediaTag {
  name: string;
  isMediaSpoiler: boolean | null;
}

export interface AniListStudioNode {
  id: number;
  name: string;
}

export interface AniListStudioEdge {
  isMain: boolean;
  node: AniListStudioNode;
}

export interface AniListStudioConnection {
  edges: AniListStudioEdge[];
}

export interface AniListVoiceActor {
  id: number;
  name: { full: string | null };
  image: { medium: string | null } | null;
  languageV2: string | null;
}

export interface AniListCharacterNode {
  id: number;
  name: { full: string | null };
  image: { large: string | null; medium: string | null } | null;
}

export interface AniListCharacterEdge {
  role: AniListCharacterRole;
  node: AniListCharacterNode;
  voiceActors: AniListVoiceActor[];
}

export interface AniListCharacterConnection {
  edges: AniListCharacterEdge[];
}

export interface AniListStaffNode {
  id: number;
  name: { full: string | null };
  image: { large: string | null; medium: string | null } | null;
}

export interface AniListStaffEdge {
  role: string | null;
  node: AniListStaffNode;
}

export interface AniListStaffConnection {
  edges: AniListStaffEdge[];
}

export interface AniListScoreDistribution {
  score: number;
  amount: number;
}

export interface AniListStatusDistribution {
  status: string;
  amount: number;
}

export interface AniListMediaStats {
  scoreDistribution: AniListScoreDistribution[] | null;
  statusDistribution: AniListStatusDistribution[] | null;
}

export interface AniListMediaTrailer {
  id: string | null;
  site: string | null;
}

export interface AniListRecommendationNode {
  mediaRecommendation: AniListMedia | null;
}

export interface AniListRecommendationEdge {
  node: AniListRecommendationNode;
}

export interface AniListRecommendationConnection {
  edges: AniListRecommendationEdge[];
}

export interface AniListRelationEdge {
  relationType: string;
  node: AniListMedia;
}

export interface AniListRelationConnection {
  edges: AniListRelationEdge[];
}

/**
 * The core `Media` object. Detail-only fields are optional because list
 * queries (trending/seasonal/browse/search) intentionally omit them to
 * keep payloads small.
 */
export interface AniListMedia {
  id: number;
  type: AniListMediaType;
  title: AniListMediaTitle;
  coverImage: AniListCoverImage | null;
  bannerImage: string | null;
  description?: string | null;
  averageScore: number | null;
  meanScore?: number | null;
  popularity?: number | null;
  favourites?: number | null;
  episodes: number | null;
  duration?: number | null;
  chapters?: number | null;
  volumes?: number | null;
  format: AniListMediaFormat | null;
  status: AniListMediaStatus | null;
  season: AniListMediaSeason | null;
  seasonYear: number | null;
  startDate?: AniListFuzzyDate | null;
  endDate?: AniListFuzzyDate | null;
  genres: string[];
  tags?: AniListMediaTag[];
  source?: AniListMediaSource | null;
  studios?: AniListStudioConnection | null;
  characters?: AniListCharacterConnection | null;
  staff?: AniListStaffConnection | null;
  recommendations?: AniListRecommendationConnection | null;
  relations?: AniListRelationConnection | null;
  stats?: AniListMediaStats | null;
  trailer?: AniListMediaTrailer | null;
}

export interface AniListPage<TNode> {
  pageInfo: AniListPageInfo;
  media: TNode[];
}

export interface PageMediaQueryResult {
  Page: AniListPage<AniListMedia>;
}

export interface MediaByIdQueryResult {
  Media: AniListMedia | null;
}
