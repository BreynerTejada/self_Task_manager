import { Component, type ReactNode } from 'react';
import { Alert, Button, Stack, Typography } from '@mui/material';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack?: string | null }) {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <Stack
          sx={{
            padding: 4,
            borderRadius: '18px',
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'error.light',
            maxWidth: 560,
            marginInline: 'auto',
            marginBlock: 4,
            gap: 2,
          }}
        >
          <Typography variant="h4">Something went sideways.</Typography>
          <Alert severity="error" variant="outlined">
            {this.state.error.message ?? 'Unknown error'}
          </Alert>
          <Typography color="text.secondary">
            The page hit an unexpected error. Try reloading — your data is safe.
          </Typography>
          <Stack direction="row" gap={1}>
            <Button onClick={this.reset} variant="contained" startIcon={<RefreshRoundedIcon />}>
              Try again
            </Button>
            <Button onClick={() => window.location.assign('/')} variant="outlined">
              Back to dashboard
            </Button>
          </Stack>
        </Stack>
      );
    }
    return this.props.children;
  }
}
