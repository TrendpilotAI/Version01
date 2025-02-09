import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/auth/login');
      } else if (event === 'SIGNED_IN') {
        navigate('/system-status');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  async function checkAuth() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session error:', error);
        throw new Error('Authentication error');
      }

      if (!session) {
        navigate('/auth/login');
        return;
      }

      // Verify user profile and permissions
      const { data: userProfile } = await supabase
        .from('users')
        .select(`
          id,
          role,
          permissions,
          workspace_members!inner (
            workspace_id,
            role
          )
        `)
        .eq('id', session.user.id)
        .single();

      if (!userProfile) {
        throw new Error('User profile not found');
      }

      // Verify workspace access
      if (userProfile.workspace_members.length === 0) {
        throw new Error('No workspace access');
      }

      // Store user permissions in context
      localStorage.setItem('userPermissions', JSON.stringify(userProfile.permissions));

      setLoading(false);
    } catch (error) {
      toast({
        title: 'Authentication Error',
        description: error instanceof Error 
          ? error.message 
          : 'Please log in to continue',
        variant: 'destructive',
      });
      navigate('/auth/login');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}