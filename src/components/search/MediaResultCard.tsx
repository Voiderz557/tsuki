"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";

import type { MediaSearchResult } from "@/types/anime";
import { PosterPlaceholder } from "@/components/anime/PosterPlaceholder";
import { displayTitle, formatFormatLabel, formatScore } from "@/lib/format";
import { cn } from "@/lib/utils";

export function MediaResultCard({ item, className }: { item: MediaSearchResult; className?: string }) {
  const [imageFailed, setImageFailed] = useState(false);
  const title = displayTitle(item.title);
  const score = formatScore(item.averageScore);
  const formatLabel = formatFormatLabel(item.format);
  const showImage = Boolean(item.coverImage) && !imageFailed;
  const href = item.mediaType === "ANIME" ? `/anime/${item.id}` : `/manga/${item.id}`;

  return (
    <Link href={href} className={cn("group block w-full", className)} aria-label={title}>
      <div className="tsuki-card overflow-hidden transition-transform duration-200 group-hover:-translate-y-1">
        <div className="relative aspect-[2/3] w-full overflow-hidden">
          {showImage ? (
            <Image
              src={item.coverImage as string}
              alt={title}
              fill
              sizes="(min-width: 1280px) 15vw, (min-width: 768px) 22vw, 42vw"
              className="object-cover"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <PosterPlaceholder glyph={item.posterGlyph} seed={item.id} className="h-full w-full" />
          )}
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
          <p className="text-xs text-muted-foreground">{[formatLabel, item.year].filter(Boolean).join(" • ")}</p>
        </div>
      </div>
    </Link>
  );
}
