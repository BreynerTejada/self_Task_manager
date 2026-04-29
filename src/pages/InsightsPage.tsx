import { useMemo } from 'react';
import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { CardSkeleton, EmptyState } from '@/components/ui';
import { useGenerateWeeklyInsight, useWeeklyInsight } from '@/hooks/useWeeklyInsight';
import { currentWeekRange, relativeTime } from '@/lib/utils';
import * as styles from './InsightsPage.styles';

export function InsightsPage() {
  const { weekStart, weekEnd } = useMemo(() => currentWeekRange(), []);
  const insight = useWeeklyInsight(weekStart);
  const generate = useGenerateWeeklyInsight();

  const data = insight.data;
  const handleGenerate = () => generate.mutate({ weekStart, weekEnd });

  const rangeLabel = useMemo(
    () =>
      `${format(parseISO(weekStart), "d 'de' MMM", { locale: es })} – ${format(parseISO(weekEnd), "d 'de' MMM", { locale: es })}`,
    [weekStart, weekEnd],
  );

  return (
    <Stack sx={styles.root}>
      <Box sx={styles.header}>
        <Stack flex={1} minWidth={240} gap={0.5}>
          <Typography sx={styles.title}>Insights</Typography>
          <Typography sx={styles.subtitle}>
            Tu semana, resumida por IA · {rangeLabel}
          </Typography>
        </Stack>
        <Box sx={styles.toolbar}>
          {data && (
            <Button
              onClick={handleGenerate}
              variant="outlined"
              startIcon={
                generate.isPending ? (
                  <CircularProgress size={16} thickness={5} />
                ) : (
                  <RefreshRoundedIcon />
                )
              }
              disabled={generate.isPending}
            >
              Regenerar
            </Button>
          )}
        </Box>
      </Box>

      {insight.isLoading ? (
        <CardSkeleton height={320} />
      ) : !data ? (
        <EmptyState
          illustration="analytics"
          title="Aún no hay resumen de esta semana"
          description="Genera tu primer resumen IA con un click. Analizaremos tus tareas para darte un panorama narrativo y recomendaciones de tiempo."
          action={
            <Button
              onClick={handleGenerate}
              variant="contained"
              startIcon={
                generate.isPending ? (
                  <CircularProgress size={16} thickness={5} sx={{ color: 'inherit' }} />
                ) : (
                  <AutoAwesomeRoundedIcon />
                )
              }
              disabled={generate.isPending}
            >
              {generate.isPending ? 'Generando…' : 'Generar resumen'}
            </Button>
          }
        />
      ) : (
        <Box sx={styles.card}>
          <Stack gap={1.25}>
            <Typography sx={styles.sectionLabel}>Resumen</Typography>
            <Typography sx={styles.summaryText}>{data.summary}</Typography>
          </Stack>

          <Stack gap={1.25}>
            <Typography sx={styles.sectionLabel}>Recomendaciones</Typography>
            <Box sx={styles.recommendationsList}>
              {data.recommendations.map((rec, i) => (
                <Box key={i} sx={styles.recommendationItem}>
                  <LightbulbOutlinedIcon className="rec-icon" fontSize="small" />
                  <span>{rec}</span>
                </Box>
              ))}
            </Box>
          </Stack>

          <Box sx={styles.footer}>
            <span>
              Generado {relativeTime(data.generated_at)} · {data.task_count}{' '}
              {data.task_count === 1 ? 'tarea' : 'tareas'} analizadas
            </span>
            <Box sx={styles.modelChip}>{data.model}</Box>
          </Box>
        </Box>
      )}
    </Stack>
  );
}
