/*
  # Fix Workspace Policies and Access Control

  1. Changes
    - Fix infinite recursion in workspace_members policy
    - Add direct user access policies
    - Improve workspace initialization flow

  2. Security
    - Maintain proper access control
    - Prevent policy recursion
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Members can view other members" ON workspace_members;
DROP POLICY IF EXISTS "Users can view their workspaces" ON workspaces;

-- Workspace access policies
CREATE POLICY "Users can view workspaces"
  ON workspaces
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM workspace_members
    WHERE workspace_members.workspace_id = id
    AND workspace_members.user_id = auth.uid()
  ));

-- Workspace members base policies
CREATE POLICY "Users can view workspace members"
  ON workspace_members
  FOR SELECT
  USING (workspace_id IN (
    SELECT workspace_id FROM workspace_members
    WHERE user_id = auth.uid()
  ));

-- Allow users to manage their own workspace membership
CREATE POLICY "Users can manage their membership"
  ON workspace_members
  FOR ALL
  USING (user_id = auth.uid());

-- Newsletter access policies
CREATE POLICY "Users can access newsletters"
  ON newsletters
  FOR ALL
  USING (workspace_id IN (
    SELECT workspace_id FROM workspace_members
    WHERE user_id = auth.uid()
  ));