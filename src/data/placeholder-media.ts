import type { AnimeSummary, ContinueWatchingEntry, PosterGlyph } from "@/types/anime";

const GLYPHS: PosterGlyph[] = ["月", "星", "夜", "空", "光", "夢", "花", "雪"];

function glyphFor(seed: number): PosterGlyph {
  return GLYPHS[seed % GLYPHS.length];
}

/**
 * Placeholder trending catalog. Titles are used as plain-text demo content
 * only — no artwork or logos are reproduced. This will be replaced by
 * `getTrendingAnime()` from `src/lib/anilist` in Milestone 2.
 */
export const trendingAnime: AnimeSummary[] = [
  {
    id: 1,
    title: { english: "Frieren: Beyond Journey's End", romaji: "Sousou no Frieren", native: "葬送のフリーレン" },
    posterGlyph: glyphFor(1),
    averageScore: 93,
    episodes: 28,
    duration: 24,
    format: "TV",
    status: "FINISHED",
    genres: ["Adventure", "Drama", "Fantasy"],
  },
  {
    id: 2,
    title: { english: "Attack on Titan", romaji: "Shingeki no Kyojin", native: "進撃の巨人" },
    posterGlyph: glyphFor(2),
    averageScore: 90,
    episodes: 87,
    duration: 24,
    format: "TV",
    status: "FINISHED",
    genres: ["Action", "Drama", "Fantasy"],
  },
  {
    id: 3,
    title: { english: "Vinland Saga", romaji: "Vinland Saga", native: "ヴィンランド・サガ" },
    posterGlyph: glyphFor(3),
    averageScore: 88,
    episodes: 48,
    duration: 24,
    format: "TV",
    status: "RELEASING",
    genres: ["Action", "Adventure", "Drama"],
  },
  {
    id: 4,
    title: { english: "Jujutsu Kaisen", romaji: "Jujutsu Kaisen", native: "呪術廻戦" },
    posterGlyph: glyphFor(4),
    averageScore: 87,
    episodes: 47,
    duration: 24,
    format: "TV",
    status: "RELEASING",
    genres: ["Action", "Supernatural"],
  },
  {
    id: 5,
    title: { english: "Chainsaw Man", romaji: "Chainsaw Man", native: "チェンソーマン" },
    posterGlyph: glyphFor(5),
    averageScore: 86,
    episodes: 12,
    duration: 24,
    format: "TV",
    status: "FINISHED",
    genres: ["Action", "Horror"],
  },
  {
    id: 6,
    title: { english: "Made in Abyss", romaji: "Made in Abyss", native: "メイドインアビス" },
    posterGlyph: glyphFor(6),
    averageScore: 85,
    episodes: 13,
    duration: 24,
    format: "TV",
    status: "FINISHED",
    genres: ["Adventure", "Drama", "Fantasy"],
  },
  {
    id: 7,
    title: { english: "Spy x Family", romaji: "Spy x Family", native: "SPY×FAMILY" },
    posterGlyph: glyphFor(7),
    averageScore: 84,
    episodes: 25,
    duration: 24,
    format: "TV",
    status: "RELEASING",
    genres: ["Action", "Comedy"],
  },
  {
    id: 8,
    title: { english: "Bocchi the Rock!", romaji: "Bocchi the Rock!", native: "ぼっち・ざ・ろっく！" },
    posterGlyph: glyphFor(8),
    averageScore: 83,
    episodes: 12,
    duration: 24,
    format: "TV",
    status: "FINISHED",
    genres: ["Comedy", "Music", "Slice of Life"],
  },
];

export const seasonalAnime: AnimeSummary[] = [
  {
    id: 9,
    title: { english: "Mushoku Tensei: Jobless Reincarnation", romaji: "Mushoku Tensei", native: "無職転生" },
    posterGlyph: glyphFor(9),
    averageScore: 82,
    episodes: 23,
    duration: 24,
    format: "TV",
    status: "RELEASING",
    season: "FALL",
    seasonYear: 2026,
    genres: ["Adventure", "Drama", "Fantasy"],
  },
  {
    id: 10,
    title: { english: "Violet Evergarden", romaji: "Violet Evergarden", native: "ヴァイオレット・エヴァーガーデン" },
    posterGlyph: glyphFor(10),
    averageScore: 86,
    episodes: 13,
    duration: 24,
    format: "TV",
    status: "RELEASING",
    season: "FALL",
    seasonYear: 2026,
    genres: ["Drama", "Fantasy"],
  },
  {
    id: 11,
    title: { english: "Steins;Gate", romaji: "Steins;Gate", native: "シュタインズ・ゲート" },
    posterGlyph: glyphFor(11),
    averageScore: 89,
    episodes: 24,
    duration: 24,
    format: "TV",
    status: "RELEASING",
    season: "FALL",
    seasonYear: 2026,
    genres: ["Drama", "Sci-Fi", "Thriller"],
  },
  {
    id: 12,
    title: { english: "Monster", romaji: "Monster", native: "モンスター" },
    posterGlyph: glyphFor(12),
    averageScore: 90,
    episodes: 74,
    duration: 24,
    format: "TV",
    status: "RELEASING",
    season: "FALL",
    seasonYear: 2026,
    genres: ["Mystery", "Psychological", "Thriller"],
  },
  {
    id: 13,
    title: { english: "Fullmetal Alchemist: Brotherhood", romaji: "Hagane no Renkinjutsushi", native: "鋼の錬金術師" },
    posterGlyph: glyphFor(13),
    averageScore: 92,
    episodes: 64,
    duration: 24,
    format: "TV",
    status: "RELEASING",
    season: "FALL",
    seasonYear: 2026,
    genres: ["Action", "Adventure", "Drama"],
  },
  {
    id: 14,
    title: { english: "Death Note", romaji: "Death Note", native: "デスノート" },
    posterGlyph: glyphFor(14),
    averageScore: 88,
    episodes: 37,
    duration: 23,
    format: "TV",
    status: "RELEASING",
    season: "FALL",
    seasonYear: 2026,
    genres: ["Mystery", "Psychological", "Thriller"],
  },
];

export const continueWatching: ContinueWatchingEntry[] = [
  {
    anime: trendingAnime[0],
    episodeProgress: 13,
    totalEpisodes: 28,
  },
  {
    anime: trendingAnime[3],
    episodeProgress: 41,
    totalEpisodes: 47,
  },
  {
    anime: seasonalAnime[3],
    episodeProgress: 22,
    totalEpisodes: 74,
  },
  {
    anime: trendingAnime[2],
    episodeProgress: 30,
    totalEpisodes: 48,
  },
];

export const currentSeasonLabel = "Fall 2026";
