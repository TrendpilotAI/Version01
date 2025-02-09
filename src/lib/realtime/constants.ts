export const CHANNELS = {
  SCORES: 'score-changes',
  LEARNING: 'learning-events',
  SETTINGS: 'scoring-settings'
} as const;

export const ERROR_MESSAGES = {
  CONNECTION: 'Failed to connect to realtime updates',
  VALIDATION: 'Invalid data received',
  PROCESSING: 'Error processing update'
} as const;

export const MAX_ITEMS = {
  SCORES: 50,
  EVENTS: 10,
  NOTIFICATIONS: 5
} as const;