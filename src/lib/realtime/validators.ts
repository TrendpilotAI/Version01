import type { RealtimeScore, LearningEvent } from '@/types/scoring';

export function validateScore(score: any): score is RealtimeScore {
  return (
    typeof score === 'object' &&
    typeof score.id === 'string' &&
    typeof score.title === 'string' &&
    typeof score.score === 'number' &&
    typeof score.workspace_id === 'string' &&
    typeof score.created_at === 'string'
  );
}

export function validateLearningEvent(event: any): event is LearningEvent {
  return (
    typeof event === 'object' &&
    typeof event.id === 'string' &&
    typeof event.action_type === 'string' &&
    typeof event.content_id === 'string' &&
    typeof event.workspace_id === 'string' &&
    typeof event.created_at === 'string' &&
    typeof event.original_score === 'number' &&
    typeof event.scoring_details === 'object'
  );
}