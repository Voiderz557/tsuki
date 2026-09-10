import type { AniListGraphQLResponse } from "./types";

const ANILIST_ENDPOINT = process.env.ANILIST_GRAPHQL_URL ?? "https://graphql.anilist.co";

/** AniList asks clients to identify themselves; this also helps avoid generic bot blocks. */
const ANILIST_USER_AGENT = "TSUKI/0.1 (anime and manga discovery; +https://github.com)";

/** Default revalidation window for cacheable list queries (trending, seasonal, browse). */
export const DEFAULT_REVALIDATE_SECONDS = 60 * 60; // 1 hour

/**
 * Error raised by the AniList client. `kind` lets callers show a specific,
 * on-brand message without needing to inspect HTTP status codes themselves.
 */
export class AniListError extends Error {
  readonly kind: "network" | "unavailable" | "rate_limited" | "not_found" | "graphql" | "unknown";
  readonly status?: number;

  constructor(
    message: string,
    kind: AniListError["kind"] = "unknown",
    status?: number
  ) {
    super(message);
    this.name = "AniListError";
    this.kind = kind;
    this.status = status;
  }
}

interface AniListRequestOptions {
  /** Seconds to cache the response for (Next.js data cache). `false` disables caching entirely. */
  revalidate?: number | false;
  /** Cache tags, useful for on-demand revalidation later. */
  tags?: string[];
  /** Abort signal — used by debounced client-triggered search. */
  signal?: AbortSignal;
}

/**
 * Low-level AniList GraphQL request helper. Every function in this module
 * (`anime.ts`, `manga.ts`, `search.ts`) goes through this so error handling,
 * caching, and headers stay consistent in one place.
 */
export async function anilistRequest<TData, TVariables extends Record<string, unknown> = Record<string, unknown>>(
  query: string,
  variables?: TVariables,
  options: AniListRequestOptions = {}
): Promise<TData> {
  const { revalidate = DEFAULT_REVALIDATE_SECONDS, tags, signal } = options;

  let response: Response;
  try {
    response = await fetch(ANILIST_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": ANILIST_USER_AGENT,
      },
      body: JSON.stringify({ query, variables }),
      signal,
      ...(revalidate === false
        ? { cache: "no-store" as const }
        : { next: { revalidate, tags } }),
    });
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === "AbortError") throw cause;
    throw new AniListError(
      "Unable to reach AniList. Check your connection and try again.",
      "network"
    );
  }

  if (response.status === 429) {
    throw new AniListError(
      "AniList rate limit reached. Please wait a moment and try again.",
      "rate_limited",
      429
    );
  }

  let json: AniListGraphQLResponse<TData>;
  try {
    json = await response.json();
  } catch {
    throw new AniListError("AniList returned an unexpected response.", "unknown", response.status);
  }

  if (json.errors && json.errors.length > 0) {
    const first = json.errors[0];
    if (first.status === 404) {
      throw new AniListError("Not found.", "not_found", 404);
    }
    if (response.status === 403 || response.status === 503 || first.status === 403) {
      throw new AniListError(
        first.message || "AniList is temporarily unavailable. Please try again later.",
        "unavailable",
        response.status
      );
    }
    throw new AniListError(first.message || "AniList returned an error.", "graphql", first.status);
  }

  if (response.status === 403 || response.status === 503) {
    throw new AniListError(
      "AniList is temporarily unavailable. Please try again later.",
      "unavailable",
      response.status
    );
  }

  if (!response.ok) {
    throw new AniListError(`AniList request failed (${response.status}).`, "unknown", response.status);
  }

  if (json.data === null || json.data === undefined) {
    throw new AniListError("AniList returned no data.", "unknown", response.status);
  }

  return json.data;
}

/**
 * Converts any thrown error into a clean, user-facing title/message pair.
 * Callers should always route caught errors through this rather than
 * displaying `error.message`/stack traces directly.
 */
export function toFriendlyError(error: unknown): { title: string; message: string } {
  if (error instanceof AniListError) {
    switch (error.kind) {
      case "unavailable":
        return { title: "AniList is temporarily unavailable", message: error.message };
      case "rate_limited":
        return { title: "Too many requests", message: error.message };
      case "network":
        return { title: "Connection problem", message: error.message };
      case "not_found":
        return { title: "Not found", message: "We couldn't find what you were looking for." };
      default:
        return {
          title: "Unable to load anime",
          message: "AniList returned an unexpected error. Please try again in a moment.",
        };
    }
  }
  return { title: "Unable to load anime", message: "Something went wrong while loading this page." };
}
