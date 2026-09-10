import type { CharacterSummary } from "@/types/anime";
import { PersonThumbnail } from "@/components/anime/PersonThumbnail";
import { EmptyState } from "@/components/feedback/EmptyState";

const ROLE_LABELS: Record<CharacterSummary["role"], string> = {
  MAIN: "Main Character",
  SUPPORTING: "Supporting",
  BACKGROUND: "Background",
};

export function CharactersTab({ characters }: { characters: CharacterSummary[] }) {
  if (characters.length === 0) {
    return <EmptyState title="No character data" message="AniList hasn't published character data for this title yet." />;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {characters.map((character) => (
        <div key={character.id} className="tsuki-card overflow-hidden">
          <PersonThumbnail image={character.image} alt={character.name} className="rounded-none" />
          <div className="space-y-1 p-3">
            <p className="line-clamp-1 text-sm font-medium text-foreground" title={character.name}>
              {character.name}
            </p>
            <p className="text-xs text-muted-foreground">{ROLE_LABELS[character.role]}</p>
            {character.voiceActor && (
              <p className="line-clamp-1 text-xs text-foreground-secondary" title={character.voiceActor.name}>
                CV: {character.voiceActor.name}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
