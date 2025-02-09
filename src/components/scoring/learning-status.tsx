import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain } from 'lucide-react';

interface LearningStatusProps {
  actionCount: number;
  patterns: Record<string, any>;
  recommendedWeights: Record<string, number>;
}

export function LearningStatus({ 
  actionCount, 
  patterns, 
  recommendedWeights 
}: LearningStatusProps) {
  const learningProgress = Math.min(actionCount / 100 * 100, 100);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-primary" />
          <CardTitle>Learning Status</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Learning Progress</span>
            <span>{learningProgress.toFixed(0)}%</span>
          </div>
          <Progress value={learningProgress} />
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Recommended Weights</h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(recommendedWeights).map(([metric, weight]) => (
              <div key={metric} className="flex justify-between items-center">
                <span className="capitalize text-sm">{metric}</span>
                <Badge variant="secondary">
                  {weight.toFixed(2)}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Pattern Recognition</h4>
          <div className="text-sm text-muted-foreground">
            {actionCount > 0 
              ? `Learning from ${actionCount} content interactions`
              : 'Waiting for content interactions to start learning'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}