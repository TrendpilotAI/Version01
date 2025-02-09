import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { IntegrationsOverview } from '@/components/integrations/IntegrationsOverview';
import { SourceCatalog } from '@/components/integrations/SourceCatalog';
import { ConnectionManager } from '@/components/integrations/ConnectionManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function IntegrationsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Content Sources</h1>
          <p className="text-muted-foreground mt-1">
            Manage your content sources and data integrations
          </p>
        </div>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sources">Source Catalog</TabsTrigger>
            <TabsTrigger value="connections">Connections</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <IntegrationsOverview />
          </TabsContent>

          <TabsContent value="sources">
            <SourceCatalog />
          </TabsContent>

          <TabsContent value="connections">
            <ConnectionManager />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}