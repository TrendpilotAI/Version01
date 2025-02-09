export type Platform = 'twitter' | 'linkedin';

export interface DistributionSchedule {
  newsletterId: string;
  platforms: Platform[];
  scheduledTime?: Date;
}

export interface SocialPost {
  id: string;
  newsletter_id: string;
  platform: Platform;
  content: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  scheduled_for: string;
  published_at?: string;
  created_at: string;
}