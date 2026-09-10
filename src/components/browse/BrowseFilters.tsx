"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ANILIST_GENRES, ANIME_FORMATS, BROWSE_SORT_OPTIONS, MEDIA_STATUSES, MIN_SCORE_OPTIONS } from "@/lib/anilist/constants";
import { capitalize, formatFormatLabel, formatStatusLabel } from "@/lib/format";

const ALL = "ALL";
const SEASONS = ["WINTER", "SPRING", "SUMMER", "FALL"] as const;
const CURRENT_YEAR = new Date().getUTCFullYear();
const YEAR_OPTIONS = Array.from({ length: CURRENT_YEAR + 1 - 1970 + 1 }, (_, i) => CURRENT_YEAR + 1 - i);

interface Option {
  value: string;
  label: string;
}

/**
 * Client-side filter bar for `/browse`. Every control writes straight to
 * the URL's search params (debounced for free-text search) so filters stay
 * shareable/bookmarkable, per the milestone spec.
 */
export function BrowseFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchValue, setSearchValue] = useState(searchParams.get("search") ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === ALL || value === "") params.delete(key);
        else params.set(key, value);
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  // Debounce free-text search so we don't push a URL update (and re-fetch)
  // on every keystroke.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateParams({ search: searchValue || null });
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // Only re-run when the text itself changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  const genre = searchParams.get("genre") ?? ALL;
  const year = searchParams.get("year") ?? ALL;
  const season = searchParams.get("season") ?? ALL;
  const format = searchParams.get("format") ?? ALL;
  const status = searchParams.get("status") ?? ALL;
  const minScore = searchParams.get("minScore") ?? ALL;
  const sort = searchParams.get("sort") ?? "TRENDING_DESC";

  const genreOptions: Option[] = [{ value: ALL, label: "All Genres" }, ...ANILIST_GENRES.map((g) => ({ value: g, label: g }))];
  const yearOptions: Option[] = [
    { value: ALL, label: "All Years" },
    ...YEAR_OPTIONS.map((y) => ({ value: String(y), label: String(y) })),
  ];
  const seasonOptions: Option[] = [
    { value: ALL, label: "All Seasons" },
    ...SEASONS.map((s) => ({ value: s, label: capitalize(s) })),
  ];
  const formatOptions: Option[] = [
    { value: ALL, label: "All Formats" },
    ...ANIME_FORMATS.map((f) => ({ value: f, label: formatFormatLabel(f) ?? f })),
  ];
  const statusOptions: Option[] = [
    { value: ALL, label: "All Statuses" },
    ...MEDIA_STATUSES.map((s) => ({ value: s, label: formatStatusLabel(s) ?? s })),
  ];
  const minScoreOptions: Option[] = [
    { value: ALL, label: "Any Score" },
    ...MIN_SCORE_OPTIONS.map((s) => ({ value: String(s), label: `${s / 10}+` })),
  ];
  const sortOptions: Option[] = BROWSE_SORT_OPTIONS.map((s) => ({ value: s.value, label: s.label }));

  return (
    <div className="tsuki-card flex flex-col gap-3 p-4">
      <div className="tsuki-focus-ring flex items-center gap-2 rounded-lg border border-border bg-background/40 px-3 py-2 transition-colors focus-within:border-border-accent">
        <Search className="size-4 text-muted-foreground" aria-hidden="true" />
        <input
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          placeholder="Search anime…"
          className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          aria-label="Search anime"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterSelect label="Genre" value={genre} onChange={(v) => updateParams({ genre: v })} options={genreOptions} />
        <FilterSelect label="Year" value={year} onChange={(v) => updateParams({ year: v })} options={yearOptions} />
        <FilterSelect label="Season" value={season} onChange={(v) => updateParams({ season: v })} options={seasonOptions} />
        <FilterSelect label="Format" value={format} onChange={(v) => updateParams({ format: v })} options={formatOptions} />
        <FilterSelect label="Status" value={status} onChange={(v) => updateParams({ status: v })} options={statusOptions} />
        <FilterSelect
          label="Min Score"
          value={minScore}
          onChange={(v) => updateParams({ minScore: v })}
          options={minScoreOptions}
        />
        <div className="ml-auto">
          <FilterSelect label="Sort" value={sort} onChange={(v) => updateParams({ sort: v })} options={sortOptions} />
        </div>
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger size="sm" aria-label={label} className="min-w-[7.5rem]">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
