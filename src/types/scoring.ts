export interface RealtimeScore {
  id: string;
  title: string;
  score: number;
  workspace_id: string;
  created_at: string;
}

export interface LearningEvent {
  id: string;
  action_type: string;
  content_id: string;
  workspace_id: string;
  created_at: string;
  original_score: number;
  scoring_details: Record<string, any>;
}