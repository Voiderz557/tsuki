import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { AnimeCard } from "@/components/anime/AnimeCard";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { getSeasonalAnime } from "@/lib/anilist/anime";
import { toFriendlyError } from "@/lib/anilist/client";
import { SEASONAL_SORT_OPTIONS } from "@/lib/anilist/constants";
import {
  getCurrentSeason,
  isValidSeason,
  nextSeason,
  previousSeason,
  seasonLabel,
  type SeasonPointer,
} from "@/lib/anilist/season";
import type { AniListMediaSort } from "@/lib/anilist/types";
import { cn } from "@/lib/utils";
import type { AnimeFormat } from "@/types/anime";

export const metadata: Metadata = { title: "Seasonal Anime — TSUKI" };

const FORMAT_TABS: { value: AnimeFormat | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "TV", label: "TV" },
  { value: "MOVIE", label: "Movies" },
  { value: "OVA", label: "OVA" },
  { value: "ONA", label: "ONA" },
  { value: "SPECIAL", label: "Specials" },
];

interface SeasonalPageProps {
  searchParams: Promise<{ season?: string; year?: string; format?: string; sort?: string }>;
}

function buildHref(pointer: SeasonPointer, format: string, sort: string): string {
  const params = new URLSearchParams({ season: pointer.season, year: String(pointer.year) });
  if (format !== "ALL") params.set("format", format);
  if (sort !== "TRENDING_DESC") params.set("sort", sort);
  return `/seasonal?${params.toString()}`;
}

export default async function SeasonalPage({ searchParams }: SeasonalPageProps) {
  const sp = await searchParams;
  const current = getCurrentSeason();
  const season = isValidSeason(sp.season) ? sp.season : current.season;
  const parsedYear = sp.year ? Number(sp.year) : current.year;
  const pointer: SeasonPointer = { season, year: Number.isFinite(parsedYear) ? parsedYear : current.year };
  const format = sp.format ?? "ALL";
  const sort: AniListMediaSort = (sp.sort as AniListMediaSort) ?? "TRENDING_DESC";

  const prev = previousSeason(pointer);
  const next = nextSeason(pointer);

  let items: Awaited<ReturnType<typeof getSeasonalAnime>>["items"] | null = null;
  let loadError: { title: string; message: string } | null = null;

  try {
    const result = await getSeasonalAnime({
      season: pointer.season,
      seasonYear: pointer.year,
      formats: format === "ALL" ? undefined : [format as AnimeFormat],
      sort,
      perPage: 24,
    });
    items = result.items;
  } catch (error) {
    loadError = toFriendlyError(error);
  }

  return (
    <div className="tsuki-container py-8 md:py-10">
      <div className="mb-6 flex items-center justify-between gap-3">
        <Link
          href={buildHref(prev, format, sort)}
          className="flex items-center gap-1 text-sm text-foreground-secondary transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">{seasonLabel(prev)}</span>
        </Link>

        <h1 className="font-display text-2xl text-foreground md:text-3xl">{seasonLabel(pointer)}</h1>

        <Link
          href={buildHref(next, format, sort)}
          className="flex items-center gap-1 text-sm text-foreground-secondary transition-colors hover:text-foreground"
        >
          <span className="hidden sm:inline">{seasonLabel(next)}</span>
          <ChevronRight className="size-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <nav aria-label="Filter by format" className="flex gap-1 overflow-x-auto">
          {FORMAT_TABS.map((tab) => (
            <Link
              key={tab.value}
              href={buildHref(pointer, tab.value, sort)}
              aria-current={format === tab.value ? "true" : undefined}
              className={cn(
                "shrink-0 rounded-lg px-3 py-1.5 text-sm transition-colors",
                format === tab.value
                  ? "bg-surface-elevated text-foreground"
                  : "text-muted-foreground hover:bg-surface hover:text-foreground-secondary"
              )}
            >
              {tab.label}
            </Link>
          ))}
        </nav>

        <nav aria-label="Sort" className="flex gap-1 overflow-x-auto">
          {SEASONAL_SORT_OPTIONS.map((opt) => (
            <Link
              key={opt.value}
              href={buildHref(pointer, format, opt.value)}
              aria-current={sort === opt.value ? "true" : undefined}
              className={cn(
                "shrink-0 rounded-lg px-3 py-1.5 text-sm transition-colors",
                sort === opt.value
                  ? "bg-surface-elevated text-foreground"
                  : "text-muted-foreground hover:bg-surface hover:text-foreground-secondary"
              )}
            >
              {opt.label}
            </Link>
          ))}
        </nav>
      </div>

      {loadError ? (
        <ErrorState title={loadError.title} message={loadError.message} />
      ) : items && items.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {items.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} showGenres />
          ))}
        </div>
      ) : (
        <EmptyState title="No anime found" message="Try a different season or format." />
      )}
    </div>
  );
}
