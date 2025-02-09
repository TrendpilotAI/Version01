import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { BaseRecoveryStrategy } from './base-strategy';

export class ChannelRecoveryStrategy extends BaseRecoveryStrategy {
  async recover(context: string, error: any): Promise<boolean> {
    let attempt = 0;
    let delay = 1000;

    while (attempt < this.maxRetries) {
      try {
        // Remove existing subscription
        await supabase.removeSubscription(context);
        
        // Wait with exponential backoff
        await this.sleep(delay);
        
        // Attempt to reestablish subscription
        const channel = await supabase
          .channel(`${context}-recovery`)
          .subscribe();

        // Verify channel is working
        if (await this.verifyChannelHealth(channel)) {
          return true;
        }

        attempt++;
        delay = Math.min(delay * 2, this.maxBackoffDelay);
      } catch (retryError) {
        this.logger.error(`Channel recovery attempt ${attempt + 1} failed:`, retryError);
      }
    }

    throw new Error('Channel recovery failed after max retries');
  }

  private async verifyChannelHealth(channel: RealtimeChannel): Promise<boolean> {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => resolve(false), 5000);
      
      channel.on('system', async (payload: any) => {
        clearTimeout(timeout);
        resolve(payload.event === 'connected');
      });
    });
  }
}