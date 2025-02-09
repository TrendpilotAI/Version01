import { supabase } from './supabase';

export interface SchemaValidation {
  valid: boolean;
  missingTables: string[];
  missingIndexes: Record<string, string[]>;
}

export async function validateSchema(): Promise<SchemaValidation> {
  try {
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
      'content_analytics',
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
      workspace_members: ['idx_workspace_members_user_id', 'idx_workspace_members_workspace_id'],
      newsletters: ['idx_newsletters_workspace_id'],
      content: ['idx_content_newsletter_id'],
      source_content: [
        'idx_source_content_source_id',
        'idx_source_content_score',
        'idx_source_content_status_score',
        'idx_source_content_title_search',
        'idx_pending_source_content',
        'idx_source_content_date_range',
        'idx_content_score_calc'
      ],
      content_sources: [
        'idx_content_sources_workspace_created',
        'idx_active_content_sources'
      ],
      feed_items: [
        'idx_feed_items_workspace_published',
        'idx_feed_items_score_status'
      ],
      analytics: ['idx_analytics_type_recorded'],
      user_actions: ['idx_user_actions_workspace_created', 'idx_user_actions_type_created'],
      content_analytics: ['idx_content_analytics_workspace_date']
    };

    const missingTables = requiredTables.filter(
      table => !tables?.find(t => t.tablename === table)
    );

    const missingIndexes = Object.entries(requiredIndexes).reduce((acc, [table, tableIndexes]) => {
      const existingTableIndexes = indexes?.filter(i => i.tablename === table) || [];
      const missing = tableIndexes.filter(
        index => !existingTableIndexes.find(i => i.indexname === index)
      );
      if (missing.length > 0) {
        acc[table] = missing;
      }
      return acc;
    }, {} as Record<string, string[]>);

    return {
      valid: missingTables.length === 0 && Object.keys(missingIndexes).length === 0,
      missingTables,
      missingIndexes
    };
  } catch (error) {
    console.error('Schema validation failed:', error);
    throw error;
  }
}