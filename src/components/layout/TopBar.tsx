import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { useUIStore } from '@/stores/uiStore';
import { useResolvedTheme } from '@/hooks/useTheme';
import * as styles from './TopBar.styles';

function timeOfDayGreeting(): string {
  const h = new Date().getHours();
  if (h < 5) return 'Still up';
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export function TopBar() {
  const { user } = useAuth();
  const openSearch = useUIStore((s) => s.openSearch);
  const themeMode = useUIStore((s) => s.themeMode);
  const setThemeMode = useUIStore((s) => s.setThemeMode);
  const { isDark } = useResolvedTheme();

  const name =
    (user?.user_metadata?.full_name as string | undefined)?.split(' ')[0] ??
    user?.email?.split('@')[0] ??
    'there';

  const cycleTheme = () => {
    if (themeMode === 'system') setThemeMode(isDark ? 'light' : 'dark');
    else if (themeMode === 'light') setThemeMode('dark');
    else setThemeMode('light');
  };

  return (
    <Box sx={styles.root}>
      <Typography sx={styles.greeting}>
        {timeOfDayGreeting()}, <span style={{ color: 'var(--mui-palette-primary-main)' }}>{name}</span>
      </Typography>
      <Typography sx={styles.date}>{format(new Date(), 'EEEE · MMM d')}</Typography>
      <Box
        component="button"
        onClick={openSearch}
        sx={{ ...styles.search, border: '1px solid', cursor: 'pointer', textAlign: 'left' }}
      >
        <SearchRoundedIcon fontSize="small" />
        <span>Search tasks…</span>
        <kbd>/</kbd>
      </Box>
      <Tooltip title={isDark ? 'Switch to light' : 'Switch to dark'}>
        <IconButton onClick={cycleTheme} aria-label="Toggle theme">
          {isDark ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
        </IconButton>
      </Tooltip>
    </Box>
  );
}
