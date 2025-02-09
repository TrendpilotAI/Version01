import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { beehiivService } from '@/lib/beehiiv/beehiiv-service';

export function NewsletterPlatformConfig() {
  const [publicationId, setPublicationId] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const handleConnect = async () => {
    if (!publicationId) {
      toast({
        title: 'Publication ID required',
        description: 'Please enter your Beehiiv publication ID',
        variant: 'destructive',
      });
      return;
    }

    setIsConnecting(true);
    try {
      await beehiivService.syncPublication('default-workspace-id', publicationId);
      toast({
        title: 'Connected to Beehiiv',
        description: 'Your publication has been synced successfully',
      });
    } catch (error) {
      toast({
        title: 'Connection failed',
        description: error instanceof Error ? error.message : 'Failed to connect to Beehiiv',
        variant: 'destructive',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Beehiiv Integration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="publication-id">Publication ID</Label>
          <Input
            id="publication-id"
            value={publicationId}
            onChange={(e) => setPublicationId(e.target.value)}
            placeholder="Enter your Beehiiv publication ID"
          />
        </div>
        <Button 
          onClick={handleConnect}
          disabled={isConnecting}
        >
          {isConnecting ? 'Connecting...' : 'Connect to Beehiiv'}
        </Button>
      </CardContent>
    </Card>
  );
}