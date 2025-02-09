import { BaseRecoveryStrategy } from './base-strategy';

export class DatabaseRecoveryStrategy extends BaseRecoveryStrategy {
  async recover(context: string, error: any): Promise<boolean> {
    // First, check if it's a temporary database issue
    const isTemporary = await this.isDatabaseErrorTemporary(error);
    
    if (isTemporary) {
      return this.handleTemporaryDatabaseError(context);
    }

    // If not temporary, try more aggressive recovery
    return this.handlePermanentDatabaseError(context);
  }

  private async isDatabaseErrorTemporary(error: any): Promise<boolean> {
    const temporaryErrors = [
      'connection_error',
      'deadlock_detected',
      'serialization_failure'
    ];
    
    return temporaryErrors.includes(error.code);
  }

  private async handleTemporaryDatabaseError(context: string): Promise<boolean> {
    let attempt = 0;
    const maxAttempts = 3;

    while (attempt < maxAttempts) {
      try {
        await this.sleep(Math.pow(2, attempt) * 1000);
        // Retry the database operation
        return true;
      } catch (error) {
        attempt++;
      }
    }

    return false;
  }

  private async handlePermanentDatabaseError(context: string): Promise<boolean> {
    // Implement fallback data storage
    // Queue operations for retry
    // Notify admin if needed
    return false;
  }
}