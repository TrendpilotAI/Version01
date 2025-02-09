import { supabase } from './supabase';
import { validateSchema } from './schema-validator';

export async function testSupabaseConnection() {
  try {
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      return {
        success: false,
        message: 'Supabase credentials are not configured. Please click "Connect to Supabase" to set them up.'
      };
    }

    // Test connection with retries
    let retries = 3;
    let error;
    
    while (retries > 0) {
      try {
        const { data, error: connError } = await supabase
          .from('workspaces')
          .select('count')
          .limit(1)
          .throwOnError();

        if (!connError) {
          // Validate schema
          const schemaValidation = await validateSchema();
          if (!schemaValidation.valid) {
            return {
              success: false,
              message: `Database schema validation failed: ${schemaValidation.missingTables.join(', ')}`
            };
          }
          
          return { 
            success: true, 
            message: 'Successfully connected to Supabase' 
          };
        }
        error = connError;
      } catch (e) {
        error = e;
      }
      retries--;
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Move error handling here, after all retries are exhausted
    console.error('Supabase connection error:', error);
    return {
      success: false,
      message: 'Failed to connect to database. Please ensure your Supabase connection is properly configured.'
    };
  } catch (error) {
    console.error('Unexpected error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred while testing the connection.'
    };
  }
}