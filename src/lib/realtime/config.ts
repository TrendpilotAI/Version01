export const realtimeConfig = {
  error: {
    maxRetries: 3,
    retryDelay: 2000,
    notifyOnSeverity: ['critical', 'warning']
  },
  channels: {
    scoreChanges: {
      table: 'source_content',
      events: ['INSERT', 'UPDATE']
    },
    learningEvents: {
      table: 'user_actions',
      events: ['INSERT']
    },
    settingsUpdates: {
      table: 'scoring_settings',
      events: ['UPDATE']
    }
  }
} as const;