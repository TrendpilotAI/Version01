import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import type { ScoreBreakdown } from '@/lib/scoring/types';

interface MetricComparisonProps {
  currentScores: ScoreBreakdown;
  averageScores: ScoreBreakdown;
}

export function MetricComparison({ currentScores, averageScores }: MetricComparisonProps) {
  const data = [
    { metric: 'Novelty', current: currentScores.novelty, average: averageScores.novelty },
    { metric: 'Impact', current: currentScores.impact, average: averageScores.impact },
    { metric: 'Timeliness', current: currentScores.timeliness, average: averageScores.timeliness },
    { metric: 'Actionability', current: currentScores.actionability, average: averageScores.actionability },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Metric Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
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
        </div>
      </CardContent>
    </Card>
  );
}