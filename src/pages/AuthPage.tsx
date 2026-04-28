import { Alert, Box, Button, Divider, Stack, TextField, Typography } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import * as styles from './AuthPage.styles';

type Mode = 'signin' | 'signup';

export function AuthPage() {
  const { isAuthenticated, signInWithPassword, signUpWithPassword, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      if (mode === 'signin') {
        await signInWithPassword(email, password);
      } else {
        await signUpWithPassword(email, password, fullName);
        setInfo('Check your email to confirm your account.');
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={styles.root}>
      <Box sx={styles.aurora} />
      <Box sx={styles.gridOverlay} />

      <Box
        component={motion.div}
        initial={{ opacity: 0, scale: 0.98, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        sx={styles.card}
      >
        <Stack alignItems="center" gap={1.25} sx={{ mb: 3 }}>
          <Box sx={styles.logoMark}>T</Box>
          <Typography sx={styles.brandName}>Tessera</Typography>
          <Typography sx={styles.tagline}>Your day, in order — small tiles, large patterns.</Typography>
        </Stack>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={() => void signInWithGoogle().catch((e) => setError((e as Error).message))}
          sx={styles.googleBtn}
        >
          Continue with Google
        </Button>

        <Divider sx={styles.divider}>
          <Typography variant="caption" sx={{ color: 'text.disabled', fontFamily: '"JetBrains Mono"' }}>
            OR EMAIL
          </Typography>
        </Divider>

        <Stack component="form" gap={1.75} onSubmit={submit}>
          {mode === 'signup' && (
            <TextField
              label="Full name"
              fullWidth
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          )}
          <TextField
            label="Email"
            type="email"
            fullWidth
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <Alert severity="error" variant="outlined">{error}</Alert>}
          {info && <Alert severity="success" variant="outlined">{info}</Alert>}
          <Button type="submit" variant="contained" size="large" disabled={loading} sx={styles.submitBtn}>
            {mode === 'signin' ? 'Sign in' : 'Create account'}
          </Button>
        </Stack>

        <Typography sx={styles.modeSwitch}>
          {mode === 'signin' ? 'New here?' : 'Already have an account?'}{' '}
          <Box
            component="button"
            type="button"
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            sx={styles.linkBtn}
          >
            {mode === 'signin' ? 'Create one' : 'Sign in'}
          </Box>
        </Typography>
      </Box>

      <Typography sx={styles.footnote}>
        Built on Supabase · End-to-end RLS · Realtime sync
      </Typography>
    </Box>
  );
}
