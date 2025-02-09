/*
  # Add User Actions and Update Scoring Settings

  1. New Tables
    - `user_actions`: Tracks user interactions with content for learning
  2. Changes
    - Add new columns to `scoring_settings` for learning data
  3. Security
    - Enable RLS on new table
    - Add policies for workspace access
*/

-- User Actions Table
CREATE TABLE IF NOT EXISTS user_actions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  content_id uuid REFERENCES source_content(id),
  action_type text NOT NULL,
  original_score numeric(3,1),
  scoring_details jsonb,
  created_at timestamptz DEFAULT now()
);

-- Add learning columns to scoring_settings
ALTER TABLE scoring_settings
ADD COLUMN IF NOT EXISTS baseline_scores jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS pattern_data jsonb DEFAULT '{}'::jsonb;

-- Enable RLS
ALTER TABLE user_actions ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Users can access workspace actions"
  ON user_actions
  FOR ALL
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid()
    )
  );

-- Add indexes
CREATE INDEX idx_user_actions_workspace ON user_actions(workspace_id);
CREATE INDEX idx_user_actions_content ON user_actions(content_id);
CREATE INDEX idx_user_actions_created ON user_actions(created_at);