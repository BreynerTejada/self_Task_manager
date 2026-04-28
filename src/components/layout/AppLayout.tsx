import { Box } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { BottomTabBar } from './BottomTabBar';
import { TopBar } from './TopBar';
import { useUIStore } from '@/stores/uiStore';
import { useGlobalShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useRealtimeTasks } from '@/hooks/useRealtimeTasks';
import { QuickAddModal } from '@/components/tasks/QuickAddModal';
import { CommandSearch } from '@/components/ui/CommandSearch';
import * as styles from './AppLayout.styles';

export function AppLayout() {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed);
  const location = useLocation();
  useGlobalShortcuts();
  useRealtimeTasks();

  return (
    <Box sx={styles.root}>
      <Box sx={styles.ambientGlow} />
      <Sidebar />
      <Box sx={styles.main(sidebarCollapsed)}>
        <TopBar />
        <Box component="main" sx={styles.content}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.24, ease: [0.32, 0.72, 0, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </Box>
      </Box>
      <BottomTabBar />
      <QuickAddModal />
      <CommandSearch />
    </Box>
  );
}
