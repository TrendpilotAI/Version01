import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import RealtimeScoring from '@/components/scoring/realtime/RealtimeScoring';

export function ScoringPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Real-time Scoring</CardTitle>
      </CardHeader>
      <RealtimeScoring workspaceId="default-workspace-id" />
    </Card>
  );
}