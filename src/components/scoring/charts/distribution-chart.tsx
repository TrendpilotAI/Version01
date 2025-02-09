import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { BaseChart } from './base-chart';
import { calculateDistribution } from '@/lib/scoring/utils/score-calculations';
import type { ScoreBreakdown } from '@/lib/scoring/types';

interface DistributionChartProps {
  scores: ScoreBreakdown[];
  loading?: boolean;
  error?: Error | null;
}

export function DistributionChart({ scores, loading, error }: DistributionChartProps) {
  const data = calculateDistribution(scores);

  return (
    <BaseChart title="Score Distribution" loading={loading} error={error}>
      <ResponsiveContainer>
        <AreaChart data={data}>
          <XAxis dataKey="range" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="count"
            fill="hsl(var(--primary))"
            fillOpacity={0.2}
            stroke="hsl(var(--primary))"
          />
        </AreaChart>
      </ResponsiveContainer>
    </BaseChart>
  );
}