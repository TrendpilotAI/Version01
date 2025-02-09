import { supabase } from '@/lib/supabase';
import { AirbyteClient } from './AirbyteClient';
import type { AirbyteConfig, SourceType } from './types';

export class SourceManager {
  private client: AirbyteClient;

  constructor(workspaceId: string) {
    this.client = new AirbyteClient(workspaceId);
  }

  async addSource(sourceType: SourceType, config: AirbyteConfig) {
    try {
      // Create Airbyte source
      const source = await this.client.createSource(config);

      // Store in Supabase
      const { data, error } = await supabase.from('content_sources').insert({
        name: config.name,
        type: sourceType,
        airbyte_source_id: source.sourceId,
        config: config.credentials,
        status: 'active',
        created_at: new Date().toISOString()
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding source:', error);
      throw error;
    }
  }

  async setupSourceSync(sourceId: string, destinationId: string) {
    try {
      const connection = await this.client.setupConnection(sourceId, destinationId);
      
      await supabase.from('content_sources')
        .update({ 
          sync_status: 'configured',
          last_synced_at: new Date().toISOString()
        })
        .eq('airbyte_source_id', sourceId);

      return connection;
    } catch (error) {
      console.error('Error setting up source sync:', error);
      throw error;
    }
  }
}