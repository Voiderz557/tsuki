import type { MediaSeason } from "@/types/anime";

export interface SeasonPointer {
  season: MediaSeason;
  year: number;
}

const SEASON_ORDER: MediaSeason[] = ["WINTER", "SPRING", "SUMMER", "FALL"];

/** AniList's season boundaries: WINTER=Jan-Mar, SPRING=Apr-Jun, SUMMER=Jul-Sep, FALL=Oct-Dec. */
export function getCurrentSeason(date: Date = new Date()): SeasonPointer {
  const month = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear();
  if (month <= 3) return { season: "WINTER", year };
  if (month <= 6) return { season: "SPRING", year };
  if (month <= 9) return { season: "SUMMER", year };
  return { season: "FALL", year };
}

export function nextSeason({ season, year }: SeasonPointer): SeasonPointer {
  const index = SEASON_ORDER.indexOf(season);
  if (index === SEASON_ORDER.length - 1) return { season: SEASON_ORDER[0], year: year + 1 };
  return { season: SEASON_ORDER[index + 1], year };
}

export function previousSeason({ season, year }: SeasonPointer): SeasonPointer {
  const index = SEASON_ORDER.indexOf(season);
  if (index === 0) return { season: SEASON_ORDER[SEASON_ORDER.length - 1], year: year - 1 };
  return { season: SEASON_ORDER[index - 1], year };
}

function capitalizeSeason(season: MediaSeason): string {
  return season.charAt(0) + season.slice(1).toLowerCase();
}

export function seasonLabel({ season, year }: SeasonPointer): string {
  return `${capitalizeSeason(season)} ${year}`;
}

export function isValidSeason(value: string | null | undefined): value is MediaSeason {
  return value === "WINTER" || value === "SPRING" || value === "SUMMER" || value === "FALL";
}
