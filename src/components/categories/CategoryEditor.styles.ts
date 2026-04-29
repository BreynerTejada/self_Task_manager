import type { SxProps, Theme } from '@mui/material';

export const dialogPaper: SxProps<Theme> = {
  borderRadius: '20px',
  overflow: 'hidden',
  border: '1px solid',
  borderColor: 'divider',
};

export const titleRow: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1.5,
  paddingBlock: 2.25,
  paddingInline: 3,
};

export const headerEyebrow: SxProps<Theme> = {
  fontFamily: '"Plus Jakarta Sans"',
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: 'primary.main',
};

export const headerTitle: SxProps<Theme> = {
  fontFamily: '"Plus Jakarta Sans"',
  fontWeight: 700,
  fontSize: 20,
  letterSpacing: '-0.02em',
  lineHeight: 1.15,
};

export const previewWrap = (color: string): SxProps<Theme> => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  paddingInline: 3,
  paddingBlock: 2.5,
  borderTop: '1px solid',
  borderBottom: '1px solid',
  borderColor: 'divider',
  background: `linear-gradient(135deg, ${color}10 0%, transparent 60%)`,
});

export const previewIcon = (color: string): SxProps<Theme> => ({
  width: 64,
  height: 64,
  borderRadius: '20px',
  display: 'grid',
  placeItems: 'center',
  fontSize: 30,
  background: `linear-gradient(135deg, ${color}33 0%, ${color}14 100%)`,
  border: `1px solid ${color}55`,
  boxShadow: `0 12px 28px -16px ${color}aa`,
  flexShrink: 0,
});

export const previewName: SxProps<Theme> = {
  fontFamily: '"Plus Jakarta Sans"',
  fontWeight: 700,
  fontSize: 18,
  letterSpacing: '-0.01em',
};

export const previewHint: SxProps<Theme> = {
  fontSize: 13,
  color: 'text.secondary',
  marginTop: 0.25,
};

export const body: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2.5,
  paddingInline: 3,
  paddingBlock: 2.5,
};

export const sectionLabel: SxProps<Theme> = {
  fontFamily: '"Plus Jakarta Sans"',
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: 'text.disabled',
  marginBottom: 1,
};

export const colorGrid: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: 'repeat(8, 1fr)',
  gap: 1,
};

export const colorSwatch = (color: string, active: boolean): SxProps<Theme> => ({
  width: '100%',
  aspectRatio: '1 / 1',
  borderRadius: '12px',
  cursor: 'pointer',
  background: color,
  position: 'relative',
  border: active ? `2px solid ${color}` : '2px solid transparent',
  outline: active ? '2px solid' : 'none',
  outlineColor: 'background.paper',
  boxShadow: active
    ? `0 0 0 3px ${color}, 0 8px 22px -10px ${color}cc`
    : `0 4px 12px -6px ${color}88`,
  transition: 'transform 140ms ease, box-shadow 200ms ease',
  '&:hover': { transform: 'scale(1.06)' },
});

export const iconGrid: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: 'repeat(10, 1fr)',
  gap: 0.75,
};

export const iconSwatch = (active: boolean): SxProps<Theme> => ({
  display: 'grid',
  placeItems: 'center',
  width: '100%',
  aspectRatio: '1 / 1',
  fontSize: 18,
  borderRadius: '10px',
  cursor: 'pointer',
  border: '1px solid',
  borderColor: active ? 'primary.main' : 'divider',
  backgroundColor: active ? (t) => `${t.palette.primary.main}1f` : 'background.paper',
  transition: 'background-color 140ms ease, border-color 140ms ease, transform 140ms ease',
  '&:hover': { transform: 'translateY(-1px)', backgroundColor: 'action.hover' },
});

export const actions: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 1,
  paddingInline: 3,
  paddingBlock: 2,
  borderTop: '1px solid',
  borderColor: 'divider',
  backgroundColor: 'surface.soft',
};
