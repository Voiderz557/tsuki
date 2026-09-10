import type { ScoreDistributionEntry } from "@/types/anime";

/** AniList buckets scores in tens (10, 20, ..., 100) — divide by 10 for a 1-10 scale label. */
export function ScoreDistributionChart({ data }: { data: ScoreDistributionEntry[] }) {
  if (data.length === 0) return null;
  const max = Math.max(1, ...data.map((entry) => entry.amount));

  return (
    <div className="space-y-1.5">
      {data.map((entry) => (
        <div key={entry.score} className="flex items-center gap-2 text-xs">
          <span className="w-5 shrink-0 text-muted-foreground">{entry.score / 10}</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#7C83FF] to-[#A78BFA]"
              style={{ width: `${(entry.amount / max) * 100}%` }}
            />
          </div>
          <span className="w-10 shrink-0 text-right text-muted-foreground">{entry.amount}</span>
        </div>
      ))}
    </div>
  );
}
