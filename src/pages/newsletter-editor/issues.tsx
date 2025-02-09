import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { IssueList } from '@/components/issues/issue-list';
import { IssueForm } from '@/components/issues/issue-form';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { createNewsletterIssue, updateNewsletterIssue } from '@/lib/api/issues';
import type { NewsletterIssue } from '@/types/newsletter';
import { useToast } from '@/components/ui/use-toast';

export default function Issues() {
  const { newsletterId } = useParams<{ newsletterId: string }>();
  const [selectedIssue, setSelectedIssue] = useState<NewsletterIssue | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleCreateIssue = async (data: Partial<NewsletterIssue>) => {
    try {
      await createNewsletterIssue({
        ...data,
        newsletter_id: newsletterId!,
      });
      setIsDialogOpen(false);
      toast({ title: 'Issue created successfully' });
    } catch (error) {
      toast({
        title: 'Failed to create issue',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateIssue = async (data: Partial<NewsletterIssue>) => {
    if (!selectedIssue) return;
    try {
      await updateNewsletterIssue(selectedIssue.id, data);
      setSelectedIssue(null);
      toast({ title: 'Issue updated successfully' });
    } catch (error) {
      toast({
        title: 'Failed to update issue',
        variant: 'destructive',
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">Newsletter Issues</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Issue
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Issue</DialogTitle>
              </DialogHeader>
              <IssueForm onSubmit={handleCreateIssue} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <IssueList
              newsletterId={newsletterId!}
              onIssueSelect={setSelectedIssue}
            />
          </div>
          <div>
            {selectedIssue && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Edit Issue</h3>
                <IssueForm
                  issue={selectedIssue}
                  onSubmit={handleUpdateIssue}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}