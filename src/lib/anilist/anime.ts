import type {
  AnimeDetail,
  AnimeFormat,
  AnimeSummary,
  CharacterSummary,
  MediaKind,
  MediaSeason,
  MediaStatus,
  MediaTag,
  RelatedMedia,
  ScoreDistributionEntry,
  StaffSummary,
  Studio,
  StatusDistributionEntry,
  Trailer,
} from "@/types/anime";
import { posterGlyphForId } from "@/lib/poster-glyph";
import { anilistRequest, AniListError } from "./client";
import { BROWSE_MEDIA_QUERY, MEDIA_BY_ID_QUERY, SEASONAL_ANIME_QUERY, TRENDING_ANIME_QUERY } from "./queries";
import type {
  AniListCharacterEdge,
  AniListMedia,
  AniListMediaSort,
  AniListPageInfo,
  AniListStaffEdge,
  MediaByIdQueryResult,
  PageMediaQueryResult,
} from "./types";

/* ------------------------------------------------------------------ */
/* Mapping: raw AniList `Media` -> app-level domain types             */
/* ------------------------------------------------------------------ */

function bestCover(media: AniListMedia): string | null {
  return media.coverImage?.extraLarge ?? media.coverImage?.large ?? media.coverImage?.medium ?? null;
}

/** Missing/empty titles fall back gracefully instead of rendering blank. */
function safeTitle(media: AniListMedia) {
  return {
    english: media.title.english ?? null,
    romaji: media.title.romaji ?? media.title.english ?? "Untitled",
    native: media.title.native ?? null,
  };
}

export function mapMediaToAnimeSummary(media: AniListMedia): AnimeSummary {
  return {
    id: media.id,
    title: safeTitle(media),
    coverImage: bestCover(media),
    bannerImage: media.bannerImage ?? null,
    posterGlyph: posterGlyphForId(media.id),
    averageScore: media.averageScore ?? null,
    popularity: media.popularity ?? null,
    episodes: media.episodes ?? null,
    duration: media.duration ?? null,
    format: (media.format as AnimeFormat) ?? null,
    status: (media.status as MediaStatus) ?? null,
    season: (media.season as MediaSeason) ?? null,
    seasonYear: media.seasonYear ?? null,
    genres: media.genres ?? [],
  };
}

function mapStudios(media: AniListMedia): Studio[] {
  return (
    media.studios?.edges.map((edge) => ({
      id: edge.node.id,
      name: edge.node.name,
      isMain: edge.isMain,
    })) ?? []
  );
}

function mapTags(media: AniListMedia): MediaTag[] {
  return (media.tags ?? []).map((tag) => ({ name: tag.name, isSpoiler: Boolean(tag.isMediaSpoiler) }));
}

function mapCharacterEdge(edge: AniListCharacterEdge): CharacterSummary {
  const voiceActor = edge.voiceActors[0] ?? null;
  return {
    id: edge.node.id,
    name: edge.node.name.full ?? "Unknown",
    role: edge.role,
    image: edge.node.image?.large ?? edge.node.image?.medium ?? null,
    voiceActor: voiceActor
      ? {
          id: voiceActor.id,
          name: voiceActor.name.full ?? "Unknown",
          image: voiceActor.image?.medium ?? null,
          language: voiceActor.languageV2 ?? null,
        }
      : null,
  };
}

function mapStaffEdge(edge: AniListStaffEdge): StaffSummary {
  return {
    id: edge.node.id,
    name: edge.node.name.full ?? "Unknown",
    role: edge.role ?? null,
    image: edge.node.image?.large ?? edge.node.image?.medium ?? null,
  };
}

function mapRelatedMedia(node: AniListMedia, relationType: string): RelatedMedia {
  return {
    id: node.id,
    mediaType: node.type as MediaKind,
    relationType,
    title: safeTitle(node),
    coverImage: bestCover(node),
    posterGlyph: posterGlyphForId(node.id),
    format: (node.format as AnimeFormat) ?? null,
  };
}

function mapScoreDistribution(media: AniListMedia): ScoreDistributionEntry[] {
  return (media.stats?.scoreDistribution ?? []).map((entry) => ({ score: entry.score, amount: entry.amount }));
}

function mapStatusDistribution(media: AniListMedia): StatusDistributionEntry[] {
  return (media.stats?.statusDistribution ?? []).map((entry) => ({ status: entry.status, amount: entry.amount }));
}

function mapTrailer(media: AniListMedia): Trailer | null {
  if (!media.trailer?.id || !media.trailer.site) return null;
  return { id: media.trailer.id, site: media.trailer.site };
}

export function mapMediaToAnimeDetail(media: AniListMedia): AnimeDetail {
  return {
    ...mapMediaToAnimeSummary(media),
    description: media.description ?? null,
    meanScore: media.meanScore ?? null,
    favourites: media.favourites ?? null,
    source: media.source ?? null,
    studios: mapStudios(media),
    tags: mapTags(media),
    characters: media.characters?.edges.map(mapCharacterEdge) ?? [],
    staff: media.staff?.edges.map(mapStaffEdge) ?? [],
    recommendations:
      media.recommendations?.edges
        .map((edge) => edge.node.mediaRecommendation)
        .filter((node): node is AniListMedia => node !== null)
        .map(mapMediaToAnimeSummary) ?? [],
    relations: media.relations?.edges.map((edge) => mapRelatedMedia(edge.node, edge.relationType)) ?? [],
    scoreDistribution: mapScoreDistribution(media),
    statusDistribution: mapStatusDistribution(media),
    trailer: mapTrailer(media),
  };
}

/* ------------------------------------------------------------------ */
/* Fetchers                                                          */
/* ------------------------------------------------------------------ */

export interface PagedResult<T> {
  items: T[];
  pageInfo: AniListPageInfo;
}

/** Homepage "Trending Now" — ~18 entries, revalidated hourly. */
export async function getTrendingAnime(perPage = 18): Promise<AnimeSummary[]> {
  const data = await anilistRequest<PageMediaQueryResult>(
    TRENDING_ANIME_QUERY,
    { perPage, page: 1 },
    { revalidate: 3600, tags: ["anilist", "trending"] }
  );
  return data.Page.media.map(mapMediaToAnimeSummary);
}

export interface SeasonalAnimeParams {
  season: MediaSeason;
  seasonYear: number;
  formats?: AnimeFormat[];
  sort?: AniListMediaSort;
  page?: number;
  perPage?: number;
}

/** Seasonal browse — homepage preview and the full `/seasonal` page both use this. */
export async function getSeasonalAnime(params: SeasonalAnimeParams): Promise<PagedResult<AnimeSummary>> {
  const { season, seasonYear, formats, sort = "POPULARITY_DESC", page = 1, perPage = 18 } = params;
  const data = await anilistRequest<PageMediaQueryResult>(
    SEASONAL_ANIME_QUERY,
    {
      season,
      seasonYear,
      sort: [sort],
      format: formats && formats.length > 0 ? formats : undefined,
      page,
      perPage,
    },
    { revalidate: 3600, tags: ["anilist", "seasonal"] }
  );
  return {
    items: data.Page.media.map(mapMediaToAnimeSummary),
    pageInfo: data.Page.pageInfo,
  };
}

export interface BrowseAnimeParams {
  search?: string;
  genres?: string[];
  seasonYear?: number;
  season?: MediaSeason;
  formats?: AnimeFormat[];
  status?: MediaStatus;
  minScore?: number;
  sort?: AniListMediaSort;
  page?: number;
  perPage?: number;
}

/** `/browse` — anime discovery with search + filters, all mapped to AniList args. */
export async function getBrowseAnime(params: BrowseAnimeParams): Promise<PagedResult<AnimeSummary>> {
  const {
    search,
    genres,
    seasonYear,
    season,
    formats,
    status,
    minScore,
    sort = "TRENDING_DESC",
    page = 1,
    perPage = 24,
  } = params;

  const data = await anilistRequest<PageMediaQueryResult>(
    BROWSE_MEDIA_QUERY,
    {
      type: "ANIME",
      search: search || undefined,
      genre_in: genres && genres.length > 0 ? genres : undefined,
      seasonYear,
      season,
      format_in: formats && formats.length > 0 ? formats : undefined,
      status,
      averageScore_greater: minScore ? minScore - 1 : undefined,
      sort: [sort],
      page,
      perPage,
    },
    // Browse results change less often than search, but filters vary a lot —
    // a short cache keeps repeat pagination cheap without serving stale data.
    { revalidate: 600, tags: ["anilist", "browse"] }
  );
  return {
    items: data.Page.media.map(mapMediaToAnimeSummary),
    pageInfo: data.Page.pageInfo,
  };
}

/** `/anime/[id]` — full detail payload (characters, staff, recommendations, stats). */
export async function getAnimeById(id: number): Promise<AnimeDetail | null> {
  try {
    const data = await anilistRequest<MediaByIdQueryResult>(
      MEDIA_BY_ID_QUERY,
      { id, type: "ANIME" },
      { revalidate: 3600, tags: ["anilist", `anime-${id}`] }
    );
    if (!data.Media) return null;
    return mapMediaToAnimeDetail(data.Media);
  } catch (error) {
    if (error instanceof AniListError && error.kind === "not_found") return null;
    throw error;
  }
}
