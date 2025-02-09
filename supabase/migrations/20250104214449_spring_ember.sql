/*
  # Fix workspace member policies

  1. Changes
    - Remove recursive policies causing infinite loops
    - Simplify workspace access checks
    - Add clearer policy names and descriptions
*/

-- Drop problematic policies
DROP POLICY IF EXISTS "Users can view workspaces" ON workspaces;
DROP POLICY IF EXISTS "Users can view workspace members" ON workspace_members;
DROP POLICY IF EXISTS "Users can manage their membership" ON workspace_members;
DROP POLICY IF EXISTS "Users can access newsletters" ON newsletters;

-- Workspace policies
CREATE POLICY "Enable read access for workspace members"
  ON workspaces
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = id
      AND workspace_members.user_id = auth.uid()
    )
  );

-- Workspace members policies
CREATE POLICY "Enable read access for members in same workspace"
  ON workspace_members
  FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members AS wm
      WHERE wm.user_id = auth.uid()
    )
  );

-- Newsletter policies
CREATE POLICY "Enable access for workspace members"
  ON newsletters
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspace_id
      AND workspace_members.user_id = auth.uid()
    )
  );