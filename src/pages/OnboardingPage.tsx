import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { useAuth } from '@/hooks/useAuth';
import { useCreateCategory } from '@/hooks/useCategories';
import { useCreateTask } from '@/hooks/useTasks';
import { registerPushSubscription } from '@/lib/push';
import { DEFAULT_CATEGORY_COLORS, DEFAULT_CATEGORY_ICONS } from '@/lib/utils';
import * as styles from './OnboardingPage.styles';

const STEPS = ['welcome', 'category', 'task'] as const;
type Step = (typeof STEPS)[number];

export function OnboardingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const createCategory = useCreateCategory();
  const createTask = useCreateTask();

  const [step, setStep] = useState<Step>('welcome');
  const [catName, setCatName] = useState('Personal');
  const [catColor, setCatColor] = useState(DEFAULT_CATEGORY_COLORS[0]);
  const [catIcon, setCatIcon] = useState(DEFAULT_CATEGORY_ICONS[1]);
  const [taskTitle, setTaskTitle] = useState('Plan my week');
  const [createdCategoryId, setCreatedCategoryId] = useState<string | null>(null);

  const next = async () => {
    if (step === 'welcome') setStep('category');
    else if (step === 'category') {
      const cat = await createCategory.mutateAsync({ name: catName.trim() || 'Personal', color: catColor, icon: catIcon });
      setCreatedCategoryId(cat.id);
      setStep('task');
    } else {
      await createTask.mutateAsync({
        title: taskTitle.trim() || 'Plan my week',
        category_id: createdCategoryId,
        priority: 'medium',
      });
      if (user?.id) {
        try { await registerPushSubscription(user.id); } catch (_) { /* optional */ }
      }
      navigate('/');
    }
  };

  return (
    <Box sx={styles.root}>
      <Box sx={styles.aurora} />
      <Box sx={styles.progress}>
        {STEPS.map((s, i) => (
          <Box
            key={s}
            sx={styles.progressDot(STEPS.indexOf(step) >= i)}
          />
        ))}
      </Box>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
          style={{ width: '100%', maxWidth: 520 }}
        >
          {step === 'welcome' && (
            <Stack alignItems="center" sx={styles.card} gap={2}>
              <Box sx={styles.illustration}>
                <svg viewBox="0 0 240 200" width="200" height="166" fill="none" aria-hidden>
                  <rect x="20" y="30" width="80" height="60" rx="12" fill="#a5b4fc" opacity="0.5" />
                  <rect x="110" y="60" width="80" height="60" rx="12" fill="#818cf8" opacity="0.65" />
                  <rect x="60" y="100" width="80" height="60" rx="12" fill="#6366f1" />
                  <circle cx="195" cy="38" r="14" fill="#f43f5e" opacity="0.65" />
                  <circle cx="40" cy="170" r="10" fill="#14b8a6" opacity="0.7" />
                </svg>
              </Box>
              <Typography variant="h2" sx={{ textAlign: 'center' }}>
                Welcome to Tessera.
              </Typography>
              <Typography sx={styles.copy}>
                Tasks fit together like tiles in a mosaic. Let's get you set up in three quick steps —
                a category, a first task, and you're moving.
              </Typography>
              <Button onClick={next} variant="contained" size="large" endIcon={<ChevronRightRoundedIcon />}>
                Let's go
              </Button>
            </Stack>
          )}

          {step === 'category' && (
            <Stack sx={styles.card} gap={2.5}>
              <Stack gap={0.5}>
                <Typography variant="overline" color="primary">Step 2 of 3</Typography>
                <Typography variant="h3">Pick your first category.</Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  Categories group related tasks. You can always add more later.
                </Typography>
              </Stack>
              <Stack direction="row" gap={1.5} alignItems="center">
                <Box sx={styles.iconPicker}>
                  {DEFAULT_CATEGORY_ICONS.map((icon) => (
                    <Box
                      key={icon}
                      component="button"
                      onClick={() => setCatIcon(icon)}
                      sx={styles.iconBtn(catIcon === icon)}
                    >
                      {icon}
                    </Box>
                  ))}
                </Box>
              </Stack>
              <TextField
                label="Category name"
                fullWidth
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
              />
              <Stack direction="row" gap={1} flexWrap="wrap">
                {DEFAULT_CATEGORY_COLORS.map((c) => (
                  <Box
                    key={c}
                    component="button"
                    onClick={() => setCatColor(c)}
                    sx={styles.colorSwatch(c, catColor === c)}
                    aria-label={`Color ${c}`}
                  />
                ))}
              </Stack>
              <Button onClick={next} variant="contained" size="large" disabled={createCategory.isPending}>
                Create &amp; continue
              </Button>
            </Stack>
          )}

          {step === 'task' && (
            <Stack sx={styles.card} gap={2.5}>
              <Stack gap={0.5}>
                <Typography variant="overline" color="primary">Step 3 of 3</Typography>
                <Typography variant="h3">Add your first task.</Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  Anything counts — a chore, a project step, a tiny win. We'll enable reminders next.
                </Typography>
              </Stack>
              <TextField
                label="What do you want to do?"
                fullWidth
                autoFocus
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
              />
              <Button onClick={next} variant="contained" size="large" disabled={createTask.isPending}>
                Add task &amp; finish
              </Button>
              <Typography variant="caption" sx={{ color: 'text.disabled', textAlign: 'center' }}>
                We'll request notification permission so reminders can ping you on time.
              </Typography>
            </Stack>
          )}
        </motion.div>
      </AnimatePresence>
    </Box>
  );
}
