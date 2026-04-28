import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TaskPriority, TaskStatus } from '@/types/database';

export type ThemeMode = 'light' | 'dark' | 'system';
export type SortBy = 'due' | 'priority' | 'created' | 'manual';

export interface TaskFilters {
  search: string;
  status: TaskStatus | 'all';
  priority: TaskPriority | 'all';
  categoryIds: string[];
  dateRange: 'all' | 'today' | 'week' | 'month' | 'overdue';
  sortBy: SortBy;
  sortDir: 'asc' | 'desc';
}

interface UIState {
  themeMode: ThemeMode;
  sidebarCollapsed: boolean;
  quickAddOpen: boolean;
  searchOpen: boolean;
  filters: TaskFilters;
  setThemeMode: (m: ThemeMode) => void;
  toggleSidebar: () => void;
  openQuickAdd: () => void;
  closeQuickAdd: () => void;
  toggleQuickAdd: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  setFilters: (patch: Partial<TaskFilters>) => void;
  resetFilters: () => void;
}

export const DEFAULT_FILTERS: TaskFilters = {
  search: '',
  status: 'all',
  priority: 'all',
  categoryIds: [],
  dateRange: 'all',
  sortBy: 'due',
  sortDir: 'asc',
};

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      themeMode: 'system',
      sidebarCollapsed: false,
      quickAddOpen: false,
      searchOpen: false,
      filters: DEFAULT_FILTERS,
      setThemeMode: (themeMode) => set({ themeMode }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      openQuickAdd: () => set({ quickAddOpen: true }),
      closeQuickAdd: () => set({ quickAddOpen: false }),
      toggleQuickAdd: () => set((s) => ({ quickAddOpen: !s.quickAddOpen })),
      openSearch: () => set({ searchOpen: true }),
      closeSearch: () => set({ searchOpen: false }),
      setFilters: (patch) => set((s) => ({ filters: { ...s.filters, ...patch } })),
      resetFilters: () => set({ filters: DEFAULT_FILTERS }),
    }),
    {
      name: 'tessera.ui',
      partialize: (s) => ({
        themeMode: s.themeMode,
        sidebarCollapsed: s.sidebarCollapsed,
        filters: s.filters,
      }),
    },
  ),
);
