import type { ErrorSeverity } from './types';

export function getErrorSeverity(error: unknown): ErrorSeverity {
  if (error instanceof Error) {
    if (error.name === 'ConnectionError') return 'critical';
    if (error.name === 'ValidationError') return 'warning';
  }
  return 'info';
}

export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
}

export function shouldRetry(error: unknown): boolean {
  if (error instanceof Error) {
    return error.name === 'ConnectionError' || 
           error.message.includes('network') ||
           error.message.includes('timeout');
  }
  return false;
}