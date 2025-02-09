-- Drop problematic policies
DROP POLICY IF EXISTS "workspace_member_access" ON workspace_members;
DROP POLICY IF EXISTS "member_access" ON workspace_members;
DROP POLICY IF EXISTS "member_self_management" ON workspace_members;

-- Create simplified workspace member policies
CREATE POLICY "enable_workspace_member_select"
  ON workspace_members
  FOR SELECT
  USING (
    user_id = auth.uid() OR
    workspace_id IN (
      SELECT workspace_id 
      FROM workspace_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "enable_workspace_member_insert"
  ON workspace_members
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid() OR
    workspace_id IN (
      SELECT workspace_id 
      FROM workspace_members 
      WHERE user_id = auth.uid() 
      AND role = 'owner'
    )
  );

CREATE POLICY "enable_workspace_member_delete"
  ON workspace_members
  FOR DELETE
  USING (
    user_id = auth.uid() OR
    workspace_id IN (
      SELECT workspace_id 
      FROM workspace_members 
      WHERE user_id = auth.uid() 
      AND role = 'owner'
    )
  );

-- Add index to improve policy performance
CREATE INDEX IF NOT EXISTS idx_workspace_members_user_workspace 
ON workspace_members(user_id, workspace_id);