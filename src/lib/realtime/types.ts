export type ErrorSeverity = 'critical' | 'warning' | 'info';

export interface ErrorConfig {
  maxRetries?: number;
  retryDelay?: number;
}

export interface RealtimeManagerOptions {
  errorConfig?: ErrorConfig;
}

export interface ErrorHandler {
  handle(context: string, error: any): Promise<void>;
}