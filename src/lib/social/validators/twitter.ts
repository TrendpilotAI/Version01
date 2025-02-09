import { PostValidation } from '../types';

const MAX_LENGTH = 280;

export function validateTwitterPost(content: string): PostValidation {
  const errors: string[] = [];

  if (!content.trim()) {
    errors.push('Content cannot be empty');
  }

  if (content.length > MAX_LENGTH) {
    errors.push(`Content exceeds Twitter's ${MAX_LENGTH} character limit`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}