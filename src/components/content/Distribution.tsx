import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Twitter, Linkedin, Clock } from 'lucide-react';
import type { SourceContent } from '@/types/content';

interface DistributionProps {
  content: SourceContent[];
}

export function Distribution({ content }: DistributionProps) {
  const approvedContent = content.filter((item) => item.status === 'approved');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Content Distribution</h2>
          <p className="text-muted-foreground">
            Schedule and publish content across platforms
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8">
          <Card className="p-6">
            <div className="space-y-4">
              {approvedContent.map((item) => (
                <Card key={item.id} className="p-4">
                  <h3 className="font-medium mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center space-x-4">
                    <Select>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="twitter">
                          <div className="flex items-center">
                            <Twitter className="h-4 w-4 mr-2" />
                            Twitter
                          </div>
                        </SelectItem>
                        <SelectItem value="linkedin">
                          <div className="flex items-center">
                            <Linkedin className="h-4 w-4 mr-2" />
                            LinkedIn
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Button variant="outline">
                      <Clock className="h-4 w-4 mr-2" />
                      Schedule
                    </Button>

                    <Button>Publish Now</Button>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>

        <div className="col-span-4">
          <Card className="p-6">
            <h3 className="font-medium mb-4">Publishing Calendar</h3>
            <Calendar />
          </Card>
        </div>
      </div>
    </div>
  );
}