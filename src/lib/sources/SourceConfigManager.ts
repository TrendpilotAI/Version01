```typescript
import { supabase } from '@/lib/supabase';
import { sourceDefinitions } from './sourceDefinitions';
import type { SyncConfig, SourceHealth } from './types';

export class SourceConfigManager {
  constructor(private workspaceId: string) {}

  async configureSource(sourceId: string, config: any) {
    const sourceType = sourceDefinitions[config.type];
    if (!sourceType) {
      throw new Error(`Invalid source type: ${config.type}`);
    }

    // Validate config fields
    this.validateConfig(config, sourceType.configFields);

    try {
      const { data, error } = await supabase
        .from('content_sources')
        .update({
          config: config,
          updated_at: new Date().toISOString()
        })
        .eq('id', sourceId)
        .eq('workspace_id', this.workspaceId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error configuring source:', error);
      throw error;
    }
  }

  async configureSyncSettings(sourceId: string, syncConfig: SyncConfig) {
    try {
      const { data, error } = await supabase
        .from('content_sources')
        .update({
          sync_config: syncConfig,
          updated_at: new Date().toISOString()
        })
        .eq('id', sourceId)
        .eq('workspace_id', this.workspaceId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error configuring sync settings:', error);
      throw error;
    }
  }

  async updateSourceHealth(sourceId: string, health: SourceHealth) {
    try {
      const { data, error } = await supabase
        .from('content_sources')
        .update({
          health_status: health.status,
          health_check_at: health.lastCheck,
          health_message: health.message,
          health_metrics: health.metrics
        })
        .eq('id', sourceId)
        .eq('workspace_id', this.workspaceId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating source health:', error);
      throw error;
    }
  }

  private validateConfig(config: any, fields: any[]) {
    for (const field of fields) {
      if (field.required && !config[field.name]) {
        throw new Error(`Missing required field: ${field.label}`);
      }

      if (field.validation) {
        const value = config[field.name];
        if (field.validation.pattern && !new RegExp(field.validation.pattern).test(value)) {
          throw new Error(`Invalid format for ${field.label}`);
        }
        if (field.validation.min !== undefined && value < field.validation.min) {
          throw new Error(`${field.label} must be at least ${field.validation.min}`);
        }
        if (field.validation.max !== undefined && value > field.validation.max) {
          throw new Error(`${field.label} must be at most ${field.validation.max}`);
        }
      }
    }
  }
}
