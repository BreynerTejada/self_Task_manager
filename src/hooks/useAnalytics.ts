import { useQuery } from '@tanstack/react-query';
import { addDays, differenceInCalendarDays, format, parseISO, startOfDay, subDays } from 'date-fns';
import { supabase } from '@/lib/supabase';
import { queryKeys } from '@/lib/queryClient';
import { useAuthStore } from '@/stores/authStore';
import type { Task } from '@/types/database';

export interface WeeklyStat {
  date: string;
  label: string;
  completed: number;
  created: number;
}

export interface CategoryStat {
  name: string;
  value: number;
  color: string;
}

export interface AnalyticsData {
  weekly: WeeklyStat[];
  categories: CategoryStat[];
  currentStreak: number;
  bestStreak: number;
  totalCompleted: number;
}

export function useAnalytics() {
  const userId = useAuthStore((s) => s.user?.id);
  return useQuery<AnalyticsData>({
    queryKey: queryKeys.analytics.weekly(),
    enabled: Boolean(userId),
    queryFn: async () => {
      const since = subDays(startOfDay(new Date()), 90);
      const sinceISO = since.toISOString();

      const [{ data: tasks, error }, { data: cats }] = await Promise.all([
        supabase
          .from('tasks')
          .select('id, status, completed_at, created_at, category_id')
          .gte('created_at', sinceISO),
        supabase.from('categories').select('id, name, color'),
      ]);
      if (error) throw error;

      const all = (tasks ?? []) as Pick<Task, 'id' | 'status' | 'completed_at' | 'created_at' | 'category_id'>[];
      const categories = (cats ?? []) as Array<{ id: string; name: string; color: string }>;
      const catById = new Map(categories.map((c) => [c.id, c]));

      const weekly: WeeklyStat[] = [];
      for (let i = 6; i >= 0; i -= 1) {
        const day = subDays(startOfDay(new Date()), i);
        const key = format(day, 'yyyy-MM-dd');
        weekly.push({
          date: key,
          label: format(day, 'EEE'),
          completed: 0,
          created: 0,
        });
      }
      const weeklyByKey = new Map(weekly.map((w) => [w.date, w]));

      for (const t of all) {
        if (t.created_at) {
          const k = format(parseISO(t.created_at), 'yyyy-MM-dd');
          const w = weeklyByKey.get(k);
          if (w) w.created += 1;
        }
        if (t.status === 'completed' && t.completed_at) {
          const k = format(parseISO(t.completed_at), 'yyyy-MM-dd');
          const w = weeklyByKey.get(k);
          if (w) w.completed += 1;
        }
      }

      const catCounts = new Map<string, number>();
      let uncategorized = 0;
      for (const t of all) {
        if (t.status !== 'completed') continue;
        if (t.category_id) catCounts.set(t.category_id, (catCounts.get(t.category_id) ?? 0) + 1);
        else uncategorized += 1;
      }
      const categoryStats: CategoryStat[] = Array.from(catCounts.entries()).map(([id, count]) => {
        const c = catById.get(id);
        return { name: c?.name ?? 'Unknown', value: count, color: c?.color ?? '#6366f1' };
      });
      if (uncategorized > 0) {
        categoryStats.push({ name: 'Uncategorized', value: uncategorized, color: '#94a3b8' });
      }

      const completedDays = new Set<string>();
      for (const t of all) {
        if (t.status === 'completed' && t.completed_at) {
          completedDays.add(format(parseISO(t.completed_at), 'yyyy-MM-dd'));
        }
      }

      let currentStreak = 0;
      let cursor = startOfDay(new Date());
      while (completedDays.has(format(cursor, 'yyyy-MM-dd'))) {
        currentStreak += 1;
        cursor = addDays(cursor, -1);
      }

      let bestStreak = 0;
      let run = 0;
      const sortedDays = Array.from(completedDays).sort();
      for (let i = 0; i < sortedDays.length; i += 1) {
        if (i === 0) {
          run = 1;
        } else {
          const prev = parseISO(sortedDays[i - 1]);
          const cur = parseISO(sortedDays[i]);
          run = differenceInCalendarDays(cur, prev) === 1 ? run + 1 : 1;
        }
        if (run > bestStreak) bestStreak = run;
      }

      return {
        weekly,
        categories: categoryStats,
        currentStreak,
        bestStreak,
        totalCompleted: all.filter((t) => t.status === 'completed').length,
      };
    },
  });
}
