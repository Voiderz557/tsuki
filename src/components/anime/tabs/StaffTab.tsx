import type { StaffSummary } from "@/types/anime";
import { PersonThumbnail } from "@/components/anime/PersonThumbnail";
import { EmptyState } from "@/components/feedback/EmptyState";

export function StaffTab({ staff }: { staff: StaffSummary[] }) {
  if (staff.length === 0) {
    return <EmptyState title="No staff data" message="AniList hasn't published staff data for this title yet." />;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {staff.map((member) => (
        <div key={member.id} className="tsuki-card overflow-hidden">
          <PersonThumbnail image={member.image} alt={member.name} className="rounded-none" />
          <div className="space-y-1 p-3">
            <p className="line-clamp-1 text-sm font-medium text-foreground" title={member.name}>
              {member.name}
            </p>
            {member.role && <p className="line-clamp-1 text-xs text-muted-foreground">{member.role}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
