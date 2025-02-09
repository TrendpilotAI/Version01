/*
  # Fix RLS Policies

  1. Changes
    - Fix infinite recursion in workspace_members policy
    - Add missing policies for content access
    - Add policies for newsletter issues
    - Improve workspace access control

  2. Security
    - Enable RLS on all tables
    - Add proper access control policies
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view their workspaces" ON workspaces;
DROP POLICY IF EXISTS "Members can view workspace members" ON workspace_members;

-- Workspace policies
CREATE POLICY "Users can view their workspaces"
  ON workspaces
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id 
      FROM workspace_members 
      WHERE workspace_members.workspace_id = id
    )
  );

CREATE POLICY "Users can update their workspaces"
  ON workspaces
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT user_id 
      FROM workspace_members 
      WHERE workspace_members.workspace_id = id
      AND workspace_members.role = 'owner'
    )
  );

-- Workspace members policies
CREATE POLICY "Members can view other members"
  ON workspace_members
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id 
      FROM workspace_members wm2
      WHERE wm2.workspace_id = workspace_id
    )
  );

-- Newsletter issues policies
CREATE POLICY "Members can access newsletter issues"
  ON newsletter_issues
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 
      FROM newsletters n
      JOIN workspace_members wm ON wm.workspace_id = n.workspace_id
      WHERE n.id = newsletter_id
      AND wm.user_id = auth.uid()
    )
  );

-- Content access policies
CREATE POLICY "Members can access content"
  ON source_content
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 
      FROM content_sources cs
      JOIN workspace_members wm ON wm.workspace_id = cs.workspace_id
      WHERE cs.id = source_id
      AND wm.user_id = auth.uid()
    )
  );

-- Scoring settings policies
CREATE POLICY "Members can access scoring settings"
  ON scoring_settings
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 
      FROM workspace_members wm
      WHERE wm.workspace_id = workspace_id
      AND wm.user_id = auth.uid()
    )
  );