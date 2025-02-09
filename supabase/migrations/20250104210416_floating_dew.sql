/*
  # Content Curation System

  1. New Tables
    - content_sources: Manages external content sources
    - source_content: Stores curated content from sources
    - scoring_settings: Configures content scoring criteria

  2. Security
    - Enable RLS on all tables
    - Add policies for workspace-based access
*/

-- Content Sources
CREATE TABLE content_sources (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  name text NOT NULL,
  url text NOT NULL,
  category text NOT NULL,
  is_active boolean DEFAULT true,
  settings jsonb DEFAULT '{}'::jsonb,
  last_fetched_at timestamptz,
  created_at timestamptz DEFAULT now(),
  health_status text DEFAULT 'active'
);

-- Source Content
CREATE TABLE source_content (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_id uuid REFERENCES content_sources(id),
  title text NOT NULL,
  description text,
  url text,
  image_url text,
  score numeric(3,1),
  scoring_details jsonb DEFAULT '{}'::jsonb,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Scoring Settings
CREATE TABLE scoring_settings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  criteria jsonb DEFAULT '{
    "novelty": 3,
    "impact": 3,
    "timeliness": 3,
    "actionability": 3
  }'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE content_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE source_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE scoring_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Content sources access for workspace members"
  ON content_sources
  FOR ALL
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM workspace_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Source content access for workspace members"
  ON source_content
  FOR ALL
  USING (
    source_id IN (
      SELECT id 
      FROM content_sources 
      WHERE workspace_id IN (
        SELECT workspace_id 
        FROM workspace_members 
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Scoring settings access for workspace members"
  ON scoring_settings
  FOR ALL
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Indexes
CREATE INDEX idx_content_sources_workspace ON content_sources(workspace_id);
CREATE INDEX idx_source_content_source ON source_content(source_id);
CREATE INDEX idx_scoring_settings_workspace ON scoring_settings(workspace_id);