import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { validateConfig, type ConfigValidation } from '@/lib/config-validator';
import { AlertTriangle, CheckCircle, Settings, ExternalLink } from 'lucide-react';

export function ConfigurationStatus() {
  const [config, setConfig] = useState<ConfigValidation>();

  useEffect(() => {
    setConfig(validateConfig());
  }, []);

  if (!config) return null;

  const getConfigUrl = (service: string) => {
    switch (service) {
      case 'supabase':
        return 'https://supabase.com/dashboard';
      case 'newsapi':
        return 'https://newsapi.org/account';
      case 'deepseek':
        return 'https://platform.deepseek.com/settings';
      case 'beehiiv':
        return 'https://app.beehiiv.com/settings';
      default:
        return '#';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Service Configuration Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(config.services).map(([service, status]) => (
          <div key={service} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {status.configured ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              )}
              <span className="capitalize">{service}</span>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant={status.configured ? 'default' : 'secondary'}>
                {status.configured ? 'Configured' : 'Not Configured'}
              </Badge>
              {!status.configured && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(getConfigUrl(service), '_blank')}
                >
                  Configure
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        ))}

        {config.environment.isDev && (
          <div className="mt-6 pt-4 border-t">
            <h3 className="text-sm font-medium mb-2">Environment</h3>
            <div className="text-sm text-muted-foreground">
              <p>Mode: {config.environment.mode}</p>
              <p>Development: {config.environment.isDev ? 'Yes' : 'No'}</p>
              <p>Production: {config.environment.isProd ? 'Yes' : 'No'}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}