import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { AirbyteClient } from '../client';
import type { AirbyteSource } from '../types';

export function useAirbyteSource(workspaceId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const client = new AirbyteClient();

  const createSource = useCallback(async (config: {
    name: string;
    sourceDefinitionId: string;
    connectionConfiguration: Record<string, any>;
  }) => {
    setIsLoading(true);
    try {
      const source = await client.createSource({
        ...config,
        workspaceId,
      });

      toast({
        title: 'Source created successfully',
        description: `${config.name} has been configured and is ready for sync`
      });

      return source;
    } catch (error) {
      toast({
        title: 'Failed to create source',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive'
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [workspaceId, toast]);

  const setupSync = useCallback(async (
    sourceId: string,
    destinationId: string,
    schedule?: { units: number; timeUnit: string }
  ) => {
    setIsLoading(true);
    try {
      const schema = await client.getSourceSchema(sourceId);
      const connection = await client.createConnection({
        name: `${workspaceId}-${sourceId}`,
        sourceId,
        destinationId,
        syncCatalog: schema,
        schedule
      });

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
  }, [workspaceId, toast]);

  return {
    createSource,
    setupSync,
    isLoading
  };
}