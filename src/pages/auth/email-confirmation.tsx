import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { resendConfirmationEmail } from '@/lib/auth';

export default function EmailConfirmation() {
  const [resending, setResending] = useState(false);
  const location = useLocation();
  const { toast } = useToast();
  
  // Get email from location state or localStorage
  const email = location.state?.email || localStorage.getItem('pendingConfirmation');
  
  const handleResend = async () => {
    if (!email) {
      toast({
        title: 'Error',
        description: 'No email address found. Please try signing up again.',
        variant: 'destructive'
      });
      return;
    }

    setResending(true);
    try {
      await resendConfirmationEmail(email);
      toast({
        title: 'Confirmation email resent',
        description: 'Please check your inbox for the confirmation link.'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to resend confirmation email',
        variant: 'destructive'
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-[400px]">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Check Your Email</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              We've sent a confirmation link to{' '}
              <span className="font-medium">{email}</span>. 
              Please click the link to activate your account.
            </p>
            <p className="text-sm text-muted-foreground">
              If you don't see the email, check your spam folder or{' '}
              <button 
                className="text-primary hover:underline" 
                onClick={handleResend}
                disabled={resending}
              >
                {resending ? (
                  <>
                    <Loader2 className="inline h-4 w-4 animate-spin mr-1" />
                    Resending...
                  </>
                ) : (
                  'click here to resend'
                )}
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}