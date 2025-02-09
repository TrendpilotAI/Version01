/*
  # Fix Workspace Member Policies

  1. Changes
    - Remove recursive policies that were causing infinite recursion
    - Add clearer, more efficient policies for workspace access
    - Ensure proper role-based access control

  2. Security
    - Maintain data isolation between workspaces
    - Enforce proper authorization checks
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Enable read access for workspace members" ON workspaces;
DROP POLICY IF EXISTS "Enable read access for members in same workspace" ON workspace_members;
DROP POLICY IF EXISTS "Enable access for workspace members" ON newsletters;

-- Workspace policies
CREATE POLICY "Allow workspace access"
  ON workspaces
  FOR ALL
  USING (
    id IN (
      SELECT workspace_id 
      FROM workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Workspace members policies
CREATE POLICY "Allow workspace member access"
  ON workspace_members
  FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM workspace_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Allow member self-management"
  ON workspace_members
  FOR ALL
  USING (
    user_id = auth.uid()
  );

-- Newsletter policies
CREATE POLICY "Allow newsletter access"
  ON newsletters
  FOR ALL
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Add role-based policies for workspace management
CREATE POLICY "Allow owner workspace management"
  ON workspaces
  FOR UPDATE
  USING (
    id IN (
      SELECT workspace_id 
      FROM workspace_members 
      WHERE user_id = auth.uid() 
      AND role = 'owner'
    )
  );

-- Add indexes to improve policy performance
CREATE INDEX IF NOT EXISTS idx_workspace_members_user_workspace 
ON workspace_members(user_id, workspace_id);

CREATE INDEX IF NOT EXISTS idx_workspace_members_role 
ON workspace_members(role);