import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { queryKeys } from '@/lib/queryClient';
import { useAuthStore } from '@/stores/authStore';
import type { Note } from '@/types/database';

export function useNotes(search = '') {
  const userId = useAuthStore((s) => s.user?.id);
  return useQuery({
    queryKey: queryKeys.notes.list(search),
    enabled: Boolean(userId),
    queryFn: async () => {
      let q = supabase
        .from('notes')
        .select('*')
        .order('pinned', { ascending: false })
        .order('updated_at', { ascending: false });
      const term = search.trim();
      if (term) q = q.or(`title.ilike.%${term}%,body.ilike.%${term}%`);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Note[];
    },
  });
}

export function useNote(id: string | undefined) {
  return useQuery({
    queryKey: id ? queryKeys.notes.detail(id) : ['notes', 'detail', 'none'],
    enabled: Boolean(id),
    queryFn: async () => {
      const { data, error } = await supabase.from('notes').select('*').eq('id', id!).single();
      if (error) throw error;
      return data as Note;
    },
  });
}

export interface CreateNoteInput {
  title?: string;
  body?: string;
  color?: string;
  pinned?: boolean;
}

export function useCreateNote() {
  const qc = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id);
  return useMutation({
    mutationFn: async (input: CreateNoteInput = {}) => {
      if (!userId) throw new Error('Not authenticated');
      const { data, error } = await supabase
        .from('notes')
        .insert({
          user_id: userId,
          title: input.title ?? '',
          body: input.body ?? '',
          color: input.color ?? '#fef3c7',
          pinned: input.pinned ?? false,
        })
        .select('*')
        .single();
      if (error) throw error;
      return data as Note;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.notes.all });
    },
    onError: (e: Error) => toast.error('Could not create note', { description: e.message }),
  });
}

export function useUpdateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Note> }) => {
      const { data, error } = await supabase.from('notes').update(patch).eq('id', id).select('*').single();
      if (error) throw error;
      return data as Note;
    },
    onMutate: async ({ id, patch }) => {
      await qc.cancelQueries({ queryKey: queryKeys.notes.all });
      const previous = qc.getQueriesData<Note[]>({ queryKey: queryKeys.notes.all });
      qc.setQueriesData<Note[]>({ queryKey: queryKeys.notes.all }, (old) =>
        old?.map((n) => (n.id === id ? { ...n, ...patch } : n)),
      );
      return { previous };
    },
    onError: (err, _vars, ctx) => {
      ctx?.previous?.forEach(([key, data]) => qc.setQueryData(key, data));
      toast.error('Could not update note', { description: (err as Error).message });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.notes.all });
    },
  });
}

export function useDeleteNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('notes').delete().eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      toast.success('Note deleted');
      qc.invalidateQueries({ queryKey: queryKeys.notes.all });
    },
    onError: (e: Error) => toast.error('Delete failed', { description: e.message }),
  });
}
