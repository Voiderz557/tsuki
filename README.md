# ☾ TSUKI

**Stories are stars. Your anime and manga journey becomes your personal night sky.**

TSUKI is a production-quality anime and manga discovery, tracking, statistics, and
social platform — combining the discovery strengths of AniList, the statistical
depth of MyAnimeList, and the personal-identity feel of Letterboxd, wrapped in an
original **Japanese night sky** visual identity: calm, dark, elegant, and cinematic.

> This is a working name. Product direction and architecture are intentionally
> decoupled from the "TSUKI" brand so it can be renamed later without a rewrite.

## Current status: Milestone 2 — AniList Discovery

The visual foundation from Milestone 1 is now connected to the official AniList
GraphQL API. The site is useful for browsing, searching, and reading anime
pages without creating an account.

Implemented so far:

- Global TSUKI design tokens, constellation background, and Japanese night-sky homepage
- Reusable `src/lib/anilist` GraphQL layer (`client`, `queries`, `anime`, `manga`, `search`, `types`)
- Real trending and current-season homepage sections (cached/revalidated hourly)
- `/seasonal` with previous/next season navigation, format tabs, and sort options
- `/browse` with shareable URL filters (search, genre, year, season, format, status, score, sort)
- Global `⌘K` / Ctrl+K search overlay (debounced, anime + manga) plus `/search?q=...`
- `/anime/[id]` detail pages: hero, overview, characters, staff, recommendations, AniList stats
- Lightweight `/manga/[id]` foundation so search results do not 404
- Loading skeletons, constellation loader, and TSUKI-styled error/empty states
- Next.js Image remote patterns for `s4.anilist.co`

Not implemented yet (later milestones): accounts, list tracking, user statistics,
reviews, following, notifications, Taste Constellation, soundtrack library.

## Tech Stack

| Concern                  | Choice                           |
| ------------------------ | -------------------------------- |
| Framework                | Next.js (App Router)             |
| Language                 | TypeScript                       |
| Styling                  | Tailwind CSS v4                  |
| UI primitives            | shadcn/ui (Radix base)           |
| Animation                | Motion (Framer Motion successor) |
| Icons                    | lucide-react                     |
| Media metadata           | AniList GraphQL API              |
| Database (planned)       | PostgreSQL via Supabase          |
| ORM (planned)            | Prisma                           |
| Auth (planned)           | Auth.js                          |
| Hosting (planned)        | Vercel                           |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other scripts

```bash
npm run build    # production build
npm run start    # run the production build
npm run lint     # eslint
npx tsc --noEmit # type-check only
```

## Environment Variables

Copy `.env.example` to `.env.local` if you want to override defaults.

```
ANILIST_GRAPHQL_URL="https://graphql.anilist.co"
```

AniList's public GraphQL endpoint needs no API key. Later milestones add
`DATABASE_URL` and Auth.js secrets. Never commit `.env*` files other than
`.env.example`.

## Project Structure

```
src/
  app/
    page.tsx                 Homepage (live trending + seasonal)
    browse/page.tsx          Discover / browse with URL filters
    seasonal/page.tsx        Season navigator
    search/page.tsx          Full search results
    community/page.tsx       Coming-soon placeholder
    anime/[id]/page.tsx      Anime detail
    manga/[id]/page.tsx      Lightweight manga detail
    api/search/route.ts      Debounced overlay search API
  components/
    anime/                   Cards, hero, detail tabs
    browse/                  BrowseFilters
    search/                  GlobalSearch, SearchForm, MediaResultCard
    home/                    Hero, Continue Watching, Trending, Seasonal
    layout/                  Navbar, MobileNav, Footer
    effects/                 ConstellationBackground, ConstellationLoader
    feedback/                ErrorState, EmptyState
  lib/anilist/
    client.ts                GraphQL fetch + error handling
    queries.ts               All GraphQL documents
    anime.ts                 Trending / seasonal / browse / getAnimeById
    manga.ts                 getMangaById
    search.ts                Media-type-friendly search
    types.ts                 Raw AniList shapes
    season.ts                Current / prev / next season helpers
    constants.ts             Genres, formats, sort options
  types/anime.ts             App-level domain types
```

## AniList Integration

All GraphQL lives in `src/lib/anilist/queries.ts`. Pages never embed queries.

- List data (trending, seasonal, browse, detail) is cached with Next.js
  `revalidate` (typically 10 minutes–1 hour).
- Search is always dynamic (`cache: "no-store"` / `force-dynamic`).
- Missing titles, covers, and metadata fall back to placeholders or omitted rows.
- User-facing errors come from `toFriendlyError()` — no raw stack traces.

## Roadmap

- **Milestone 3 — Tracking**: Auth.js, Prisma/Supabase, Add to List, episode
  progress, scoring, `ProgressEvent` history.
- **Milestone 4 — Identity & Statistics**: Profiles, favorites, watch-time math,
  score/status distributions.
- **Milestone 5 — Manga**: Full manga tracking, chapters/volumes, confirmed pages.
- **Milestone 6 — Social**: Following, activity feed, reviews, notifications.
- **Milestone 7 — TSUKI Signature Features**: Taste Constellation, achievements,
  personalized recommendations, AniList/MAL import, soundtrack discovery.

Full detail lives in the original build specification supplied for this project.
