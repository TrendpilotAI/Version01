import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Hero } from './hero';
import { Features } from './features';
import { Benefits } from './benefits';
import { Pricing } from './pricing';
import { Footer } from './footer';

export default function Landing() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b dark:bg-gray-900/80 dark:border-gray-800">
        <div className="container mx-auto px-4 h-16 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            TrendPilot
          </h1>
          <div className="space-x-4">
            <Button onClick={handleGetStarted}>Get Started</Button>
          </div>
        </div>
      </nav>
      <Hero />
      <Features />
      <Benefits />
      <Pricing />
      <Footer />
    </div>
  );
}