# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # start dev server at http://localhost:5173
npm run build      # tsc type-check then vite production build → dist/
npm run preview    # serve dist/ locally (tests PWA/service-worker offline)
npm run lint       # eslint on all .ts/.tsx files
```

No test suite is configured.

## Architecture

Single-page React PWA. All data is local — no backend, no auth, no network calls after load.

### Data flow

`src/db/index.ts` is the single source of truth. It opens an IndexedDB database (`calories-tracker` v1) with three object stores:

- **`profile`** — one record (id=1): age, weight, height, gender, activityLevel, goal, dailyTarget
- **`customFoods`** — user's saved food library, indexed by name
- **`entries`** — food log rows (date, meal, foodName, calories, timestamp), indexed by date

All pages call these exported helpers directly; there is no state management layer.

### Calorie calculation

`src/lib/bmr.ts` — Mifflin-St Jeor BMR → multiply by activity multiplier (1.2–1.9) → add goal offset (lose −500, gain +300). `dailyTarget` is calculated once and stored in the profile record. Re-calculated and re-saved whenever the user updates their profile.

### Suggestion engine

`src/lib/suggestions.ts` — pure function `getSuggestions(entries, dailyTarget)` returns an array of `{type, message}` objects. Rules fire based on the current hour and what's been logged. Called on every Home page render.

### Routing

`App.tsx` checks for a profile on mount. If none exists, all routes redirect to `/onboarding`. After onboarding completes, it calls `onComplete()` (passed as prop) to update the `hasProfile` state in App — this must happen before `navigate('/')` or the redirect guard will loop back to onboarding.

Routes: `/onboarding`, `/` (Home), `/charts`, `/profile`. Each page except Onboarding is wrapped in `<Layout>` which renders `<BottomNav>`.

### Styling

Tailwind CSS v4 (via `@tailwindcss/vite`). Design tokens are CSS variables in `src/index.css` — `--bg`, `--surface`, `--surface2`, `--border`, `--lime`, `--coral`, `--amber`, `--teal`, and their `-dim` variants. Inline styles are used heavily alongside Tailwind utilities. Fonts: Bebas Neue (display/numbers), Outfit (body), DM Mono (calorie readouts) — loaded from Google Fonts in `index.css`.

### PWA

`vite-plugin-pwa` generates `dist/sw.js` (Workbox) and `dist/manifest.webmanifest` at build time. The service worker pre-caches all built assets. Icons at `public/icons/icon-192.png` and `icon-512.png`.

## TypeScript notes

`verbatimModuleSyntax` is enabled — types must use `import type` syntax. All type-only imports that mix with value imports should be split: `import type { Foo } from './db'` separate from `import { bar } from './db'`.
