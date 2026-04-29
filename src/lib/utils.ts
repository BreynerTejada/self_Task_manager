import {
  endOfWeek,
  format,
  formatDistanceToNowStrict,
  isToday,
  isTomorrow,
  isYesterday,
  parseISO,
  startOfDay,
  startOfWeek,
} from 'date-fns';
import type { Task, TaskPriority } from '@/types/database';

export const PRIORITY_COLORS: Record<TaskPriority, { bg: string; fg: string; ring: string }> = {
  low: { bg: '#ecfeff', fg: '#0891b2', ring: '#a5f3fc' },
  medium: { bg: '#fff7ed', fg: '#c2410c', ring: '#fed7aa' },
  high: { bg: '#fef2f2', fg: '#dc2626', ring: '#fecaca' },
};

export const PRIORITY_DARK: Record<TaskPriority, { bg: string; fg: string; ring: string }> = {
  low: { bg: 'rgba(34,211,238,0.12)', fg: '#67e8f9', ring: 'rgba(34,211,238,0.35)' },
  medium: { bg: 'rgba(251,146,60,0.14)', fg: '#fdba74', ring: 'rgba(251,146,60,0.4)' },
  high: { bg: 'rgba(244,63,94,0.16)', fg: '#fda4af', ring: 'rgba(244,63,94,0.45)' },
};

export const DEFAULT_CATEGORY_COLORS = [
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#f43f5e',
  '#f97316',
  '#f59e0b',
  '#10b981',
  '#14b8a6',
  '#06b6d4',
  '#0ea5e9',
];

export const DEFAULT_CATEGORY_ICONS = [
  '💼', '🌱', '💪', '📚', '🏠', '✈️', '🎨', '🎯', '💡', '🔧', '🍳', '🧘',
];

export function formatDueDate(task: Pick<Task, 'due_date' | 'due_time'>): string {
  if (!task.due_date) return 'No due date';
  const dt = parseISO(task.due_date);
  let prefix: string;
  if (isToday(dt)) prefix = 'Today';
  else if (isTomorrow(dt)) prefix = 'Tomorrow';
  else if (isYesterday(dt)) prefix = 'Yesterday';
  else prefix = format(dt, 'EEE, MMM d');
  return task.due_time ? `${prefix} · ${task.due_time.slice(0, 5)}` : prefix;
}

export function relativeTime(iso: string | null | undefined): string {
  if (!iso) return '';
  return formatDistanceToNowStrict(parseISO(iso), { addSuffix: true });
}

export function isOverdue(task: Pick<Task, 'due_date' | 'status'>): boolean {
  if (!task.due_date || task.status === 'completed') return false;
  return parseISO(task.due_date) < startOfDay(new Date());
}

export function todayISO(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function currentWeekRange(): { weekStart: string; weekEnd: string } {
  const now = new Date();
  return {
    weekStart: format(startOfWeek(now, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
    weekEnd: format(endOfWeek(now, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
  };
}

export function urlBase64ToUint8Array(base64: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const data = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(data);
  const buffer = new ArrayBuffer(raw.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < raw.length; i += 1) view[i] = raw.charCodeAt(i);
  return buffer;
}

export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}
