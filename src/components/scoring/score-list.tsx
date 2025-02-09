import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ScoreBreakdown } from '@/lib/scoring/types';

interface ScoreListProps {
  scores: Array<{
    id: string;
    title: string;
    breakdown: ScoreBreakdown;
  }>;
}

export function ScoreList({ scores }: ScoreListProps) {
  return (
    <div className="space-y-4">
      {scores.map(({ id, title, breakdown }) => (
        <Card key={id}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">{title}</h4>
              <Badge variant={getScoreVariant(breakdown.final)}>
                {breakdown.final.toFixed(1)}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Novelty</span>
                <span>{breakdown.novelty.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Impact</span>
                <span>{breakdown.impact.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Timeliness</span>
                <span>{breakdown.timeliness.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Actionability</span>
                <span>{breakdown.actionability.toFixed(1)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function getScoreVariant(score: number) {
  if (score >= 4) return 'default';
  if (score >= 3) return 'secondary';
  return 'destructive';
}