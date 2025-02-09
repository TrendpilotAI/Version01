import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';

export function AutomationSettings() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Automation Settings</h2>
          <p className="text-muted-foreground">
            Configure your content curation automation
          </p>
        </div>
        <Button>
          <Wand2 className="h-4 w-4 mr-2" />
          Auto-configure
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Auto-processing Rules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-approve high scores</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically approve content with high quality scores
                </p>
              </div>
              <Switch />
            </div>

            <div className="space-y-2">
              <Label>Minimum score threshold</Label>
              <Slider defaultValue={[4.5]} max={5} step={0.1} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Learning Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Adaptive scoring</Label>
                <p className="text-sm text-muted-foreground">
                  Learn from curator actions to improve scoring
                </p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Pattern recognition</Label>
                <p className="text-sm text-muted-foreground">
                  Identify content patterns and trends
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>High-quality alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about exceptional content
                </p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Queue alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Notifications for queue status changes
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}