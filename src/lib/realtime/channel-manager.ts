import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { ErrorHandler } from './types';

export class ChannelManager {
  private channels: Map<string, RealtimeChannel> = new Map();

  constructor(
    private workspaceId: string,
    private errorHandler: ErrorHandler
  ) {}

  public async setupChannel(name: string, handler: Function) {
    try {
      const channel = supabase
        .channel(name)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: name,
          filter: `workspace_id=eq.${this.workspaceId}`
        }, async (payload) => {
          const result = await handler(payload);
          if (result) {
            await this.processChannelResult(name, result);
          }
        })
        .subscribe();

      this.channels.set(name, channel);
      return true;
    } catch (error) {
      this.errorHandler.handle(`channelSetup:${name}`, error);
      return false;
    }
  }

  private async processChannelResult(name: string, result: any) {
    // Process channel results
  }

  public cleanup() {
    this.channels.forEach(channel => channel.unsubscribe());
    this.channels.clear();
  }
}

export const createChannelManager = (workspaceId: string, errorHandler: ErrorHandler) => {
  return new ChannelManager(workspaceId, errorHandler);
};