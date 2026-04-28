import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useState } from 'react';
import { toast } from 'sonner';
import { SectionHeader } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useCategories, useCreateCategory, useDeleteCategory, useUpdateCategory } from '@/hooks/useCategories';
import { useUIStore } from '@/stores/uiStore';
import { registerPushSubscription } from '@/lib/push';
import { supabase } from '@/lib/supabase';
import { DEFAULT_CATEGORY_COLORS, DEFAULT_CATEGORY_ICONS } from '@/lib/utils';
import * as styles from './SettingsPage.styles';

export function SettingsPage() {
  const { user, signOut } = useAuth();
  const { data: categories = [] } = useCategories();
  const create = useCreateCategory();
  const update = useUpdateCategory();
  const del = useDeleteCategory();
  const themeMode = useUIStore((s) => s.themeMode);
  const setThemeMode = useUIStore((s) => s.setThemeMode);

  const [fullName, setFullName] = useState((user?.user_metadata?.full_name as string | undefined) ?? '');
  const [savingProfile, setSavingProfile] = useState(false);

  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState(DEFAULT_CATEGORY_ICONS[0]);
  const [newCatColor, setNewCatColor] = useState(DEFAULT_CATEGORY_COLORS[0]);
  const [notifications, setNotifications] = useState(false);

  const saveProfile = async () => {
    setSavingProfile(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({ id: user!.id, full_name: fullName });
      if (error) throw error;
      await supabase.auth.updateUser({ data: { full_name: fullName } });
      toast.success('Profile updated');
    } catch (e) {
      toast.error('Profile update failed', { description: (e as Error).message });
    } finally {
      setSavingProfile(false);
    }
  };

  const enableNotifications = async () => {
    if (!user) return;
    const ok = await registerPushSubscription(user.id);
    setNotifications(ok);
    if (ok) toast.success('Notifications enabled');
    else toast.error('Could not enable notifications');
  };

  return (
    <Stack gap={4} sx={{ maxWidth: 880, marginInline: 'auto' }}>
      <SectionHeader
        eyebrow="Settings"
        title="Make Tessera yours."
        description="Profile, categories, and notification preferences live here."
      />

      <Box sx={styles.card}>
        <Stack direction="row" gap={2.5} alignItems="center" sx={{ mb: 3 }}>
          <Avatar
            src={user?.user_metadata?.avatar_url as string | undefined}
            sx={{ width: 64, height: 64, bgcolor: 'primary.main', fontSize: 22, fontWeight: 700 }}
          >
            {(fullName || user?.email || 'U').slice(0, 1).toUpperCase()}
          </Avatar>
          <Stack flex={1}>
            <Typography variant="h5">Profile</Typography>
            <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
          </Stack>
        </Stack>
        <Stack gap={2}>
          <TextField label="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} fullWidth />
          <Stack direction="row" gap={1.5} justifyContent="flex-end">
            <Button onClick={saveProfile} variant="contained" disabled={savingProfile}>
              Save changes
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Box sx={styles.card}>
        <Stack direction="row" alignItems="flex-end" sx={{ mb: 2.5 }}>
          <Stack flex={1}>
            <Typography variant="h5">Categories</Typography>
            <Typography variant="body2" color="text.secondary">
              Group related tasks. Up to a dozen is plenty for most people.
            </Typography>
          </Stack>
        </Stack>
        <Stack direction={{ xs: 'column', md: 'row' }} gap={1.5} sx={{ mb: 2.5 }}>
          <Select
            size="small"
            value={newCatIcon}
            onChange={(e) => setNewCatIcon(e.target.value as string)}
            sx={{ minWidth: 80 }}
          >
            {DEFAULT_CATEGORY_ICONS.map((i) => (
              <MenuItem key={i} value={i}>{i}</MenuItem>
            ))}
          </Select>
          <TextField
            size="small"
            placeholder="Category name"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            fullWidth
          />
          <Stack direction="row" gap={0.5} flexWrap="wrap" sx={{ alignItems: 'center' }}>
            {DEFAULT_CATEGORY_COLORS.slice(0, 6).map((c) => (
              <Box
                key={c}
                component="button"
                onClick={() => setNewCatColor(c)}
                sx={styles.colorSwatch(c, newCatColor === c)}
                aria-label={`Color ${c}`}
              />
            ))}
          </Stack>
          <Button
            startIcon={<AddRoundedIcon />}
            variant="contained"
            onClick={async () => {
              if (!newCatName.trim()) return;
              await create.mutateAsync({ name: newCatName.trim(), color: newCatColor, icon: newCatIcon });
              setNewCatName('');
            }}
            disabled={!newCatName.trim() || create.isPending}
          >
            Add
          </Button>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        <Stack gap={1.25}>
          {categories.length === 0 ? (
            <Typography sx={{ color: 'text.disabled', fontStyle: 'italic' }}>
              No categories yet — add one above.
            </Typography>
          ) : (
            categories.map((c) => (
              <Stack key={c.id} direction="row" alignItems="center" gap={1.5} sx={styles.catRow}>
                <Box sx={{ fontSize: 20 }}>{c.icon}</Box>
                <TextField
                  size="small"
                  value={c.name}
                  onBlur={(e) => {
                    if (e.target.value !== c.name) {
                      update.mutate({ id: c.id, patch: { name: e.target.value } });
                    }
                  }}
                  onChange={() => undefined}
                  defaultValue={c.name}
                  variant="standard"
                  sx={{ flex: 1 }}
                />
                <Chip
                  label={c.color}
                  sx={{
                    fontFamily: '"JetBrains Mono"',
                    fontSize: 11,
                    backgroundColor: `${c.color}1f`,
                    color: c.color,
                    border: `1px solid ${c.color}33`,
                  }}
                />
                <IconButton
                  onClick={() => {
                    if (window.confirm(`Delete category "${c.name}"? Tasks will become uncategorized.`)) {
                      del.mutate(c.id);
                    }
                  }}
                  size="small"
                >
                  <DeleteOutlineRoundedIcon fontSize="small" />
                </IconButton>
              </Stack>
            ))
          )}
        </Stack>
      </Box>

      <Box sx={styles.card}>
        <Typography variant="h5">Preferences</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Theme, notifications, and app behavior.
        </Typography>

        <Stack gap={2}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={styles.prefRow}>
            <Stack>
              <Typography sx={{ fontWeight: 600, fontFamily: '"Plus Jakarta Sans"' }}>Theme</Typography>
              <Typography variant="body2" color="text.secondary">
                System follows your OS setting; light/dark stay fixed.
              </Typography>
            </Stack>
            <Select
              size="small"
              value={themeMode}
              onChange={(e) => setThemeMode(e.target.value as typeof themeMode)}
            >
              <MenuItem value="system">System</MenuItem>
              <MenuItem value="light">Light</MenuItem>
              <MenuItem value="dark">Dark</MenuItem>
            </Select>
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={styles.prefRow}>
            <Stack>
              <Typography sx={{ fontWeight: 600, fontFamily: '"Plus Jakarta Sans"' }}>Browser notifications</Typography>
              <Typography variant="body2" color="text.secondary">
                Push reminders fire when a task's reminder time arrives.
              </Typography>
            </Stack>
            <Switch
              checked={notifications}
              onChange={(_, v) => {
                if (v) void enableNotifications();
                else setNotifications(false);
              }}
            />
          </Stack>
        </Stack>
      </Box>

      <Stack direction="row" justifyContent="flex-end">
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<LogoutRoundedIcon />}
          onClick={() => void signOut()}
          sx={{ color: 'text.secondary' }}
        >
          Sign out
        </Button>
      </Stack>
    </Stack>
  );
}
