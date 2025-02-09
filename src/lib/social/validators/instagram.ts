import { PostValidation } from '../types';

const MAX_CAPTION_LENGTH = 2200;
const MAX_HASHTAGS = 30;

export function validateInstagramPost(content: string, mediaUrls?: string[]): PostValidation {
  const errors: string[] = [];

  if (!content.trim()) {
    errors.push('Caption cannot be empty');
  }

  if (content.length > MAX_CAPTION_LENGTH) {
    errors.push(`Caption exceeds Instagram's ${MAX_CAPTION_LENGTH} character limit`);
  }

  const hashtagCount = (content.match(/#\w+/g) || []).length;
  if (hashtagCount > MAX_HASHTAGS) {
    errors.push(`Too many hashtags. Maximum allowed is ${MAX_HASHTAGS}`);
  }

  if (!mediaUrls?.length) {
    errors.push('Instagram posts require at least one image or video');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}