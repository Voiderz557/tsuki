import type { StatusDistributionEntry } from "@/types/anime";
import { capitalize } from "@/lib/format";

/** Raw AniList list-status buckets (CURRENT, PLANNING, COMPLETED, ...) — aggregate across all AniList users, not TSUKI's own list statuses. */
export function StatusDistributionChart({ data }: { data: StatusDistributionEntry[] }) {
  if (data.length === 0) return null;
  const max = Math.max(1, ...data.map((entry) => entry.amount));

  return (
    <div className="space-y-1.5">
      {data.map((entry) => (
        <div key={entry.status} className="flex items-center gap-2 text-xs">
          <span className="w-24 shrink-0 truncate text-muted-foreground">{capitalize(entry.status)}</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#E89AB8] to-[#F4B87A]"
              style={{ width: `${(entry.amount / max) * 100}%` }}
            />
          </div>
          <span className="w-10 shrink-0 text-right text-muted-foreground">{entry.amount}</span>
        </div>
      ))}
    </div>
  );
}
