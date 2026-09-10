import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AnimeHero } from "@/components/anime/AnimeHero";
import { AnimeDetailTabs } from "@/components/anime/AnimeDetailTabs";
import { ErrorState } from "@/components/feedback/ErrorState";
import { getAnimeById } from "@/lib/anilist/anime";
import { toFriendlyError } from "@/lib/anilist/client";
import { displayTitle } from "@/lib/format";
import type { AnimeDetail } from "@/types/anime";

interface AnimeDetailPageProps {
  params: Promise<{ id: string }>;
}

function parseId(raw: string): number | null {
  const id = Number(raw);
  return Number.isFinite(id) && id > 0 ? id : null;
}

export async function generateMetadata({ params }: AnimeDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const numericId = parseId(id);
  if (numericId === null) return { title: "Anime — TSUKI" };

  try {
    const anime = await getAnimeById(numericId);
    if (!anime) return { title: "Anime Not Found — TSUKI" };
    return {
      title: `${displayTitle(anime.title)} — TSUKI`,
      description: anime.description ? anime.description.replace(/<[^>]+>/g, "").slice(0, 160) : undefined,
    };
  } catch {
    return { title: "Anime — TSUKI" };
  }
}

// Revalidate detail pages hourly — the fetch layer in `src/lib/anilist`
// also tags these requests for on-demand revalidation later if needed.
export const revalidate = 3600;

export default async function AnimeDetailPage({ params }: AnimeDetailPageProps) {
  const { id } = await params;
  const numericId = parseId(id);
  if (numericId === null) notFound();

  let anime: AnimeDetail | null;
  try {
    anime = await getAnimeById(numericId);
  } catch (error) {
    const { title, message } = toFriendlyError(error);
    return (
      <div className="tsuki-container py-20">
        <ErrorState title={title} message={message} />
      </div>
    );
  }

  if (!anime) notFound();

  return (
    <>
      <AnimeHero anime={anime} />
      <div className="tsuki-container">
        <AnimeDetailTabs anime={anime} />
      </div>
    </>
  );
}
