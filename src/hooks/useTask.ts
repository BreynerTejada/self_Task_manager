import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { queryKeys } from '@/lib/queryClient';
import type { TaskWithRelations } from '@/types/database';

export function useTask(id: string | undefined) {
  return useQuery({
    queryKey: id ? queryKeys.tasks.detail(id) : ['tasks', 'detail', 'none'],
    enabled: Boolean(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*, category:categories(*), tags:tags(*)')
        .eq('id', id!)
        .single();
      if (error) throw error;
      return data as unknown as TaskWithRelations;
    },
  });
}
