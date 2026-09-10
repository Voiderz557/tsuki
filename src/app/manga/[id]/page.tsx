import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Star } from "lucide-react";

import { PosterPlaceholder } from "@/components/anime/PosterPlaceholder";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { Badge } from "@/components/ui/badge";
import { getMangaById } from "@/lib/anilist/manga";
import { toFriendlyError } from "@/lib/anilist/client";
import {
  displayTitle,
  formatChapterCount,
  formatFormatLabel,
  formatScore,
  formatSourceLabel,
  formatStatusLabel,
  stripHtml,
} from "@/lib/format";
import type { MangaDetail } from "@/types/anime";

interface MangaDetailPageProps {
  params: Promise<{ id: string }>;
}

function parseId(raw: string): number | null {
  const id = Number(raw);
  return Number.isFinite(id) && id > 0 ? id : null;
}

export async function generateMetadata({ params }: MangaDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const numericId = parseId(id);
  if (numericId === null) return { title: "Manga — TSUKI" };

  try {
    const manga = await getMangaById(numericId);
    if (!manga) return { title: "Manga Not Found — TSUKI" };
    return { title: `${displayTitle(manga.title)} — TSUKI` };
  } catch {
    return { title: "Manga — TSUKI" };
  }
}

export const revalidate = 3600;

function MetaRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right text-foreground-secondary">{value}</span>
    </div>
  );
}

export default async function MangaDetailPage({ params }: MangaDetailPageProps) {
  const { id } = await params;
  const numericId = parseId(id);
  if (numericId === null) notFound();

  let manga: MangaDetail | null;
  try {
    manga = await getMangaById(numericId);
  } catch (error) {
    const { title, message } = toFriendlyError(error);
    return (
      <div className="tsuki-container py-20">
        <ErrorState title={title} message={message} />
      </div>
    );
  }

  if (!manga) notFound();

  const title = displayTitle(manga.title);
  const score = formatScore(manga.averageScore);
  const synopsis = stripHtml(manga.description);
  const volumes = manga.volumes ? `${manga.volumes} Volume${manga.volumes === 1 ? "" : "s"}` : null;

  return (
    <div className="tsuki-container py-8 md:py-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="relative aspect-[2/3] w-36 shrink-0 overflow-hidden rounded-[10px] border border-border-strong sm:w-44">
          {manga.coverImage ? (
            <Image src={manga.coverImage} alt={title} fill priority sizes="180px" className="object-cover" />
          ) : (
            <PosterPlaceholder glyph={manga.posterGlyph} seed={manga.id} className="h-full w-full" />
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <h1 className="font-display text-2xl leading-tight text-foreground sm:text-3xl">{title}</h1>
          {manga.title.romaji && manga.title.romaji !== title && (
            <p className="text-sm text-foreground-secondary">{manga.title.romaji}</p>
          )}
          {manga.title.native && <p className="text-sm text-muted-foreground">{manga.title.native}</p>}

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-sm text-foreground-secondary">
            {score && (
              <span className="flex items-center gap-1 font-medium text-foreground">
                <Star className="size-4 fill-gold text-gold" aria-hidden="true" /> {score}
              </span>
            )}
            <span>
              {[formatFormatLabel(manga.format), formatChapterCount(manga.chapters), formatStatusLabel(manga.status)]
                .filter(Boolean)
                .join(" • ")}
            </span>
          </div>

          {manga.genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {manga.genres.map((genre) => (
                <Badge key={genre} variant="outline">
                  {genre}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 grid gap-10 md:grid-cols-[minmax(0,1fr)_260px]">
        <div>
          {synopsis ? (
            <>
              <h2 className="mb-2 text-sm font-medium text-foreground-secondary">Synopsis</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-foreground-secondary">{synopsis}</p>
            </>
          ) : (
            <EmptyState title="No synopsis" message="AniList hasn't published a description for this title yet." />
          )}
        </div>

        <aside>
          <MetaRow label="Format" value={formatFormatLabel(manga.format)} />
          <MetaRow label="Chapters" value={formatChapterCount(manga.chapters)} />
          <MetaRow label="Volumes" value={volumes} />
          <MetaRow label="Status" value={formatStatusLabel(manga.status)} />
          <MetaRow label="Source" value={formatSourceLabel(manga.source)} />
        </aside>
      </div>
    </div>
  );
}
