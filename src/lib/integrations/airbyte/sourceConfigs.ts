import type { SourceType } from './types';

export const sourceDefinitions: Record<string, SourceType> = {
  newsapi: {
    id: 'newsapi-source',
    name: 'NewsAPI',
    category: 'news',
    icon: '📰',
    description: 'Access news articles from over 80,000 sources worldwide',
    configFields: [
      {
        name: 'apiKey',
        label: 'API Key',
        type: 'password',
        required: true
      },
      {
        name: 'categories',
        label: 'Categories',
        type: 'select',
        required: true,
        options: [
          { label: 'Technology', value: 'technology' },
          { label: 'Business', value: 'business' },
          { label: 'Science', value: 'science' },
          { label: 'Health', value: 'health' },
          { label: 'Entertainment', value: 'entertainment' }
        ]
      },
      {
        name: 'countries',
        label: 'Countries',
        type: 'select',
        required: false,
        options: [
          { label: 'United States', value: 'us' },
          { label: 'United Kingdom', value: 'gb' },
          { label: 'Canada', value: 'ca' },
          { label: 'Australia', value: 'au' }
        ]
      },
      {
        name: 'languages',
        label: 'Languages',
        type: 'select',
        required: false,
        options: [
          { label: 'English', value: 'en' },
          { label: 'Spanish', value: 'es' },
          { label: 'French', value: 'fr' },
          { label: 'German', value: 'de' }
        ]
      },
      {
        name: 'updateFrequency',
        label: 'Update Frequency',
        type: 'select',
        required: true,
        options: [
          { label: 'Every 15 minutes', value: '15' },
          { label: 'Every hour', value: '60' },
          { label: 'Every 6 hours', value: '360' }
        ]
      }
    ],
    transformations: ['summarization', 'entityRecognition', 'sentimentAnalysis']
  },
  newsio: {
    id: 'newsio-source',
    name: 'NewsIO',
    category: 'news',
    icon: '📰',
    description: 'Real-time news and media content from NewsIO',
    configFields: [
      {
        name: 'apiKey',
        label: 'API Key',
        type: 'password',
        required: true
      },
      {
        name: 'categories',
        label: 'Categories',
        type: 'select',
        required: true,
        options: [
          { label: 'Technology', value: 'technology' },
          { label: 'Business', value: 'business' },
          { label: 'Science', value: 'science' },
          { label: 'AI/ML', value: 'ai' }
        ]
      },
      {
        name: 'updateFrequency',
        label: 'Update Frequency',
        type: 'select',
        required: true,
        options: [
          { label: 'Every 15 minutes', value: '15' },
          { label: 'Every hour', value: '60' },
          { label: 'Every 6 hours', value: '360' }
        ]
      }
    ],
    transformations: ['summarization', 'topicClassification']
  },
  newsdata: {
    id: 'newsdata-source',
    name: 'Newsdata.io',
    category: 'news',
    icon: '📱',
    description: 'Global news coverage from Newsdata.io',
    configFields: [
      {
        name: 'apiKey',
        label: 'API Key',
        type: 'password',
        required: true
      },
      {
        name: 'languages',
        label: 'Languages',
        type: 'select',
        required: true,
        options: [
          { label: 'English', value: 'en' },
          { label: 'Spanish', value: 'es' },
          { label: 'French', value: 'fr' },
          { label: 'German', value: 'de' }
        ]
      },
      {
        name: 'domains',
        label: 'Domains',
        type: 'text',
        required: false,
        validation: {
          pattern: '^[a-zA-Z0-9,.-]+$'
        }
      },
      {
        name: 'syncSchedule',
        label: 'Sync Schedule',
        type: 'select',
        required: true,
        options: [
          { label: 'Real-time', value: 'realtime' },
          { label: 'Every 30 minutes', value: '30' },
          { label: 'Hourly', value: '60' }
        ]
      }
    ],
    transformations: ['summarization', 'entityRecognition', 'sentimentAnalysis']
  }
};

export const getSourceConfig = (type: SourceType) => {
  const definition = sourceDefinitions[type];
  if (!definition) throw new Error(`Unknown source type: ${type}`);
  return definition;
};