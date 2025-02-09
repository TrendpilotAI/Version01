-- Drop existing problematic policies
DROP POLICY IF EXISTS "enable_workspace_member_select" ON workspace_members;
DROP POLICY IF EXISTS "enable_workspace_member_insert" ON workspace_members;
DROP POLICY IF EXISTS "enable_workspace_member_delete" ON workspace_members;

-- Create base policy for workspace members
CREATE POLICY "workspace_members_base_access"
  ON workspace_members
  FOR ALL
  USING (
    -- Users can access their own membership records
    user_id = auth.uid()
  );

-- Create owner policy for workspace members
CREATE POLICY "workspace_members_owner_access"
  ON workspace_members
  FOR ALL
  USING (
    -- Workspace owners can manage all members
    EXISTS (
      SELECT 1 FROM workspace_members owners
      WHERE owners.workspace_id = workspace_members.workspace_id
      AND owners.user_id = auth.uid()
      AND owners.role = 'owner'
    )
  );

-- Add index to optimize policy performance
CREATE INDEX IF NOT EXISTS idx_workspace_members_role 
ON workspace_members(workspace_id, user_id, role);

-- Refresh existing policies on related tables
DO $$ 
BEGIN
  -- Refresh newsletter access policy
  DROP POLICY IF EXISTS "newsletter_access" ON newsletters;
  CREATE POLICY "newsletter_access"
    ON newsletters
    FOR ALL
    USING (
      EXISTS (
        SELECT 1 FROM workspace_members
        WHERE workspace_members.workspace_id = newsletters.workspace_id
        AND workspace_members.user_id = auth.uid()
      )
    );
END $$;