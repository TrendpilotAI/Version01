import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle2, 
  XCircle, 
  Activity, 
  Shield, 
  Globe,
  Database 
} from 'lucide-react';
import { performSystemCheck, type SystemCheck } from '@/lib/monitoring/system-checker';

export function SystemStatus() {
  const [status, setStatus] = useState<SystemCheck | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSystem() {
      try {
        const result = await performSystemCheck();
        setStatus(result);
      } catch (error) {
        console.error('System check failed:', error);
      } finally {
        setLoading(false);
      }
    }

    checkSystem();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 animate-pulse" />
            <span>Checking System Status...</span>
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (!status) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to check system status</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">System Status</h2>
        <Badge variant={getHealthVariant(status.overallHealth)}>
          {status.overallHealth.toUpperCase()}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Authentication Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Authentication</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <StatusItem
                label="Session Valid"
                status={status.auth.sessionValid}
              />
              {status.auth.tokenExpiration && (
                <div className="text-sm text-muted-foreground">
                  Expires: {new Date(status.auth.tokenExpiration).toLocaleString()}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* API Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>API Connection</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <StatusItem
                label="Connected"
                status={status.api.isConnected}
              />
              <StatusItem
                label="SSL Valid"
                status={status.api.sslValid}
              />
              <div className="text-sm text-muted-foreground">
                Latency: {status.api.latency}ms
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Storage Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Storage</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <StatusItem
                label="Initialized"
                status={status.storage.initialized}
              />
              {Object.entries(status.storage.buckets).map(([bucket, isAvailable]) => (
                <StatusItem
                  key={bucket}
                  label={bucket}
                  status={isAvailable}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Request Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Request Setup</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <StatusItem
                label="Headers Valid"
                status={status.requests.headersValid}
              />
              <StatusItem
                label="API Key Valid"
                status={status.requests.apiKeyValid}
              />
              <StatusItem
                label="Content Type Valid"
                status={status.requests.contentTypeValid}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Errors Section */}
      {(status.requests.errors.length > 0 || status.storage.error) && (
        <Alert variant="destructive">
          <AlertDescription>
            <ul className="list-disc pl-4">
              {status.requests.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
              {status.storage.error && (
                <li>{status.storage.error}</li>
              )}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

function StatusItem({ label, status }: { label: string; status: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm capitalize">{label.replace(/([A-Z])/g, ' $1').trim()}</span>
      {status ? (
        <CheckCircle2 className="h-4 w-4 text-green-500" />
      ) : (
        <XCircle className="h-4 w-4 text-destructive" />
      )}
    </div>
  );
}

function getHealthVariant(health: string) {
  switch (health) {
    case 'healthy':
      return 'success';
    case 'degraded':
      return 'warning';
    default:
      return 'destructive';
  }
}