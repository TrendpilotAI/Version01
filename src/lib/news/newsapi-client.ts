import type { NewsApiResponse, Article, Source } from './types';
import { config } from '../config';

export class NewsAPIClient {
  private baseUrl = 'https://newsapi.org/v2';
  private apiKey: string;

  constructor() {
    this.apiKey = config.newsapi.key;
    if (!config.newsapi.isConfigured) {
      console.warn('NewsAPI key is not set. Some features will be limited.');
    }
  }

  private async request<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    try {
      if (!config.newsapi.isConfigured) {
        return {
          status: 'error',
          articles: [],
          totalResults: 0,
          message: 'NewsAPI key not configured. Please click "Connect to NewsAPI" to set up your API key.'
        } as T;
      }

      const url = new URL(`${this.baseUrl}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, value.toString());
    });

      const response = await fetch(url.toString(), {
        headers: {
          'X-Api-Key': this.apiKey,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || 
          `NewsAPI error (${response.status}): ${response.statusText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`NewsAPI request failed (${endpoint}): ${error.message}`);
      }
      throw error;
    }
  }

  async getTopHeadlines(params: {
    country?: string;
    category?: string;
    sources?: string;
    q?: string;
    pageSize?: number;
    page?: number;
    language?: string;
  }): Promise<NewsApiResponse<Article>> {
    try {
      if (!this.apiKey) {
        return { status: 'error', articles: [], totalResults: 0 };
      }

      return await this.request<NewsApiResponse<Article>>('/top-headlines', params);
    } catch (error) {
      console.error('Failed to fetch top headlines:', error);
      return { status: 'error', articles: [], totalResults: 0 };
    }
  }

  async getEverything(params: {
    q?: string;
    sources?: string;
    domains?: string;
    from?: string;
    to?: string;
    language?: string;
    sortBy?: 'relevancy' | 'popularity' | 'publishedAt';
    pageSize?: number;
    page?: number;
  }): Promise<NewsApiResponse<Article>> {
    try {
      return await this.request<NewsApiResponse<Article>>('/everything', params);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      throw error;
    }
  }

  async getSources(params: {
    category?: string;
    language?: string;
    country?: string;
  }): Promise<NewsApiResponse<Source>> {
    try {
      return await this.request<NewsApiResponse<Source>>('/sources', params);
    } catch (error) {
      console.error('Failed to fetch sources:', error);
      throw error;
    }
  }

  // Helper methods for common queries
  async getTechNews(pageSize = 10): Promise<NewsApiResponse<Article>> {
    return this.getTopHeadlines({
      category: 'technology',
      pageSize
    });
  }

  async searchAINews(pageSize = 10): Promise<NewsApiResponse<Article>> {
    return this.getEverything({
      q: 'artificial intelligence OR machine learning',
      sortBy: 'publishedAt',
      language: 'en',
      pageSize
    });
  }

  async getStartupNews(pageSize = 10): Promise<NewsApiResponse<Article>> {
    return this.getEverything({
      q: 'startup OR entrepreneurship',
      sortBy: 'publishedAt',
      language: 'en',
      pageSize
    });
  }
}

export const newsapi = new NewsAPIClient();