import { ScoreDistribution } from './score-distribution';
import { MetricComparison } from './metric-comparison';
import { TrendAnalysis } from './trend-analysis';
import type { ScoreBreakdown } from '@/lib/scoring/types';

interface VisualizationDashboardProps {
  scores: Array<{
    date: Date;
    breakdown: ScoreBreakdown;
  }>;
  currentScores: ScoreBreakdown;
  averageScores: ScoreBreakdown;
}

export function VisualizationDashboard({
  scores,
  currentScores,
  averageScores,
}: VisualizationDashboardProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <ScoreDistribution scores={scores.map(s => s.breakdown)} />
      <MetricComparison 
        currentScores={currentScores}
        averageScores={averageScores}
      />
      <div className="md:col-span-2">
        <TrendAnalysis scores={scores} />
      </div>
    </div>
  );
}