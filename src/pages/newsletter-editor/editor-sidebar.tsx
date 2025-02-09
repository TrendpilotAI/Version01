import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Wand2, Clock, Settings2 } from 'lucide-react';

interface EditorSidebarProps {
  newsletterId: string | null;
  content: string;
  onContentUpdate: (content: string) => void;
}

export function EditorSidebar({ newsletterId, content, onContentUpdate }: EditorSidebarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();

  const generateContent = async () => {
    // AI content generation will be implemented here
  };

  return (
    <div className="w-80 border-l p-4">
      <Tabs defaultValue="ai">
        <TabsList className="w-full">
          <TabsTrigger value="ai" className="flex-1">AI</TabsTrigger>
          <TabsTrigger value="schedule" className="flex-1">Schedule</TabsTrigger>
          <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Assistant</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Topic</Label>
                <Input placeholder="Enter a topic..." />
              </div>
              <div className="space-y-2">
                <Label>Tone</Label>
                <Input placeholder="Professional, Casual, etc." />
              </div>
              <Button className="w-full" onClick={generateContent}>
                <Wand2 className="h-4 w-4 mr-2" />
                Generate Content
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
              />
              <div className="space-y-2">
                <Label>Time</Label>
                <Input type="time" />
              </div>
              <div className="space-y-2">
                <Label>Time Zone</Label>
                <Input value="UTC" disabled />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings2 className="h-4 w-4 mr-2" />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Template</Label>
                <Input value="Default" disabled />
              </div>
              <div className="space-y-2">
                <Label>Font</Label>
                <Input value="Arial" disabled />
              </div>
              <div className="space-y-2">
                <Label>Colors</Label>
                <Input type="color" className="h-10" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}