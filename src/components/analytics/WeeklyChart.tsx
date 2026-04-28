import { useTheme } from '@mui/material';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { WeeklyStat } from '@/hooks/useAnalytics';

interface Props {
  data: WeeklyStat[];
}

export function WeeklyChart({ data }: Props) {
  const theme = useTheme();
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a5b4fc" stopOpacity={0.95} />
            <stop offset="100%" stopColor="#6366f1" stopOpacity={0.7} />
          </linearGradient>
          <linearGradient id="barCreated" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={theme.palette.text.disabled} stopOpacity={0.4} />
            <stop offset="100%" stopColor={theme.palette.text.disabled} stopOpacity={0.18} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={theme.palette.divider} strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="label"
          stroke={theme.palette.text.secondary}
          tick={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          stroke={theme.palette.text.secondary}
          tick={{ fontFamily: 'JetBrains Mono', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          cursor={{ fill: theme.palette.action.hover }}
          contentStyle={{
            background: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 12,
            fontFamily: 'Plus Jakarta Sans',
            fontSize: 13,
            boxShadow: theme.shadows[6],
          }}
          labelStyle={{ fontWeight: 600 }}
        />
        <Bar dataKey="created" name="Created" fill="url(#barCreated)" radius={[6, 6, 0, 0]} />
        <Bar dataKey="completed" name="Completed" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
