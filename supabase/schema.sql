-- ============================================================================
-- Tessera — Personal Task Management
-- Schema, RLS, triggers, helper functions
-- ============================================================================

-- Required extensions ---------------------------------------------------------
create extension if not exists "uuid-ossp";
create extension if not exists "pg_cron";

-- Enums -----------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'task_priority') then
    create type task_priority as enum ('low', 'medium', 'high');
  end if;
  if not exists (select 1 from pg_type where typname = 'task_status') then
    create type task_status as enum ('pending', 'in_progress', 'completed');
  end if;
  if not exists (select 1 from pg_type where typname = 'task_recurrence') then
    create type task_recurrence as enum ('none', 'daily', 'weekly', 'monthly');
  end if;
end$$;

-- Tables ----------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  timezone text default 'UTC',
  notifications_enabled boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  color text not null default '#6366f1',
  icon text default '📁',
  created_at timestamptz default now()
);
create index if not exists categories_user_id_idx on public.categories(user_id);

create table if not exists public.tags (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  color text default '#94a3b8',
  created_at timestamptz default now(),
  unique (user_id, name)
);
create index if not exists tags_user_id_idx on public.tags(user_id);

create table if not exists public.tasks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  title text not null,
  description text,
  due_date date,
  due_time time,
  priority task_priority not null default 'medium',
  status task_status not null default 'pending',
  reminder_at timestamptz,
  recurrence task_recurrence not null default 'none',
  order_index integer not null default 0,
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists tasks_user_id_idx on public.tasks(user_id);
create index if not exists tasks_due_date_idx on public.tasks(user_id, due_date);
create index if not exists tasks_status_idx on public.tasks(user_id, status);
create index if not exists tasks_reminder_at_idx on public.tasks(reminder_at) where reminder_at is not null;

create table if not exists public.task_tags (
  task_id uuid not null references public.tasks(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  primary key (task_id, tag_id)
);

create table if not exists public.push_subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  user_agent text,
  created_at timestamptz default now()
);
create index if not exists push_subs_user_id_idx on public.push_subscriptions(user_id);

-- Triggers --------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tasks_touch on public.tasks;
create trigger tasks_touch
before update on public.tasks
for each row execute function public.touch_updated_at();

drop trigger if exists profiles_touch on public.profiles;
create trigger profiles_touch
before update on public.profiles
for each row execute function public.touch_updated_at();

-- Auto-stamp completed_at when status flips to/from completed
create or replace function public.stamp_completed_at()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'completed' and (old.status is distinct from 'completed') then
    new.completed_at = now();
  elsif new.status <> 'completed' then
    new.completed_at = null;
  end if;
  return new;
end;
$$;

drop trigger if exists tasks_stamp_completed on public.tasks;
create trigger tasks_stamp_completed
before update on public.tasks
for each row execute function public.stamp_completed_at();

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Row Level Security ----------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.tasks enable row level security;
alter table public.task_tags enable row level security;
alter table public.push_subscriptions enable row level security;

-- profiles: users may select/update their own profile
drop policy if exists "profiles select own" on public.profiles;
create policy "profiles select own" on public.profiles for select using (auth.uid() = id);
drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles for update using (auth.uid() = id);
drop policy if exists "profiles insert own" on public.profiles;
create policy "profiles insert own" on public.profiles for insert with check (auth.uid() = id);

-- categories
drop policy if exists "categories owner all" on public.categories;
create policy "categories owner all" on public.categories
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- tags
drop policy if exists "tags owner all" on public.tags;
create policy "tags owner all" on public.tags
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- tasks
drop policy if exists "tasks owner all" on public.tasks;
create policy "tasks owner all" on public.tasks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- task_tags: rely on parent task ownership
drop policy if exists "task_tags via task" on public.task_tags;
create policy "task_tags via task" on public.task_tags
  for all
  using (exists (select 1 from public.tasks t where t.id = task_id and t.user_id = auth.uid()))
  with check (exists (select 1 from public.tasks t where t.id = task_id and t.user_id = auth.uid()));

-- push_subscriptions
drop policy if exists "push_subs owner all" on public.push_subscriptions;
create policy "push_subs owner all" on public.push_subscriptions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Realtime --------------------------------------------------------------------
alter publication supabase_realtime add table public.tasks;
alter publication supabase_realtime add table public.categories;

-- Cron job to fire reminders edge function ------------------------------------
-- The function `send-reminders` is deployed separately. Schedule it every minute.
-- (Adjust `<project-ref>` and the service-role token via Vault when deploying.)
-- select cron.schedule(
--   'task-reminders',
--   '* * * * *',
--   $$ select net.http_post(
--        url := 'https://<project-ref>.supabase.co/functions/v1/send-reminders',
--        headers := jsonb_build_object('Authorization', 'Bearer ' || current_setting('app.cron_token', true))
--      ); $$
-- );
