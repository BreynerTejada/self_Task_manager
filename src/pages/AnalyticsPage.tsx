import { Box, Stack, Typography } from '@mui/material';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import { CategoryPieChart, WeeklyChart } from '@/components/analytics';
import { CardSkeleton, EmptyState, SectionHeader, StatSkeleton } from '@/components/ui';
import { useAnalytics } from '@/hooks/useAnalytics';
import * as styles from './AnalyticsPage.styles';

export function AnalyticsPage() {
  const { data, isLoading } = useAnalytics();

  return (
    <Stack gap={3}>
      <SectionHeader
        eyebrow="Insights"
        title="The shape of your week."
        description="Trends, streaks, and where your effort lands."
      />

      <Box sx={styles.statRow}>
        <StatBig
          icon={<LocalFireDepartmentRoundedIcon />}
          label="Current streak"
          value={isLoading ? null : data?.currentStreak ?? 0}
          suffix="days"
          accent="#f43f5e"
          loading={isLoading}
        />
        <StatBig
          icon={<EmojiEventsRoundedIcon />}
          label="Best streak"
          value={isLoading ? null : data?.bestStreak ?? 0}
          suffix="days"
          accent="#f59e0b"
          loading={isLoading}
        />
        <StatBig
          icon={<TaskAltRoundedIcon />}
          label="Total completed"
          value={isLoading ? null : data?.totalCompleted ?? 0}
          accent="#14b8a6"
          loading={isLoading}
        />
      </Box>

      <Box sx={styles.chartGrid}>
        <Box sx={styles.chartCard}>
          <Typography variant="overline" sx={styles.chartLabel}>Last 7 days</Typography>
          <Typography variant="h4" sx={{ mb: 2 }}>Created vs. completed</Typography>
          {isLoading ? <CardSkeleton height={260} /> : <WeeklyChart data={data?.weekly ?? []} />}
        </Box>

        <Box sx={styles.chartCard}>
          <Typography variant="overline" sx={styles.chartLabel}>Last 90 days</Typography>
          <Typography variant="h4" sx={{ mb: 2 }}>Where time goes</Typography>
          {isLoading ? (
            <CardSkeleton height={240} />
          ) : (data?.categories.length ?? 0) === 0 ? (
            <EmptyState
              illustration="analytics"
              title="No completions yet."
              description="Finish a few tasks and this chart will fill itself in."
            />
          ) : (
            <Stack direction="row" alignItems="center" gap={2.5} flexWrap="wrap">
              <Box sx={{ flex: 1, minWidth: 220 }}>
                <CategoryPieChart data={data?.categories ?? []} />
              </Box>
              <Stack gap={1} sx={{ minWidth: 180 }}>
                {data?.categories.map((c) => (
                  <Stack key={c.name} direction="row" alignItems="center" gap={1.25}>
                    <Box sx={{ width: 12, height: 12, borderRadius: 3, backgroundColor: c.color }} />
                    <Typography sx={{ fontWeight: 600, flex: 1 }}>{c.name}</Typography>
                    <Typography variant="caption" sx={{ fontFamily: '"JetBrains Mono"', color: 'text.secondary' }}>
                      {c.value}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          )}
        </Box>
      </Box>
    </Stack>
  );
}

function StatBig({
  icon,
  label,
  value,
  suffix,
  accent,
  loading,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | null;
  suffix?: string;
  accent: string;
  loading?: boolean;
}) {
  if (loading) return <StatSkeleton />;
  return (
    <Box sx={styles.statBig(accent)}>
      <Box sx={styles.statIcon(accent)}>{icon}</Box>
      <Stack>
        <Typography sx={styles.statBigLabel}>{label}</Typography>
        <Typography sx={styles.statBigValue}>
          {value} {suffix && <Box component="span" sx={styles.statBigSuffix}>{suffix}</Box>}
        </Typography>
      </Stack>
    </Box>
  );
}
