import { config } from './config';

export interface ConfigValidation {
  valid: boolean;
  services: {
    supabase: {
      configured: boolean;
      message?: string;
    };
    newsapi: {
      configured: boolean;
      message?: string;
    };
    deepseek: {
      configured: boolean;
      message?: string;
    };
    beehiiv: {
      configured: boolean;
      message?: string;
    };
  };
  environment: {
    mode: string;
    isDev: boolean;
    isProd: boolean;
  };
}

export function validateConfig(): ConfigValidation {
  const validation: ConfigValidation = {
    valid: true,
    services: {
      supabase: {
        configured: config.supabase.isConfigured,
        message: config.supabase.isConfigured ? undefined : 
          'Supabase credentials not configured. Click "Connect to Supabase" to set up your project.'
      },
      newsapi: {
        configured: config.newsapi.isConfigured,
        message: config.newsapi.isConfigured ? undefined :
          'NewsAPI key not configured. Some content features will be limited.'
      },
      deepseek: {
        configured: config.deepseek.isConfigured,
        message: config.deepseek.isConfigured ? undefined :
          'DeepSeek API key not configured. AI features will be limited.'
      },
      beehiiv: {
        configured: config.beehiiv.isConfigured,
        message: config.beehiiv.isConfigured ? undefined :
          'Beehiiv API key not configured. Newsletter publishing features will be limited.'
      }
    },
    environment: {
      mode: config.env.mode,
      isDev: config.env.isDev,
      isProd: config.env.isProd
    }
  };

  // Overall validity requires at least Supabase to be configured
  validation.valid = validation.services.supabase.configured;

  return validation;
}

export function getServiceStatus(service: keyof ConfigValidation['services']) {
  const validation = validateConfig();
  return validation.services[service];
}

export function validateRequiredServices(services: Array<keyof ConfigValidation['services']>) {
  const validation = validateConfig();
  const missingServices = services.filter(service => !validation.services[service].configured);
  
  if (missingServices.length > 0) {
    throw new Error(
      `Required services not configured: ${missingServices.join(', ')}. ` +
      'Please configure these services before proceeding.'
    );
  }
  
  return true;
}