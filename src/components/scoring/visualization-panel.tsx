import { useScoreData } from '@/lib/scoring/hooks/use-score-data';
import { DistributionChart } from './charts/distribution-chart';
import { MetricsChart } from './charts/metrics-chart';

interface VisualizationPanelProps {
  workspaceId: string;
  currentScore?: ScoreBreakdown;
}

export function VisualizationPanel({ workspaceId, currentScore }: VisualizationPanelProps) {
  const { scores, loading, error } = useScoreData(workspaceId);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <DistributionChart
        scores={scores.map(s => s.breakdown)}
        loading={loading}
        error={error}
      />
      {currentScore && (
        <MetricsChart
          scores={scores.map(s => s.breakdown)}
          currentScore={currentScore}
          loading={loading}
          error={error}
        />
      )}
    </div>
  );
}