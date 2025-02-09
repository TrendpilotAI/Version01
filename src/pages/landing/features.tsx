import { Bot, Sparkles, Zap, BarChart2, Share2, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    title: 'AI-Powered Scoring',
    description: 'Automatically evaluate content relevance and impact with our advanced ML algorithms',
    icon: Sparkles,
  },
  {
    title: 'Smart Automation',
    description: 'Streamline your workflow with intelligent content processing and distribution',
    icon: Zap,
  },
  {
    title: 'Content Learning',
    description: 'System learns from your choices to improve recommendations over time',
    icon: Bot,
  },
  {
    title: 'Advanced Analytics',
    description: 'Gain deep insights into content performance and audience engagement',
    icon: BarChart2,
  },
  {
    title: 'Multi-Channel Distribution',
    description: 'Publish to multiple platforms with smart formatting and scheduling',
    icon: Share2,
  },
  {
    title: 'Enterprise Security',
    description: 'Bank-grade security with role-based access control and audit logs',
    icon: Shield,
  },
];

export function Features() {
  return (
    <div className="py-24 bg-gradient-to-b from-background via-primary/5 to-background relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent inline-block">
            Why Choose TrendPilot?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our platform combines AI intelligence with powerful automation to transform your content operations
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={feature.title} 
                className="border-primary/10 bg-background/60 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/5 transition-all group dark:bg-gray-900/60"
              >
                <CardHeader>
                  <div className="mb-4 inline-block p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors dark:bg-primary/20">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}