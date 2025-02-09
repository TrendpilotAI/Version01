/*
  # Add social media platform support
  
  1. Changes
    - Add support for Instagram, Facebook, and Threads
    - Update social_posts table platform constraints
    - Add media support for social posts
    - Add social media settings table
*/

-- Drop existing constraint if it exists
ALTER TABLE social_posts 
  DROP CONSTRAINT IF EXISTS social_posts_platform_check;

-- Add new platform constraint
ALTER TABLE social_posts 
  ADD CONSTRAINT social_posts_platform_check 
  CHECK (platform IN ('twitter', 'linkedin', 'instagram', 'facebook', 'threads'));

-- Add media support
ALTER TABLE social_posts
  ADD COLUMN IF NOT EXISTS media_urls text[] DEFAULT array[]::text[],
  ADD COLUMN IF NOT EXISTS workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE;

-- Create social media settings table
CREATE TABLE IF NOT EXISTS social_media_settings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  platform text NOT NULL,
  credentials jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(workspace_id, platform)
);

-- Enable RLS
ALTER TABLE social_media_settings ENABLE ROW LEVEL SECURITY;

-- Add policies for social posts
CREATE POLICY "Enable access for workspace members on social posts"
  ON social_posts
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = social_posts.workspace_id
      AND workspace_members.user_id = auth.uid()
    )
  );

-- Add policies for social media settings
CREATE POLICY "Enable access for workspace members on social media settings"
  ON social_media_settings
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = social_media_settings.workspace_id
      AND workspace_members.user_id = auth.uid()
    )
  );

-- Add index for social media settings
CREATE INDEX IF NOT EXISTS idx_social_media_settings_workspace ON social_media_settings(workspace_id);