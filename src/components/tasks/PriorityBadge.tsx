import { Box } from '@mui/material';
import type { TaskPriority } from '@/types/database';
import { PRIORITY_COLORS, PRIORITY_DARK } from '@/lib/utils';

interface Props {
  priority: TaskPriority;
  size?: 'sm' | 'md';
}

export function PriorityBadge({ priority, size = 'sm' }: Props) {
  return (
    <Box
      sx={(t) => {
        const c = t.palette.mode === 'dark' ? PRIORITY_DARK[priority] : PRIORITY_COLORS[priority];
        return {
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
          paddingInline: size === 'sm' ? 0.875 : 1.25,
          paddingBlock: size === 'sm' ? 0.25 : 0.4,
          borderRadius: '999px',
          fontFamily: '"Plus Jakarta Sans"',
          fontWeight: 600,
          fontSize: size === 'sm' ? 11 : 12.5,
          letterSpacing: '0.02em',
          textTransform: 'capitalize',
          backgroundColor: c.bg,
          color: c.fg,
          border: `1px solid ${c.ring}`,
        };
      }}
    >
      <Box
        component="span"
        sx={(t) => {
          const c = t.palette.mode === 'dark' ? PRIORITY_DARK[priority] : PRIORITY_COLORS[priority];
          return { width: 6, height: 6, borderRadius: '50%', backgroundColor: c.fg };
        }}
      />
      {priority}
    </Box>
  );
}
