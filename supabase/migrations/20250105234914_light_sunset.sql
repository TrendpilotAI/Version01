-- Content Feed Settings
CREATE TABLE IF NOT EXISTS feed_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  source_ids text[] DEFAULT array[]::text[],
  filters jsonb DEFAULT '{}'::jsonb,
  sort_config jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Content Feed Items
CREATE TABLE IF NOT EXISTS feed_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  source_id uuid REFERENCES content_sources(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  url text,
  author text,
  published_at timestamptz NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  score numeric(3,1),
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE feed_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'feed_settings' AND policyname = 'workspace_feed_settings_access'
  ) THEN
    DROP POLICY workspace_feed_settings_access ON feed_settings;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'feed_items' AND policyname = 'workspace_feed_items_access'
  ) THEN
    DROP POLICY workspace_feed_items_access ON feed_items;
  END IF;
END $$;

-- RLS Policies
CREATE POLICY "workspace_feed_settings_access"
  ON feed_settings
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspace_id
      AND workspace_members.user_id = auth.uid()
    )
  );

CREATE POLICY "workspace_feed_items_access"
  ON feed_items
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspace_id
      AND workspace_members.user_id = auth.uid()
    )
  );

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_feed_items_workspace ON feed_items(workspace_id);
CREATE INDEX IF NOT EXISTS idx_feed_items_source ON feed_items(source_id);
CREATE INDEX IF NOT EXISTS idx_feed_items_status ON feed_items(status);
CREATE INDEX IF NOT EXISTS idx_feed_items_score ON feed_items(score);
CREATE INDEX IF NOT EXISTS idx_feed_items_published ON feed_items(published_at);

-- Add updated_at triggers
DO $$ BEGIN
  CREATE TRIGGER update_feed_settings_updated_at
    BEFORE UPDATE ON feed_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TRIGGER update_feed_items_updated_at
    BEFORE UPDATE ON feed_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;