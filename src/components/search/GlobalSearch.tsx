"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ConstellationLoader } from "@/components/effects/ConstellationLoader";
import { PosterPlaceholder } from "@/components/anime/PosterPlaceholder";
import type { MediaSearchResult } from "@/types/anime";
import { displayTitle, formatFormatLabel } from "@/lib/format";

interface SearchContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SearchContext = createContext<SearchContextValue | null>(null);

/** Lets any component (Navbar's search pill, MobileNav, etc.) open the ⌘K overlay. */
export function useGlobalSearch(): SearchContextValue {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useGlobalSearch must be used within a SearchProvider");
  return ctx;
}

export function SearchProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const value = useMemo(() => ({ open, setOpen }), [open]);

  return (
    <SearchContext.Provider value={value}>
      {children}
      <SearchOverlay open={open} onOpenChange={setOpen} />
    </SearchContext.Provider>
  );
}

interface CombinedResults {
  anime: MediaSearchResult[];
  manga: MediaSearchResult[];
}

const EMPTY_RESULTS: CombinedResults = { anime: [], manga: [] };
const DEBOUNCE_MS = 300;

function SearchOverlay({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CombinedResults>(EMPTY_RESULTS);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next) {
        setQuery("");
        setResults(EMPTY_RESULTS);
        setLoading(false);
        abortRef.current?.abort();
      }
      onOpenChange(next);
    },
    [onOpenChange]
  );

  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);
    if (value.trim()) {
      setLoading(true);
    } else {
      setResults(EMPTY_RESULTS);
      setLoading(false);
      abortRef.current?.abort();
    }
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) return;

    const timeout = setTimeout(() => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, { signal: controller.signal })
        .then((res) => res.json())
        .then((data: Partial<CombinedResults>) => {
          setResults({ anime: data.anime ?? [], manga: data.manga ?? [] });
        })
        .catch((error: unknown) => {
          if (error instanceof DOMException && error.name === "AbortError") return;
          setResults(EMPTY_RESULTS);
        })
        .finally(() => setLoading(false));
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timeout);
    };
  }, [query]);

  const handleSelect = useCallback(
    (item: MediaSearchResult) => {
      handleOpenChange(false);
      router.push(item.mediaType === "ANIME" ? `/anime/${item.id}` : `/manga/${item.id}`);
    },
    [handleOpenChange, router]
  );

  const trimmedQuery = query.trim();
  const hasResults = results.anime.length > 0 || results.manga.length > 0;

  return (
    <CommandDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Search TSUKI"
      description="Search for anime and manga"
    >
      <Command shouldFilter={false}>
        <CommandInput
          value={query}
          onValueChange={handleQueryChange}
          placeholder="Search anime, manga…"
          onKeyDown={(event) => {
            if (event.key === "Enter" && trimmedQuery) {
              event.preventDefault();
              handleOpenChange(false);
              router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
            }
          }}
        />
        <CommandList>
          {loading && (
            <div className="py-4">
              <ConstellationLoader label="Searching…" className="py-0" />
            </div>
          )}

          {!loading && trimmedQuery && !hasResults && (
            <CommandEmpty>No results for &ldquo;{trimmedQuery}&rdquo;.</CommandEmpty>
          )}

          {!loading && !trimmedQuery && (
            <div className="px-3 py-8 text-center text-sm text-muted-foreground">
              Start typing to search anime &amp; manga.
            </div>
          )}

          {!loading && results.anime.length > 0 && (
            <CommandGroup heading="Anime">
              {results.anime.map((item) => (
                <SearchResultItem key={`anime-${item.id}`} item={item} onSelect={() => handleSelect(item)} />
              ))}
            </CommandGroup>
          )}

          {!loading && results.manga.length > 0 && (
            <CommandGroup heading="Manga">
              {results.manga.map((item) => (
                <SearchResultItem key={`manga-${item.id}`} item={item} onSelect={() => handleSelect(item)} />
              ))}
            </CommandGroup>
          )}

          {!loading && trimmedQuery && (
            <CommandGroup>
              <CommandItem
                value={`view-all-${trimmedQuery}`}
                onSelect={() => {
                  handleOpenChange(false);
                  router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
                }}
              >
                View all results for &ldquo;{trimmedQuery}&rdquo;
              </CommandItem>
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}

function SearchResultItem({ item, onSelect }: { item: MediaSearchResult; onSelect: () => void }) {
  const title = displayTitle(item.title);
  const formatLabel = formatFormatLabel(item.format);

  return (
    <CommandItem value={`${item.mediaType}-${item.id}-${title}`} onSelect={onSelect} className="gap-3">
      <div className="relative h-12 w-9 shrink-0 overflow-hidden rounded bg-surface-elevated">
        {item.coverImage ? (
          <Image src={item.coverImage} alt="" fill sizes="36px" className="object-cover" />
        ) : (
          <PosterPlaceholder glyph={item.posterGlyph} seed={item.id} className="h-full w-full" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-foreground">{title}</p>
        <p className="truncate text-xs text-muted-foreground">{[formatLabel, item.year].filter(Boolean).join(" • ")}</p>
      </div>
    </CommandItem>
  );
}
