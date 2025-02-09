import type { SourceType } from './types';

export const sourceDefinitions: Record<string, SourceType> = {
  // AI/ML Sources
  huggingface: {
    id: 'huggingface',
    name: 'HuggingFace',
    category: 'ai_ml',
    icon: '🤗',
    description: 'Access ML models and research papers from HuggingFace',
    configFields: [
      {
        name: 'apiKey',
        label: 'API Key',
        type: 'password',
        required: true
      },
      {
        name: 'modelTypes',
        label: 'Model Types',
        type: 'select',
        required: true,
        options: [
          { label: 'All', value: 'all' },
          { label: 'NLP', value: 'nlp' },
          { label: 'Computer Vision', value: 'vision' }
        ]
      }
    ],
    transformations: ['summarization', 'keyPointExtraction']
  },

  arxiv: {
    id: 'arxiv',
    name: 'arXiv',
    category: 'research',
    icon: '📚',
    description: 'Latest AI/ML research papers from arXiv',
    configFields: [
      {
        name: 'categories',
        label: 'Categories',
        type: 'select',
        required: true,
        options: [
          { label: 'Machine Learning', value: 'cs.LG' },
          { label: 'Artificial Intelligence', value: 'cs.AI' },
          { label: 'Computer Vision', value: 'cs.CV' }
        ]
      },
      {
        name: 'updateFrequency',
        label: 'Update Frequency',
        type: 'select',
        required: true,
        options: [
          { label: 'Daily', value: 'daily' },
          { label: 'Weekly', value: 'weekly' }
        ]
      }
    ],
    transformations: ['summarization', 'topicClassification']
  },

  // News Sources
  newsapi: {
    id: 'newsapi',
    name: 'NewsAPI',
    category: 'news',
    icon: '📰',
    description: 'Real-time news from multiple sources',
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
          { label: 'Science', value: 'science' }
        ]
      },
      {
        name: 'updateFrequency',
        label: 'Update Frequency',
        type: 'select',
        required: true,
        options: [
          { label: 'Every 15 minutes', value: '15' },
          { label: 'Hourly', value: '60' },
          { label: 'Daily', value: '1440' }
        ]
      }
    ],
    transformations: ['summarization', 'entityRecognition']
  },

  // Social Media Sources
  twitter: {
    id: 'twitter',
    name: 'Twitter',
    category: 'social',
    icon: '🐦',
    description: 'Monitor Twitter for relevant content',
    configFields: [
      {
        name: 'apiKey',
        label: 'API Key',
        type: 'password',
        required: true
      },
      {
        name: 'apiSecret',
        label: 'API Secret',
        type: 'password',
        required: true
      },
      {
        name: 'keywords',
        label: 'Keywords',
        type: 'text',
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
          { label: 'French', value: 'fr' }
        ]
      }
    ],
    transformations: ['sentimentAnalysis', 'topicClassification']
  },

  // RSS Feeds
  rss: {
    id: 'rss',
    name: 'RSS Feed',
    category: 'custom',
    icon: '📡',
    description: 'Import content from any RSS feed',
    configFields: [
      {
        name: 'feedUrl',
        label: 'Feed URL',
        type: 'text',
        required: true,
        validation: {
          pattern: '^https?://.+',
        }
      },
      {
        name: 'updateInterval',
        label: 'Update Interval (minutes)',
        type: 'number',
        required: true,
        validation: {
          min: 5,
          max: 1440
        }
      }
    ],
    transformations: ['summarization', 'keyPointExtraction']
  }
};

export const getSourceConfig = (type: string): SourceType => {
  const config = sourceDefinitions[type];
  if (!config) {
    throw new Error(`Unknown source type: ${type}`);
  }
  return config;
};