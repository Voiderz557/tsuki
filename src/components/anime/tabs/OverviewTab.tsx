import Link from "next/link";
import Image from "next/image";

import type { AnimeDetail } from "@/types/anime";
import { AnimeCard } from "@/components/anime/AnimeCard";
import { PersonThumbnail } from "@/components/anime/PersonThumbnail";
import { Badge } from "@/components/ui/badge";
import {
  displayTitle,
  formatDuration,
  formatEpisodeCount,
  formatFormatLabel,
  formatSeasonLabel,
  formatSourceLabel,
  formatStatusLabel,
  stripHtml,
} from "@/lib/format";

function MetaRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right text-foreground-secondary">{value}</span>
    </div>
  );
}

export function OverviewTab({ anime }: { anime: AnimeDetail }) {
  const synopsis = stripHtml(anime.description);
  const mainStudio = anime.studios.find((studio) => studio.isMain) ?? anime.studios[0];
  const visibleTags = anime.tags.filter((tag) => !tag.isSpoiler).slice(0, 14);

  return (
    <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_260px]">
      <div className="space-y-9">
        {synopsis && (
          <div>
            <h2 className="mb-2 text-sm font-medium text-foreground-secondary">Synopsis</h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-foreground-secondary">{synopsis}</p>
          </div>
        )}

        {anime.characters.length > 0 && (
          <div>
            <h2 className="mb-3 text-sm font-medium text-foreground-secondary">Characters</h2>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {anime.characters.slice(0, 6).map((character) => (
                <div key={character.id} className="text-center">
                  <PersonThumbnail image={character.image} alt={character.name} shape="circle" sizes="96px" />
                  <p className="mt-1.5 truncate text-xs text-foreground-secondary">{character.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {anime.relations.length > 0 && (
          <div>
            <h2 className="mb-3 text-sm font-medium text-foreground-secondary">Related</h2>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
              {anime.relations.slice(0, 6).map((relation) => (
                <Link
                  key={`${relation.mediaType}-${relation.id}`}
                  href={relation.mediaType === "ANIME" ? `/anime/${relation.id}` : `/manga/${relation.id}`}
                  className="tsuki-card block overflow-hidden"
                >
                  <div className="relative aspect-[2/3] w-full overflow-hidden bg-surface-elevated">
                    {relation.coverImage ? (
                      <Image src={relation.coverImage} alt="" fill sizes="160px" className="object-cover" />
                    ) : null}
                  </div>
                  <div className="p-2">
                    <p className="line-clamp-2 text-xs text-foreground-secondary">{displayTitle(relation.title)}</p>
                    <p className="text-[10px] tracking-wide text-muted-foreground uppercase">
                      {relation.relationType.replace(/_/g, " ")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {anime.recommendations.length > 0 && (
          <div>
            <h2 className="mb-3 text-sm font-medium text-foreground-secondary">Recommendations</h2>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
              {anime.recommendations.slice(0, 6).map((rec) => (
                <AnimeCard key={rec.id} anime={rec} />
              ))}
            </div>
          </div>
        )}
      </div>

      <aside className="space-y-0.5 text-sm">
        <MetaRow label="Format" value={formatFormatLabel(anime.format)} />
        <MetaRow label="Episodes" value={formatEpisodeCount(anime.episodes)} />
        <MetaRow label="Duration" value={formatDuration(anime.duration)} />
        <MetaRow label="Status" value={formatStatusLabel(anime.status)} />
        <MetaRow label="Season" value={formatSeasonLabel(anime.season, anime.seasonYear)} />
        <MetaRow label="Studio" value={mainStudio?.name} />
        <MetaRow label="Source" value={formatSourceLabel(anime.source)} />

        {visibleTags.length > 0 && (
          <div className="pt-4">
            <p className="mb-2 text-muted-foreground">Tags</p>
            <div className="flex flex-wrap gap-1.5">
              {visibleTags.map((tag) => (
                <Badge key={tag.name} variant="outline">
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {anime.genres.length > 0 && (
          <div className="pt-4">
            <p className="mb-2 text-muted-foreground">Genres</p>
            <div className="flex flex-wrap gap-1.5">
              {anime.genres.map((genre) => (
                <Badge key={genre}>{genre}</Badge>
              ))}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
