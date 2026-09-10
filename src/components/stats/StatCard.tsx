import { cn } from "@/lib/utils";

export function StatCard({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={cn("tsuki-card px-4 py-3", className)}>
      <p className="text-2xl font-semibold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
