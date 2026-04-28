import { Box, Stack, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { TaskForm, type TaskFormValues } from '@/components/tasks';
import { CardSkeleton, SectionHeader } from '@/components/ui';
import { useTask } from '@/hooks/useTask';
import { useCreateTask, useUpdateTask } from '@/hooks/useTasks';

export function TaskEditPage({ mode }: { mode: 'create' | 'edit' }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: task, isLoading } = useTask(mode === 'edit' ? id : undefined);
  const create = useCreateTask();
  const update = useUpdateTask();

  if (mode === 'edit' && isLoading) return <CardSkeleton height={400} />;

  const onSubmit = async (values: TaskFormValues) => {
    const reminder = values.reminder_enabled ? values.reminder_at || null : null;
    const payload = {
      title: values.title,
      description: values.description ?? null,
      category_id: values.category_id ?? null,
      due_date: values.due_date || null,
      due_time: values.due_time || null,
      priority: values.priority,
      status: values.status,
      recurrence: values.recurrence,
      reminder_at: reminder,
    };

    if (mode === 'create') {
      const created = await create.mutateAsync(payload);
      navigate(`/tasks/${created.id}`);
    } else if (id) {
      await update.mutateAsync({ id, patch: payload });
      navigate(`/tasks/${id}`);
    }
  };

  return (
    <Box sx={{ maxWidth: 720, marginInline: 'auto' }}>
      <SectionHeader
        eyebrow={mode === 'create' ? 'New task' : 'Edit task'}
        title={mode === 'create' ? 'Capture it before it slips.' : task?.title ?? 'Edit task'}
        description={
          mode === 'create'
            ? 'Title is the only required field. Everything else is optional context.'
            : 'Tweak the details and save.'
        }
      />

      <Box
        sx={{
          paddingInline: { xs: 2.5, md: 4 },
          paddingBlock: { xs: 3, md: 4 },
          borderRadius: '20px',
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <TaskForm
          initial={task ?? undefined}
          submitLabel={mode === 'create' ? 'Create task' : 'Save changes'}
          onSubmit={onSubmit}
          onCancel={() => navigate(-1)}
          loading={create.isPending || update.isPending}
        />
      </Box>

      {mode === 'edit' && task && (
        <Stack direction="row" gap={2} sx={{ mt: 2, color: 'text.disabled', fontFamily: '"JetBrains Mono"', fontSize: 11 }}>
          <Typography variant="caption">id: {task.id.slice(0, 8)}…</Typography>
        </Stack>
      )}
    </Box>
  );
}
