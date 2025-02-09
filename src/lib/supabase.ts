import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import { config } from './config';

if (!config.supabase.url || !config.supabase.anonKey) {
  throw new Error(
    'Supabase credentials are not configured. Please click "Connect to Supabase" to set up your project.'
  );
}

// Create Supabase client with error handling and retries
export const supabase = createClient<Database>(config.supabase.url, config.supabase.anonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'trendpilot-auth',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined
  },
  global: {
    headers: {
      'apikey': config.supabase.anonKey,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    fetch: (url, options = {}) => {
      const retries = 3;
      const retryDelay = 1000;
      const requestHeaders = {
        ...options.headers,
        'Content-Type': 'application/json'
      };

      const fetchWithRetry = async (attempt = 0): Promise<Response> => {
        try {
          const response = await fetch(url, {
            ...options,
            headers: requestHeaders
          });

          if (!response.ok && attempt < retries) {
            await new Promise(resolve =>
              setTimeout(resolve, retryDelay * Math.pow(2, attempt))
            );
            return fetchWithRetry(attempt + 1);
          }

          return response;
        } catch (error) {
          if (attempt < retries) {
            await new Promise(resolve =>
              setTimeout(resolve, retryDelay * Math.pow(2, attempt))
            );
            return fetchWithRetry(attempt + 1);
          }
          throw error;
        }
      };

      return fetchWithRetry();
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
      timeout: 30000,
      fastClose: true
    }
  },
  db: {
    schema: 'public'
  }
});

// Add connection health check
export async function checkConnection() {
  try {
    const { data, error } = await supabase
      .from('workspaces')
      .select('count')
      .limit(1)
      .throwOnError();

    if (error) {
      console.error('Connection check failed:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Supabase connection check failed:', error);
    return false;
  }
}

// Add schema validation helper
export async function validateSchema() {
  try {
    // Check database connection first
    const isConnected = await checkConnection();
    if (!isConnected) {
      throw new Error('Database connection failed');
    }

    // Check for required tables
    const { data: tables, error: tablesError } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');

    if (tablesError) throw tablesError;

    const requiredTables = [
      'workspaces',
      'workspace_members',
      'newsletters',
      'subscribers',
      'content',
      'analytics',
      'content_sources',
      'source_content',
      'scoring_settings',
      'user_actions',
      'feed_settings',
      'feed_items',
      'historical_trends',
      'trend_predictions',
      'airbyte_sources',
      'airbyte_destinations',
      'airbyte_connections',
      'airbyte_sync_logs',
      'saved_articles',
      'article_tags',
      'reading_history'
    ];

    // Check for required indexes
    const { data: indexes, error: indexError } = await supabase
      .from('pg_indexes')
      .select('tablename, indexname')
      .eq('schemaname', 'public');

    if (indexError) throw indexError;

    const requiredIndexes = {
      workspace_members: [
        'idx_workspace_members_user_id',
        'idx_workspace_members_workspace_id'
      ],
      newsletters: ['idx_newsletters_workspace_id'],
      content: ['idx_content_newsletter_id'],
      source_content: [
        'idx_source_content_source_id',
        'idx_source_content_score'
      ]
    };

    // Collect missing indexes
    const missingIndexes = Object.entries(requiredIndexes).reduce(
      (acc, [table, tableIndexes]) => {
        const existingTableIndexes =
          indexes?.filter(i => i.tablename === table) || [];

        const missing = tableIndexes.filter(
          index => !existingTableIndexes.find(i => i.indexname === index)
        );

        if (missing.length > 0) {
          acc[table] = missing;
        }

        return acc;
      },
      {} as Record<string, string[]>
    );

    // Return validation result
    return {
      valid: true,
      missingTables: requiredTables.filter(
        table => !tables?.find(t => t.tablename === table)
      ),
      missingIndexes
    };

  } catch (error) {
    console.error('Schema validation failed:', error);
    throw error;
  }
}