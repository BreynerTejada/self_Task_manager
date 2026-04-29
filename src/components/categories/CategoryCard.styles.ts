import type { SxProps, Theme } from '@mui/material';

export const card = (color: string): SxProps<Theme> => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: 1.75,
  padding: 2.5,
  borderRadius: '20px',
  border: '1px solid',
  borderColor: 'divider',
  backgroundColor: 'background.paper',
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 5,
    background: `linear-gradient(90deg, ${color}, ${color}aa)`,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: `radial-gradient(220px 160px at 100% 0%, ${color}1f, transparent 70%)`,
    pointerEvents: 'none',
  },
  '&:hover': {
    transform: 'translateY(-3px)',
    borderColor: color,
    boxShadow: `0 22px 40px -22px ${color}88`,
  },
  '&:hover .category-actions': {
    opacity: 1,
  },
});

export const header: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 1.5,
  position: 'relative',
  zIndex: 1,
};

export const iconBox = (color: string): SxProps<Theme> => ({
  width: 48,
  height: 48,
  borderRadius: '14px',
  display: 'grid',
  placeItems: 'center',
  fontSize: 24,
  background: `linear-gradient(135deg, ${color}33 0%, ${color}14 100%)`,
  border: `1px solid ${color}44`,
  flexShrink: 0,
});

export const titleStack: SxProps<Theme> = {
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 0.25,
};

export const name: SxProps<Theme> = {
  fontFamily: '"Plus Jakarta Sans"',
  fontWeight: 700,
  fontSize: 18,
  letterSpacing: '-0.01em',
  lineHeight: 1.15,
  display: '-webkit-box',
  WebkitLineClamp: 1,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
};

export const subtitle: SxProps<Theme> = {
  fontFamily: '"JetBrains Mono"',
  fontSize: 11,
  letterSpacing: '0.04em',
  color: 'text.secondary',
};

export const actions: SxProps<Theme> = {
  display: 'flex',
  gap: 0.25,
  opacity: 0,
  transition: 'opacity 160ms ease',
};

export const progressTrack = (color: string): SxProps<Theme> => ({
  height: 8,
  width: '100%',
  borderRadius: '999px',
  backgroundColor: `${color}1a`,
  overflow: 'hidden',
  position: 'relative',
  zIndex: 1,
});

export const progressFill = (color: string, pct: number): SxProps<Theme> => ({
  height: '100%',
  width: `${Math.min(100, Math.max(0, pct))}%`,
  background: `linear-gradient(90deg, ${color}, ${color}cc)`,
  borderRadius: '999px',
  transition: 'width 360ms cubic-bezier(0.32, 0.72, 0, 1)',
});

export const progressMeta: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  position: 'relative',
  zIndex: 1,
};

export const progressValue: SxProps<Theme> = {
  fontFamily: '"Plus Jakarta Sans"',
  fontWeight: 800,
  fontSize: 22,
  letterSpacing: '-0.02em',
};

export const progressUnit: SxProps<Theme> = {
  fontSize: 12,
  fontWeight: 600,
  color: 'text.secondary',
  marginLeft: 0.5,
};

export const progressLabel: SxProps<Theme> = {
  fontSize: 12,
  color: 'text.secondary',
};

export const statRow: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 1,
  position: 'relative',
  zIndex: 1,
};

export const statCell: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  paddingInline: 1.25,
  paddingBlock: 1,
  borderRadius: '12px',
  backgroundColor: 'surface.soft',
  border: '1px solid',
  borderColor: 'divider',
};

export const statValue: SxProps<Theme> = {
  fontFamily: '"Plus Jakarta Sans"',
  fontWeight: 700,
  fontSize: 16,
  letterSpacing: '-0.01em',
  lineHeight: 1.1,
};

export const statLabel: SxProps<Theme> = {
  fontSize: 10.5,
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'text.disabled',
  marginTop: 0.25,
};

export const cardFooter: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 1,
  position: 'relative',
  zIndex: 1,
};

export const viewBtn = (color: string): SxProps<Theme> => ({
  fontFamily: '"Plus Jakarta Sans"',
  fontWeight: 600,
  fontSize: 13,
  color,
  textTransform: 'none',
  paddingInline: 1.25,
  '&:hover': { backgroundColor: `${color}14` },
});
