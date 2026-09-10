"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AnimeDetail } from "@/types/anime";
import { OverviewTab } from "./tabs/OverviewTab";
import { CharactersTab } from "./tabs/CharactersTab";
import { StaffTab } from "./tabs/StaffTab";
import { RecommendationsTab } from "./tabs/RecommendationsTab";
import { StatsTab } from "./tabs/StatsTab";

/**
 * Data-driven tab list — appending a "Soundtracks" entry (and its content
 * component) later is all that's needed to add that tab, no restructuring.
 */
const TAB_DEFS = [
  { id: "overview", label: "Overview" },
  { id: "characters", label: "Characters" },
  { id: "staff", label: "Staff" },
  { id: "recommendations", label: "Recommendations" },
  { id: "stats", label: "Stats" },
] as const;

export function AnimeDetailTabs({ anime }: { anime: AnimeDetail }) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <div className="sticky top-16 z-20 -mx-5 border-b border-border bg-background/95 px-5 backdrop-blur-md md:top-[72px] md:-mx-0 md:px-0">
        <TabsList variant="line" className="h-auto w-full justify-start gap-1 overflow-x-auto py-2">
          {TAB_DEFS.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="shrink-0">
              {tab.label}
            </TabsTrigger>
          ))}
          {/* Reviews needs signed-in users (Milestone 3) — shown, disabled, so the tab layout doesn't shift later. */}
          <span
            className="ml-1 shrink-0 rounded-full bg-surface-elevated px-2.5 py-1 text-xs text-muted-foreground"
            title="Reviews arrive once accounts exist"
          >
            Reviews · Soon
          </span>
        </TabsList>
      </div>

      <div className="py-6">
        <TabsContent value="overview">
          <OverviewTab anime={anime} />
        </TabsContent>
        <TabsContent value="characters">
          <CharactersTab characters={anime.characters} />
        </TabsContent>
        <TabsContent value="staff">
          <StaffTab staff={anime.staff} />
        </TabsContent>
        <TabsContent value="recommendations">
          <RecommendationsTab recommendations={anime.recommendations} />
        </TabsContent>
        <TabsContent value="stats">
          <StatsTab anime={anime} />
        </TabsContent>
      </div>
    </Tabs>
  );
}
