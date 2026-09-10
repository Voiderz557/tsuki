"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function SearchForm({ defaultValue = "" }: { defaultValue?: string }) {
  const router = useRouter();

  return (
    <form
      className="tsuki-focus-ring mb-8 flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-colors focus-within:border-border-accent"
      action="/search"
      onSubmit={(event) => {
        event.preventDefault();
        const value = new FormData(event.currentTarget).get("q");
        const query = typeof value === "string" ? value.trim() : "";
        router.push(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
      }}
    >
      <Search className="size-5 text-muted-foreground" aria-hidden="true" />
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder="Search anime, manga…"
        className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        aria-label="Search anime and manga"
        autoFocus={!defaultValue}
      />
    </form>
  );
}
