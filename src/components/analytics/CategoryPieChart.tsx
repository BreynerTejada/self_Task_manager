import { useTheme } from '@mui/material';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { CategoryStat } from '@/hooks/useAnalytics';

interface Props {
  data: CategoryStat[];
}

export function CategoryPieChart({ data }: Props) {
  const theme = useTheme();
  if (data.length === 0) return null;
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Tooltip
          contentStyle={{
            background: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 12,
            fontFamily: 'Plus Jakarta Sans',
            fontSize: 13,
            boxShadow: theme.shadows[6],
          }}
        />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={56}
          outerRadius={92}
          paddingAngle={4}
          stroke={theme.palette.background.paper}
          strokeWidth={2}
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
