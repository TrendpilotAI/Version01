import { Logger } from '../utils/logger';

export abstract class BaseRecoveryStrategy {
  protected readonly maxRetries: number;
  protected readonly maxBackoffDelay: number;
  protected readonly logger: Logger;

  constructor(
    maxRetries: number = 5,
    maxBackoffDelay: number = 32000,
    logger: Logger
  ) {
    this.maxRetries = maxRetries;
    this.maxBackoffDelay = maxBackoffDelay;
    this.logger = logger;
  }

  abstract recover(context: string, error: any): Promise<boolean>;

  protected async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}