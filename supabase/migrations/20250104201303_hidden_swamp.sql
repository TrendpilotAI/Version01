/*
  # Initial TrendPilot Schema

  1. Core Tables
    - `workspaces` - Team workspaces
    - `workspace_members` - Workspace member relationships
    - `newsletters` - Newsletter configurations
    - `subscribers` - Newsletter subscribers
    - `content` - Newsletter content/issues
    - `analytics` - Performance metrics

  2. Security
    - Enable RLS on all tables
    - Add policies for workspace-based access
    - Set up authentication policies

  3. Indexes
    - Add performance indexes for common queries
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Workspaces
CREATE TABLE workspaces (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  logo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  settings jsonb DEFAULT '{}'::jsonb,
  subscription_tier text DEFAULT 'free',
  subscription_status text DEFAULT 'active',
  stripe_customer_id text,
  stripe_subscription_id text
);

-- Workspace Members
CREATE TABLE workspace_members (
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member',
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (workspace_id, user_id)
);

-- Newsletters
CREATE TABLE newsletters (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  beehiiv_publication_id text,
  status text DEFAULT 'draft'
);

-- Subscribers
CREATE TABLE subscribers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text NOT NULL,
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  newsletter_id uuid REFERENCES newsletters(id) ON DELETE CASCADE,
  status text DEFAULT 'active',
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(email, newsletter_id)
);

-- Content
CREATE TABLE content (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  newsletter_id uuid REFERENCES newsletters(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  status text DEFAULT 'draft',
  scheduled_for timestamptz,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb,
  ai_generated boolean DEFAULT false
);

-- Analytics
CREATE TABLE analytics (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  newsletter_id uuid REFERENCES newsletters(id) ON DELETE CASCADE,
  content_id uuid REFERENCES content(id) ON DELETE CASCADE,
  type text NOT NULL,
  value numeric NOT NULL,
  recorded_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Enable Row Level Security
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletters ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Workspaces: Users can read workspaces they're members of
CREATE POLICY "Users can view their workspaces"
  ON workspaces
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspaces.id
      AND workspace_members.user_id = auth.uid()
    )
  );

-- Workspace Members: Members can view other members in their workspaces
CREATE POLICY "Members can view workspace members"
  ON workspace_members
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members AS wm
      WHERE wm.workspace_id = workspace_members.workspace_id
      AND wm.user_id = auth.uid()
    )
  );

-- Newsletters: Members can view newsletters in their workspaces
CREATE POLICY "Members can view workspace newsletters"
  ON newsletters
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = newsletters.workspace_id
      AND workspace_members.user_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX idx_workspace_members_user_id ON workspace_members(user_id);
CREATE INDEX idx_newsletters_workspace_id ON newsletters(workspace_id);
CREATE INDEX idx_subscribers_newsletter_id ON subscribers(newsletter_id);
CREATE INDEX idx_content_newsletter_id ON content(newsletter_id);
CREATE INDEX idx_analytics_newsletter_id ON analytics(newsletter_id);
CREATE INDEX idx_analytics_content_id ON analytics(content_id);

-- Functions and Triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_workspaces_updated_at
  BEFORE UPDATE ON workspaces
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_newsletters_updated_at
  BEFORE UPDATE ON newsletters
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_subscribers_updated_at
  BEFORE UPDATE ON subscribers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_content_updated_at
  BEFORE UPDATE ON content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();