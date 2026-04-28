import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { useTask } from '@/hooks/useTask';
import { useDeleteTask, useToggleTaskStatus } from '@/hooks/useTasks';
import { PriorityBadge } from '@/components/tasks';
import { CardSkeleton } from '@/components/ui';
import { formatDueDate, isOverdue, relativeTime } from '@/lib/utils';
import * as styles from './TaskDetailPage.styles';

export function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: task, isLoading, error } = useTask(id);
  const toggle = useToggleTaskStatus();
  const del = useDeleteTask();
  const navigate = useNavigate();

  if (isLoading) return <CardSkeleton height={320} />;
  if (error || !task) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h4">Task not found.</Typography>
        <Button onClick={() => navigate('/tasks')} sx={{ mt: 2 }}>
          Back to tasks
        </Button>
      </Box>
    );
  }

  const overdue = isOverdue(task);
  const completed = task.status === 'completed';
  const accent = task.category?.color ?? '#6366f1';

  return (
    <Box sx={styles.root}>
      <Box sx={styles.header(accent)}>
        <Stack gap={0.75}>
          <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.8)' }}>
            {task.category ? `${task.category.icon} ${task.category.name}` : 'Uncategorized'}
          </Typography>
          <Typography sx={styles.headerTitle}>{task.title}</Typography>
          <Typography sx={styles.headerSubtitle}>
            {formatDueDate(task)} · created {relativeTime(task.created_at)}
          </Typography>
        </Stack>
        <Stack direction="row" gap={1} sx={{ flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            color="inherit"
            startIcon={completed ? <RestartAltRoundedIcon /> : <CheckCircleRoundedIcon />}
            onClick={() => toggle(task)}
            sx={styles.headerBtn}
          >
            {completed ? 'Reopen task' : 'Mark complete'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<EditRoundedIcon />}
            component={Link}
            to={`/tasks/${task.id}/edit`}
            sx={styles.headerBtnGhost}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            startIcon={<DeleteRoundedIcon />}
            onClick={() => {
              if (window.confirm('Delete this task?')) {
                del.mutate(task.id, { onSuccess: () => navigate('/tasks') });
              }
            }}
            sx={styles.headerBtnGhost}
          >
            Delete
          </Button>
        </Stack>
      </Box>

      <Box sx={styles.metaGrid}>
        <Meta label="Status">
          <Chip
            label={task.status.replace('_', ' ')}
            sx={{
              fontWeight: 600,
              textTransform: 'capitalize',
              backgroundColor: completed ? 'success.main' : overdue ? 'error.main' : 'primary.main',
              color: 'white',
            }}
          />
        </Meta>
        <Meta label="Priority">
          <PriorityBadge priority={task.priority} size="md" />
        </Meta>
        <Meta label="Recurrence">
          <Typography sx={{ textTransform: 'capitalize' }}>{task.recurrence}</Typography>
        </Meta>
        <Meta label="Reminder">
          <Typography>
            {task.reminder_at ? format(parseISO(task.reminder_at), "MMM d 'at' p") : 'No reminder'}
          </Typography>
        </Meta>
      </Box>

      <Box sx={styles.descriptionCard}>
        <Typography variant="overline" sx={{ color: 'text.secondary', mb: 1.5, display: 'block' }}>
          Description
        </Typography>
        {task.description ? (
          <Typography sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{task.description}</Typography>
        ) : (
          <Typography sx={{ color: 'text.disabled', fontStyle: 'italic' }}>
            No description yet — add some context.
          </Typography>
        )}
      </Box>

      <Stack direction="row" gap={2} sx={{ color: 'text.disabled', fontFamily: '"JetBrains Mono"', fontSize: 11.5 }}>
        <span>id: {task.id.slice(0, 8)}…</span>
        <span>updated: {relativeTime(task.updated_at)}</span>
      </Stack>
    </Box>
  );
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Box sx={styles.metaCard}>
      <Typography variant="overline" sx={{ color: 'text.disabled' }}>{label}</Typography>
      <Box sx={{ mt: 0.5 }}>{children}</Box>
    </Box>
  );
}
