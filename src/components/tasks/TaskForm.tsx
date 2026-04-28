import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { useCategories } from '@/hooks/useCategories';
import type { Task, TaskPriority, TaskRecurrence, TaskStatus } from '@/types/database';
import * as styles from './TaskForm.styles';

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(2000).optional().or(z.literal('')),
  category_id: z.string().nullable().optional(),
  due_date: z.string().nullable().optional(),
  due_time: z.string().nullable().optional(),
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(['pending', 'in_progress', 'completed']),
  recurrence: z.enum(['none', 'daily', 'weekly', 'monthly']),
  reminder_enabled: z.boolean(),
  reminder_at: z.string().nullable().optional(),
});

export type TaskFormValues = z.infer<typeof schema>;

interface Props {
  initial?: Partial<Task>;
  submitLabel?: string;
  onSubmit: (values: TaskFormValues) => void | Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  compact?: boolean;
}

export function TaskForm({ initial, submitLabel = 'Save task', onSubmit, onCancel, loading, compact }: Props) {
  const { data: categories = [] } = useCategories();

  const {
    control,
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initial?.title ?? '',
      description: initial?.description ?? '',
      category_id: initial?.category_id ?? null,
      due_date: initial?.due_date ?? '',
      due_time: initial?.due_time ?? '',
      priority: (initial?.priority ?? 'medium') as TaskPriority,
      status: (initial?.status ?? 'pending') as TaskStatus,
      recurrence: (initial?.recurrence ?? 'none') as TaskRecurrence,
      reminder_enabled: Boolean(initial?.reminder_at),
      reminder_at: initial?.reminder_at ?? '',
    },
  });

  const reminderEnabled = watch('reminder_enabled');
  const dueDate = watch('due_date');
  const dueTime = watch('due_time');

  useEffect(() => {
    if (reminderEnabled && dueDate && !watch('reminder_at')) {
      const time = dueTime || '09:00';
      setValue('reminder_at', `${dueDate}T${time}:00`);
    }
  }, [reminderEnabled, dueDate, dueTime, setValue, watch]);

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={styles.root}>
      <TextField
        label="Title"
        fullWidth
        autoFocus
        {...register('title')}
        error={Boolean(errors.title)}
        helperText={errors.title?.message}
      />

      {!compact && (
        <TextField
          label="Description"
          fullWidth
          multiline
          minRows={3}
          maxRows={8}
          {...register('description')}
        />
      )}

      <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
        <TextField
          label="Due date"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          {...register('due_date')}
        />
        <TextField
          label="Time"
          type="time"
          fullWidth
          InputLabelProps={{ shrink: true }}
          {...register('due_time')}
        />
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
        <Controller
          name="category_id"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                label="Category"
                value={field.value ?? ''}
                onChange={(e) => field.onChange(e.target.value || null)}
              >
                <MenuItem value=""><em>Uncategorized</em></MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    <Box component="span" sx={{ mr: 1 }}>{cat.icon}</Box>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />

        {!compact && (
          <Controller
            name="recurrence"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Recurrence</InputLabel>
                <Select label="Recurrence" {...field}>
                  <MenuItem value="none">No repeat</MenuItem>
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        )}
      </Stack>

      <Stack gap={1}>
        <Typography variant="overline" sx={{ color: 'text.secondary' }}>Priority</Typography>
        <Controller
          name="priority"
          control={control}
          render={({ field }) => (
            <ToggleButtonGroup
              value={field.value}
              exclusive
              onChange={(_, v) => v && field.onChange(v)}
              fullWidth
              sx={styles.toggleGroup}
            >
              <ToggleButton value="low">Low</ToggleButton>
              <ToggleButton value="medium">Medium</ToggleButton>
              <ToggleButton value="high">High</ToggleButton>
            </ToggleButtonGroup>
          )}
        />
      </Stack>

      {!compact && (
        <>
          <Stack gap={1}>
            <Typography variant="overline" sx={{ color: 'text.secondary' }}>Status</Typography>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <ToggleButtonGroup
                  value={field.value}
                  exclusive
                  onChange={(_, v) => v && field.onChange(v)}
                  fullWidth
                  sx={styles.toggleGroup}
                >
                  <ToggleButton value="pending">Pending</ToggleButton>
                  <ToggleButton value="in_progress">In progress</ToggleButton>
                  <ToggleButton value="completed">Completed</ToggleButton>
                </ToggleButtonGroup>
              )}
            />
          </Stack>

          <Box sx={styles.reminderRow}>
            <Stack>
              <Typography sx={{ fontWeight: 600, fontFamily: '"Plus Jakarta Sans"' }}>
                Reminder notification
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Send a browser push when the task is coming up.
              </Typography>
            </Stack>
            <Controller
              name="reminder_enabled"
              control={control}
              render={({ field }) => (
                <Switch checked={field.value} onChange={(_, v) => field.onChange(v)} />
              )}
            />
          </Box>

          {reminderEnabled && (
            <TextField
              label="Reminder time"
              type="datetime-local"
              fullWidth
              InputLabelProps={{ shrink: true }}
              {...register('reminder_at')}
            />
          )}
        </>
      )}

      <Stack direction="row" gap={1.5} sx={{ mt: 1, justifyContent: 'flex-end' }}>
        {onCancel && (
          <Button type="button" onClick={onCancel} variant="outlined" color="inherit">
            Cancel
          </Button>
        )}
        <Button type="submit" variant="contained" disabled={loading}>
          {submitLabel}
        </Button>
      </Stack>
    </Box>
  );
}
