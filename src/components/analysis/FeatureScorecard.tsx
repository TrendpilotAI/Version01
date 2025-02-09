import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart,
  ResponsiveContainer,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import { analyzeFeatures, type ApplicationScore } from '@/lib/feature-analysis';

const STATUS_COLORS = {
  complete: 'bg-green-500',
  'in-progress': 'bg-yellow-500',
  planned: 'bg-blue-500'
};

export function FeatureScorecard() {
  const [analysis, setAnalysis] = useState<ApplicationScore | null>(null);

  useEffect(() => {
    async function loadAnalysis() {
      const result = await analyzeFeatures();
      setAnalysis(result);
    }
    loadAnalysis();
  }, []);

  if (!analysis) {
    return <div>Loading analysis...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Overall Application Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-2xl font-bold">
                {analysis.overall.toFixed(1)}/10
              </span>
              <span className="text-muted-foreground">
                Last updated: {new Date(analysis.lastUpdated).toLocaleDateString()}
              </span>
            </div>
            <Progress value={analysis.overall * 10} />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Capability Scores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analysis.capabilities}>
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Bar dataKey="score" fill="hsl(var(--primary))">
                    {analysis.capabilities.map((entry, index) => (
                      <Cell 
                        key={index}
                        fill={`hsl(${index * 360 / analysis.capabilities.length}, 70%, 50%)`}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Feature Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {analysis.capabilities.map((capability) => (
                <div key={capability.name} className="space-y-2">
                  <h3 className="font-medium">{capability.name}</h3>
                  <div className="space-y-1">
                    {capability.features.map((feature) => (
                      <div 
                        key={feature.name}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm">{feature.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{feature.score.toFixed(1)}</span>
                          <Badge 
                            variant="secondary"
                            className={STATUS_COLORS[feature.status]}
                          >
                            {feature.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}