import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function EmailConfirmed() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Clear the pending confirmation email from storage
    localStorage.removeItem('pendingConfirmation');

    // Show success toast
    toast({
      title: 'Email Confirmed',
      description: 'Your account has been activated successfully.',
    });

    // Automatically redirect to login after 5 seconds
    const timer = setTimeout(() => {
      navigate('/auth/login');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-[400px]">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-green-500/10">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Email Confirmed!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Your email has been confirmed successfully. You can now log in to your account.
            </p>
            <p className="text-sm text-muted-foreground">
              Redirecting to login in 5 seconds...
            </p>
            <Button 
              className="w-full" 
              onClick={() => navigate('/auth/login')}
            >
              Continue to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}