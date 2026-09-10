import Link from "next/link";
import { Compass } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function MangaNotFound() {
  return (
    <div className="tsuki-container flex flex-col items-center gap-4 py-24 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-surface-elevated text-moonlight">
        <Compass className="size-6" aria-hidden="true" />
      </div>
      <h1 className="font-display text-2xl text-foreground">This title drifted out of view</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        We couldn&apos;t find a manga with that id on AniList. It may not exist, or it could be an anime entry.
      </p>
      <Button asChild size="sm" className="tsuki-btn-gradient border-0 text-white">
        <Link href="/search">Search</Link>
      </Button>
    </div>
  );
}
