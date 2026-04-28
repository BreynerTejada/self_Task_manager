import { Box, Skeleton, Stack } from '@mui/material';

export function TaskRowSkeleton() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        padding: 1.5,
        borderRadius: '14px',
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Skeleton variant="circular" width={22} height={22} />
      <Stack flex={1} gap={0.75}>
        <Skeleton width="60%" height={16} />
        <Skeleton width="35%" height={12} />
      </Stack>
      <Skeleton variant="rounded" width={64} height={20} />
    </Box>
  );
}

export function TaskListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <Stack gap={1.25}>
      {Array.from({ length: rows }).map((_, i) => (
        <TaskRowSkeleton key={i} />
      ))}
    </Stack>
  );
}

export function CardSkeleton({ height = 180 }: { height?: number }) {
  return <Skeleton variant="rounded" width="100%" height={height} sx={{ borderRadius: '18px' }} />;
}

export function StatSkeleton() {
  return (
    <Stack
      sx={{
        padding: 2.5,
        borderRadius: '18px',
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
      }}
      gap={1}
    >
      <Skeleton width="40%" height={12} />
      <Skeleton width="60%" height={36} />
      <Skeleton width="50%" height={10} />
    </Stack>
  );
}
