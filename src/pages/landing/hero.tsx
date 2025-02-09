import { ArrowRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function Hero() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  const handleLogin = () => {
    navigate('/auth/login');
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-primary/2 to-background pt-24 pb-32 dark:from-primary/10 dark:via-primary/5 dark:to-background">
      {/* Animated background patterns */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse dark:bg-primary/10" />
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000 dark:bg-purple-500/10" />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-block mb-6 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium dark:bg-primary/20">
            New: AI-Powered Content Scoring 🚀
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent animate-gradient">
            AI-Powered Content Curation & Distribution
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed dark:text-gray-300">
            Transform your content workflow with intelligent curation, scoring, and multi-channel distribution. 
            <span className="text-primary font-medium dark:text-primary/90">Save 20+ hours every week</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              className="text-lg px-8 h-14 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 dark:text-white"
              onClick={handleGetStarted}
            >
              Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 h-14 group dark:border-gray-700 dark:hover:border-primary"
              onClick={handleLogin}
            >
              Log In
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 h-14 group dark:border-gray-700 dark:hover:border-primary">
              <Play className="mr-2 h-4 w-4 group-hover:text-primary transition-colors" />
              Watch Demo
            </Button>
          </div>

          <div className="text-sm font-medium text-muted-foreground mb-6 dark:text-gray-400">
            Trusted by content teams at leading companies worldwide
          </div>
          
          <div className="flex justify-center items-center gap-12 grayscale opacity-60 hover:opacity-100 transition-opacity dark:opacity-40 dark:hover:opacity-80">
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" className="h-8 dark:invert" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" className="h-7 dark:invert" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" alt="Netflix" className="h-6 dark:invert" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b2/Slack_RGB.svg" alt="Slack" className="h-7 dark:invert" />
          </div>
        </div>
      </div>
    </div>
  );
}