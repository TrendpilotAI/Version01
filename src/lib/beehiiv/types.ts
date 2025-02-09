export interface BeehiivPublication {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface BeehiivPost {
  id: string;
  publication_id: string;
  title: string;
  subtitle?: string;
  content: string;
  status: 'draft' | 'scheduled' | 'published';
  scheduled_for?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface BeehiivSubscriber {
  id: string;
  publication_id: string;
  email: string;
  status: 'active' | 'pending' | 'unsubscribed';
  created_at: string;
  metadata?: Record<string, any>;
}

export interface BeehiivStats {
  total_subscribers: number;
  open_rate: number;
  click_rate: number;
}