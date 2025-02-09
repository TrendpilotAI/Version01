// React and routing
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Landing from '@/pages/landing';

// Components
import { AuthGuard } from '@/components/auth/AuthGuard';
import { ErrorBoundary } from '@/components/error-boundary';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

// Context providers
import { NewsletterProvider } from '@/contexts/newsletter-context';

import Login from '@/pages/auth/login';
import Signup from '@/pages/auth/signup';
import EmailConfirmation from '@/pages/auth/email-confirmation';
import EmailConfirmed from '@/pages/auth/email-confirmed';
import SystemStatus from '@/pages/system-status';
import AppScorecard from '@/pages/app-scorecard';
import NewsletterEditor from '@/pages/newsletter-editor';
import NewsletterIssues from '@/pages/newsletter-editor/issues';
import Subscribers from '@/pages/subscribers';
import Analytics from '@/pages/analytics';
import Settings from '@/pages/settings';
import Billing from '@/pages/billing';
import Team from '@/pages/team';
import ScoringPage from '@/pages/[workspace]/scoring';

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system" storageKey="trendpilot-theme">
        <TooltipProvider>
          <NewsletterProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/signup" element={<Signup />} />
                <Route path="/auth/email-confirmation" element={<EmailConfirmation />} />
                <Route path="/auth/email-confirmed" element={<EmailConfirmed />} />
                <Route element={<AuthGuard />}>
                  <Route path="/system-status" element={<SystemStatus />} />
                  <Route path="/app-scorecard" element={<AppScorecard />} />
                  <Route path="/editor" element={<NewsletterEditor />} />
                  <Route path="/newsletters/:newsletterId/issues" element={<NewsletterIssues />} />
                  <Route path="/subscribers" element={<Subscribers />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/billing" element={<Billing />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/:workspace/scoring" element={<ScoringPage />} />
                </Route>
              </Routes>
              <Toaster />
            </Router>
          </NewsletterProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}