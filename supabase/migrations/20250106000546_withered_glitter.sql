-- Drop all existing workspace member policies
DO $$ BEGIN
  DROP POLICY IF EXISTS "workspace_members_base_access" ON workspace_members;
  DROP POLICY IF EXISTS "workspace_members_owner_access" ON workspace_members;
  DROP POLICY IF EXISTS "enable_workspace_member_select" ON workspace_members;
  DROP POLICY IF EXISTS "enable_workspace_member_insert" ON workspace_members;
  DROP POLICY IF EXISTS "enable_workspace_member_delete" ON workspace_members;
END $$;

-- Create a single, simple policy for workspace members
CREATE POLICY "workspace_member_access_policy"
  ON workspace_members
  FOR ALL
  USING (
    -- Users can access records where they are either:
    -- 1. The member themselves
    -- 2. An owner of the workspace
    user_id = auth.uid() OR
    (
      workspace_id IN (
        SELECT wm.workspace_id
        FROM workspace_members wm
        WHERE wm.user_id = auth.uid()
        AND wm.role = 'owner'
      )
    )
  );

-- Optimize indexes
CREATE INDEX IF NOT EXISTS idx_workspace_members_lookup 
ON workspace_members(user_id, workspace_id, role);

-- Update newsletter policy to use direct user lookup
DROP POLICY IF EXISTS "newsletter_access" ON newsletters;
CREATE POLICY "newsletter_access"
  ON newsletters
  FOR ALL
  USING (
    workspace_id IN (
      SELECT workspace_id
      FROM workspace_members
      WHERE user_id = auth.uid()
    )
  );