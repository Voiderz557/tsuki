"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Star } from "lucide-react";

import type { AnimeSummary } from "@/types/anime";
import { displayTitle, formatEpisodeCount, formatFormatLabel, formatScore } from "@/lib/format";
import { cn } from "@/lib/utils";
import { PosterPlaceholder } from "./PosterPlaceholder";

export interface AnimeCardProps {
  anime: AnimeSummary;
  /** Controls how much metadata is shown below the poster. */
  variant?: "default" | "compact";
  showGenres?: boolean;
  /** Image sizes hint — tune per grid density to avoid over-fetching. */
  sizes?: string;
  priority?: boolean;
  className?: string;
}

export function AnimeCard({
  anime,
  variant = "default",
  showGenres = false,
  sizes = "(min-width: 1280px) 15vw, (min-width: 768px) 22vw, 42vw",
  priority = false,
  className,
}: AnimeCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const title = displayTitle(anime.title);
  const score = formatScore(anime.averageScore);
  const formatLabel = formatFormatLabel(anime.format);
  const episodeLabel = formatEpisodeCount(anime.episodes);
  const showImage = Boolean(anime.coverImage) && !imageFailed;

  return (
    <Link
      href={`/anime/${anime.id}`}
      className={cn("group block w-full", className)}
      aria-label={title}
    >
      <motion.div
        className="tsuki-card overflow-hidden"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <div className="relative aspect-[2/3] w-full overflow-hidden">
          <motion.div
            className="h-full w-full"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {showImage ? (
              <Image
                src={anime.coverImage as string}
                alt={title}
                fill
                sizes={sizes}
                priority={priority}
                className="object-cover"
                onError={() => setImageFailed(true)}
              />
            ) : (
              <PosterPlaceholder glyph={anime.posterGlyph} seed={anime.id} className="h-full w-full" />
            )}
          </motion.div>

          {score && (
            <div className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-black/60 px-1.5 py-0.5 text-xs font-medium text-moonlight backdrop-blur-sm">
              <Star className="size-3 fill-gold text-gold" />
              {score}
            </div>
          )}
        </div>

        <div className="space-y-1 p-3">
          <h3 className="line-clamp-2 text-sm font-medium text-foreground" title={title}>
            {title}
          </h3>

          {variant === "default" && (
            <p className="text-xs text-muted-foreground">
              {[formatLabel, episodeLabel].filter(Boolean).join(" • ")}
            </p>
          )}

          {showGenres && anime.genres.length > 0 && (
            <p className="truncate text-xs text-foreground-secondary">{anime.genres.slice(0, 2).join(", ")}</p>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
