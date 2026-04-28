import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addDays, format, startOfDay } from 'date-fns';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { queryKeys } from '@/lib/queryClient';
import { todayISO } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore, type TaskFilters } from '@/stores/uiStore';
import type { Task, TaskWithRelations } from '@/types/database';

const PAGE_SIZE = 20;

const SELECT = '*, category:categories(*), tags:tags(*)' as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyFilters(query: any, filters: TaskFilters): any {
  let q = query;
  if (filters.status !== 'all') q = q.eq('status', filters.status);
  if (filters.priority !== 'all') q = q.eq('priority', filters.priority);
  if (filters.categoryIds.length > 0) q = q.in('category_id', filters.categoryIds);
  if (filters.search.trim()) q = q.ilike('title', `%${filters.search.trim()}%`);

  if (filters.dateRange === 'today') {
    q = q.eq('due_date', todayISO());
  } else if (filters.dateRange === 'week') {
    q = q.gte('due_date', todayISO()).lte('due_date', format(addDays(new Date(), 7), 'yyyy-MM-dd'));
  } else if (filters.dateRange === 'month') {
    q = q.gte('due_date', todayISO()).lte('due_date', format(addDays(new Date(), 30), 'yyyy-MM-dd'));
  } else if (filters.dateRange === 'overdue') {
    q = q.lt('due_date', todayISO()).neq('status', 'completed');
  }

  const sortColumn =
    filters.sortBy === 'due' ? 'due_date' :
    filters.sortBy === 'priority' ? 'priority' :
    filters.sortBy === 'created' ? 'created_at' :
    'order_index';
  q = q.order(sortColumn, { ascending: filters.sortDir === 'asc', nullsFirst: false });

  return q;
}

export function useTasksInfinite() {
  const filters = useUIStore((s) => s.filters);
  const userId = useAuthStore((s) => s.user?.id);

  return useInfiniteQuery({
    queryKey: queryKeys.tasks.list(filters as unknown as Record<string, unknown>),
    enabled: Boolean(userId),
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const from = (pageParam as number) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      let q = supabase.from('tasks').select(SELECT).range(from, to);
      q = applyFilters(q, filters);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as unknown as TaskWithRelations[];
    },
    getNextPageParam: (last, pages) => (last.length === PAGE_SIZE ? pages.length : undefined),
  });
}

export function useTodayTasks() {
  const userId = useAuthStore((s) => s.user?.id);
  return useQuery({
    queryKey: queryKeys.tasks.today(),
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select(SELECT)
        .eq('due_date', todayISO())
        .order('due_time', { ascending: true, nullsFirst: false });
      if (error) throw error;
      return (data ?? []) as unknown as TaskWithRelations[];
    },
  });
}

export function useOverdueTasks() {
  const userId = useAuthStore((s) => s.user?.id);
  return useQuery({
    queryKey: queryKeys.tasks.overdue(),
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select(SELECT)
        .lt('due_date', todayISO())
        .neq('status', 'completed')
        .order('due_date', { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as TaskWithRelations[];
    },
  });
}

export function useUpcomingTasks() {
  const userId = useAuthStore((s) => s.user?.id);
  return useQuery({
    queryKey: queryKeys.tasks.upcoming(),
    enabled: Boolean(userId),
    queryFn: async () => {
      const start = format(addDays(startOfDay(new Date()), 1), 'yyyy-MM-dd');
      const end = format(addDays(startOfDay(new Date()), 7), 'yyyy-MM-dd');
      const { data, error } = await supabase
        .from('tasks')
        .select(SELECT)
        .gte('due_date', start)
        .lte('due_date', end)
        .neq('status', 'completed')
        .order('due_date', { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as TaskWithRelations[];
    },
  });
}

export function useTasksInRange(startISO: string, endISO: string) {
  const userId = useAuthStore((s) => s.user?.id);
  return useQuery({
    queryKey: queryKeys.tasks.range(startISO, endISO),
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select(SELECT)
        .gte('due_date', startISO)
        .lte('due_date', endISO);
      if (error) throw error;
      return (data ?? []) as unknown as TaskWithRelations[];
    },
  });
}

export interface CreateTaskInput {
  title: string;
  description?: string | null;
  category_id?: string | null;
  due_date?: string | null;
  due_time?: string | null;
  priority?: Task['priority'];
  status?: Task['status'];
  reminder_at?: string | null;
  recurrence?: Task['recurrence'];
  order_index?: number;
}

export function useCreateTask() {
  const qc = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id);

  return useMutation({
    mutationFn: async (input: CreateTaskInput) => {
      if (!userId) throw new Error('Not authenticated');
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          user_id: userId,
          title: input.title,
          description: input.description ?? null,
          category_id: input.category_id ?? null,
          due_date: input.due_date ?? null,
          due_time: input.due_time ?? null,
          priority: input.priority ?? 'medium',
          status: input.status ?? 'pending',
          reminder_at: input.reminder_at ?? null,
          recurrence: input.recurrence ?? 'none',
          order_index: input.order_index ?? 0,
        })
        .select(SELECT)
        .single();
      if (error) throw error;
      return data as unknown as TaskWithRelations;
    },
    onSuccess: (task) => {
      toast.success('Task added', {
        description: task.title,
      });
      qc.invalidateQueries({ queryKey: queryKeys.tasks.all });
    },
    onError: (e: Error) => toast.error('Could not create task', { description: e.message }),
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Task> }) => {
      const { data, error } = await supabase
        .from('tasks')
        .update(patch)
        .eq('id', id)
        .select(SELECT)
        .single();
      if (error) throw error;
      return data as unknown as TaskWithRelations;
    },
    onMutate: async ({ id, patch }) => {
      await qc.cancelQueries({ queryKey: queryKeys.tasks.all });
      const previous = qc.getQueriesData<TaskWithRelations[]>({ queryKey: queryKeys.tasks.all });
      qc.setQueriesData<TaskWithRelations[] | { pages: TaskWithRelations[][]; pageParams: unknown[] }>(
        { queryKey: queryKeys.tasks.all },
        (old) => {
          if (!old) return old as any;
          if (Array.isArray(old)) {
            return old.map((t) => (t.id === id ? { ...t, ...patch } : t));
          }
          return {
            ...old,
            pages: old.pages.map((page) => page.map((t) => (t.id === id ? { ...t, ...patch } : t))),
          };
        },
      );
      return { previous };
    },
    onError: (err, _vars, ctx) => {
      ctx?.previous?.forEach(([key, data]) => qc.setQueryData(key, data));
      toast.error('Could not update task', { description: (err as Error).message });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.tasks.all });
    },
  });
}

export function useToggleTaskStatus() {
  const update = useUpdateTask();
  return (task: Pick<Task, 'id' | 'status'>) => {
    const next = task.status === 'completed' ? 'pending' : 'completed';
    update.mutate(
      { id: task.id, patch: { status: next } },
      {
        onSuccess: () => {
          toast.success(next === 'completed' ? 'Marked as done' : 'Marked as pending');
        },
      },
    );
  };
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      toast.success('Task deleted');
      qc.invalidateQueries({ queryKey: queryKeys.tasks.all });
    },
    onError: (e: Error) => toast.error('Delete failed', { description: e.message }),
  });
}

export function useReorderTasks() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (orders: Array<{ id: string; order_index: number }>) => {
      const updates = orders.map(({ id, order_index }) =>
        supabase.from('tasks').update({ order_index }).eq('id', id),
      );
      const results = await Promise.all(updates);
      const firstError = results.find((r) => r.error)?.error;
      if (firstError) throw firstError;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.tasks.all }),
  });
}
