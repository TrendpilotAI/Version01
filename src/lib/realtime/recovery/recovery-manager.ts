import { ChannelRecoveryStrategy } from './strategies/channel-recovery';
import { DatabaseRecoveryStrategy } from './strategies/database-recovery';
import { NetworkRecoveryStrategy } from './strategies/network-recovery';
import { Logger } from './utils/logger';
import type { RecoveryConfig } from './types';

export class RecoveryManager {
  private strategies: Map<string, any>;
  private logger: Logger;

  constructor(config: RecoveryConfig) {
    this.logger = new Logger();
    this.strategies = new Map([
      ['REALTIME_SUBSCRIPTION_ERROR', new ChannelRecoveryStrategy(config.maxRetries, config.maxBackoffDelay, this.logger)],
      ['POSTGRES_ERROR', new DatabaseRecoveryStrategy(config.maxRetries, config.maxBackoffDelay, this.logger)],
      ['NETWORK_ERROR', new NetworkRecoveryStrategy(config.maxRetries, config.maxBackoffDelay, this.logger)]
    ]);
  }

  async handleFailure(context: string, error: any): Promise<void> {
    const strategy = this.determineStrategy(error);
    
    try {
      await strategy.recover(context, error);
    } catch (recoveryError) {
      this.logger.error('Recovery failed:', recoveryError);
      await this.escalateFailure(context, error, recoveryError);
    }
  }

  private determineStrategy(error: any) {
    if (error.code) {
      const strategy = this.strategies.get(error.code);
      if (strategy) return strategy;
    }
    return this.strategies.get('NETWORK_ERROR'); // Default strategy
  }

  private async escalateFailure(context: string, originalError: any, recoveryError: any) {
    this.logger.error('Recovery escalation:', {
      context,
      originalError,
      recoveryError
    });

    // Notify administrators
    try {
      await fetch('/api/admin/notify', {
        method: 'POST',
        body: JSON.stringify({
          context,
          originalError,
          recoveryError
        })
      });
    } catch (error) {
      this.logger.error('Failed to notify admin:', error);
    }
  }
}