export type SocialPlatform = 'twitter' | 'linkedin' | 'instagram' | 'facebook' | 'threads';

export interface SocialPost {
  id: string;
  platform: SocialPlatform;
  content: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  scheduledFor?: Date;
  publishedAt?: Date;
  metadata: Record<string, any>;
  mediaUrls?: string[];
}

export interface ScheduleOptions {
  platform: SocialPlatform;
  content: string;
  scheduledFor: Date;
  metadata?: Record<string, any>;
  mediaUrls?: string[];
}

export interface PostValidation {
  isValid: boolean;
  errors: string[];
}