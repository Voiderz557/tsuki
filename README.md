# ☾ TSUKI

**Stories are stars. Your anime and manga journey becomes your personal night sky.**

TSUKI is a production-quality anime and manga discovery, tracking, statistics, and
social platform — combining the discovery strengths of AniList, the statistical
depth of MyAnimeList, and the personal-identity feel of Letterboxd, wrapped in an
original **Japanese night sky** visual identity: calm, dark, elegant, and cinematic.

> This is a working name. Product direction and architecture are intentionally
> decoupled from the "TSUKI" brand so it can be renamed later without a rewrite.

## Current status: Milestone 1 — Visual Foundation

This repository currently contains the **first milestone** only: a polished,
fully responsive, static homepage built with placeholder data. No backend,
authentication, or live media data exists yet — see [Roadmap](#roadmap) below.

Implemented so far:

- Global TSUKI design tokens (color, radius, typography) layered on Tailwind v4 + shadcn/ui
- `Inter` (UI) and `Playfair Display` (display/headline) fonts
- Responsive desktop navbar + mobile bottom navigation
- `ConstellationBackground`: a subtle, canvas-based star field with drifting
  stars, faint constellation links, and an occasional shooting star —
  respects `prefers-reduced-motion`
- Hero section with an original CSS/SVG Japanese night scene (moon, mountains,
  a torii silhouette, lantern glow) and gentle mouse-parallax
- Reusable `AnimeCard` component with generated placeholder poster art
  (deterministic gradients + a meaningful kanji glyph — no external image
  dependency yet)
- Homepage sections: Continue Watching (with immediate, modal-free +1 episode
  demo interaction), Trending, Seasonal

## Tech Stack

| Concern              | Choice                              |
| --------------------- | ------------------------------------ |
| Framework             | Next.js (App Router)                |
| Language              | TypeScript                           |
| Styling               | Tailwind CSS v4                      |
| UI primitives         | shadcn/ui (Radix base)               |
| Animation             | Motion (Framer Motion successor)     |
| Icons                 | lucide-react                         |
| Database (planned)    | PostgreSQL via Supabase              |
| ORM (planned)         | Prisma                               |
| Auth (planned)        | Auth.js                              |
| Media metadata (planned) | AniList GraphQL API               |
| Hosting (planned)     | Vercel                               |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other scripts

```bash
npm run build   # production build
npm run start   # run the production build
npm run lint     # eslint
npx tsc --noEmit # type-check only
```

## Environment Variables

No environment variables are required yet. Once AniList/Supabase/Auth.js are
wired up (Milestones 2–3), copy `.env.example` to `.env.local` and fill in the
values described there. Never commit `.env*` files — they're already
git-ignored.

## Project Structure

```
src/
  app/
    layout.tsx          Root layout: fonts, navbar, constellation bg, footer, mobile nav
    page.tsx             Homepage composition
    globals.css          TSUKI design tokens + Tailwind layer
  components/
    anime/                AnimeCard, PosterPlaceholder
    layout/               Navbar, MobileNav, Footer
    home/                 Hero, ContinueWatching, TrendingSection, SeasonalSection
    effects/              ConstellationBackground
    ui/                   shadcn/ui primitives
  data/
    placeholder-media.ts  Placeholder trending/seasonal/continue-watching data
  types/
    anime.ts              Shared Anime/Manga types (mirrors future AniList shapes)
  lib/
    format.ts              Display formatting helpers (title, score, episode count)
    utils.ts                cn() class merging helper
```

## Design System

All brand colors, spacing, and radii live as CSS variables in
`src/app/globals.css` (`:root` + `@theme inline`), so components never
hardcode hex values. Key tokens:

- `background`, `surface`, `card`, `surface-elevated` — the four dark layers
- `foreground`, `foreground-secondary`, `muted-foreground` — text hierarchy
- `primary` (#7C83FF), `accent` (#A78BFA), `sunset`, `gold`, `moonlight`, `steel` — accents
- `.tsuki-card`, `.tsuki-btn-gradient`, `.tsuki-container`, `.tsuki-focus-ring` — shared component utilities

## Roadmap

- **Milestone 2 — Media Data**: `src/lib/anilist` GraphQL client, real trending/seasonal
  data, global `⌘K` search, Browse page with filters, anime detail pages, characters/staff.
- **Milestone 3 — Tracking**: Auth.js signup/login, Prisma schema (`User`,
  `AnimeListEntry`, `ProgressEvent`, ...), Supabase Postgres, Add to List, episode
  progress, scoring.
- **Milestone 4 — Identity & Statistics**: Profiles, favorites, watch-time math,
  score/status distributions.
- **Milestone 5 — Manga**: Manga tracking, chapters/volumes, confirmed page tracking.
- **Milestone 6 — Social**: Following, activity feed, reviews, notifications.
- **Milestone 7 — TSUKI Signature Features**: Taste Constellation, achievements-as-stars,
  personalized recommendations, AniList/MAL import.

Full detail lives in the original build specification supplied for this project.
