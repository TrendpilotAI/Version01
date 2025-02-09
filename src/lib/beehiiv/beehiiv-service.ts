import { supabase } from '../supabase';
import { BeehiivClient } from './beehiiv-client';
import { config } from '../config';
import type { BeehiivPublication, BeehiivPost, BeehiivSubscriber } from './types';

export class BeehiivService {
  private client: BeehiivClient;

  constructor(apiKey: string) {
    this.client = new BeehiivClient(apiKey);
  }

  async syncPublication(workspaceId: string, publicationId: string) {
    try {
      // Get publication details from Beehiiv
      const publication = await this.client.getPublication(publicationId);

      // Update newsletter record with Beehiiv details
      const { error } = await supabase
        .from('newsletters')
        .update({
          beehiiv_publication_id: publicationId,
          name: publication.name,
          description: publication.description,
          updated_at: new Date().toISOString()
        })
        .eq('workspace_id', workspaceId)
        .single();

      if (error) throw error;

      // Sync subscribers
      await this.syncSubscribers(workspaceId, publicationId);

      return publication;
    } catch (error) {
      console.error('Failed to sync publication:', error);
      throw error;
    }
  }

  async syncSubscribers(workspaceId: string, publicationId: string) {
    try {
      // Get subscribers from Beehiiv
      const subscribers = await this.client.getSubscribers(publicationId);

      // Batch upsert subscribers
      const { error } = await supabase.from('subscribers').upsert(
        subscribers.map(sub => ({
          workspace_id: workspaceId,
          email: sub.email,
          status: sub.status,
          metadata: sub.metadata,
          created_at: sub.created_at,
          updated_at: new Date().toISOString()
        }))
      );

      if (error) throw error;

      return subscribers;
    } catch (error) {
      console.error('Failed to sync subscribers:', error);
      throw error;
    }
  }

  async createPost(workspaceId: string, newsletterId: string, content: string) {
    try {
      // Get newsletter with Beehiiv publication ID
      const { data: newsletter, error: newsletterError } = await supabase
        .from('newsletters')
        .select('beehiiv_publication_id')
        .eq('id', newsletterId)
        .single();

      if (newsletterError) throw newsletterError;
      if (!newsletter?.beehiiv_publication_id) {
        throw new Error('Newsletter not connected to Beehiiv');
      }

      // Create post in Beehiiv
      const post = await this.client.createPost(newsletter.beehiiv_publication_id, {
        title: 'New Post', // You might want to pass this as a parameter
        content,
        status: 'draft'
      });

      // Store post reference in our database
      const { error } = await supabase
        .from('newsletter_issues')
        .insert({
          newsletter_id: newsletterId,
          title: post.title,
          content: post.content,
          status: post.status,
          metadata: { beehiiv_post_id: post.id },
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      return post;
    } catch (error) {
      console.error('Failed to create post:', error);
      throw error;
    }
  }

  async publishPost(newsletterId: string, issueId: string) {
    try {
      // Get newsletter and issue details
      const { data: issue, error: issueError } = await supabase
        .from('newsletter_issues')
        .select(`
          *,
          newsletters!inner(beehiiv_publication_id)
        `)
        .eq('id', issueId)
        .single();

      if (issueError) throw issueError;
      if (!issue.newsletters.beehiiv_publication_id) {
        throw new Error('Newsletter not connected to Beehiiv');
      }

      const beehiivPostId = issue.metadata?.beehiiv_post_id;
      if (!beehiivPostId) {
        throw new Error('Issue not connected to Beehiiv post');
      }

      // Update post status in Beehiiv
      const post = await this.client.updatePost(
        issue.newsletters.beehiiv_publication_id,
        beehiivPostId,
        { status: 'published' }
      );

      // Update issue status in our database
      const { error } = await supabase
        .from('newsletter_issues')
        .update({
          status: 'published',
          published_at: new Date().toISOString()
        })
        .eq('id', issueId);

      if (error) throw error;

      return post;
    } catch (error) {
      console.error('Failed to publish post:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
export const beehiivService = new BeehiivService(
  config.beehiiv.isConfigured ? config.beehiiv.key : ''
);

// Log warning if not configured
if (!config.beehiiv.isConfigured) {
  console.warn('Beehiiv API key not configured. Newsletter publishing features will be limited.');
}