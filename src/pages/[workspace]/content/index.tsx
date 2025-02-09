import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Dashboard } from '@/components/content/Dashboard';
import { useToast } from '@/components/ui/use-toast';
import { getCurrentUser } from '@/lib/auth';
import { getWorkspaces } from '@/lib/api';
import { testSupabaseConnection } from '@/lib/test-connection';

export default function WorkspaceContent() {
  const { workspace } = useParams<{ workspace: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    async function checkAccess() {
      try {
        // Test Supabase connection
        const connectionTest = await testSupabaseConnection();
        if (!connectionTest.success) {
          toast({
            title: 'Connection Error',
            description: connectionTest.message,
            variant: 'destructive',
          });
          return;
        }

        // Check authentication
        const user = await getCurrentUser();
        if (!user) {
          navigate('/auth');
          return;
        }

        // Check workspace access
        const workspaces = await getWorkspaces(user.id);
        const hasWorkspaceAccess = workspaces.some(w => w.slug === workspace);
        
        if (!hasWorkspaceAccess) {
          toast({
            title: 'Access Denied',
            description: 'You do not have access to this workspace',
            variant: 'destructive',
          });
          navigate('/dashboard');
          return;
        }

        setHasAccess(true);
      } catch (error) {
        console.error('Access check failed:', error);
        toast({
          title: 'Error',
          description: 'Failed to verify workspace access',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }

    checkAccess();
  }, [workspace, navigate, toast]);

  if (loading) {
    return (
      <DashboardLayout>
        <div>Loading...</div>
      </DashboardLayout>
    );
  }

  if (!hasAccess) {
    return null;
  }

  return (
    <DashboardLayout>
      <Dashboard />
    </DashboardLayout>
  );
}