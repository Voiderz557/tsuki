import type { PosterGlyph } from "@/types/anime";
import { cn } from "@/lib/utils";

const GRADIENTS = [
  "linear-gradient(155deg, #1c2140 0%, #2c2a5c 55%, #7c83ff 130%)",
  "linear-gradient(155deg, #211a38 0%, #4a2f5c 55%, #a78bfa 130%)",
  "linear-gradient(155deg, #2a1f30 0%, #5c3450 55%, #e89ab8 130%)",
  "linear-gradient(155deg, #241d2a 0%, #5c4030 55%, #f4b87a 130%)",
  "linear-gradient(155deg, #14192c 0%, #253256 55%, #6478a8 130%)",
  "linear-gradient(155deg, #191c30 0%, #2e2650 55%, #a78bfa 130%)",
];

interface PosterPlaceholderProps {
  glyph: PosterGlyph;
  seed: number;
  className?: string;
}

/**
 * Generated poster art used while real cover images aren't wired up yet.
 * Deterministic per-title gradient + a single meaningful kanji character,
 * so every card still feels intentional rather than "broken image".
 */
export function PosterPlaceholder({ glyph, seed, className }: PosterPlaceholderProps) {
  const gradient = GRADIENTS[seed % GRADIENTS.length];

  return (
    <div
      className={cn("relative flex h-full w-full items-center justify-center overflow-hidden", className)}
      style={{ backgroundImage: gradient }}
      aria-hidden="true"
    >
      {/* faint static stars */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 20% 30%, rgba(244,246,255,0.6) 0%, transparent 60%)," +
            "radial-gradient(1px 1px at 70% 20%, rgba(244,246,255,0.5) 0%, transparent 60%)," +
            "radial-gradient(1.5px 1.5px at 85% 65%, rgba(244,246,255,0.5) 0%, transparent 60%)," +
            "radial-gradient(1px 1px at 35% 80%, rgba(244,246,255,0.4) 0%, transparent 60%)," +
            "radial-gradient(1px 1px at 55% 50%, rgba(244,246,255,0.35) 0%, transparent 60%)",
        }}
      />
      <span
        className="font-display select-none text-6xl text-moonlight/25"
        style={{ textShadow: "0 0 32px rgba(221,231,255,0.25)" }}
      >
        {glyph}
      </span>
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
    </div>
  );
}
