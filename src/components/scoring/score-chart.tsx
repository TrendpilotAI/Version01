import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { ScoreBreakdown } from '@/lib/scoring/types';

interface ScoreChartProps {
  scores: ScoreBreakdown[];
}

export function ScoreChart({ scores }: ScoreChartProps) {
  const data = scores.map(score => ({
    novelty: score.novelty,
    impact: score.impact,
    timeliness: score.timeliness,
    actionability: score.actionability,
  }));

  return (
    <Card className="p-4">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis domain={[0, 5]} />
            <Tooltip />
            <Bar dataKey="novelty" fill="hsl(var(--chart-1))" />
            <Bar dataKey="impact" fill="hsl(var(--chart-2))" />
            <Bar dataKey="timeliness" fill="hsl(var(--chart-3))" />
            <Bar dataKey="actionability" fill="hsl(var(--chart-4))" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}