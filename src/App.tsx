import { CssBaseline, GlobalStyles, ThemeProvider } from '@mui/material';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppLayout } from '@/components/layout';
import { ErrorBoundary } from '@/components/ui';
import {
  AnalyticsPage,
  AuthPage,
  CalendarPage,
  CategoriesPage,
  DashboardPage,
  InsightsPage,
  NotesPage,
  OnboardingPage,
  SettingsPage,
  TaskDetailPage,
  TaskEditPage,
  TasksPage,
} from '@/pages';
import { useAuth, useAuthBootstrap } from '@/hooks/useAuth';
import { useResolvedTheme } from '@/hooks/useTheme';
import { queryClient } from '@/lib/queryClient';

function ProtectedRoute() {
  const { isAuthenticated, initialized } = useAuth();
  if (!initialized) return null;
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return <Outlet />;
}

function ThemedShell({ children }: { children: React.ReactNode }) {
  const { theme, isDark } = useResolvedTheme();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          html: { scrollBehavior: 'smooth' },
          body: { backgroundColor: theme.palette.background.default },
          '::selection': {
            backgroundColor: 'rgba(99,102,241,0.25)',
            color: theme.palette.text.primary,
          },
        }}
      />
      <Toaster
        position="bottom-right"
        theme={isDark ? 'dark' : 'light'}
        toastOptions={{
          style: {
            fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
            fontSize: 14,
            borderRadius: 12,
          },
        }}
      />
      {children}
    </ThemeProvider>
  );
}

function AppRoutes() {
  useAuthBootstrap();
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route element={<AppLayout />}>
          <Route index element={<ErrorBoundary><DashboardPage /></ErrorBoundary>} />
          <Route path="tasks" element={<ErrorBoundary><TasksPage /></ErrorBoundary>} />
          <Route path="tasks/new" element={<ErrorBoundary><TaskEditPage mode="create" /></ErrorBoundary>} />
          <Route path="tasks/:id" element={<ErrorBoundary><TaskDetailPage /></ErrorBoundary>} />
          <Route path="tasks/:id/edit" element={<ErrorBoundary><TaskEditPage mode="edit" /></ErrorBoundary>} />
          <Route path="categories" element={<ErrorBoundary><CategoriesPage /></ErrorBoundary>} />
          <Route path="calendar" element={<ErrorBoundary><CalendarPage /></ErrorBoundary>} />
          <Route path="notes" element={<ErrorBoundary><NotesPage /></ErrorBoundary>} />
          <Route path="insights" element={<ErrorBoundary><InsightsPage /></ErrorBoundary>} />
          <Route path="analytics" element={<ErrorBoundary><AnalyticsPage /></ErrorBoundary>} />
          <Route path="settings" element={<ErrorBoundary><SettingsPage /></ErrorBoundary>} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemedShell>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ThemedShell>
    </QueryClientProvider>
  );
}
