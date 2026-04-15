# Rep Connect

Rep Connect helps people quickly find and contact the elected officials who represent their address.

The app is designed to turn civic intent into action: look up your reps, see your federal and state districts on a map, and make outreach simple with direct call/details actions.

## Project Goal

The goal of this project is to reduce friction between constituents and their representatives by:

- geocoding an address and resolving matching districts
- showing federal and state representatives in a clear, fast UI
- providing contact-oriented interactions (call/details) with minimal clicks
- making district boundaries visible so users understand who represents them

## What The App Does

- Address search and ZIP-based representative lookup
- Federal and state level toggle
- District map + legend rendering
- Representative roster with responsive mobile/desktop layouts
- Rep detail drawer with links and context
- Refinement flow when a ZIP maps to multiple districts

## Tech Stack

- Next.js App Router + TypeScript
- React + SCSS modules
- Framer Motion / GSAP for interaction and animation
- Zustand for client-side rep state
- OpenStates + district geometry sources for state-level data

## Local Development

Install dependencies:

```bash
pnpm install
```

Run the app:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create a `.env.local` (or `.env`) with the keys you need for your setup:

- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (or `GOOGLE_API_KEY`) for map/geocoding usage
- `OPENSTATES_API_KEY` for state legislator lookup
- Optional Supabase variables for image/index workflows:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `DATABASE_URL`

## Useful Scripts

- `pnpm dev` - start local dev server
- `pnpm build` - production build
- `pnpm lint` - lint project
- `pnpm state-leg-images:index` - generate state legislator image index
- `pnpm state-leg-images:download` - download image assets
- `pnpm state-leg-images:push-supabase` - push JSONL index to Supabase

## Notes

- Keep sensitive values in env files only; never commit secrets.
- SQL dump/chunk files are intentionally excluded from normal commits.
