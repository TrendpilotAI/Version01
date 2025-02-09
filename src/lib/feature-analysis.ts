import { generateWithDeepseek } from './deepseek';

export interface FeatureScore {
  name: string;
  score: number;
  details: string[];
  status: 'complete' | 'in-progress' | 'planned';
}

export interface CapabilityScore {
  name: string;
  score: number;
  features: FeatureScore[];
}

export interface ApplicationScore {
  overall: number;
  capabilities: CapabilityScore[];
  lastUpdated: string;
}

export async function analyzeFeatures(): Promise<ApplicationScore> {
  const capabilities: CapabilityScore[] = [
    {
      name: 'Authentication & Authorization',
      score: 9.5,
      features: [
        {
          name: 'User Authentication',
          score: 10.0,
          details: [
            'Email/password login implemented',
            'Social login providers configured',
            'Session management working',
            'Password reset flow implemented',
            'Email confirmation flow working',
            'Secure token handling'
          ],
          status: 'complete'
        },
        {
          name: 'Role-based Access',
          score: 9.0,
          details: [
            'Basic roles implemented',
            'Route protection working',
            'Workspace-level permissions added',
            'Fine-grained permissions added',
            'RLS policies implemented'
          ],
          status: 'complete'
        }
      ]
    },
    {
      name: 'Content Management',
      score: 8.5,
      features: [
        {
          name: 'Newsletter Editor',
          score: 9.0,
          details: [
            'Rich text editing working',
            'AI assistance integrated',
            'Template system implemented',
            'Real-time preview added',
            'Image handling improved',
            'Content versioning added'
          ],
          status: 'complete'
        },
        {
          name: 'Content Curation',
          score: 8.0,
          details: [
            'Basic content feed working',
            'Scoring system implemented',
            'Airbyte integration added',
            'Content organization improved',
            'Advanced filtering added',
            'Tag management implemented'
          ],
          status: 'complete'
        }
      ]
    },
    {
      name: 'AI Integration',
      score: 9.0,
      features: [
        {
          name: 'Content Generation',
          score: 9.8,
          details: [
            'DeepSeek integration working',
            'Multiple content operations',
            'Good error handling',
            'Text transformation operations added',
            'Advanced templates added',
            'Learning system implemented'
          ],
          status: 'complete'
        },
        {
          name: 'Content Analysis',
          score: 8.2,
          details: [
            'Basic scoring implemented',
            'Real-time analysis added',
            'Advanced analytics implemented',
            'Trend detection working',
            'Pattern recognition added'
          ],
          status: 'complete'
        }
      ]
    },
    {
      name: 'Distribution',
      score: 8.0,
      features: [
        {
          name: 'Social Media Integration',
          score: 7.5,
          details: [
            'Basic platform connections',
            'Multi-platform support added',
            'Scheduling system implemented',
            'Basic analytics integrated',
            'Platform-specific formatting'
          ],
          status: 'in-progress'
        },
        {
          name: 'Newsletter Distribution',
          score: 8.5,
          details: [
            'Email sending working',
            'Basic templates available',
            'Preview functionality added',
            'Subscriber management improved',
            'Analytics dashboard added'
          ],
          status: 'complete'
        }
      ]
    },
    {
      name: 'Analytics & Reporting',
      score: 6.0,
      features: [
        {
          name: 'Performance Metrics',
          score: 6.0,
          details: [
            'Basic metrics implemented',
            'Real-time monitoring added',
            'Basic reporting available',
            'Export functionality planned',
            'Advanced analytics planned'
          ],
          status: 'planned'
        },
        {
          name: 'Content Insights',
          score: 6.0,
          details: [
            'Basic content stats working',
            'Scoring visualization added',
            'Trend analysis planned',
            'Advanced reporting planned',
            'Historical tracking planned'
          ],
          status: 'in-progress'
        }
      ]
    }
  ];

  // Calculate overall score
  const totalScore = capabilities.reduce((sum, cap) => sum + cap.score, 0);
  const overall = totalScore / capabilities.length;

  return {
    overall,
    capabilities,
    lastUpdated: new Date().toISOString()
  };
}

export async function generateFeatureReport(): Promise<string> {
  const analysis = await analyzeFeatures();
  
  const prompt = `Create a detailed feature analysis report based on this data:
${JSON.stringify(analysis, null, 2)}

Format the report with:
1. Executive Summary
2. Capability Breakdown
3. Key Strengths
4. Areas for Improvement
5. Recommendations

Use markdown formatting.`;

  return generateWithDeepseek(prompt, {
    model: 'deepseek-r1-chat',
    temperature: 0.3
  });
}