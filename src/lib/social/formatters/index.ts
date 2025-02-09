import { SocialPlatform } from '../types';
import { formatTwitterPost } from './twitter';
import { formatLinkedInPost } from './linkedin';
import { formatInstagramPost } from './instagram';
import { formatFacebookPost } from './facebook';
import { formatThreadsPost } from './threads';

export function formatPost(content: string, platform: SocialPlatform): string {
  switch (platform) {
    case 'twitter':
      return formatTwitterPost(content);
    case 'linkedin':
      return formatLinkedInPost(content);
    case 'instagram':
      return formatInstagramPost(content);
    case 'facebook':
      return formatFacebookPost(content);
    case 'threads':
      return formatThreadsPost(content);
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}