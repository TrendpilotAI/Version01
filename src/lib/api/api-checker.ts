import { supabase } from '../supabase';

export interface APIStatus {
  isConnected: boolean;
  endpoints: {
    [key: string]: boolean;
  };
  sslValid: boolean;
  latency: number;
  error?: string;
}

export async function checkAPIStatus(): Promise<APIStatus> {
  const startTime = Date.now();
  
  try {
    // Test basic connectivity
    const { data, error } = await supabase
      .from('workspaces')
      .select('count')
      .limit(1)
      .throwOnError();

    if (error) throw error;

    // Check SSL/TLS (assuming browser's fetch handles this)
    const sslCheck = await fetch(import.meta.env.VITE_SUPABASE_URL);
    const sslValid = sslCheck.url.startsWith('https');

    // Test critical endpoints
    const endpoints = {
      auth: await testEndpoint('auth/v1/user'),
      rest: await testEndpoint('rest/v1/'),
      storage: await testEndpoint('storage/v1/object'),
    };

    return {
      isConnected: true,
      endpoints,
      sslValid,
      latency: Date.now() - startTime
    };
  } catch (error) {
    console.error('API status check failed:', error);
    return {
      isConnected: false,
      endpoints: {},
      sslValid: false,
      latency: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function testEndpoint(path: string): Promise<boolean> {
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/${path}`, {
      method: 'HEAD',
      headers: {
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
      }
    });
    return response.ok || response.status === 401; // 401 means endpoint exists but needs auth
  } catch {
    return false;
  }
}