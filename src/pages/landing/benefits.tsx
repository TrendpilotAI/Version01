import { Check } from 'lucide-react';

const benefits = {
  efficiency: [
    'Reduce content curation time by 70%',
    'Automated content scoring and ranking',
    'Smart scheduling across channels',
    'Bulk content processing',
  ],
  quality: [
    'AI-powered relevance scoring',
    'Content performance prediction',
    'Audience engagement analysis',
    'Competitive content insights',
  ],
  roi: [
    'Increase content engagement by 3x',
    'Reduce operational costs by 50%',
    'Higher team productivity',
    'Better resource allocation',
  ],
};

export function Benefits() {
  return (
    <div className="py-24 bg-primary/5 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 dark:text-white">Transform Your Content Operations</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto dark:text-gray-300">
            See how TrendPilot delivers value across your organization
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-xl font-semibold mb-6 dark:text-white">Operational Efficiency</h3>
            <ul className="space-y-4">
              {benefits.efficiency.map((benefit) => (
                <li key={benefit} className="flex items-start">
                  <Check className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                  <span className="dark:text-gray-300">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6 dark:text-white">Content Quality</h3>
            <ul className="space-y-4">
              {benefits.quality.map((benefit) => (
                <li key={benefit} className="flex items-start">
                  <Check className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                  <span className="dark:text-gray-300">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6 dark:text-white">Business Impact</h3>
            <ul className="space-y-4">
              {benefits.roi.map((benefit) => (
                <li key={benefit} className="flex items-start">
                  <Check className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                  <span className="dark:text-gray-300">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}