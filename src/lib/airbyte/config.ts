export const AIRBYTE_CONFIG = {
  apiUrl: import.meta.env.VITE_AIRBYTE_API_URL || '',
  apiKey: import.meta.env.VITE_AIRBYTE_API_KEY || '',
  workspaceId: import.meta.env.VITE_AIRBYTE_WORKSPACE_ID || '',
  defaultDestinationId: import.meta.env.VITE_AIRBYTE_DEFAULT_DESTINATION_ID || ''
};

if (!AIRBYTE_CONFIG.apiUrl) {
  console.warn('VITE_AIRBYTE_API_URL is not set. Please configure it in your .env file.');
}

if (!AIRBYTE_CONFIG.apiKey) {
  console.warn('VITE_AIRBYTE_API_KEY is not set. Please configure it in your .env file.');
}

export const AIRBYTE_SYNC_FREQUENCIES = {
  REALTIME: 'realtime',
  MINUTES_15: '15min',
  HOURLY: 'hourly',
  DAILY: 'daily'
} as const;

export type SyncFrequency = typeof AIRBYTE_SYNC_FREQUENCIES[keyof typeof AIRBYTE_SYNC_FREQUENCIES];