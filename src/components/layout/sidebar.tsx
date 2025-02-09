// React and routing
import { Link, useLocation } from 'react-router-dom';

// Icons
import {
  Activity,
  BarChart2,
  CreditCard,
  Database,
  FileText,
  Mail,
  Settings,
  Sparkles,
  Users,
  Users2
} from 'lucide-react';

// Utils
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'System Status', href: '/system-status', icon: Activity },
  { name: 'App Scorecard', href: '/app-scorecard', icon: BarChart2 },
  { name: 'Editor', href: '/editor', icon: Mail },
  { name: 'Issues', href: '/newsletters/:newsletterId/issues', icon: FileText },
  { name: 'Subscribers', href: '/subscribers', icon: Users },
  { name: 'Content Scoring', href: '/default-workspace/scoring', icon: Sparkles },
  { name: 'Integrations', href: '/integrations', icon: Database },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Billing', href: '/billing', icon: CreditCard },
  { name: 'Team', href: '/team', icon: Users2 },
];

export function Sidebar() {
  const location = useLocation();
  
  return (
    <div className="flex h-full w-64 flex-col bg-muted">
      <div className="flex h-16 items-center px-4">
        <h1 className="text-xl font-bold">TrendPilot</h1>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          const href = item.href.replace(':newsletterId', '1');
          
          return (
            <Link
              key={item.name}
              to={href}
              className={cn(
                'group flex items-center rounded-md px-2 py-2 text-sm font-medium',
                location.pathname === href
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}