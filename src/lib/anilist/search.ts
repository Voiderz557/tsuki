import type { MediaKind, MediaSearchResult } from "@/types/anime";
import { posterGlyphForId } from "@/lib/poster-glyph";
import { anilistRequest } from "./client";
import { SEARCH_MEDIA_QUERY } from "./queries";
import type { AniListMedia, AniListMediaType, PageMediaQueryResult } from "./types";

function bestCover(media: AniListMedia): string | null {
  return media.coverImage?.extraLarge ?? media.coverImage?.large ?? media.coverImage?.medium ?? null;
}

function mapMediaToSearchResult(media: AniListMedia): MediaSearchResult {
  return {
    id: media.id,
    mediaType: media.type as MediaKind,
    title: {
      english: media.title.english ?? null,
      romaji: media.title.romaji ?? media.title.english ?? "Untitled",
      native: media.title.native ?? null,
    },
    coverImage: bestCover(media),
    posterGlyph: posterGlyphForId(media.id),
    format: media.format ?? null,
    year: media.seasonYear ?? media.startDate?.year ?? null,
    averageScore: media.averageScore ?? null,
  };
}

export interface SearchMediaParams {
  query: string;
  /** Omit to search both anime and manga in a single query. */
  type?: MediaKind;
  perPage?: number;
  signal?: AbortSignal;
}

/**
 * Search architecture is media-type friendly by design — callers choose
 * `type: "ANIME"`, `type: "MANGA"`, or omit it entirely to search both, so
 * manga search (Milestone 5+) never requires touching this function.
 */
export async function searchMedia({ query, type, perPage = 10, signal }: SearchMediaParams): Promise<MediaSearchResult[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const data = await anilistRequest<PageMediaQueryResult>(
    SEARCH_MEDIA_QUERY,
    { search: trimmed, type: type as AniListMediaType | undefined, perPage },
    { revalidate: false, signal }
  );
  return data.Page.media.map(mapMediaToSearchResult);
}

export interface CombinedSearchResults {
  anime: MediaSearchResult[];
  manga: MediaSearchResult[];
}

/** Used by the `⌘K` quick-search overlay: a few of each type, grouped. */
export async function searchAnimeAndManga(
  query: string,
  perPagePerType = 5,
  signal?: AbortSignal
): Promise<CombinedSearchResults> {
  const trimmed = query.trim();
  if (!trimmed) return { anime: [], manga: [] };

  const [anime, manga] = await Promise.all([
    searchMedia({ query: trimmed, type: "ANIME", perPage: perPagePerType, signal }),
    searchMedia({ query: trimmed, type: "MANGA", perPage: perPagePerType, signal }),
  ]);
  return { anime, manga };
}
