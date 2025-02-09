import type { Platform } from '@/types/distribution';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateContent(content: string, platform: Platform): ValidationResult {
  const errors: string[] = [];

  // Check for empty content
  if (!content.trim()) {
    errors.push('Content cannot be empty');
  }

  // Platform-specific validation
  switch (platform) {
    case 'twitter':
      if (content.length > 280) {
        errors.push('Content exceeds Twitter\'s 280 character limit');
      }
      break;
    case 'linkedin':
      if (content.length > 3000) {
        errors.push('Content exceeds LinkedIn\'s character limit');
      }
      break;
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}