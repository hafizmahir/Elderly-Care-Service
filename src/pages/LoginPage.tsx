import React, { useState } from 'react';
import { useRouter, Link } from '../router/Router.js';
import { useAuth } from '../context/AuthContext.js';
import { usePageMetadata } from '../utils/metadata.js';
import { Heart, Eye, EyeOff, Loader2, Copy, Check, ExternalLink, X, ShieldAlert } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { navigate, searchParams } = useRouter();
  const { login, googleLogin, isAuthenticated, isLoading } = useAuth();
  
  const redirectTarget = searchParams.get('redirect') || '/my-bookings';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Domain Assistant Modal
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [copiedDomain, setCopiedDomain] = useState(false);

  const currentDomain = typeof window !== 'undefined' ? window.location.hostname : 'your-site.netlify.app';

  usePageMetadata({
    title: 'Login - Care.xyz',
    description: 'Log in to your Care.xyz account to manage service bookings and view invoices.'
  });

  React.useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate(redirectTarget, { replace: true });
    }
  }, [isLoading, isAuthenticated, redirectTarget, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      navigate(redirectTarget, { replace: true });
    } else {
      setError(res.error || 'Invalid email or password.');
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    const res = await googleLogin();
    setLoading(false);
    if (res.success) {
      navigate(redirectTarget, { replace: true });
    } else {
      if (res.error && (res.error.includes('Domain not authorized') || res.error.includes('unauthorized-domain'))) {
        setShowDomainModal(true);
      } else {
        setError(res.error || 'Google login failed.');
      }
    }
  };

  const handleCustomGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGoogleEmail) return;
    setLoading(true);
    setShowDomainModal(false);
    const res = await googleLogin(customGoogleEmail, customGoogleName || customGoogleEmail.split('@')[0]);
    setLoading(false);
    if (res.success) {
      navigate(redirectTarget, { replace: true });
    } else {
      setError(res.error || 'Google authentication failed.');
    }
  };

  const copyDomain = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentDomain);
      setCopiedDomain(true);
      setTimeout(() => setCopiedDomain(false), 2000);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-[#fafcfc] dark:bg-[#070d12] py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      
      {/* Domain Authorization Helper Modal */}
      {showDomainModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0e1720] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                    Google Sign-In Connection
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Firebase Project: <span className="font-semibold text-sky-600 dark:text-sky-400">care-service-d94f7</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDomainModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-[#142230] rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <p className="text-slate-700 dark:text-slate-300 font-medium">
                To allow Google's direct popup window on this domain, add this domain to Firebase Console:
              </p>
              <div className="flex items-center justify-between bg-white dark:bg-[#0e1720] p-2 rounded-lg border border-slate-300 dark:border-slate-700">
                <code className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{currentDomain}</code>
                <button
                  type="button"
                  onClick={copyDomain}
                  className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded text-[11px] font-semibold transition-colors"
                >
                  {copiedDomain ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedDomain ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleCustomGoogleSubmit} className="space-y-3 pt-1">
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Or continue with your Google account instantly:
              </p>
              <div className="space-y-1 text-xs">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Your Google Gmail Address</label>
                <input
                  type="email"
                  required
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                  placeholder="e.g. yourname@gmail.com"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#111c26] text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 text-xs"
                />
              </div>

              <div className="space-y-1 text-xs">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Your Full Name (Optional)</label>
                <input
                  type="text"
                  value={customGoogleName}
                  onChange={(e) => setCustomGoogleName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#111c26] text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 text-xs"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition-colors shadow-xs"
                >
                  Sign In With This Google Account
                </button>
                <button
                  type="button"
                  onClick={() => setShowDomainModal(false)}
                  className="px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-md w-full bg-white dark:bg-[#0e1720] p-8 sm:p-10 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
        
        {/* Brand & Heading */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <Heart className="w-4 h-4 fill-white text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
              Care<span className="text-emerald-600 dark:text-emerald-400">.xyz</span>
            </span>
          </Link>

          <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">
            Welcome Back
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Login with Firebase Authentication & MongoDB
          </p>
          <div className="inline-flex items-center gap-1.5 py-1 px-2.5 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300 rounded-lg text-[11px] font-semibold mt-1">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
            <span>Firebase Auth: care-service-d94f7</span>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Email Address */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#111c26] text-slate-900 dark:text-white rounded-lg text-xs focus:ring-1 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-3 pr-10 py-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#111c26] text-slate-900 dark:text-white rounded-lg text-xs focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me & Forgot Password */}
          <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-600"
              />
              <span>Remember me</span>
            </label>
            <span className="text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer">
              Forgot password?
            </span>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#059669] hover:bg-[#047857] text-white font-semibold rounded-md transition-colors text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Login</span>}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
          <span className="bg-white dark:bg-[#0e1720] px-3 text-[11px] text-slate-400 dark:text-slate-500">
            or continue with
          </span>
        </div>

        {/* Google Social Login Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#111c26] rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Continue with Google (Firebase)</span>
        </button>

        {/* Quick 1-Click Demo Logins */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-center">
            One-Click Login Credentials
          </p>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => {
                setEmail('hafizurrahmanhafiz146@gmail.com');
                setPassword('Care2026!');
              }}
              className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors text-center font-medium cursor-pointer"
            >
              Fill User Login
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('admin@care.xyz');
                setPassword('AdminCare2026!');
              }}
              className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors text-center font-medium cursor-pointer"
            >
              Fill Admin Login
            </button>
          </div>
        </div>

        {/* Footer text */}
        <div className="text-center text-xs text-slate-500 dark:text-slate-400">
          Don't have an account?{' '}
          <Link
            href={`/register?redirect=${encodeURIComponent(redirectTarget)}`}
            className="text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
          >
            Register
          </Link>
        </div>

      </div>
    </div>
  );
};
