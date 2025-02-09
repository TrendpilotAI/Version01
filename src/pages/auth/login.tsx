import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { Apple, Facebook, Linkedin } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { signIn, signInWithProvider } from '@/lib/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSocialLogin = async (provider: 'google' | 'apple' | 'facebook' | 'linkedin') => {
    try {
      await signInWithProvider(provider);
    } catch (error) {
      toast({
        title: 'Social Login Error',
        description: error instanceof Error ? error.message : `Failed to login with ${provider}`,
        variant: 'destructive',
      });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);

      toast({
        title: 'Welcome back!',
        description: 'Successfully logged in.',
      });

      navigate('/system-status');
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to log in',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Log in to TrendPilot to manage your content curation and distribution
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Button variant="outline" className="w-full" onClick={() => handleSocialLogin('google')}>
              <FcGoogle className="h-5 w-5 mr-2" />
              Google
            </Button>
            <Button variant="outline" className="w-full" onClick={() => handleSocialLogin('apple')}>
              <Apple className="h-5 w-5 mr-2" />
              Apple
            </Button>
            <Button variant="outline" className="w-full" onClick={() => handleSocialLogin('facebook')}>
              <Facebook className="h-5 w-5 mr-2 text-blue-600" />
              Facebook
            </Button>
            <Button variant="outline" className="w-full" onClick={() => handleSocialLogin('linkedin')}>
              <Linkedin className="h-5 w-5 mr-2 text-blue-500" />
              LinkedIn
            </Button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Button variant="link" onClick={() => navigate('/auth/signup')}>
                Sign Up
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}