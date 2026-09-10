import type { MangaDetail, MangaFormat, MangaSummary, MediaStatus } from "@/types/anime";
import { posterGlyphForId } from "@/lib/poster-glyph";
import { anilistRequest, AniListError } from "./client";
import { MEDIA_BY_ID_QUERY } from "./queries";
import type { AniListMedia, MediaByIdQueryResult } from "./types";

function bestCover(media: AniListMedia): string | null {
  return media.coverImage?.extraLarge ?? media.coverImage?.large ?? media.coverImage?.medium ?? null;
}

function safeTitle(media: AniListMedia) {
  return {
    english: media.title.english ?? null,
    romaji: media.title.romaji ?? media.title.english ?? "Untitled",
    native: media.title.native ?? null,
  };
}

export function mapMediaToMangaSummary(media: AniListMedia): MangaSummary {
  return {
    id: media.id,
    title: safeTitle(media),
    coverImage: bestCover(media),
    posterGlyph: posterGlyphForId(media.id),
    averageScore: media.averageScore ?? null,
    popularity: media.popularity ?? null,
    chapters: media.chapters ?? null,
    volumes: media.volumes ?? null,
    format: (media.format as MangaFormat) ?? null,
    status: (media.status as MediaStatus) ?? null,
    genres: media.genres ?? [],
  };
}

export function mapMediaToMangaDetail(media: AniListMedia): MangaDetail {
  return {
    ...mapMediaToMangaSummary(media),
    description: media.description ?? null,
    meanScore: media.meanScore ?? null,
    favourites: media.favourites ?? null,
    source: media.source ?? null,
    studios:
      media.studios?.edges.map((edge) => ({ id: edge.node.id, name: edge.node.name, isMain: edge.isMain })) ?? [],
    tags: (media.tags ?? []).map((tag) => ({ name: tag.name, isSpoiler: Boolean(tag.isMediaSpoiler) })),
    characters: [],
    staff: [],
    recommendations:
      media.recommendations?.edges
        .map((edge) => edge.node.mediaRecommendation)
        .filter((node): node is AniListMedia => node !== null)
        .map(mapMediaToMangaSummary) ?? [],
    relations: [],
    scoreDistribution: (media.stats?.scoreDistribution ?? []).map((entry) => ({
      score: entry.score,
      amount: entry.amount,
    })),
    statusDistribution: (media.stats?.statusDistribution ?? []).map((entry) => ({
      status: entry.status,
      amount: entry.amount,
    })),
  };
}

/**
 * Minimal manga read — the API architecture is media-type friendly (see
 * `search.ts`), but full manga pages/tracking are out of scope until a
 * later milestone.
 */
export async function getMangaById(id: number): Promise<MangaDetail | null> {
  try {
    const data = await anilistRequest<MediaByIdQueryResult>(
      MEDIA_BY_ID_QUERY,
      { id, type: "MANGA" },
      { revalidate: 3600, tags: ["anilist", `manga-${id}`] }
    );
    if (!data.Media) return null;
    return mapMediaToMangaDetail(data.Media);
  } catch (error) {
    if (error instanceof AniListError && error.kind === "not_found") return null;
    throw error;
  }
}
