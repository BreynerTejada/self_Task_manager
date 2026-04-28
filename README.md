# Tessera — personal task management

A clean, opinionated task & calendar workspace. React 18 + Vite + TypeScript on the front, Supabase (Postgres + Auth + Realtime + Edge Functions) on the back.

> "Small tiles, large patterns." Every task is a tessera in your week's mosaic.

## Stack

- **React 18 + Vite + TypeScript**
- **MUI v6** with `sx`, styles split into `*.styles.ts` modules and imported as `import * as styles from './X.styles'`
- **Supabase** for auth (email/password + Google OAuth), Postgres with RLS, Realtime subscriptions, Edge Functions
- **TanStack Query** for server state with optimistic updates
- **Zustand** for global UI state (theme, sidebar, filters) — persisted to localStorage
- **FullCalendar** for monthly/weekly views with drag-to-reschedule
- **React Hook Form + Zod** for forms
- **date-fns** everywhere
- **Framer Motion** for page transitions and stagger reveals
- **Sonner** for toasts
- **Recharts** for analytics

## Getting started

1. Copy `.env.example` to `.env` and fill in your Supabase project credentials.
2. In Supabase SQL editor, run [supabase/schema.sql](supabase/schema.sql) to create the tables, RLS policies, and triggers.
3. Install and run:

```bash
npm install
npm run dev
```

4. (Optional) Deploy the reminder edge function:

```bash
supabase functions deploy send-reminders
supabase secrets set VAPID_PUBLIC_KEY=… VAPID_PRIVATE_KEY=… VAPID_SUBJECT="mailto:you@example.com"
```

Then schedule it via `pg_cron` (the SQL is commented at the bottom of `schema.sql`).

## Project structure

```
src/
  components/     # All UI, organized by domain — barrel-exported
    layout/       # Sidebar, BottomTabBar, TopBar, AppLayout
    ui/           # EmptyState, Skeletons, ErrorBoundary, CommandSearch
    tasks/        # TaskCard, TaskList, TaskForm, QuickAddModal, Filters
    analytics/    # ProgressRing, WeeklyChart, CategoryPieChart
  hooks/          # useAuth, useTasks, useTask, useCategories, useAnalytics, useTheme,
                  # useRealtimeTasks, useKeyboardShortcuts
  lib/            # supabase client singleton, queryClient, push helpers, utils
  pages/          # 9 routed pages, each with its own *.styles.ts
  stores/         # Zustand stores (uiStore, authStore)
  theme/          # MUI light + dark themes
  types/          # Database types (mirrors supabase/schema.sql)
supabase/
  schema.sql      # Tables, RLS, triggers, realtime, cron stub
  functions/
    send-reminders/  # Deno edge function for Web Push reminders
public/
  sw.js           # Push service worker
```

## Keyboard shortcuts

- **N** — open quick-add modal
- **/** — open search
- **ESC** — close modal/search

## What's implemented

- 9 routed pages: `/auth`, `/onboarding`, `/`, `/tasks`, `/tasks/new`, `/tasks/:id`, `/tasks/:id/edit`, `/calendar`, `/analytics`, `/settings`
- Email/password sign-in & sign-up + Google OAuth
- Three-step onboarding (welcome → category → first task)
- Dashboard with hero, progress ring, today / overdue / upcoming sections
- Task list with sidebar filters (status / priority / category / date range), search, sort, infinite scroll (page size 20)
- Calendar view with month/week toggle, click-to-create, drag-to-reschedule
- Quick-add modal with floating FAB on mobile and N shortcut globally
- Settings: profile, categories CRUD, theme (light/dark/system), notification toggle
- Analytics: weekly bar chart, category pie chart, current & best streaks
- Realtime sync via Supabase channels
- Push notifications via service worker + edge function
- RLS on every table — users can only CRUD their own data
- Light/dark theme with system preference detection, persisted in Zustand
- Empty states with custom inline SVG illustrations
- Loading skeletons (no spinners)
- Error boundaries on each route
- Optimistic updates with rollback on failure
