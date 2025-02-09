import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { format } from 'date-fns';
import type { ScoreBreakdown } from '@/lib/scoring/types';

interface TrendAnalysisProps {
  scores: Array<{
    date: Date;
    breakdown: ScoreBreakdown;
  }>;
}

export function TrendAnalysis({ scores }: TrendAnalysisProps) {
  const data = scores.map(score => ({
    date: format(score.date, 'MMM d'),
    novelty: score.breakdown.novelty,
    impact: score.breakdown.impact,
    timeliness: score.breakdown.timeliness,
    actionability: score.breakdown.actionability,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Score Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="date" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="novelty" 
                stroke="hsl(var(--chart-1))" 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="impact" 
                stroke="hsl(var(--chart-2))" 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="timeliness" 
                stroke="hsl(var(--chart-3))" 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="actionability" 
                stroke="hsl(var(--chart-4))" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}