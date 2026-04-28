import { Box, Button, Stack, Typography } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useEffect } from 'react';
import { TaskFilters, TaskList } from '@/components/tasks';
import { EmptyState, SectionHeader, TaskListSkeleton } from '@/components/ui';
import { useTasksInfinite } from '@/hooks/useTasks';
import { useUIStore } from '@/stores/uiStore';
import * as styles from './TasksPage.styles';

export function TasksPage() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useTasksInfinite();
  const openQuickAdd = useUIStore((s) => s.openQuickAdd);
  const flat = data?.pages.flat() ?? [];

  useEffect(() => {
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 600 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        void fetchNextPage();
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <Box>
      <SectionHeader
        eyebrow="All tasks"
        title="Everything in one place."
        description="Filter, sort, and zero in. Reordering, search, and saved views all live here."
        trailing={
          <Button onClick={openQuickAdd} variant="contained" startIcon={<AddRoundedIcon />}>
            Add task
          </Button>
        }
      />
      <Box sx={styles.layout}>
        <TaskFilters />
        <Box sx={styles.list}>
          {isLoading ? (
            <TaskListSkeleton rows={6} />
          ) : flat.length === 0 ? (
            <EmptyState
              illustration="search"
              title="No tasks match these filters."
              description="Try clearing some filters or add a new task to get started."
              action={
                <Button onClick={openQuickAdd} variant="contained" startIcon={<AddRoundedIcon />}>
                  Add task
                </Button>
              }
            />
          ) : (
            <Stack gap={1.25}>
              <TaskList tasks={flat} />
              {hasNextPage && (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Button onClick={() => void fetchNextPage()} disabled={isFetchingNextPage}>
                    {isFetchingNextPage ? 'Loading…' : 'Load more'}
                  </Button>
                </Box>
              )}
              {!hasNextPage && flat.length >= 20 && (
                <Typography variant="caption" sx={{ textAlign: 'center', color: 'text.disabled', py: 1 }}>
                  ── that's everything ──
                </Typography>
              )}
            </Stack>
          )}
        </Box>
      </Box>
    </Box>
  );
}
