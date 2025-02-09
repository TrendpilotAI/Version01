```typescript
import type { BeehiivPublication, BeehiivPost, BeehiivSubscriber } from './types';

export class BeehiivClient {
  private apiKey: string;
  private baseUrl = 'https://api.beehiiv.com/v2';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Beehiiv API error: ${response.statusText}`);
    }

    return response.json();
  }

  // Publications
  async getPublications(): Promise<BeehiivPublication[]> {
    return this.request<BeehiivPublication[]>('/publications');
  }

  async getPublication(id: string): Promise<BeehiivPublication> {
    return this.request<BeehiivPublication>(`/publications/${id}`);
  }

  // Posts
  async getPosts(publicationId: string): Promise<BeehiivPost[]> {
    return this.request<BeehiivPost[]>(`/publications/${publicationId}/posts`);
  }

  async createPost(publicationId: string, post: Partial<BeehiivPost>): Promise<BeehiivPost> {
    return this.request<BeehiivPost>(`/publications/${publicationId}/posts`, {
      method: 'POST',
      body: JSON.stringify(post),
    });
  }

  async updatePost(publicationId: string, postId: string, updates: Partial<BeehiivPost>): Promise<BeehiivPost> {
    return this.request<BeehiivPost>(`/publications/${publicationId}/posts/${postId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  // Subscribers
  async getSubscribers(publicationId: string): Promise<BeehiivSubscriber[]> {
    return this.request<BeehiivSubscriber[]>(`/publications/${publicationId}/subscribers`);
  }

  async addSubscriber(publicationId: string, email: string, metadata?: Record<string, any>): Promise<BeehiivSubscriber> {
    return this.request<BeehiivSubscriber>(`/publications/${publicationId}/subscribers`, {
      method: 'POST',
      body: JSON.stringify({ email, metadata }),
    });
  }
}