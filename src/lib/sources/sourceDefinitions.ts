typescript
import { SourceType } from './types';

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

  googleai: {
    id: 'googleai',
    name: 'Google AI Research',
    category: 'ai_ml',
    icon: '🔬',
    description: 'Latest research and updates from Google AI',
    configFields: [
      {
        name: 'topics',
        label: 'Research Topics',
        type: 'select',
        required: true,
        options: [
          { label: 'Machine Learning', value: 'ml' },
          { label: 'Natural Language', value: 'nlp' },
          { label: 'Computer Vision', value: 'vision' }
        ]
      }
    ],
    transformations: ['summarization', 'topicClassification']
  },

  // Business Intelligence
  crunchbase: {
    id: 'crunchbase',
    name: 'Crunchbase',
    category: 'business',
    icon: '💼',
    description: 'Company and startup intelligence',
    configFields: [
      {
        name: 'apiKey',
        label: 'API Key',
        type: 'password',
        required: true
      },
      {
        name: 'industries',
        label: 'Industries',
        type: 'select',
        required: true,
        options: [
          { label: 'Technology', value: 'tech' },
          { label: 'Finance', value: 'finance' },
          { label: 'Healthcare', value: 'health' }
        ]
      }
    ],
    transformations: ['entityRecognition', 'sentimentAnalysis']
  },

  // Tech News
  producthunt: {
    id: 'producthunt',
    name: 'Product Hunt',
    category: 'tech',
    icon: '😺',
    description: 'Latest product launches and tech news',
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
          { label: 'All', value: 'all' },
          { label: 'Developer Tools', value: 'dev' },
          { label: 'AI & ML', value: 'ai' }
        ]
      }
    ],
    transformations: ['summarization', 'topicClassification']
  },

  // Custom Sources
  webscraper: {
    id: 'webscraper',
    name: 'Web Scraper',
    category: 'custom',
    icon: '🕷️',
    description: 'Custom web scraping for any website',
    configFields: [
      {
        name: 'url',
        label: 'Website URL',
        type: 'text',
        required: true
      },
      {
        name: 'selectors',
        label: 'CSS Selectors',
        type: 'text',
        required: true
      },
      {
        name: 'frequency',
        label: 'Check Frequency (minutes)',
        type: 'number',
        required: true,
        validation: {
          min: 5,
          max: 1440
        }
      }
    ],
    transformations: ['summarization', 'entityRecognition', 'languageTranslation']
  }
};
