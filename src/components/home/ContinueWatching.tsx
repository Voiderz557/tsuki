"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import type { ContinueWatchingEntry } from "@/types/anime";
import { displayTitle } from "@/lib/format";
import { PosterPlaceholder } from "@/components/anime/PosterPlaceholder";
import { Button } from "@/components/ui/button";

export function ContinueWatching({ entries }: { entries: ContinueWatchingEntry[] }) {
  const [progress, setProgress] = useState(() => entries.map((entry) => entry.episodeProgress));

  if (entries.length === 0) return null;

  return (
    <section className="tsuki-container py-8 md:py-10">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-xl font-semibold text-foreground md:text-2xl">Continue Watching</h2>
      </div>

      <div className="-mx-5 flex gap-4 overflow-x-auto px-5 pb-2 md:-mx-0 md:px-0 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible lg:grid-cols-4">
        {entries.map((entry, i) => {
          const title = displayTitle(entry.anime.title);
          const current = progress[i];
          const percent = Math.min(100, Math.round((current / entry.totalEpisodes) * 100));
          const atMax = current >= entry.totalEpisodes;

          return (
            <div key={entry.anime.id} className="tsuki-card min-w-[260px] shrink-0 overflow-hidden md:min-w-0">
              {/* Demo data isn't backed by a real AniList id yet (Milestone 3
                  wires up real list persistence), so this card intentionally
                  doesn't deep-link to /anime/[id]. */}
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <PosterPlaceholder glyph={entry.anime.posterGlyph} seed={entry.anime.id} className="h-full w-full" />
              </div>

              <div className="space-y-2.5 p-3.5">
                <p className="line-clamp-1 text-sm font-medium text-foreground">{title}</p>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    Episode {current} / {entry.totalEpisodes}
                  </span>
                  <span>{percent}%</span>
                </div>

                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#786EFF] to-[#B57EDC] transition-all duration-300"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="gap-1"
                    disabled={atMax}
                    onClick={() =>
                      setProgress((prev) => {
                        const next = [...prev];
                        next[i] = Math.min(entry.totalEpisodes, next[i] + 1);
                        return next;
                      })
                    }
                  >
                    <Plus className="size-3.5" /> Episode
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
