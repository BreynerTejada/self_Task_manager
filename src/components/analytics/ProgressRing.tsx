import { Box, Stack, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { clamp } from '@/lib/utils';

interface Props {
  completed: number;
  total: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export function ProgressRing({ completed, total, size = 132, strokeWidth = 12, label }: Props) {
  const pct = total === 0 ? 0 : clamp(completed / total, 0, 1);
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct);

  return (
    <Stack alignItems="center" justifyContent="center" sx={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        <defs>
          <linearGradient id="ringGrad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#a5b4fc" />
            <stop offset="0.5" stopColor="#818cf8" />
            <stop offset="1" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="currentColor"
          strokeOpacity={0.08}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="url(#ringGrad)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.9, ease: [0.32, 0.72, 0, 1] }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <Box sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
        <Stack alignItems="center" gap={0}>
          <Typography
            sx={{
              fontFamily: '"Plus Jakarta Sans"',
              fontWeight: 800,
              fontSize: size * 0.28,
              letterSpacing: '-0.04em',
              lineHeight: 1,
            }}
          >
            {Math.round(pct * 100)}
            <Box component="span" sx={{ fontSize: size * 0.14, color: 'text.secondary', ml: 0.25 }}>%</Box>
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontFamily: '"Plus Jakarta Sans"',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'text.secondary',
              mt: 0.5,
            }}
          >
            {label ?? `${completed} / ${total}`}
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
}
