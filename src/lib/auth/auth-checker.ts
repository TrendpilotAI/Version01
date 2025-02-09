import { supabase } from '../supabase';

export interface AuthStatus {
  isAuthenticated: boolean;
  sessionValid: boolean;
  tokenExpiration: Date | null;
  permissions: string[];
  error?: string;
}

export async function checkAuthStatus(): Promise<AuthStatus> {
  try {
    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) throw sessionError;
    
    if (!session) {
      return {
        isAuthenticated: false,
        sessionValid: false,
        tokenExpiration: null,
        permissions: []
      };
    }

    // Check token expiration
    const tokenExpiration = new Date(session.expires_at! * 1000);
    const isExpired = tokenExpiration < new Date();

    // Get user permissions from JWT claims
    const permissions = session.user?.app_metadata?.permissions || [];

    return {
      isAuthenticated: true,
      sessionValid: !isExpired,
      tokenExpiration,
      permissions
    };
  } catch (error) {
    console.error('Auth status check failed:', error);
    return {
      isAuthenticated: false,
      sessionValid: false,
      tokenExpiration: null,
      permissions: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}