export interface ContentSource {
  id: string;
  workspace_id: string;
  name: string;
  url: string;
  category: string;
  is_active: boolean;
  settings: Record<string, any>;
  last_fetched_at: string | null;
  created_at: string;
  health_status: string;
}

export interface SourceContent {
  id: string;
  source_id: string;
  title: string;
  description: string | null;
  url: string | null;
  image_url: string | null;
  score: number | null;
  scoring_details: Record<string, any>;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface ScoringSettings {
  id: string;
  workspace_id: string;
  criteria: {
    novelty: number;
    impact: number;
    timeliness: number;
    actionability: number;
  };
  created_at: string;
  updated_at: string;
}