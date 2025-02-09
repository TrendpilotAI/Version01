import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { CurationDashboard } from '@/components/content/curation/CurationDashboard';

export default function CurationPage() {
  return (
    <DashboardLayout>
      <CurationDashboard />
    </DashboardLayout>
  );
}