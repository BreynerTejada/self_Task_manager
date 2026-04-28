import { Box, Stack, Typography } from '@mui/material';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import EventRoundedIcon from '@mui/icons-material/EventRounded';
import { useNavigate } from 'react-router-dom';
import type { MouseEvent } from 'react';
import { PriorityBadge } from './PriorityBadge';
import { useToggleTaskStatus } from '@/hooks/useTasks';
import { formatDueDate, isOverdue } from '@/lib/utils';
import type { TaskWithRelations } from '@/types/database';
import * as styles from './TaskCard.styles';

interface Props {
  task: TaskWithRelations;
  onClick?: (task: TaskWithRelations) => void;
  hideCategory?: boolean;
}

export function TaskCard({ task, onClick, hideCategory }: Props) {
  const toggle = useToggleTaskStatus();
  const navigate = useNavigate();
  const completed = task.status === 'completed';
  const overdue = isOverdue(task);
  const accent = task.category?.color ?? '#6366f1';

  const handleToggle = (e: MouseEvent) => {
    e.stopPropagation();
    toggle(task);
  };

  const handleCardClick = () => {
    if (onClick) onClick(task);
    else navigate(`/tasks/${task.id}`);
  };

  return (
    <Box sx={styles.root(overdue, completed)} onClick={handleCardClick}>
      <Box
        role="checkbox"
        aria-checked={completed}
        tabIndex={0}
        sx={styles.checkbox(completed, accent)}
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle(e as unknown as MouseEvent);
          }
        }}
      >
        <CheckRoundedIcon />
      </Box>

      <Stack sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={styles.title(completed)}>{task.title}</Typography>
        {task.description && (
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: 13,
              mt: 0.25,
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {task.description}
          </Typography>
        )}

        <Box sx={styles.meta}>
          {task.due_date && (
            <Typography sx={styles.dueChip(overdue)}>
              <EventRoundedIcon /> {formatDueDate(task)}
            </Typography>
          )}
          {!hideCategory && task.category && (
            <Box sx={styles.categoryChip(task.category.color)}>
              <span>{task.category.icon}</span> {task.category.name}
            </Box>
          )}
          <PriorityBadge priority={task.priority} />
        </Box>
      </Stack>
    </Box>
  );
}
