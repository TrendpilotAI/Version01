import { supabase } from '../supabase';
import type { ContentSource, SourceContent, ScoringSettings } from '@/types/content';
import { newsapi } from '../news/newsapi-client';
import { generateWithDeepseek } from '../deepseek';

async function scoreArticle(article: any): Promise<number> {
  try {
    // First analyze individual criteria
    const criteriaPrompt = `Analyze this article and provide scores (0-5) for each criterion. Only return JSON:
    Title: ${article.title}
    Description: ${article.description || ''}
    Source: ${article.source.name}
    Published: ${article.publishedAt}
    
    Criteria:
    - Novelty: How unique/innovative is the content?
    - Impact: What's the potential impact on the industry/readers?
    - Timeliness: How time-sensitive/relevant is this now?
    - Quality: How well-written and informative is the content?`;

    const criteriaResponse = await generateWithDeepseek(criteriaPrompt, {
      model: 'deepseek-r1-chat',
      temperature: 0.3
    });

    let scores;
    try {
      scores = JSON.parse(criteriaResponse);
    } catch (parseError) {
      console.error('Failed to parse scoring response:', parseError);
      return 0;
    }

    // Calculate weighted average
    const weights = {
      novelty: 0.3,
      impact: 0.3,
      timeliness: 0.2,
      quality: 0.2
    };

    const weightedScore = Object.entries(weights).reduce((total, [criterion, weight]) => {
      return total + (scores[criterion] || 0) * weight;
    }, 0);

    return Math.round(weightedScore * 10) / 10; // Round to 1 decimal place
  } catch (error) {
    console.error('Error scoring article:', error);
    return 0;
  }
}

interface ScoringDetails {
  novelty: number;
  impact: number;
  timeliness: number;
  quality: number;
  final: number;
  lastScored: string;
}

export async function getContentSources(workspaceId: string) {
  const { data, error } = await supabase
    .from('content_sources')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createContentSource(source: Partial<ContentSource>) {
  const { data, error } = await supabase
    .from('content_sources')
    .insert([source])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getSourceContent(sourceId: string) {
  const { data, error } = await supabase
    .from('source_content')
    .select('*')
    .eq('source_id', sourceId)
    .order('score', { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateContentStatus(id: string, status: string) {
  const { data, error } = await supabase
    .from('source_content')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getScoringSettings(workspaceId: string) {
  const { data, error } = await supabase
    .from('scoring_settings')
    .select('*')
    .eq('workspace_id', workspaceId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateScoringSettings(
  workspaceId: string,
  criteria: ScoringSettings['criteria']
) {
  const { data, error } = await supabase
    .from('scoring_settings')
    .upsert([
      {
        workspace_id: workspaceId,
        criteria,
        updated_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function fetchInitialContent(workspaceId: string) {
  try {
    // First create a default source for NewsAPI
    const { data: source } = await supabase
      .from('content_sources')
      .insert({
        workspace_id: workspaceId,
        name: 'NewsAPI',
        url: 'https://newsapi.org',
        category: 'news',
        is_active: true,
        settings: { type: 'newsapi' }
      })
      .select()
      .single();

    if (!source) throw new Error('Failed to create content source');

    // Fetch articles from NewsAPI
    const response = await newsapi.getTopHeadlines({
      category: 'technology',
      pageSize: 20,
      language: 'en'
    });

    if (!response.articles) throw new Error('No articles found');

    // Score and prepare articles
    const scoredArticles = await Promise.all(response.articles.map(async article => {
      const score = await scoreArticle(article);
      const scoringDetails: ScoringDetails = {
        novelty: score * 0.3,
        impact: score * 0.3,
        timeliness: score * 0.2,
        quality: score * 0.2,
        final: score,
        lastScored: new Date().toISOString()
      };

      return {
        source_id: source.id,
        title: article.title,
        description: article.description,
        url: article.url,
        image_url: article.urlToImage,
        score,
        scoring_details: scoringDetails,
        status: 'pending',
        created_at: new Date().toISOString()
      };
    }));

    const { error } = await supabase
      .from('source_content')
      .insert(scoredArticles);

    if (error) throw error;

    return scoredArticles.length;
  } catch (error) {
    console.error('Error fetching initial content:', error);
    throw error;
  }
}