import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card } from '@/components/ui/card';

export default function Team() {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h2 className="text-3xl font-bold">Team</h2>
        <Card className="p-6">
          <p>Team management coming soon...</p>
        </Card>
      </div>
    </DashboardLayout>
  );
}