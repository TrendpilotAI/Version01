import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { SourceManager } from '@/lib/integrations/airbyte/SourceManager';
import type { SourceType, AirbyteConfig } from '@/lib/integrations/airbyte/types';

export function useSourceIntegration(workspaceId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const sourceManager = new SourceManager(workspaceId);

  const addSource = async (sourceType: SourceType, config: AirbyteConfig) => {
    setIsLoading(true);
    try {
      const source = await sourceManager.addSource(sourceType, config);
      
      toast({
        title: 'Source added successfully',
        description: `${config.name} has been configured and is ready for sync`
      });

      return source;
    } catch (error) {
      toast({
        title: 'Failed to add source',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive'
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const setupSync = async (sourceId: string, destinationId: string) => {
    setIsLoading(true);
    try {
      const connection = await sourceManager.setupSourceSync(sourceId, destinationId);
      
      toast({
        title: 'Sync configured successfully',
        description: 'Content will be synced automatically'
      });

      return connection;
    } catch (error) {
      toast({
        title: 'Failed to configure sync',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive'
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addSource,
    setupSync,
    isLoading
  };
}