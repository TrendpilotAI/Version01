export interface RecoveryConfig {
  maxRetries: number;
  maxBackoffDelay: number;
  healthCheckInterval?: number;
}

export interface RecoveryStrategy {
  recover(context: string, error: any): Promise<boolean>;
}

export interface RecoveryResult {
  success: boolean;
  error?: Error;
  context: string;
}