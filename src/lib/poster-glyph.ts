import type { PosterGlyph } from "@/types/anime";

const GLYPHS: PosterGlyph[] = ["月", "星", "夜", "空", "光", "夢", "花", "雪"];

/** Deterministic, meaningful-kanji glyph for a given media id — used by PosterPlaceholder. */
export function posterGlyphForId(id: number): PosterGlyph {
  return GLYPHS[Math.abs(id) % GLYPHS.length];
}
