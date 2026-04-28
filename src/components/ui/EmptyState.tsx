import { Box, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import * as styles from './EmptyState.styles';

interface EmptyStateProps {
  illustration?: 'tasks' | 'calendar' | 'search' | 'overdue' | 'analytics';
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ illustration = 'tasks', title, description, action }: EmptyStateProps) {
  return (
    <Stack sx={styles.root}>
      <Box sx={styles.illustration}>{ILLUSTRATIONS[illustration]}</Box>
      <Typography variant="h4" sx={styles.title}>{title}</Typography>
      {description && <Typography sx={styles.description}>{description}</Typography>}
      {action && <Box sx={{ mt: 2 }}>{action}</Box>}
    </Stack>
  );
}

const TasksSvg = (
  <svg viewBox="0 0 240 200" width="240" height="200" fill="none" aria-hidden>
    <defs>
      <linearGradient id="card1" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#eef2ff" />
        <stop offset="1" stopColor="#e0e7ff" />
      </linearGradient>
    </defs>
    <rect x="40" y="32" width="160" height="120" rx="14" fill="url(#card1)" />
    <rect x="56" y="50" width="92" height="10" rx="4" fill="#a5b4fc" />
    <rect x="56" y="70" width="128" height="6" rx="3" fill="#c7d2fe" />
    <rect x="56" y="84" width="96" height="6" rx="3" fill="#c7d2fe" />
    <circle cx="68" cy="118" r="9" fill="#fff" stroke="#6366f1" strokeWidth="2.5" />
    <path d="M64 118l3 3 6-6" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="84" y="113" width="80" height="10" rx="3" fill="#a5b4fc" />
    <circle cx="180" cy="40" r="14" fill="#8b5cf6" opacity="0.18" />
    <circle cx="48" cy="160" r="9" fill="#f43f5e" opacity="0.15" />
  </svg>
);

const CalendarSvg = (
  <svg viewBox="0 0 240 200" width="240" height="200" fill="none" aria-hidden>
    <rect x="46" y="40" width="148" height="118" rx="14" fill="#eef2ff" />
    <rect x="46" y="40" width="148" height="28" rx="14" fill="#6366f1" />
    <rect x="46" y="56" width="148" height="12" fill="#6366f1" />
    <circle cx="78" cy="38" r="6" fill="#fff" />
    <circle cx="162" cy="38" r="6" fill="#fff" />
    {[0, 1, 2, 3].map((row) =>
      [0, 1, 2, 3, 4, 5, 6].map((col) => (
        <circle
          key={`${row}-${col}`}
          cx={62 + col * 20}
          cy={86 + row * 18}
          r="4"
          fill={row === 1 && col === 3 ? '#6366f1' : '#c7d2fe'}
        />
      )),
    )}
  </svg>
);

const SearchSvg = (
  <svg viewBox="0 0 240 200" width="240" height="200" fill="none" aria-hidden>
    <circle cx="105" cy="95" r="46" stroke="#a5b4fc" strokeWidth="6" />
    <circle cx="105" cy="95" r="32" fill="#eef2ff" />
    <path d="M140 130l28 26" stroke="#6366f1" strokeWidth="8" strokeLinecap="round" />
    <circle cx="105" cy="95" r="10" fill="#fff" stroke="#6366f1" strokeWidth="3" />
  </svg>
);

const OverdueSvg = (
  <svg viewBox="0 0 240 200" width="240" height="200" fill="none" aria-hidden>
    <circle cx="120" cy="100" r="60" fill="#fef2f2" />
    <circle cx="120" cy="100" r="48" stroke="#fb7185" strokeWidth="5" fill="#fff" />
    <path d="M120 70v32l20 12" stroke="#f43f5e" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const AnalyticsSvg = (
  <svg viewBox="0 0 240 200" width="240" height="200" fill="none" aria-hidden>
    <rect x="40" y="40" width="160" height="120" rx="14" fill="#eef2ff" />
    <rect x="60" y="120" width="20" height="22" rx="4" fill="#a5b4fc" />
    <rect x="92" y="100" width="20" height="42" rx="4" fill="#818cf8" />
    <rect x="124" y="80" width="20" height="62" rx="4" fill="#6366f1" />
    <rect x="156" y="60" width="20" height="82" rx="4" fill="#4f46e5" />
    <path d="M60 64l30 14 24-10 30-18" stroke="#f43f5e" strokeWidth="3" fill="none" strokeLinecap="round" />
  </svg>
);

const ILLUSTRATIONS: Record<NonNullable<EmptyStateProps['illustration']>, ReactNode> = {
  tasks: TasksSvg,
  calendar: CalendarSvg,
  search: SearchSvg,
  overdue: OverdueSvg,
  analytics: AnalyticsSvg,
};
