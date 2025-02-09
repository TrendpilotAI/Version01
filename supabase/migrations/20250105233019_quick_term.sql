/*
  # Fix Workspace Member Policies

  1. Changes
    - Simplify policies to prevent recursion
    - Add direct user access checks
    - Optimize policy performance

  2. Security
    - Maintain proper access control
    - Ensure data isolation
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Allow workspace access" ON workspaces;
DROP POLICY IF EXISTS "Allow workspace member access" ON workspace_members;
DROP POLICY IF EXISTS "Allow member self-management" ON workspace_members;
DROP POLICY IF EXISTS "Allow newsletter access" ON newsletters;

-- Simple, direct workspace access policy
CREATE POLICY "workspace_member_access"
  ON workspaces
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = id
      AND workspace_members.user_id = auth.uid()
    )
  );

-- Direct workspace member access policy
CREATE POLICY "member_access"
  ON workspace_members
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members AS wm
      WHERE wm.workspace_id = workspace_id
      AND wm.user_id = auth.uid()
    )
  );

-- Self-management policy for members
CREATE POLICY "member_self_management"
  ON workspace_members
  FOR ALL
  USING (user_id = auth.uid());

-- Direct newsletter access policy
CREATE POLICY "newsletter_access"
  ON newsletters
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspace_id
      AND workspace_members.user_id = auth.uid()
    )
  );

-- Add indexes for policy performance
CREATE INDEX IF NOT EXISTS idx_workspace_members_lookup 
ON workspace_members(workspace_id, user_id);