import { Dialog, InputBase, Stack, Typography, Box } from '@mui/material';
import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { useUIStore } from '@/stores/uiStore';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import type { Task } from '@/types/database';
import * as styles from './CommandSearch.styles';

export function CommandSearch() {
  const open = useUIStore((s) => s.searchOpen);
  const close = useUIStore((s) => s.closeSearch);
  const userId = useAuthStore((s) => s.user?.id);
  const [q, setQ] = useState('');
  const [results, setResults] = useState<Task[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) {
      setQ('');
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    if (!q.trim() || !userId) {
      setResults([]);
      return;
    }
    let active = true;
    const t = setTimeout(async () => {
      const { data } = await supabase
        .from('tasks')
        .select('id, title, due_date, priority, status, category_id, user_id, description, due_time, reminder_at, recurrence, order_index, completed_at, created_at, updated_at')
        .ilike('title', `%${q.trim()}%`)
        .limit(10);
      if (active) setResults((data ?? []) as Task[]);
    }, 180);
    return () => {
      active = false;
      clearTimeout(t);
    };
  }, [q, userId]);

  const hint = useMemo(
    () => (q ? (results.length === 0 ? 'No matches' : `${results.length} ${results.length === 1 ? 'result' : 'results'}`) : 'Type to search…'),
    [q, results.length],
  );

  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth="sm" PaperProps={{ sx: styles.paper }}>
      <Stack sx={styles.input}>
        <SearchRoundedIcon sx={{ color: 'text.secondary' }} />
        <InputBase
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search tasks by title…"
          fullWidth
          sx={{ fontSize: 16, fontFamily: '"Plus Jakarta Sans"' }}
        />
        <Box sx={styles.kbd}>ESC</Box>
      </Stack>
      <Box sx={styles.results}>
        {results.length === 0 ? (
          <Typography sx={styles.hint}>{hint}</Typography>
        ) : (
          <Stack>
            {results.map((r) => (
              <Box
                key={r.id}
                component="button"
                sx={styles.row}
                onClick={() => {
                  navigate(`/tasks/${r.id}`);
                  close();
                }}
              >
                <Typography sx={{ fontWeight: 600, fontFamily: '"Plus Jakarta Sans"', flex: 1 }} noWrap>
                  {r.title}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {r.due_date ?? 'no date'}
                </Typography>
              </Box>
            ))}
          </Stack>
        )}
      </Box>
    </Dialog>
  );
}
