import { PostValidation } from '../types';

const MAX_LENGTH = 63206;

export function validateFacebookPost(content: string): PostValidation {
  const errors: string[] = [];

  if (!content.trim()) {
    errors.push('Content cannot be empty');
  }

  if (content.length > MAX_LENGTH) {
    errors.push(`Content exceeds Facebook's ${MAX_LENGTH} character limit`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}