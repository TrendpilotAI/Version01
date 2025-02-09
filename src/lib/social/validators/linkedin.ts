import { PostValidation } from '../types';

const MAX_LENGTH = 3000;

export function validateLinkedInPost(content: string): PostValidation {
  const errors: string[] = [];

  if (!content.trim()) {
    errors.push('Content cannot be empty');
  }

  if (content.length > MAX_LENGTH) {
    errors.push(`Content exceeds LinkedIn's ${MAX_LENGTH} character limit`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}