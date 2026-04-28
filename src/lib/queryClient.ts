import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

export const queryKeys = {
  tasks: {
    all: ['tasks'] as const,
    list: (filters?: Record<string, unknown>) => ['tasks', 'list', filters ?? {}] as const,
    detail: (id: string) => ['tasks', 'detail', id] as const,
    today: () => ['tasks', 'today'] as const,
    overdue: () => ['tasks', 'overdue'] as const,
    upcoming: () => ['tasks', 'upcoming'] as const,
    range: (start: string, end: string) => ['tasks', 'range', start, end] as const,
  },
  categories: {
    all: ['categories'] as const,
  },
  tags: {
    all: ['tags'] as const,
  },
  analytics: {
    weekly: () => ['analytics', 'weekly'] as const,
    streak: () => ['analytics', 'streak'] as const,
  },
  notes: {
    all: ['notes'] as const,
    list: (search?: string) => ['notes', 'list', search ?? ''] as const,
    detail: (id: string) => ['notes', 'detail', id] as const,
  },
  profile: () => ['profile'] as const,
};
