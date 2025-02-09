-- Create historical trends table
CREATE TABLE historical_trends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  name text NOT NULL,
  signals jsonb NOT NULL,
  outcome jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Create trend predictions table
CREATE TABLE trend_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  topic text NOT NULL,
  prediction jsonb NOT NULL,
  actual_outcome jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE historical_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE trend_predictions ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "workspace_historical_trends_access"
  ON historical_trends
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspace_id
      AND workspace_members.user_id = auth.uid()
    )
  );

CREATE POLICY "workspace_trend_predictions_access"
  ON trend_predictions
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspace_id
      AND workspace_members.user_id = auth.uid()
    )
  );

-- Add indexes
CREATE INDEX idx_historical_trends_workspace ON historical_trends(workspace_id);
CREATE INDEX idx_trend_predictions_workspace ON trend_predictions(workspace_id);
CREATE INDEX idx_trend_predictions_topic ON trend_predictions(topic);