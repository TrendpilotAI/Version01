export type IssueStatus = 'draft' | 'reviewing' | 'scheduled' | 'published';

export interface NewsletterIssue {
  id: string;
  newsletter_id: string;
  title: string;
  content: string;
  status: IssueStatus;
  scheduled_for: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  metrics: Record<string, any>;
  ai_generated: boolean;
}