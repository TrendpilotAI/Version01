import React from 'react';
import { ScoreUpdates } from './ScoreUpdates';
import { LearningEvents } from './LearningEvents';
import { useRealtimeSubscriptions } from '@/hooks/useRealtimeSubscriptions';

interface RealtimeScoringProps {
  workspaceId: string;
}

const RealtimeScoring: React.FC<RealtimeScoringProps> = ({ workspaceId }) => {
  const { realtimeScores, learningEvents } = useRealtimeSubscriptions(workspaceId);

  return (
    <div className="space-y-6">
      <ScoreUpdates scores={realtimeScores} />
      <LearningEvents events={learningEvents} />
    </div>
  );
};

export default RealtimeScoring;