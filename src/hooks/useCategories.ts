import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { queryKeys } from '@/lib/queryClient';
import { useAuthStore } from '@/stores/authStore';
import type { Category } from '@/types/database';

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
      qc.invalidateQueries({ queryKey: queryKeys.tasks.all });
    },
    onError: (e: Error) => toast.error('Delete failed', { description: e.message }),
  });
}
