import { supabase } from '../supabase';

export interface RequestValidation {
  headersValid: boolean;
  authValid: boolean;
  contentTypeValid: boolean;
  apiKeyValid: boolean;
  errors: string[];
}

export async function validateRequestSetup(): Promise<RequestValidation> {
  const errors: string[] = [];
  const validation = {
    headersValid: false,
    authValid: false,
    contentTypeValid: false,
    apiKeyValid: false,
    errors
  };

  try {
    // Check if auth header is properly configured
    const { data: { session } } = await supabase.auth.getSession();
    validation.authValid = !!session?.access_token;
    if (!validation.authValid) {
      errors.push('Missing or invalid authorization token');
    }

    // Validate API key
    validation.apiKeyValid = !!import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (!validation.apiKeyValid) {
      errors.push('Missing or invalid API key');
    }

    // Check content type headers
    const client = supabase;
    validation.contentTypeValid = client.headers?.['Content-Type'] === 'application/json';
    if (!validation.contentTypeValid) {
      errors.push('Invalid Content-Type header');
    }

    // Check all required headers
    validation.headersValid = validateHeaders(client.headers);
    if (!validation.headersValid) {
      errors.push('Missing required headers');
    }

    return validation;
  } catch (error) {
    console.error('Request validation failed:', error);
    errors.push(error instanceof Error ? error.message : 'Unknown error');
    return validation;
  }
}

function validateHeaders(headers: Record<string, string> = {}): boolean {
  const requiredHeaders = ['apikey', 'Content-Type'];
  return requiredHeaders.every(header => 
    Object.keys(headers).some(h => h.toLowerCase() === header.toLowerCase())
  );
}