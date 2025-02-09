import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import type { ScoreBreakdown } from '@/lib/scoring/types';

interface ScoreDistributionProps {
  scores: ScoreBreakdown[];
}

export function ScoreDistribution({ scores }: ScoreDistributionProps) {
  const distributionData = Array.from({ length: 10 }, (_, i) => ({
    range: `${i * 0.5}-${(i + 1) * 0.5}`,
    count: scores.filter(s => 
      s.final >= i * 0.5 && s.final < (i + 1) * 0.5
    ).length
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Score Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={distributionData}>
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
        </div>
      </CardContent>
    </Card>
  );
}