import type { AnimeSummary, ContinueWatchingEntry } from "@/types/anime";
import { posterGlyphForId } from "@/lib/poster-glyph";

/**
 * "Continue Watching" is a signed-in, personal feature — it can't be backed
 * by real AniList data until user accounts + list persistence exist
 * (Milestone 3). This demo data stays in place until then; titles are used
 * as plain-text demo content only, no artwork/logos are reproduced.
 *
 * Trending and seasonal placeholder data were removed in Milestone 2 — the
 * homepage now fetches those from `src/lib/anilist`.
 */

const demoAnime: AnimeSummary[] = [
  {
    id: 1,
    title: { english: "Frieren: Beyond Journey's End", romaji: "Sousou no Frieren", native: "葬送のフリーレン" },
    posterGlyph: posterGlyphForId(1),
    averageScore: 93,
    episodes: 28,
    duration: 24,
    format: "TV",
    status: "FINISHED",
    genres: ["Adventure", "Drama", "Fantasy"],
  },
  {
    id: 4,
    title: { english: "Jujutsu Kaisen", romaji: "Jujutsu Kaisen", native: "呪術廻戦" },
    posterGlyph: posterGlyphForId(4),
    averageScore: 87,
    episodes: 47,
    duration: 24,
    format: "TV",
    status: "RELEASING",
    genres: ["Action", "Supernatural"],
  },
  {
    id: 12,
    title: { english: "Monster", romaji: "Monster", native: "モンスター" },
    posterGlyph: posterGlyphForId(12),
    averageScore: 90,
    episodes: 74,
    duration: 24,
    format: "TV",
    status: "RELEASING",
    genres: ["Mystery", "Psychological", "Thriller"],
  },
  {
    id: 3,
    title: { english: "Vinland Saga", romaji: "Vinland Saga", native: "ヴィンランド・サガ" },
    posterGlyph: posterGlyphForId(3),
    averageScore: 88,
    episodes: 48,
    duration: 24,
    format: "TV",
    status: "RELEASING",
    genres: ["Action", "Adventure", "Drama"],
  },
];

export const continueWatching: ContinueWatchingEntry[] = [
  { anime: demoAnime[0], episodeProgress: 13, totalEpisodes: 28 },
  { anime: demoAnime[1], episodeProgress: 41, totalEpisodes: 47 },
  { anime: demoAnime[2], episodeProgress: 22, totalEpisodes: 74 },
  { anime: demoAnime[3], episodeProgress: 30, totalEpisodes: 48 },
];
