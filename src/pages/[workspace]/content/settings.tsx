import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SourceManager } from '@/components/content/SourceManager';
import { ScoringConfig } from '@/components/content/ScoringConfig';
import { Distribution } from '@/components/content/Distribution';
import { useToast } from '@/components/ui/use-toast';
import { getCurrentUser } from '@/lib/auth';
import { getWorkspaces } from '@/lib/api';

export default function ContentSettings() {
  const { workspace } = useParams<{ workspace: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    async function checkAccess() {
      try {
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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold">Content Settings</h2>
            <p className="text-muted-foreground">
              Configure content sources, scoring, and distribution
            </p>
          </div>
        </div>

        <Tabs defaultValue="sources">
          <TabsList>
            <TabsTrigger value="sources">Sources</TabsTrigger>
            <TabsTrigger value="scoring">Scoring</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
          </TabsList>

          <TabsContent value="sources">
            <Card className="p-6">
              <SourceManager
                selectedSource={null}
                onSourceSelect={() => {}}
              />
            </Card>
          </TabsContent>

          <TabsContent value="scoring">
            <Card className="p-6">
              <ScoringConfig />
            </Card>
          </TabsContent>

          <TabsContent value="distribution">
            <Card className="p-6">
              <Distribution content={[]} />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}