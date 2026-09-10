"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, Plus, Star } from "lucide-react";

import type { AnimeDetail } from "@/types/anime";
import { PosterPlaceholder } from "@/components/anime/PosterPlaceholder";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  displayTitle,
  formatDuration,
  formatEpisodeCount,
  formatFormatLabel,
  formatScore,
  formatSeasonLabel,
  formatSourceLabel,
  formatStatusLabel,
} from "@/lib/format";

export function AnimeHero({ anime }: { anime: AnimeDetail }) {
  const [favorited, setFavorited] = useState(false);
  const [showListHint, setShowListHint] = useState(false);

  const title = displayTitle(anime.title);
  const score = formatScore(anime.averageScore);
  const mainStudio = anime.studios.find((studio) => studio.isMain) ?? anime.studios[0];
  const metaParts = [
    formatFormatLabel(anime.format),
    formatEpisodeCount(anime.episodes),
    formatDuration(anime.duration),
    formatStatusLabel(anime.status),
  ].filter(Boolean);
  const seasonText = formatSeasonLabel(anime.season, anime.seasonYear);
  const sourceText = formatSourceLabel(anime.source);

  return (
    <section className="relative">
      <div className="relative h-52 w-full overflow-hidden sm:h-72 md:h-96">
        {anime.bannerImage ? (
          <Image src={anime.bannerImage} alt="" fill priority sizes="100vw" className="object-cover" />
        ) : (
          <div
            className="h-full w-full"
            style={{ backgroundImage: "linear-gradient(160deg, #0d1324 0%, #1c2140 55%, #2c2a5c 130%)" }}
            aria-hidden="true"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-background/10" />
      </div>

      <div className="tsuki-container relative -mt-16 sm:-mt-24 md:-mt-28">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
          <div className="relative aspect-[2/3] w-32 shrink-0 overflow-hidden rounded-[10px] border border-border-strong shadow-xl sm:w-40 md:w-48">
            {anime.coverImage ? (
              <Image src={anime.coverImage} alt={title} fill priority sizes="200px" className="object-cover" />
            ) : (
              <PosterPlaceholder glyph={anime.posterGlyph} seed={anime.id} className="h-full w-full" />
            )}
          </div>

          <div className="flex-1 space-y-2 pb-2">
            <h1 className="font-display text-2xl leading-tight text-foreground sm:text-3xl md:text-4xl">{title}</h1>
            {anime.title.romaji && anime.title.romaji !== title && (
              <p className="text-sm text-foreground-secondary">{anime.title.romaji}</p>
            )}
            {anime.title.native && <p className="text-sm text-muted-foreground">{anime.title.native}</p>}

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-sm text-foreground-secondary">
              {score && (
                <span className="flex items-center gap-1 font-medium text-foreground">
                  <Star className="size-4 fill-gold text-gold" aria-hidden="true" /> {score}
                </span>
              )}
              {metaParts.length > 0 && <span>{metaParts.join(" • ")}</span>}
              {seasonText && <span>{seasonText}</span>}
              {mainStudio && <span>{mainStudio.name}</span>}
              {sourceText && <span>{sourceText}</span>}
            </div>

            {anime.genres.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {anime.genres.map((genre) => (
                  <Badge key={genre} variant="outline">
                    {genre}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 pt-3">
              <div className="relative">
                <Button
                  className="tsuki-btn-gradient gap-1.5 border-0 text-white"
                  onClick={() => setShowListHint((v) => !v)}
                  aria-describedby="add-to-list-hint"
                >
                  <Plus className="size-4" aria-hidden="true" /> Add to List
                </Button>
                {showListHint && (
                  <div
                    id="add-to-list-hint"
                    role="status"
                    className="absolute left-0 top-full z-10 mt-2 w-60 rounded-lg border border-border bg-popover px-3 py-2 text-xs text-muted-foreground shadow-lg"
                  >
                    List tracking arrives in a later milestone — this button is a visual placeholder only.
                  </div>
                )}
              </div>

              <Button
                variant={favorited ? "default" : "secondary"}
                className="gap-1.5"
                onClick={() => setFavorited((v) => !v)}
                aria-pressed={favorited}
              >
                <Heart className={favorited ? "size-4 fill-current" : "size-4"} aria-hidden="true" />
                Favorite
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
