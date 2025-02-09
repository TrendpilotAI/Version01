import { toast } from '@/components/ui/use-toast';
import type { ErrorConfig, ErrorSeverity } from './types';

export class ErrorHandler {
  private retryAttempts: Map<string, number> = new Map();
  private readonly MAX_RETRIES: number;
  private readonly RETRY_DELAY: number;

  constructor(config?: ErrorConfig) {
    this.MAX_RETRIES = config?.maxRetries ?? 3;
    this.RETRY_DELAY = config?.retryDelay ?? 2000;
  }

  public async handle(context: string, error: any) {
    console.error(`Error in ${context}:`, error);
    const severity = this.determineErrorSeverity(error);

    if (this.shouldAttemptRecovery(context, error)) {
      await this.attemptRecovery(context);
    }

    if (this.shouldNotifyUser(severity)) {
      this.notifyUser(context, error, severity);
    }
  }

  private determineErrorSeverity(error: any): ErrorSeverity {
    // Determine error severity logic
    return 'warning';
  }

  private shouldAttemptRecovery(context: string, error: any): boolean {
    // Recovery decision logic
    return true;
  }

  private async attemptRecovery(context: string) {
    const attempts = this.retryAttempts.get(context) || 0;
    
    if (attempts < this.MAX_RETRIES) {
      this.retryAttempts.set(context, attempts + 1);
      const delay = this.RETRY_DELAY * Math.pow(2, attempts);
      
      setTimeout(() => {
        this.retryAttempts.delete(context);
      }, delay);
    }
  }

  private shouldNotifyUser(severity: ErrorSeverity): boolean {
    return severity !== 'info';
  }

  private notifyUser(context: string, error: any, severity: ErrorSeverity) {
    const messages = {
      critical: {
        title: 'Critical Error',
        description: 'A critical error occurred. The system will attempt to recover.'
      },
      warning: {
        title: 'Warning',
        description: 'A non-critical error occurred. Some features may be affected.'
      },
      info: {
        title: 'Notice',
        description: 'A minor issue occurred. No action needed.'
      }
    };

    const message = messages[severity];
    toast({
      title: message.title,
      description: message.description,
      variant: severity === 'critical' ? 'destructive' : 'default'
    });
  }
}

export const createErrorHandler = (config?: ErrorConfig) => {
  return new ErrorHandler(config);
};