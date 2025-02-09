import { supabase } from '../supabase';
import { beehiivService } from '../beehiiv/beehiiv-service';

export async function getNewsletters(workspaceId: string) {
  try {
    if (!workspaceId) {
      console.error('getNewsletters: workspaceId is required');
      return [];
    }

    const { data, error } = await supabase
      .from('newsletters')
      .select('*')
      .eq('workspace_id', workspaceId);

    if (error) {
      console.error('Error fetching newsletters:', error);
      return [];
    }

    // If no newsletters exist, create a default one
    if (!data || data.length === 0) {
      try {
        const defaultNewsletter = await createDefaultNewsletter(workspaceId);
        return defaultNewsletter ? [defaultNewsletter] : [];
      } catch (createError) {
        console.error('Error creating default newsletter:', createError);
        return [];
      }
    }

    return data;
  } catch (error) {
    console.error('Error in getNewsletters:', error);
    return [];
  }
}

async function createDefaultNewsletter(workspaceId: string) {
  try {
    const { data, error } = await supabase
      .from('newsletters')
      .insert([{
        workspace_id: workspaceId,
        name: 'My Newsletter',
        description: 'My first newsletter',
        status: 'draft',
        settings: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating default newsletter:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in createDefaultNewsletter:', error);
    return null;
  }
}

export async function createNewsletterFromContent(
  newsletterId: string,
  selectedContent: any[]
) {
  try {
    if (!newsletterId) {
      throw new Error('Newsletter ID is required');
    }

    if (!selectedContent || selectedContent.length === 0) {
      throw new Error('Content is required');
    }

    // Create content in our database first
    const { data: issue, error } = await supabase
      .from('newsletter_issues')
      .insert({
        newsletter_id: newsletterId,
        title: generateTitle(selectedContent),
        content: await generateContent(selectedContent),
        status: 'draft',
        ai_generated: true,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    // If newsletter is connected to Beehiiv, create post there too
    try {
      await beehiivService.createPost(
        issue.workspace_id,
        newsletterId,
        issue.content
      );
    } catch (beehiivError) {
      console.error('Failed to create Beehiiv post:', beehiivError);
      // Don't throw - we still created the issue in our database
    }

    return issue;
  } catch (error) {
    console.error('Error in createNewsletterFromContent:', error);
    throw error;
  }
}

// Helper functions
function generateTitle(content: any[]): string {
  if (!content || content.length === 0) {
    return 'Untitled Newsletter';
  }

  const topContent = [...content].sort((a, b) => 
    (b.score || 0) - (a.score || 0)
  )[0];
  
  return topContent?.title || 'Untitled Newsletter';
}

async function generateContent(content: any[]): Promise<string> {
  if (!content || content.length === 0) {
    return '';
  }

  const sections = content.map(item => `
## ${item.title || 'Untitled Section'}

${item.description || 'No description available'}

${item.url ? `[Read more](${item.url})` : ''}
  `).join('\n\n');

  return sections.trim();
}