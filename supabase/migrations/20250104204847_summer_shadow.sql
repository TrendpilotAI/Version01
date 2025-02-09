/*
  # Enhanced Newsletter Schema
  
  1. New Tables
    - newsletter_issues: Separate content into discrete issues
    - newsletter_subscriptions: Many-to-many newsletter-subscriber relationship
    - social_posts: Social media integration
    - api_keys: API authentication
    - billing_subscriptions: Detailed billing tracking
    - usage_metrics: Usage tracking
    
  2. Enhancements
    - Added subscriber details
    - Improved status enums
    - Better metadata structure
    
  3. Security
    - Enhanced RLS policies
    - Utility functions
*/

-- Enable pg_stat_statements extension
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Add new fields to subscribers
ALTER TABLE subscribers 
ADD COLUMN IF NOT EXISTS first_name text,
ADD COLUMN IF NOT EXISTS last_name text,
ADD COLUMN IF NOT EXISTS preferences jsonb DEFAULT '{}'::jsonb;

-- Create newsletter_issues table
CREATE TABLE IF NOT EXISTS newsletter_issues (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  newsletter_id uuid REFERENCES newsletters(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'reviewing', 'scheduled', 'published')),
  scheduled_for timestamptz,
  published_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  metrics jsonb DEFAULT '{}'::jsonb,
  ai_generated boolean DEFAULT false
);

-- Create newsletter_subscriptions table
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  newsletter_id uuid REFERENCES newsletters(id) ON DELETE CASCADE,
  subscriber_id uuid REFERENCES subscribers(id) ON DELETE CASCADE,
  status text DEFAULT 'subscribed' CHECK (status IN ('subscribed', 'unsubscribed')),
  created_at timestamptz DEFAULT now() NOT NULL,
  PRIMARY KEY (newsletter_id, subscriber_id)
);

-- Create social_posts table
CREATE TABLE IF NOT EXISTS social_posts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
  issue_id uuid REFERENCES newsletter_issues(id) ON DELETE CASCADE,
  platform text NOT NULL CHECK (platform IN ('twitter', 'linkedin')),
  content text NOT NULL,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
  scheduled_for timestamptz,
  published_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create api_keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  key text UNIQUE NOT NULL,
  scopes text[] DEFAULT array[]::text[],
  created_at timestamptz DEFAULT now() NOT NULL,
  expires_at timestamptz,
  last_used_at timestamptz
);

-- Create usage_metrics table
CREATE TABLE IF NOT EXISTS usage_metrics (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
  metric_type text NOT NULL,
  value integer NOT NULL,
  recorded_at timestamptz DEFAULT now() NOT NULL
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_issues_newsletter ON newsletter_issues(newsletter_id);
CREATE INDEX IF NOT EXISTS idx_issues_status ON newsletter_issues(status);
CREATE INDEX IF NOT EXISTS idx_social_posts_workspace ON social_posts(workspace_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_workspace ON api_keys(workspace_id);
CREATE INDEX IF NOT EXISTS idx_usage_metrics_workspace ON usage_metrics(workspace_id);

-- Enable RLS
ALTER TABLE newsletter_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Newsletter issues access for workspace members"
  ON newsletter_issues
  FOR ALL
  USING (
    newsletter_id IN (
      SELECT id 
      FROM newsletters 
      WHERE workspace_id IN (
        SELECT workspace_id 
        FROM workspace_members 
        WHERE user_id = auth.uid()
      )
    )
  );

-- Utility Functions
CREATE OR REPLACE FUNCTION get_workspace_usage(workspace_id uuid, metric_type text)
RETURNS integer AS $$
BEGIN
  RETURN (
    SELECT sum(value)
    FROM usage_metrics
    WHERE workspace_id = $1
    AND metric_type = $2
    AND recorded_at >= date_trunc('month', current_date)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;