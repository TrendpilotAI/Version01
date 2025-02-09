/*
  # Airbyte Integration Schema

  1. New Tables
    - `airbyte_sources` - Stores Airbyte source configurations
    - `airbyte_destinations` - Stores Airbyte destination configurations
    - `airbyte_connections` - Stores connection details between sources and destinations
    - `airbyte_sync_logs` - Tracks sync history and status

  2. Security
    - Enable RLS on all tables
    - Add policies for workspace-based access control

  3. Indexes
    - Add indexes for foreign keys and frequently queried fields
*/

-- Airbyte Sources
CREATE TABLE IF NOT EXISTS airbyte_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  airbyte_source_id text NOT NULL,
  name text NOT NULL,
  type text NOT NULL,
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text DEFAULT 'active',
  health_status text DEFAULT 'pending',
  last_sync_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Airbyte Destinations
CREATE TABLE IF NOT EXISTS airbyte_destinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  airbyte_destination_id text NOT NULL,
  name text NOT NULL,
  type text NOT NULL,
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(workspace_id)
);

-- Airbyte Connections
CREATE TABLE IF NOT EXISTS airbyte_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  source_id uuid REFERENCES airbyte_sources(id) ON DELETE CASCADE,
  destination_id uuid REFERENCES airbyte_destinations(id) ON DELETE CASCADE,
  airbyte_connection_id text NOT NULL,
  sync_catalog jsonb NOT NULL DEFAULT '{}'::jsonb,
  sync_schedule jsonb DEFAULT '{}'::jsonb,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Airbyte Sync Logs
CREATE TABLE IF NOT EXISTS airbyte_sync_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id uuid REFERENCES airbyte_connections(id) ON DELETE CASCADE,
  status text NOT NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  records_synced integer DEFAULT 0,
  bytes_synced bigint DEFAULT 0,
  error_message text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE airbyte_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE airbyte_destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE airbyte_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE airbyte_sync_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can access workspace sources"
  ON airbyte_sources
  FOR ALL
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can access workspace destinations"
  ON airbyte_destinations
  FOR ALL
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can access workspace connections"
  ON airbyte_connections
  FOR ALL
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can access workspace sync logs"
  ON airbyte_sync_logs
  FOR ALL
  USING (
    connection_id IN (
      SELECT id FROM airbyte_connections
      WHERE workspace_id IN (
        SELECT workspace_id FROM workspace_members
        WHERE user_id = auth.uid()
      )
    )
  );

-- Add indexes
CREATE INDEX idx_airbyte_sources_workspace ON airbyte_sources(workspace_id);
CREATE INDEX idx_airbyte_sources_status ON airbyte_sources(status);
CREATE INDEX idx_airbyte_sources_health ON airbyte_sources(health_status);

CREATE INDEX idx_airbyte_destinations_workspace ON airbyte_destinations(workspace_id);

CREATE INDEX idx_airbyte_connections_workspace ON airbyte_connections(workspace_id);
CREATE INDEX idx_airbyte_connections_source ON airbyte_connections(source_id);
CREATE INDEX idx_airbyte_connections_destination ON airbyte_connections(destination_id);
CREATE INDEX idx_airbyte_connections_status ON airbyte_connections(status);

CREATE INDEX idx_airbyte_sync_logs_connection ON airbyte_sync_logs(connection_id);
CREATE INDEX idx_airbyte_sync_logs_status ON airbyte_sync_logs(status);
CREATE INDEX idx_airbyte_sync_logs_started ON airbyte_sync_logs(started_at);

-- Add updated_at triggers
CREATE TRIGGER update_airbyte_sources_updated_at
  BEFORE UPDATE ON airbyte_sources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_airbyte_destinations_updated_at
  BEFORE UPDATE ON airbyte_destinations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_airbyte_connections_updated_at
  BEFORE UPDATE ON airbyte_connections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();