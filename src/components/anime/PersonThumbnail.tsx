import Image from "next/image";
import { User } from "lucide-react";

import { cn } from "@/lib/utils";

/** Character/staff/voice-actor portrait with a graceful fallback when AniList has no image. */
export function PersonThumbnail({
  image,
  alt,
  shape = "rounded",
  sizes = "160px",
  className,
}: {
  image: string | null | undefined;
  alt: string;
  shape?: "rounded" | "circle";
  sizes?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-surface-elevated",
        shape === "circle" ? "aspect-square rounded-full" : "aspect-[3/4] rounded-[10px]",
        className
      )}
    >
      {image ? (
        <Image src={image} alt={alt} fill sizes={sizes} className="object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
          <User className="size-6" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
