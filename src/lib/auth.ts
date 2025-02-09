import { supabase } from './supabase';
import { generateEmailTemplate } from './email-templates';

export interface SignUpData {
  username: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
}

export async function signInWithProvider(provider: 'google' | 'apple' | 'facebook' | 'linkedin') {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`${provider} sign in error:`, error);
    throw error;
  }
}

export async function resendConfirmationEmail(email: string) {
  try {
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/email-confirmed`,
      }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error resending confirmation email:', error);
    throw error;
  }
}

export async function signUp(email: string, password: string, userData: SignUpData) {
  try {
    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      throw new Error('User already exists. Please log in instead.');
    }

    // Create auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: userData.username,
          first_name: userData.first_name,
          last_name: userData.last_name,
          phone_number: userData.phone_number,
        },
        emailRedirectTo: `${window.location.origin}/auth/email-confirmed`,
        emailTemplate: generateEmailTemplate('confirmation', {
          firstName: userData.first_name,
          username: userData.username
        })
      }
    });

    if (error) throw error;

    // Store email for confirmation page
    localStorage.setItem('pendingConfirmation', email);
    
    return data;
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
}

export async function signIn(email: string, password: string) {
  try {
    // Validate inputs
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Provide more specific error messages
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Invalid email or password. Please try again.');
      } else if (error.message.includes('Email not confirmed')) {
        throw new Error('Please confirm your email address before signing in.');
      } else if (error.message.includes('Too many requests')) {
        throw new Error('Too many sign in attempts. Please try again later.');
      }
      throw error;
    }

    // Verify session was created
    if (!data.session) {
      throw new Error('Failed to create session. Please try again.');
    }

    return data;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    
    if (!session) {
      throw new Error('No active session');
    }

    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    if (!user) throw new Error('No user found');

    return user;
  } catch (error) {
    if (error instanceof Error && error.message.includes('auth')) {
      const authError = new Error('Not authenticated');
      authError.name = 'AuthError';
      throw authError;
    }
    throw error;
  }
}

export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) throw error;
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
}

export async function updatePassword(newPassword: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;
  } catch (error) {
    console.error('Password update error:', error);
    throw error;
  }
}

export async function updateUserProfile(updates: Partial<SignUpData>) {
  try {
    const { error } = await supabase.auth.updateUser({
      data: updates
    });

    if (error) throw error;
  } catch (error) {
    console.error('Profile update error:', error);
    throw error;
  }
}