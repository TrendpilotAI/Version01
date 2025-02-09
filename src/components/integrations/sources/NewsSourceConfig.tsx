import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { sourceDefinitions } from '@/lib/integrations/airbyte/sourceConfigs';
import { SourceManager } from '@/lib/integrations/airbyte/SourceManager';

interface NewsSourceConfigProps {
  sourceType: 'newsio' | 'newsdata';
  onConfigured: () => void;
}

export function NewsSourceConfig({ sourceType, onConfigured }: NewsSourceConfigProps) {
  const [config, setConfig] = useState({
    apiKey: '',
    categories: [],
    languages: [],
    domains: '',
    syncSchedule: ''
  });
  const [isConfiguring, setIsConfiguring] = useState(false);
  const { toast } = useToast();
  const sourceManager = new SourceManager('default-workspace-id');
  const sourceConfig = sourceDefinitions[sourceType];

  const handleConfigure = async () => {
    if (!config.apiKey) {
      toast({
        title: 'API Key Required',
        description: 'Please enter your API key',
        variant: 'destructive'
      });
      return;
    }

    setIsConfiguring(true);
    try {
      await sourceManager.addSource(sourceType, {
        name: sourceConfig.name,
        sourceType: sourceType,
        credentials: config
      });

      toast({
        title: 'Source Configured',
        description: `${sourceConfig.name} has been configured successfully`
      });
      onConfigured();
    } catch (error) {
      toast({
        title: 'Configuration Failed',
        description: error instanceof Error ? error.message : 'Failed to configure source',
        variant: 'destructive'
      });
    } finally {
      setIsConfiguring(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>{sourceConfig.icon}</span>
          {sourceConfig.name} Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="apiKey">API Key</Label>
          <Input
            id="apiKey"
            type="password"
            value={config.apiKey}
            onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
            placeholder={`Enter your ${sourceConfig.name} API key`}
          />
        </div>

        {sourceType === 'newsio' && (
          <div className="space-y-2">
            <Label>Categories</Label>
            <Select
              value={config.categories[0]}
              onValueChange={(value) => setConfig({ ...config, categories: [value] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select categories" />
              </SelectTrigger>
              <SelectContent>
                {sourceConfig.configFields
                  .find(f => f.name === 'categories')
                  ?.options?.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {sourceType === 'newsdata' && (
          <>
            <div className="space-y-2">
              <Label>Languages</Label>
              <Select
                value={config.languages[0]}
                onValueChange={(value) => setConfig({ ...config, languages: [value] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select languages" />
                </SelectTrigger>
                <SelectContent>
                  {sourceConfig.configFields
                    .find(f => f.name === 'languages')
                    ?.options?.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="domains">Domains (optional)</Label>
              <Input
                id="domains"
                value={config.domains}
                onChange={(e) => setConfig({ ...config, domains: e.target.value })}
                placeholder="e.g., techcrunch.com, wired.com"
              />
            </div>
          </>
        )}

        <div className="space-y-2">
          <Label>Sync Schedule</Label>
          <Select
            value={config.syncSchedule}
            onValueChange={(value) => setConfig({ ...config, syncSchedule: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select sync schedule" />
            </SelectTrigger>
            <SelectContent>
              {sourceConfig.configFields
                .find(f => f.name === 'syncSchedule' || f.name === 'updateFrequency')
                ?.options?.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          className="w-full"
          onClick={handleConfigure}
          disabled={isConfiguring}
        >
          {isConfiguring ? 'Configuring...' : 'Configure Source'}
        </Button>
      </CardContent>
    </Card>
  );
}