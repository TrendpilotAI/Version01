import { useEffect, useState } from 'react';
import { getNewsletterIssues } from '@/lib/api/issues';
import type { NewsletterIssue } from '@/types/newsletter';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface IssueListProps {
  newsletterId: string;
  onIssueSelect: (issue: NewsletterIssue) => void;
}

export function IssueList({ newsletterId, onIssueSelect }: IssueListProps) {
  const [issues, setIssues] = useState<NewsletterIssue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadIssues() {
      try {
        const data = await getNewsletterIssues(newsletterId);
        setIssues(data);
      } catch (error) {
        console.error('Failed to load issues:', error);
      } finally {
        setLoading(false);
      }
    }

    loadIssues();
  }, [newsletterId]);

  if (loading) {
    return <div>Loading issues...</div>;
  }

  return (
    <div className="space-y-4">
      {issues.map((issue) => (
        <Card
          key={issue.id}
          className="p-4 cursor-pointer hover:bg-accent"
          onClick={() => onIssueSelect(issue)}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{issue.title}</h3>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(issue.created_at), { addSuffix: true })}
              </p>
            </div>
            <Badge>{issue.status}</Badge>
          </div>
        </Card>
      ))}
    </div>
  );
}