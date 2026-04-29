-- ============================================================================
-- Security hardening + RLS performance optimization
-- - Pin search_path on trigger / definer functions
-- - Lock down handle_new_user (only the auth trigger should call it)
-- - Wrap auth.uid() with (select ...) so RLS is evaluated once per query
-- - Cover unindexed foreign keys
-- ============================================================================

alter function public.touch_updated_at()  set search_path = public, pg_temp;
alter function public.stamp_completed_at() set search_path = public, pg_temp;
alter function public.handle_new_user()    set search_path = public, pg_temp;

revoke execute on function public.handle_new_user() from public;
revoke execute on function public.handle_new_user() from anon;
revoke execute on function public.handle_new_user() from authenticated;

-- profiles
drop policy if exists "profiles select own" on public.profiles;
create policy "profiles select own" on public.profiles
  for select using ((select auth.uid()) = id);

drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles
  for update using ((select auth.uid()) = id);

drop policy if exists "profiles insert own" on public.profiles;
create policy "profiles insert own" on public.profiles
  for insert with check ((select auth.uid()) = id);

-- categories
drop policy if exists "categories owner all" on public.categories;
create policy "categories owner all" on public.categories
  for all
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- tags
drop policy if exists "tags owner all" on public.tags;
create policy "tags owner all" on public.tags
  for all
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- tasks
drop policy if exists "tasks owner all" on public.tasks;
create policy "tasks owner all" on public.tasks
  for all
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- task_tags
drop policy if exists "task_tags via task" on public.task_tags;
create policy "task_tags via task" on public.task_tags
  for all
  using (
    exists (
      select 1 from public.tasks t
      where t.id = task_id and t.user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.tasks t
      where t.id = task_id and t.user_id = (select auth.uid())
    )
  );

-- push_subscriptions
drop policy if exists "push_subs owner all" on public.push_subscriptions;
create policy "push_subs owner all" on public.push_subscriptions
  for all
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- notes
drop policy if exists "notes owner all" on public.notes;
create policy "notes owner all" on public.notes
  for all
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- weekly_insights
drop policy if exists "weekly_insights owner all" on public.weekly_insights;
create policy "weekly_insights owner all" on public.weekly_insights
  for all
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create index if not exists tasks_category_id_idx on public.tasks(category_id);
create index if not exists task_tags_tag_id_idx  on public.task_tags(tag_id);
