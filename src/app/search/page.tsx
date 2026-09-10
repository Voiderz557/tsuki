import type { Metadata } from "next";

import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { MediaResultCard } from "@/components/search/MediaResultCard";
import { SearchForm } from "@/components/search/SearchForm";
import { searchAnimeAndManga, type CombinedSearchResults } from "@/lib/anilist/search";
import { toFriendlyError } from "@/lib/anilist/client";

export const metadata: Metadata = { title: "Search — TSUKI" };

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  let results: CombinedSearchResults | null = null;
  let loadError: { title: string; message: string } | null = null;

  if (query) {
    try {
      results = await searchAnimeAndManga(query, 24);
    } catch (error) {
      loadError = toFriendlyError(error);
    }
  }

  const hasResults = Boolean(results && (results.anime.length > 0 || results.manga.length > 0));

  return (
    <div className="tsuki-container py-8 md:py-10">
      <h1 className="mb-6 font-display text-2xl text-foreground md:text-3xl">
        {query ? (
          <>
            Results for <span className="text-primary">&ldquo;{query}&rdquo;</span>
          </>
        ) : (
          "Search"
        )}
      </h1>
      <SearchForm defaultValue={query} />

      {!query && (
        <EmptyState title="Search TSUKI" message="Type a title, or press ⌘K anywhere to search anime and manga." />
      )}

      {query && loadError && <ErrorState title={loadError.title} message={loadError.message} />}

      {query && !loadError && !hasResults && (
        <EmptyState title="No titles found" message={`No results for "${query}". Try a different title.`} />
      )}

      {results && hasResults && (
        <div className="space-y-10">
          {results.anime.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-semibold text-foreground">Anime</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {results.anime.map((item) => (
                  <MediaResultCard key={`anime-${item.id}`} item={item} />
                ))}
              </div>
            </section>
          )}
          {results.manga.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-semibold text-foreground">Manga</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {results.manga.map((item) => (
                  <MediaResultCard key={`manga-${item.id}`} item={item} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
