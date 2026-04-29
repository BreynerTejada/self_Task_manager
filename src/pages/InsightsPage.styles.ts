import type { SxProps, Theme } from '@mui/material';

export const root: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

export const header: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'flex-end',
  gap: 2,
  flexWrap: 'wrap',
};

export const title: SxProps<Theme> = {
  fontFamily: '"Plus Jakarta Sans"',
  fontWeight: 800,
  fontSize: { xs: 28, md: 36 },
  letterSpacing: '-0.03em',
  lineHeight: 1.05,
};

export const subtitle: SxProps<Theme> = {
  color: 'text.secondary',
  fontSize: 14,
};

export const toolbar: SxProps<Theme> = {
  display: 'flex',
  gap: 1.5,
  alignItems: 'center',
  flexWrap: 'wrap',
};

export const card: SxProps<Theme> = {
  position: 'relative',
  padding: { xs: 2.5, md: 3.5 },
  borderRadius: '20px',
  backgroundColor: 'background.paper',
  border: '1px solid',
  borderColor: 'divider',
  boxShadow: '0 4px 14px -10px rgba(0,0,0,0.18)',
  display: 'flex',
  flexDirection: 'column',
  gap: 2.5,
};

export const sectionLabel: SxProps<Theme> = {
  fontFamily: '"Plus Jakarta Sans"',
  fontWeight: 700,
  fontSize: 13,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'text.secondary',
};

export const summaryText: SxProps<Theme> = {
  fontSize: 16,
  lineHeight: 1.7,
  color: 'text.primary',
  whiteSpace: 'pre-line',
};

export const recommendationItem: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 1.25,
  padding: 1.5,
  borderRadius: '12px',
  backgroundColor: 'action.hover',
  fontSize: 14,
  lineHeight: 1.55,
  '& .rec-icon': {
    color: 'primary.main',
    marginTop: '2px',
    flexShrink: 0,
  },
};

export const recommendationsList: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
};

export const footer: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 1.5,
  paddingTop: 1.5,
  borderTop: '1px solid',
  borderColor: 'divider',
  fontSize: 12,
  color: 'text.secondary',
  flexWrap: 'wrap',
};

export const modelChip: SxProps<Theme> = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 0.5,
  paddingX: 1,
  paddingY: 0.25,
  borderRadius: '999px',
  backgroundColor: 'action.selected',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: 11,
};
