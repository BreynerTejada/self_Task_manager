import type { SxProps, Theme } from '@mui/material';

export const root: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2.5,
};

export const toggleGroup: SxProps<Theme> = {
  '& .MuiToggleButton-root': {
    fontFamily: '"Plus Jakarta Sans"',
    fontWeight: 600,
    border: '1px solid',
    borderColor: 'divider',
    paddingBlock: 1,
    textTransform: 'none',
    '&.Mui-selected': {
      backgroundColor: 'primary.main',
      color: 'primary.contrastText',
      borderColor: 'primary.main',
      '&:hover': { backgroundColor: 'primary.dark' },
    },
  },
};

export const reminderRow: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingInline: 2,
  paddingBlock: 1.5,
  borderRadius: '14px',
  backgroundColor: 'surface.soft',
  border: '1px solid',
  borderColor: 'divider',
};
