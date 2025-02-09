import { supabase } from './supabase';

/**
 * Test user credentials for development/testing purposes.
 * IMPORTANT: Never use these credentials in production!
 */

export interface TestUser {
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'editor' | 'viewer';
}

export const TEST_USERS: Record<string, TestUser> = {
  admin: {
    email: 'admin@test.com',
    password: 'test123!admin',
    username: 'admin_test',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin'
  },
  editor: {
    email: 'editor@test.com',
    password: 'test123!editor',
    username: 'editor_test',
    firstName: 'Editor',
    lastName: 'User',
    role: 'editor'
  },
  viewer: {
    email: 'viewer@test.com',
    password: 'test123!viewer',
    username: 'viewer_test',
    firstName: 'Viewer',
    lastName: 'User',
    role: 'viewer'
  }
};

export async function setupTestUsers() {
  if (import.meta.env.MODE !== 'development') {
    console.warn('Test users can only be set up in development mode');
    return;
  }

  for (const user of Object.values(TEST_USERS)) {
    try {
      // Check if user exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', user.email)
        .single();

      if (existingUser) {
        console.log(`Test user ${user.email} already exists`);
        continue;
      }

      // Create new user
      const { data, error } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: {
            username: user.username,
            first_name: user.firstName,
            last_name: user.lastName,
            role: user.role
          }
        }
      });

      if (error) {
        console.error(`Failed to create test user ${user.email}:`, error);
        continue;
      }

      // Auto-confirm email for test users in development
      await supabase.auth.updateUser({
        email_confirm: true
      });

      console.log(`Created test user: ${user.email}`);
    } catch (error) {
      console.error(`Error setting up test user ${user.email}:`, error);
    }
  }
}

export function getTestUserCredentials(role: 'admin' | 'editor' | 'viewer'): TestUser {
  return TEST_USERS[role];
}

// Development helper to quickly log in as a test user
export async function loginAsTestUser(role: 'admin' | 'editor' | 'viewer') {
  if (import.meta.env.MODE !== 'development') {
    throw new Error('Test user login only available in development mode');
  }

  const user = TEST_USERS[role];
  const { error } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: user.password
  });

  if (error) throw error;
  return true;
}