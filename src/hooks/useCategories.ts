import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { queryKeys } from '@/lib/queryClient';
import { useAuthStore } from '@/stores/authStore';
import type { Category, TaskPriority, TaskStatus } from '@/types/database';

export interface CategoryStatsRow {
  category: Category | null;
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  overdue: number;
  highPriority: number;
  completionRate: number;
}

export function useCategories() {
  const userId = useAuthStore((s) => s.user?.id);
  return useQuery({
    queryKey: queryKeys.categories.all,
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true });
      if (error) throw error;
      return (data ?? []) as Category[];
    },
  });
}

export function useCategoriesWithStats() {
  const userId = useAuthStore((s) => s.user?.id);
  return useQuery<CategoryStatsRow[]>({
    queryKey: queryKeys.categories.stats(),
    enabled: Boolean(userId),
    queryFn: async () => {
      const todayISO = new Date().toISOString().slice(0, 10);
      const [cats, tasks] = await Promise.all([
        supabase.from('categories').select('*').order('created_at', { ascending: true }),
        supabase.from('tasks').select('id, category_id, status, priority, due_date'),
      ]);
      if (cats.error) throw cats.error;
      if (tasks.error) throw tasks.error;

      type Lite = { id: string; category_id: string | null; status: TaskStatus; priority: TaskPriority; due_date: string | null };
      const allTasks = (tasks.data ?? []) as Lite[];
      const categories = (cats.data ?? []) as Category[];

      const buildRow = (cat: Category | null, list: Lite[]): CategoryStatsRow => {
        const total = list.length;
        const completed = list.filter((t) => t.status === 'completed').length;
        const inProgress = list.filter((t) => t.status === 'in_progress').length;
        const pending = list.filter((t) => t.status === 'pending').length;
        const overdue = list.filter(
          (t) => t.status !== 'completed' && t.due_date !== null && t.due_date < todayISO,
        ).length;
        const highPriority = list.filter((t) => t.priority === 'high' && t.status !== 'completed').length;
        const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);
        return { category: cat, total, completed, inProgress, pending, overdue, highPriority, completionRate };
      };

      const rows: CategoryStatsRow[] = categories.map((cat) =>
        buildRow(cat, allTasks.filter((t) => t.category_id === cat.id)),
      );
      const uncategorized = allTasks.filter((t) => t.category_id === null);
      if (uncategorized.length > 0) {
        rows.push(buildRow(null, uncategorized));
      }
      return rows;
    },
  });
}

export interface CreateCategoryInput {
  name: string;
  color: string;
  icon?: string;
}

export function useCreateCategory() {
  const qc = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id);
  return useMutation({
    mutationFn: async (input: CreateCategoryInput) => {
      if (!userId) throw new Error('Not authenticated');
      const { data, error } = await supabase
        .from('categories')
        .insert({ user_id: userId, name: input.name, color: input.color, icon: input.icon ?? '📁' })
        .select()
        .single();
      if (error) throw error;
      return data as Category;
    },
    onSuccess: () => {
      toast.success('Category created');
      qc.invalidateQueries({ queryKey: queryKeys.categories.all });
      qc.invalidateQueries({ queryKey: queryKeys.categories.stats() });
    },
    onError: (e: Error) => toast.error('Could not create category', { description: e.message }),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Category> }) => {
      const { data, error } = await supabase
        .from('categories')
        .update(patch)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Category;
    },
    onSuccess: () => {
      toast.success('Category updated');
      qc.invalidateQueries({ queryKey: queryKeys.categories.all });
      qc.invalidateQueries({ queryKey: queryKeys.categories.stats() });
    },
    onError: (e: Error) => toast.error('Update failed', { description: e.message }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Category deleted');
      qc.invalidateQueries({ queryKey: queryKeys.categories.all });
      qc.invalidateQueries({ queryKey: queryKeys.categories.stats() });
      qc.invalidateQueries({ queryKey: queryKeys.tasks.all });
    },
    onError: (e: Error) => toast.error('Delete failed', { description: e.message }),
  });
}
