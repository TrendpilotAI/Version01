import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { sourceDefinitions } from '@/lib/airbyte/sourceDefinitions';
import { useAirbyteSource } from '@/lib/airbyte/hooks/useAirbyteSource';
import type { SourceType } from '@/lib/airbyte/types';

interface SourceConfigFormProps {
  sourceType: string;
  onConfigured: () => void;
}

export function SourceConfigForm({ sourceType, onConfigured }: SourceConfigFormProps) {
  const [config, setConfig] = useState<Record<string, any>>({});
  const [isConfiguring, setIsConfiguring] = useState(false);
  const { toast } = useToast();
  const { createSource } = useAirbyteSource('default-workspace-id');
  const sourceConfig = sourceDefinitions[sourceType];

  if (!sourceConfig) {
    return <div>Invalid source type</div>;
  }

  const handleConfigure = async () => {
    setIsConfiguring(true);
    try {
      // Validate required fields
      const missingFields = sourceConfig.configFields
        .filter(field => field.required && !config[field.name])
        .map(field => field.label);

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Validate field patterns
      for (const field of sourceConfig.configFields) {
        if (field.validation?.pattern && config[field.name]) {
          const pattern = new RegExp(field.validation.pattern);
          if (!pattern.test(config[field.name])) {
            throw new Error(`Invalid format for ${field.label}`);
          }
        }
      }

      await createSource({
        name: sourceConfig.name,
        sourceDefinitionId: sourceConfig.id,
        connectionConfiguration: config
      });

      toast({
        title: 'Source Configured',
        description: `${sourceConfig.name} has been configured successfully`
      });
      onConfigured();
    } catch (error) {
      toast({
        title: 'Configuration Failed',
        description: error instanceof Error ? error.message : 'Failed to configure source',
        variant: 'destructive'
      });
    } finally {
      setIsConfiguring(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>{sourceConfig.icon}</span>
          {sourceConfig.name} Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sourceConfig.configFields.map((field) => (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>{field.label}</Label>
            {field.type === 'select' ? (
              <Select
                value={config[field.name]}
                onValueChange={(value) => setConfig({ ...config, [field.name]: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id={field.name}
                type={field.type}
                value={config[field.name] || ''}
                onChange={(e) => setConfig({ ...config, [field.name]: e.target.value })}
                {...(field.validation && {
                  pattern: field.validation.pattern,
                  min: field.validation.min,
                  max: field.validation.max
                })}
              />
            )}
          </div>
        ))}

        <Button
          className="w-full"
          onClick={handleConfigure}
          disabled={isConfiguring}
        >
          {isConfiguring ? 'Configuring...' : 'Configure Source'}
        </Button>
      </CardContent>
    </Card>
  );
}