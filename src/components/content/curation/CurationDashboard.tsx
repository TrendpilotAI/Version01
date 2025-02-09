import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContentDiscoveryEngine } from '../discovery/ContentDiscoveryEngine';
import { MetricsOverview } from './MetricsOverview';
import { CurationQueue } from './CurationQueue';
import { AutomationSettings } from './AutomationSettings';

export function CurationDashboard() {
  const [activeTab, setActiveTab] = useState('discovery');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Content Curation</h1>
        <p className="text-muted-foreground">
          Discover, evaluate, and curate content for your audience
        </p>
      </div>

      <MetricsOverview />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="discovery">Discovery</TabsTrigger>
          <TabsTrigger value="queue">Curation Queue</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="discovery">
          <ContentDiscoveryEngine />
        </TabsContent>

        <TabsContent value="queue">
          <CurationQueue />
        </TabsContent>

        <TabsContent value="automation">
          <AutomationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}