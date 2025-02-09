typescript
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { SourceConfigManager } from '@/lib/sources/SourceConfigManager';
import type { SyncConfig } from '@/lib/sources/types';

export function useSourceConfig(workspaceId: string) {
  const [isConfiguring, setIsConfiguring] = useState(false);
  const { toast } = useToast();
  const configManager = new SourceConfigManager(workspaceId);

  const configureSource = async (sourceId: string, config: any) => {
    setIsConfiguring(true);
    try {
      const source = await configManager.configureSource(sourceId, config);
      
      toast({
        title: 'Source configured successfully',
        description: 'The source settings have been updated'
      });

      return source;
    } catch (error) {
      toast({
        title: 'Configuration failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive'
      });
      throw error;
    } finally {
      setIsConfiguring(false);
    }
  };

  const configureSyncSettings = async (sourceId: string, syncConfig: SyncConfig) => {
    setIsConfiguring(true);
    try {
      const source = await configManager.configureSyncSettings(sourceId, syncConfig);
      
      toast({
        title: 'Sync settings updated',
        description: 'The sync configuration has been saved'
      });

      return source;
    } catch (error) {
      toast({
        title: 'Sync configuration failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive'
      });
      throw error;
    } finally {
      setIsConfiguring(false);
    }
  };

  return {
    configureSource,
    configureSyncSettings,
    isConfiguring
  };
}
```