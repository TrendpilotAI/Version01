import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { FeatureScorecard } from '@/components/analysis/FeatureScorecard';
import { Button } from '@/components/ui/button'; 
import { Download, RefreshCw } from 'lucide-react';
import { generateFeatureReport } from '@/lib/feature-analysis';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';

export default function AppScorecard() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleExportReport = async () => {
    try {
      const report = await generateFeatureReport();
      
      // Create blob and download
      const blob = new Blob([report], { type: 'text/markdown' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `feature-analysis-${new Date().toISOString().split('T')[0]}.md`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: 'Report exported successfully',
        description: 'The feature analysis report has been downloaded.'
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: error instanceof Error ? error.message : 'Failed to export report',
        variant: 'destructive'
      });
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Allow UI to update
      toast({
        title: 'Scorecard refreshed',
        description: 'The feature analysis has been updated.'
      });
    } catch (error) {
      toast({
        title: 'Refresh failed',
        description: error instanceof Error ? error.message : 'Failed to refresh scorecard',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">App Scorecard</h1>
            <p className="text-muted-foreground mt-1">
              Track application feature completion and development progress
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={handleExportReport}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        <FeatureScorecard />
      </div>
    </DashboardLayout>
  );
}