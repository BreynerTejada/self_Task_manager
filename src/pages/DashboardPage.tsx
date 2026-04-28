import { Box, Button, Stack, Typography } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ProgressRing } from '@/components/analytics';
import { TaskList } from '@/components/tasks';
import { EmptyState, TaskListSkeleton, StatSkeleton } from '@/components/ui';
import { useTodayTasks, useOverdueTasks, useUpcomingTasks } from '@/hooks/useTasks';
import { useUIStore } from '@/stores/uiStore';
import { useAuth } from '@/hooks/useAuth';
import * as styles from './DashboardPage.styles';

export function DashboardPage() {
  const today = useTodayTasks();
  const overdue = useOverdueTasks();
  const upcoming = useUpcomingTasks();
  const openQuickAdd = useUIStore((s) => s.openQuickAdd);
  const navigate = useNavigate();
  const { user } = useAuth();

  const totalToday = today.data?.length ?? 0;
  const completedToday = today.data?.filter((t) => t.status === 'completed').length ?? 0;
  const overdueCount = overdue.data?.length ?? 0;
  const upcomingCount = upcoming.data?.length ?? 0;
  const firstName =
    (user?.user_metadata?.full_name as string | undefined)?.split(' ')[0] ??
    user?.email?.split('@')[0] ??
    'friend';

  return (
    <Stack gap={4}>
      <Box sx={styles.hero}>
        <Box sx={styles.heroBackground} />
        <Stack sx={styles.heroContent} gap={2}>
          <Stack gap={0.75}>
            <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.75)' }}>
              {format(new Date(), 'EEEE · MMMM d').toUpperCase()}
            </Typography>
            <Typography sx={styles.heroTitle}>
              {totalToday === 0 ? `A clean slate, ${firstName}.` :
                completedToday === totalToday ? `You finished all ${totalToday} for today.` :
                  `${totalToday - completedToday} more to wrap today.`}
            </Typography>
            <Typography sx={styles.heroSubtitle}>
              {overdueCount > 0
                ? `${overdueCount} overdue · ${upcomingCount} coming up this week`
                : `${upcomingCount} coming up this week · keep your streak alive`}
            </Typography>
          </Stack>
          <Stack direction="row" gap={1.25} flexWrap="wrap">
            <Button
              onClick={openQuickAdd}
              variant="contained"
              startIcon={<AddRoundedIcon />}
              sx={styles.heroBtnFilled}
            >
              Add task
            </Button>
            <Button onClick={() => navigate('/tasks')} sx={styles.heroBtnGhost}>
              View all tasks
            </Button>
          </Stack>
        </Stack>
        {today.isLoading ? (
          <StatSkeleton />
        ) : (
          <Box sx={styles.heroRing}>
            <ProgressRing completed={completedToday} total={totalToday} size={156} strokeWidth={14} label="Today" />
          </Box>
        )}
      </Box>

      <Box sx={styles.statGrid}>
        <Stat
          label="Today"
          value={totalToday}
          accent="#6366f1"
          subtitle={`${completedToday} done`}
          loading={today.isLoading}
        />
        <Stat
          label="Overdue"
          value={overdueCount}
          accent={overdueCount > 0 ? '#f43f5e' : '#94a3b8'}
          subtitle={overdueCount === 0 ? 'all clear' : 'needs attention'}
          loading={overdue.isLoading}
        />
        <Stat label="Upcoming" value={upcomingCount} accent="#14b8a6" subtitle="next 7 days" loading={upcoming.isLoading} />
        <Stat
          label="Completion"
          value={totalToday === 0 ? '—' : `${Math.round((completedToday / totalToday) * 100)}%`}
          accent="#8b5cf6"
          subtitle="today"
          loading={today.isLoading}
        />
      </Box>

      <Stack direction={{ xs: 'column', lg: 'row' }} gap={3}>
        <Section
          title="Today"
          subtitle={totalToday === 0 ? 'Nothing planned for today.' : 'Your queue for the day.'}
          link="/tasks"
          loading={today.isLoading}
          isEmpty={totalToday === 0}
          emptyTitle="A blank canvas."
          emptyDescription="Add your first task and we'll keep it tidy."
          emptyAction={
            <Button onClick={openQuickAdd} variant="contained" startIcon={<AddRoundedIcon />}>
              Add task
            </Button>
          }
        >
          <TaskList tasks={today.data ?? []} />
        </Section>

        <Stack gap={3} sx={{ flex: 1, minWidth: 0 }}>
          <Section
            title="Overdue"
            subtitle={overdueCount === 0 ? 'No backlog.' : 'These slipped past.'}
            link="/tasks"
            loading={overdue.isLoading}
            isEmpty={overdueCount === 0}
            emptyIllustration="overdue"
            emptyTitle="Nothing overdue."
            emptyDescription="You're keeping up. Nice."
          >
            <TaskList tasks={overdue.data ?? []} />
          </Section>
          <Section
            title="Upcoming"
            subtitle="Next 7 days."
            link="/calendar"
            loading={upcoming.isLoading}
            isEmpty={upcomingCount === 0}
            emptyIllustration="calendar"
            emptyTitle="No upcoming tasks."
            emptyDescription="Plan ahead and your week stays smooth."
          >
            <TaskList tasks={upcoming.data ?? []} />
          </Section>
        </Stack>
      </Stack>
    </Stack>
  );
}

function Stat({
  label,
  value,
  accent,
  subtitle,
  loading,
}: {
  label: string;
  value: number | string;
  accent: string;
  subtitle?: string;
  loading?: boolean;
}) {
  if (loading) return <StatSkeleton />;
  return (
    <Box sx={styles.statCard(accent)}>
      <Typography sx={styles.statLabel}>{label}</Typography>
      <Typography sx={styles.statValue}>{value}</Typography>
      {subtitle && <Typography sx={styles.statSubtitle}>{subtitle}</Typography>}
      <Box sx={styles.statAccent(accent)} />
    </Box>
  );
}

function Section({
  title,
  subtitle,
  link,
  loading,
  isEmpty,
  emptyTitle,
  emptyDescription,
  emptyIllustration = 'tasks',
  emptyAction,
  children,
}: {
  title: string;
  subtitle?: string;
  link?: string;
  loading?: boolean;
  isEmpty?: boolean;
  emptyTitle: string;
  emptyDescription: string;
  emptyIllustration?: 'tasks' | 'calendar' | 'overdue' | 'analytics' | 'search';
  emptyAction?: React.ReactNode;
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  return (
    <Box sx={styles.section}>
      <Stack direction="row" alignItems="flex-end" sx={{ mb: 2 }}>
        <Stack flex={1}>
          <Typography variant="h5">{title}</Typography>
          {subtitle && <Typography variant="caption" sx={{ color: 'text.secondary' }}>{subtitle}</Typography>}
        </Stack>
        {link && !loading && !isEmpty && (
          <Button
            size="small"
            endIcon={<ArrowForwardRoundedIcon />}
            onClick={() => navigate(link)}
            sx={{ color: 'text.secondary' }}
          >
            See all
          </Button>
        )}
      </Stack>
      {loading ? (
        <TaskListSkeleton rows={3} />
      ) : isEmpty ? (
        <EmptyState
          illustration={emptyIllustration}
          title={emptyTitle}
          description={emptyDescription}
          action={emptyAction}
        />
      ) : (
        children
      )}
    </Box>
  );
}
