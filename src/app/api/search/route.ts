import { NextResponse, type NextRequest } from "next/server";

import { searchAnimeAndManga } from "@/lib/anilist/search";
import { toFriendlyError } from "@/lib/anilist/client";

// Search results change with every keystroke's query — never cache this route.
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  const perType = Number(request.nextUrl.searchParams.get("perType")) || 6;

  if (!query) {
    return NextResponse.json({ anime: [], manga: [] });
  }

  try {
    const results = await searchAnimeAndManga(query, perType);
    return NextResponse.json(results);
  } catch (error) {
    const { message } = toFriendlyError(error);
    // Never leak raw error/stack details to the client.
    return NextResponse.json({ anime: [], manga: [], error: message }, { status: 502 });
  }
}
