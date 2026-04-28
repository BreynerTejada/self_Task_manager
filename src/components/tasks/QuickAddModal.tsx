import {
  Box,
  Button,
  Dialog,
  FormControl,
  InputBase,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useUIStore } from '@/stores/uiStore';
import { useCategories } from '@/hooks/useCategories';
import { useCreateTask } from '@/hooks/useTasks';
import type { TaskPriority } from '@/types/database';
import * as styles from './QuickAddModal.styles';

export function QuickAddModal() {
  const open = useUIStore((s) => s.quickAddOpen);
  const close = useUIStore((s) => s.closeQuickAdd);
  const { data: categories = [] } = useCategories();
  const create = useCreateTask();

  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [priority, setPriority] = useState<TaskPriority>('medium');

  useEffect(() => {
    if (open) {
      setTitle('');
      setDueDate('');
      setCategoryId('');
      setPriority('medium');
    }
  }, [open]);

  const submit = async () => {
    if (!title.trim()) return;
    const created = await create.mutateAsync({
      title: title.trim(),
      due_date: dueDate || null,
      category_id: categoryId || null,
      priority,
    });
    close();
    toast(created.title, {
      description: 'Task added',
      action: {
        label: 'Add details',
        onClick: () => window.location.assign(`/tasks/${created.id}/edit`),
      },
    });
  };

  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth="sm" PaperProps={{ sx: styles.paper }}>
      <Box sx={styles.headerRow}>
        <Stack>
          <Typography sx={styles.title}>Quick add</Typography>
          <Typography sx={styles.subtitle}>Press Enter to save · ESC to dismiss</Typography>
        </Stack>
        <Box component="button" onClick={close} sx={styles.closeBtn} aria-label="Close">
          <CloseRoundedIcon fontSize="small" />
        </Box>
      </Box>

      <Box sx={styles.body}>
        <InputBase
          placeholder="What needs to get done?"
          autoFocus
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              void submit();
            }
          }}
          sx={styles.titleInput}
        />

        <Stack direction={{ xs: 'column', sm: 'row' }} gap={1.5}>
          <InputBase
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            sx={styles.smallInput}
            inputProps={{ 'aria-label': 'Due date' }}
          />

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value as string)}
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.id}>{c.icon} {c.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              label="Priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Box>

      <Stack direction="row" sx={styles.footer}>
        <Typography variant="caption" sx={{ color: 'text.secondary', flex: 1 }}>
          Need more options?{' '}
          <Box
            component={Link}
            to="/tasks/new"
            onClick={close}
            sx={{ color: 'primary.main', fontWeight: 600, textDecoration: 'none' }}
          >
            Open full editor →
          </Box>
        </Typography>
        <Button onClick={submit} disabled={!title.trim() || create.isPending} variant="contained">
          Add task
        </Button>
      </Stack>
    </Dialog>
  );
}
