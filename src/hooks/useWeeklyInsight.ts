import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { queryKeys } from '@/lib/queryClient';
import { useAuthStore } from '@/stores/authStore';
import type { WeeklyInsight } from '@/types/database';

export function useWeeklyInsight(weekStart: string) {
  const userId = useAuthStore((s) => s.user?.id);
  return useQuery({
    queryKey: queryKeys.weeklyInsight.byWeek(weekStart),
    enabled: Boolean(userId && weekStart),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('weekly_insights')
        .select('*')
        .eq('user_id', userId!)
        .eq('week_start', weekStart)
        .maybeSingle();
      if (error) throw error;
      return (data as WeeklyInsight | null) ?? null;
    },
  });
}

export interface GenerateInsightInput {
  weekStart: string;
  weekEnd: string;
}

export function useGenerateWeeklyInsight() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ weekStart, weekEnd }: GenerateInsightInput) => {
      const { data, error } = await supabase.functions.invoke<WeeklyInsight>('summarize-week', {
        body: { weekStart, weekEnd },
      });
      if (error) throw error;
      if (!data) throw new Error('Empty response from summarize-week');
      return data;
    },
    onSuccess: (data) => {
      qc.setQueryData(queryKeys.weeklyInsight.byWeek(data.week_start), data);
      qc.invalidateQueries({ queryKey: queryKeys.weeklyInsight.all });
      toast.success('Resumen generado');
    },
    onError: (e: Error) =>
      toast.error('No se pudo generar el resumen', { description: e.message }),
  });
}
