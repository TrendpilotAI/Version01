import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ModelSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select model" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="deepseek-r1-chat">DeepSeek R1 Chat</SelectItem>
        <SelectItem value="deepseek-r1">DeepSeek R1</SelectItem>
      </SelectContent>
    </Select>
  );
}