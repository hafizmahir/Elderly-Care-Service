import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { useRouter } from '../router/Router.js';
import { Loader2 } from 'lucide-react';

export const PrivateRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({
  children,
  adminOnly = false
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { path, navigate } = useRouter();

  useEffect(() => {
    // ⚠️ CRITICAL REQUIREMENT:
    // Only redirect if authentication check is completely finished AND user is not authenticated.
    // On reload, isLoading is true until localStorage/token hydration completes,
    // so authenticated users NEVER get bounced to login!
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate(`/login?redirect=${encodeURIComponent(path)}`, { replace: true });
      } else if (adminOnly && user?.role !== 'admin') {
        navigate('/my-bookings', { replace: true });
      }
    }
  }, [isLoading, isAuthenticated, user, adminOnly, path, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-emerald-700 animate-spin" />
        <p className="text-sm font-medium text-slate-600">Verifying secure care session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (adminOnly && user?.role !== 'admin') {
    return null;
  }

  return <>{children}</>;
};
