import { supabase } from '../supabase';
import type { Platform } from '@/types/distribution';

export async function scheduleDistribution(
  newsletterId: string,
  platforms: Platform[],
  scheduledTime?: Date
) {
  const posts = platforms.map(platform => ({
    newsletter_id: newsletterId,
    platform,
    scheduled_for: scheduledTime || getNextScheduledTime(),
    status: 'scheduled',
    content: '', // Will be generated per platform
    created_at: new Date().toISOString()
  }));

  const { data, error } = await supabase
    .from('social_posts')
    .insert(posts)
    .select();

  if (error) throw error;
  return data;
}

function getNextScheduledTime(): Date {
  const now = new Date();
  // Schedule for next hour by default
  now.setHours(now.getHours() + 1);
  now.setMinutes(0);
  now.setSeconds(0);
  now.setMilliseconds(0);
  return now;
}