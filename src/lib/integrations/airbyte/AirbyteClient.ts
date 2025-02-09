import { supabase } from '@/lib/supabase';
import type { AirbyteConfig, AirbyteSource, AirbyteConnection } from './types';

export class AirbyteClient {
  private apiUrl: string;
  private workspaceId: string;

  constructor(workspaceId: string) {
    this.apiUrl = process.env.AIRBYTE_API_URL || '';
    this.workspaceId = workspaceId;
  }

  async createSource(config: AirbyteConfig): Promise<AirbyteSource> {
    try {
      const response = await fetch(`${this.apiUrl}/sources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: config.name,
          sourceDefinitionId: config.sourceType,
          workspaceId: this.workspaceId,
          connectionConfiguration: config.credentials
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create Airbyte source');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating Airbyte source:', error);
      throw error;
    }
  }

  async setupConnection(sourceId: string, destinationId: string): Promise<AirbyteConnection> {
    try {
      const response = await fetch(`${this.apiUrl}/connections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${this.workspaceId}-${sourceId}`,
          sourceId,
          destinationId,
          syncCatalog: await this.getSyncCatalog(sourceId),
          schedule: { units: 1, timeUnit: 'HOURS' }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create Airbyte connection');
      }

      return await response.json();
    } catch (error) {
      console.error('Error setting up Airbyte connection:', error);
      throw error;
    }
  }

  private async getSyncCatalog(sourceId: string) {
    const response = await fetch(`${this.apiUrl}/sources/${sourceId}/schema`);
    const schema = await response.json();

    return {
      streams: schema.streams.map((stream: any) => ({
        ...stream,
        syncMode: 'incremental',
        cursorField: ['created_at'],
        destinationSyncMode: 'append'
      }))
    };
  }
}