// Environment variable configuration
export const config = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    get isConfigured() {
      return Boolean(this.url && this.anonKey);
    }
  },
  newsapi: {
    key: import.meta.env.VITE_NEWSAPI_KEY || '',
    get isConfigured() {
      return Boolean(this.key);
    }
  },
  deepseek: {
    key: import.meta.env.VITE_DEEPSEEK_API_KEY || '',
    get isConfigured() {
      return Boolean(this.key);
    }
  },
  beehiiv: {
    key: import.meta.env.VITE_BEEHIIV_API_KEY || '',
    get isConfigured() {
      return Boolean(this.key);
    }
  },
  env: {
    mode: import.meta.env.MODE,
    isDev: import.meta.env.DEV,
    isProd: import.meta.env.PROD,
  }
} as const;

// Type definitions for config
export type Config = typeof config;

// Helper functions
export function getRequiredConfig<T>(key: keyof Config, subKey: string): T {
  const value = config[key][subKey];
  if (!value) {
    throw new Error(`Required configuration missing: ${key}.${subKey}`);
  }
  return value as T;
}

export function isServiceConfigured(service: keyof Config): boolean {
  return 'isConfigured' in config[service] && config[service].isConfigured;
}

// Service-specific helpers
export function getSupabaseConfig() {
  if (!config.supabase.isConfigured) {
    console.warn('Supabase is not configured. Please click "Connect to Supabase" to set up your project.');
  }
  return config.supabase;
}

export function getNewsApiConfig() {
  if (!config.newsapi.isConfigured) {
    console.warn('NewsAPI is not configured. Some content features will be limited.');
  }
  return config.newsapi;
}

export function getDeepseekConfig() {
  if (!config.deepseek.isConfigured) {
    console.warn('DeepSeek is not configured. AI features will be limited.');
  }
  return config.deepseek;
}

export function getBeehiivConfig() {
  if (!config.beehiiv.isConfigured) {
    console.warn('Beehiiv is not configured. Newsletter publishing features will be limited.');
  }
  return config.beehiiv;
}