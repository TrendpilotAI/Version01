import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ConfigurationValidator } from '@/components/integrations/ConfigurationValidator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { ModelSelector } from '@/components/ai/ModelSelector';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';

export default function Settings() {
  const [aiSettings, setAiSettings] = useState({
    defaultModel: 'deepseek-r1-chat',
    temperature: 0.7,
    maxTokens: 1000,
    autoSave: true
  });

  const [integrationSettings, setIntegrationSettings] = useState({
    newsApiKey: '',
    beehiivApiKey: '',
    twitterApiKey: '',
    linkedinApiKey: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    contentAlerts: true,
    systemAlerts: true
  });

  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: 'Settings saved',
      description: 'Your settings have been updated successfully.'
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your application settings and preferences
          </p>
        </div>

        <Tabs defaultValue="ai">
          <TabsList>
            <TabsTrigger value="ai">AI Settings</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>

          <TabsContent value="ai" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>AI Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Default Model</Label>
                  <ModelSelector 
                    value={aiSettings.defaultModel}
                    onChange={(value) => setAiSettings({ ...aiSettings, defaultModel: value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Temperature</Label>
                  <Slider 
                    value={[aiSettings.temperature]}
                    onValueChange={([value]) => setAiSettings({ ...aiSettings, temperature: value })}
                    min={0}
                    max={1}
                    step={0.1}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Max Tokens</Label>
                  <Input 
                    type="number"
                    value={aiSettings.maxTokens}
                    onChange={(e) => setAiSettings({ ...aiSettings, maxTokens: parseInt(e.target.value) })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Auto-save generated content</Label>
                  <Switch 
                    checked={aiSettings.autoSave}
                    onCheckedChange={(checked) => setAiSettings({ ...aiSettings, autoSave: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>NewsAPI Key</Label>
                  <Input 
                    type="password"
                    value={integrationSettings.newsApiKey}
                    onChange={(e) => setIntegrationSettings({ ...integrationSettings, newsApiKey: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Beehiiv API Key</Label>
                  <Input 
                    type="password"
                    value={integrationSettings.beehiivApiKey}
                    onChange={(e) => setIntegrationSettings({ ...integrationSettings, beehiivApiKey: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Twitter API Key</Label>
                  <Input 
                    type="password"
                    value={integrationSettings.twitterApiKey}
                    onChange={(e) => setIntegrationSettings({ ...integrationSettings, twitterApiKey: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>LinkedIn API Key</Label>
                  <Input 
                    type="password"
                    value={integrationSettings.linkedinApiKey}
                    onChange={(e) => setIntegrationSettings({ ...integrationSettings, linkedinApiKey: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="configuration" className="space-y-4">
            <ConfigurationValidator />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label>Email Notifications</Label>
                  <Switch 
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, emailNotifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Push Notifications</Label>
                  <Switch 
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, pushNotifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Content Alerts</Label>
                  <Switch 
                    checked={notificationSettings.contentAlerts}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, contentAlerts: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>System Alerts</Label>
                  <Switch 
                    checked={notificationSettings.systemAlerts}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, systemAlerts: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Theme Settings</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Theme settings will be implemented */}
                <p className="text-muted-foreground">Theme settings coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Settings</Button>
        </div>
      </div>
    </DashboardLayout>
  );
}