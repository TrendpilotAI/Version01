export class RealtimeError extends Error {
  constructor(
    message: string,
    public context: string,
    public severity: 'critical' | 'warning' | 'info' = 'warning',
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'RealtimeError';
  }
}

export class ValidationError extends RealtimeError {
  constructor(context: string, details: string) {
    super(`Validation failed: ${details}`, context, 'warning');
    this.name = 'ValidationError';
  }
}

export class ConnectionError extends RealtimeError {
  constructor(context: string, originalError?: unknown) {
    super('Connection failed', context, 'critical', originalError);
    this.name = 'ConnectionError';
  }
}