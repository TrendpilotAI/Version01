import { ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { BaseChart } from './base-chart';
import { calculateAverageScores } from '@/lib/scoring/utils/score-calculations';
import type { ScoreBreakdown } from '@/lib/scoring/types';

interface MetricsChartProps {
  scores: ScoreBreakdown[];
  currentScore: ScoreBreakdown;
  loading?: boolean;
  error?: Error | null;
}

export function MetricsChart({ scores, currentScore, loading, error }: MetricsChartProps) {
  const averageScores = calculateAverageScores(scores);
  
  const data = [
    { metric: 'Novelty', current: currentScore.novelty, average: averageScores.novelty },
    { metric: 'Impact', current: currentScore.impact, average: averageScores.impact },
    { metric: 'Timeliness', current: currentScore.timeliness, average: averageScores.timeliness },
    { metric: 'Actionability', current: currentScore.actionability, average: averageScores.actionability },
  ];

  return (
    <BaseChart title="Metric Comparison" loading={loading} error={error}>
      <ResponsiveContainer>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="metric" />
          <PolarRadiusAxis domain={[0, 5]} />
          <Radar
            name="Current"
            dataKey="current"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.2}
          />
          <Radar
            name="Average"
            dataKey="average"
            stroke="hsl(var(--muted-foreground))"
            fill="hsl(var(--muted-foreground))"
            fillOpacity={0.2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </BaseChart>
  );
}