import type { Platform } from '@/types/distribution';

const TWITTER_CHAR_LIMIT = 280;
const LINKEDIN_CHAR_LIMIT = 3000;

export function formatForPlatform(content: string, platform: Platform): string {
  switch (platform) {
    case 'twitter':
      return truncateWithEllipsis(content, TWITTER_CHAR_LIMIT);
    case 'linkedin':
      return truncateWithEllipsis(content, LINKEDIN_CHAR_LIMIT);
    default:
      return content;
  }
}

function truncateWithEllipsis(text: string, limit: number): string {
  if (text.length <= limit) return text;
  return text.slice(0, limit - 3) + '...';
}