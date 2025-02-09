import { supabase } from '../supabase';
import type { SocialPost, ScheduleOptions } from './types';
import { validatePost } from './validators';
import { formatPost } from './formatters';

export async function scheduleSocialPost(options: ScheduleOptions): Promise<SocialPost> {
  // Validate the post
  const validation = validatePost(options.content, options.platform);
  if (!validation.isValid) {
    throw new Error(validation.errors.join(', '));
  }

  // Format the content for the platform
  const formattedContent = formatPost(options.content, options.platform);

  // Create the post
  const { data, error } = await supabase
    .from('social_posts')
    .insert({
      platform: options.platform,
      content: formattedContent,
      scheduled_for: options.scheduledFor.toISOString(),
      status: 'scheduled',
      metadata: options.metadata || {}
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getSocialPosts(workspaceId: string): Promise<SocialPost[]> {
  const { data, error } = await supabase
    .from('social_posts')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('scheduled_for', { ascending: true });

  if (error) throw error;
  return data;
}

export async function updateSocialPost(
  postId: string,
  updates: Partial<SocialPost>
): Promise<SocialPost> {
  const { data, error } = await supabase
    .from('social_posts')
    .update(updates)
    .eq('id', postId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteSocialPost(postId: string): Promise<void> {
  const { error } = await supabase
    .from('social_posts')
    .delete()
    .eq('id', postId);

  if (error) throw error;
}