-- Add indexes to improve realtime performance
CREATE INDEX IF NOT EXISTS idx_source_content_score 
ON source_content(score);

CREATE INDEX IF NOT EXISTS idx_user_actions_created 
ON user_actions(created_at);

CREATE INDEX IF NOT EXISTS idx_scoring_settings_updated 
ON scoring_settings(updated_at);

-- Add indexes for foreign key relationships
CREATE INDEX IF NOT EXISTS idx_source_content_source 
ON source_content(source_id);

CREATE INDEX IF NOT EXISTS idx_user_actions_content 
ON user_actions(content_id);

-- Add indexes for status and type fields
CREATE INDEX IF NOT EXISTS idx_source_content_status 
ON source_content(status);

CREATE INDEX IF NOT EXISTS idx_user_actions_type 
ON user_actions(action_type);