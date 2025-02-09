import { checkAuthStatus, type AuthStatus } from '../auth/auth-checker';
import { checkAPIStatus, type APIStatus } from '../api/api-checker';
import { validateRequestSetup, type RequestValidation } from '../api/request-validator';
import { initializeStorageSystem, type StorageStatus } from '../storage/storage-initializer';

export interface SystemCheck {
  timestamp: Date;
  auth: AuthStatus;
  api: APIStatus;
  requests: RequestValidation;
  storage: StorageStatus;
  overallHealth: 'healthy' | 'degraded' | 'unhealthy';
}

export async function performSystemCheck(): Promise<SystemCheck> {
  const [auth, api, requests, storage] = await Promise.all([
    checkAuthStatus(),
    checkAPIStatus(),
    validateRequestSetup(),
    initializeStorageSystem()
  ]);

  // Determine overall system health
  const overallHealth = determineHealth(auth, api, requests, storage);

  return {
    timestamp: new Date(),
    auth,
    api,
    requests,
    storage,
    overallHealth
  };
}

function determineHealth(
  auth: AuthStatus,
  api: APIStatus,
  requests: RequestValidation,
  storage: StorageStatus
): 'healthy' | 'degraded' | 'unhealthy' {
  if (!api.isConnected || !auth.sessionValid || !storage.initialized) {
    return 'unhealthy';
  }

  const hasErrors = requests.errors.length > 0;
  const hasEndpointIssues = Object.values(api.endpoints).some(status => !status);
  const hasStorageIssues = Object.values(storage.buckets).some(status => !status);

  if (hasErrors || hasEndpointIssues || hasStorageIssues) {
    return 'degraded';
  }

  return 'healthy';
}