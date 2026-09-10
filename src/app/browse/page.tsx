import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { AnimeCard } from "@/components/anime/AnimeCard";
import { BrowseFilters } from "@/components/browse/BrowseFilters";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { getBrowseAnime, type PagedResult } from "@/lib/anilist/anime";
import { toFriendlyError } from "@/lib/anilist/client";
import type { AniListMediaSort } from "@/lib/anilist/types";
import type { AnimeFormat, AnimeSummary, MediaSeason, MediaStatus } from "@/types/anime";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Browse Anime — TSUKI" };

interface BrowsePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function buildPageHref(sp: Record<string, string | string[] | undefined>, page: number): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(sp)) {
    if (key === "page") continue;
    const v = first(value);
    if (v) params.set(key, v);
  }
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/browse?${query}` : "/browse";
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const sp = await searchParams;
  const mediaType = first(sp.type);

  // Manga browsing is intentionally out of scope for this milestone — the
  // API layer already supports it (`src/lib/anilist/manga.ts`), but the
  // Browse UI only renders anime results for now.
  if (mediaType === "manga") {
    return (
      <div className="tsuki-container py-8 md:py-10">
        <h1 className="mb-6 font-display text-2xl text-foreground md:text-3xl">Discover</h1>
        <EmptyState
          title="Manga browsing is coming soon"
          message="TSUKI's manga catalog and tracking arrive in a later milestone. In the meantime, try searching — manga shows up in global search results."
        />
      </div>
    );
  }

  const page = Number(first(sp.page)) || 1;
  const minScore = first(sp.minScore) ? Number(first(sp.minScore)) : undefined;

  let result: PagedResult<AnimeSummary> | null = null;
  let loadError: { title: string; message: string } | null = null;

  try {
    result = await getBrowseAnime({
      search: first(sp.search),
      genres: first(sp.genre) ? [first(sp.genre) as string] : undefined,
      seasonYear: first(sp.year) ? Number(first(sp.year)) : undefined,
      season: first(sp.season) as MediaSeason | undefined,
      formats: first(sp.format) ? [first(sp.format) as AnimeFormat] : undefined,
      status: first(sp.status) as MediaStatus | undefined,
      minScore,
      sort: (first(sp.sort) as AniListMediaSort) ?? "TRENDING_DESC",
      page,
      perPage: 24,
    });
  } catch (error) {
    loadError = toFriendlyError(error);
  }

  const pageInfo = result?.pageInfo ?? null;

  return (
    <div className="tsuki-container py-8 md:py-10">
      <h1 className="mb-6 font-display text-2xl text-foreground md:text-3xl">Discover</h1>

      <div className="mb-6">
        <Suspense fallback={<Skeleton className="h-32 w-full bg-surface-elevated" />}>
          <BrowseFilters />
        </Suspense>
      </div>

      {loadError ? (
        <ErrorState title={loadError.title} message={loadError.message} />
      ) : result && result.items.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {result.items.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} showGenres />
          ))}
        </div>
      ) : (
        <EmptyState title="No anime found" message="Try adjusting your search or filters." />
      )}

      {pageInfo && (page > 1 || pageInfo.hasNextPage) && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href={buildPageHref(sp, Math.max(1, page - 1))}
            aria-disabled={page <= 1}
            className={cn(
              "flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-foreground-secondary transition-colors hover:bg-surface-elevated",
              page <= 1 && "pointer-events-none opacity-40"
            )}
          >
            <ChevronLeft className="size-4" aria-hidden="true" /> Prev
          </Link>
          <span className="text-sm text-muted-foreground">Page {page}</span>
          <Link
            href={buildPageHref(sp, page + 1)}
            aria-disabled={!pageInfo.hasNextPage}
            className={cn(
              "flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-foreground-secondary transition-colors hover:bg-surface-elevated",
              !pageInfo.hasNextPage && "pointer-events-none opacity-40"
            )}
          >
            Next <ChevronRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      )}
    </div>
  );
}
