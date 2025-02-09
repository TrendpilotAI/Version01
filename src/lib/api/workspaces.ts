import { supabase } from '../supabase';

export async function initializeWorkspace(userId: string) {
  try {
    // First check if user already has any workspaces
    const { data: existingWorkspaces, error: fetchError } = await supabase
      .from('workspaces')
      .select('*')
      .eq('workspace_id', userId)
      .maybeSingle();

    if (fetchError) {
      console.error('Error checking existing workspaces:', fetchError);
      throw new Error('Failed to check existing workspaces');
    }

    // If user already has a workspace, return it
    if (existingWorkspaces) {
      return existingWorkspaces;
    }

    // Create default workspace with a unique slug
    const timestamp = Date.now();
    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .insert([{
        name: 'My Workspace',
        slug: `my-workspace-${timestamp}`,
        settings: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (workspaceError) {
      console.error('Error creating workspace:', workspaceError);
      throw new Error('Failed to create workspace');
    }

    // Add user as workspace owner
    const { error: memberError } = await supabase
      .from('workspace_members')
      .insert([{
        workspace_id: workspace.id,
        user_id: userId,
        role: 'owner',
        created_at: new Date().toISOString()
      }]);

    if (memberError) {
      // Attempt to rollback workspace creation
      await supabase
        .from('workspaces')
        .delete()
        .eq('id', workspace.id);
      
      console.error('Error adding workspace member:', memberError);
      throw new Error('Failed to setup workspace membership');
    }

    return workspace;
  } catch (error) {
    console.error('Workspace initialization failed:', error);
    throw error;
  }
}

export async function getWorkspaces(userId: string) {
  try {
    const { data, error } = await supabase
      .from('workspaces')
      .select(`
        *,
        workspace_members!inner(*)
      `)
      .eq('workspace_members.user_id', userId);

    if (error) {
      console.error('Error fetching workspaces:', error);
      throw new Error('Failed to fetch workspaces');
    }

    return data || [];
  } catch (error) {
    console.error('Error in getWorkspaces:', error);
    throw error;
  }
}