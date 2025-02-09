import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { RealtimeScore } from '@/types/scoring';

interface ScoreUpdatesProps {
  scores: RealtimeScore[];
}

export const ScoreUpdates: React.FC<ScoreUpdatesProps> = ({ scores }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Real-time Scores</span>
          <Badge>{scores.length} Updates</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {scores.slice(0, 5).map((score) => (
            <div 
              key={score.id}
              className="flex justify-between items-center p-2 bg-gray-50 rounded"
            >
              <span className="truncate flex-1 mr-4">{score.title}</span>
              <Badge variant={score.score >= 4 ? "success" : "default"}>
                {score.score.toFixed(1)}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};