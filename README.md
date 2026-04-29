# Tessera — personal task & note workspace

A clean, opinionated daily-driver. Tasks, calendar, notes and analytics in one place. React 18 + Vite + TypeScript on the front, Supabase (Postgres + Auth + Realtime) on the back, deployed to Vercel.

> "Small tiles, large patterns." Every task is a tessera in your week's mosaic.

---

## Stack

- **React 18 + Vite + TypeScript** SPA
- **MUI v6** with `sx`, styles split into `*.styles.ts` modules
- **Supabase** for auth (email/password + Google OAuth), Postgres with RLS, Realtime subscriptions, Edge Functions
- **TanStack Query** for server state with optimistic updates
- **Zustand** for global UI state (theme, sidebar, filters) — persisted to localStorage
- **FullCalendar** for monthly/weekly views with drag-to-reschedule
- **React Hook Form + Zod** for forms + env validation
- **Framer Motion** for page transitions
- **Sonner** for toasts · **Recharts** for analytics

## Local development — Docker only

You only need Docker. No local Node, no `npm install` on the host.

```bash
# 1. One-time setup
cp .env.example .env.local        # then fill in real Supabase values

# 2. Start dev server (Vite, hot reload, port 5173)
docker compose up dev

# 3. Run tooling inside the same image
docker compose run --rm dev npm run typecheck
docker compose run --rm dev npm run lint

# 4. Preview the production nginx build locally (port 3000)
docker compose --profile prod up --build app
```

Open <http://localhost:5173> for dev or <http://localhost:3000> for the prod preview.

## Supabase setup

1. Create a project at <https://supabase.com>.
2. In the SQL editor, run [`supabase/schema.sql`](supabase/schema.sql) — creates tables, RLS, triggers, realtime publication.
3. Copy the **Project URL** and **anon key** (Settings → API) into `.env.local`.
4. (Optional) Deploy the reminder edge function:
   ```bash
   supabase functions deploy send-reminders
   supabase secrets set VAPID_PUBLIC_KEY=… VAPID_PRIVATE_KEY=… VAPID_SUBJECT="mailto:you@example.com"
   ```
5. (Optional) Enable the **Insights** page (AI-powered weekly summary + time-management tips, in Spanish). Uses Google Gemini 2.0 Flash — free tier (1500 req/day, no credit card).
   - Get a key at <https://aistudio.google.com/apikey>.
   - Deploy the function and set the secret:
     ```bash
     supabase functions deploy summarize-week
     supabase secrets set GEMINI_API_KEY=…
     ```
   - The `weekly_insights` table is part of `schema.sql`, so step 2 already created it.

## Production — Vercel

The app deploys to Vercel via the GitHub integration. Vercel ignores the `Dockerfile`s and uses `vercel.json` instead.

1. Import the repo at <https://vercel.com/new>.
2. Vercel auto-detects Vite. `vercel.json` configures the SPA fallback and caching headers.
3. Add the following **Environment Variables** in the Vercel project settings (apply to Production + Preview):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_VAPID_PUBLIC_KEY` *(optional)*
4. Push to `master` → Vercel deploys.

## CI — GitHub Actions

`.github/workflows/ci.yml` runs on every push and PR. It:

1. Builds the dev Docker image
2. Runs `npm run typecheck` and `npm run lint` inside it
3. Builds the production image with the build-time secrets injected

Configure these **Repository Secrets** at *Settings → Secrets and variables → Actions*:

| Secret | Required |
|---|---|
| `VITE_SUPABASE_URL` | yes |
| `VITE_SUPABASE_ANON_KEY` | yes |
| `VITE_VAPID_PUBLIC_KEY` | optional |

## Project structure

```
src/
  components/   # UI by domain (layout, ui, tasks, analytics) — barrel-exported
  hooks/        # useAuth, useTasks, useNotes, useCategories, useAnalytics, useTheme, …
  lib/          # supabase client, env validation, queryClient, push, utils
  pages/        # 10 routed pages, each with its own *.styles.ts
  stores/       # Zustand stores (uiStore, authStore)
  theme/        # MUI light + dark themes
  types/        # Database types (mirrors supabase/schema.sql)
supabase/
  schema.sql    # Tables, RLS, triggers, realtime, cron stub
  functions/
    send-reminders/  # Deno edge function for Web Push reminders
public/
  sw.js         # Push service worker
.github/workflows/ci.yml   # Docker-based CI
Dockerfile        # Production multi-stage (used in CI + prod profile)
Dockerfile.dev    # Dev container (Vite + hot reload)
docker-compose.yml
vercel.json       # SPA rewrites + caching headers for production
```

## Pages

`/auth`, `/onboarding`, `/`, `/tasks`, `/tasks/new`, `/tasks/:id`, `/tasks/:id/edit`, `/calendar`, **`/notes`**, `/analytics`, `/settings`

## Keyboard shortcuts

- **N** — open quick-add modal
- **/** — open search
- **ESC** — close modal/search
