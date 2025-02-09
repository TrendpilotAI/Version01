import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { MoonIcon, SunIcon } from 'lucide-react';
import { ConnectButton } from '@/components/supabase/ConnectButton';
import { ConnectionStatus } from '@/components/supabase/ConnectionStatus';
import { useTheme } from '@/components/theme-provider';

export function Header() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  return (
    <header className="flex h-16 items-center justify-between border-b px-6">
      <div className="flex items-center space-x-4">
        <span className="text-sm text-muted-foreground">Welcome back!</span>
        <ConnectionStatus />
      </div>
      <div className="flex items-center space-x-4">
        <ConnectButton />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? (
            <SunIcon className="h-5 w-5" />
          ) : (
            <MoonIcon className="h-5 w-5" />
          )}
        </Button>
      </div>
    </header>
  );
}