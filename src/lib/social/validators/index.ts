import { SocialPlatform } from '../types';
import { validateTwitterPost } from './twitter';
import { validateLinkedInPost } from './linkedin';
import { validateInstagramPost } from './instagram';
import { validateFacebookPost } from './facebook';
import { validateThreadsPost } from './threads';

export function validatePost(content: string, platform: SocialPlatform, mediaUrls?: string[]) {
  switch (platform) {
    case 'twitter':
      return validateTwitterPost(content);
    case 'linkedin':
      return validateLinkedInPost(content);
    case 'instagram':
      return validateInstagramPost(content, mediaUrls);
    case 'facebook':
      return validateFacebookPost(content);
    case 'threads':
      return validateThreadsPost(content);
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}