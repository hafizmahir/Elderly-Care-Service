import React, { useState } from 'react';
import { useRouter, Link } from '../router/Router.js';
import { useAuth } from '../context/AuthContext.js';
import { usePageMetadata } from '../utils/metadata.js';
import { Heart, Loader2 } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { navigate, searchParams } = useRouter();
  const { register, googleLogin, isAuthenticated, isLoading } = useAuth();
  
  const redirectTarget = searchParams.get('redirect') || '/booking/baby-care';

  const [nid, setNid] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  usePageMetadata({
    title: 'Register - Care.xyz',
    description: 'Create your Care.xyz verified account with NID validation.'
  });

  React.useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate(redirectTarget, { replace: true });
    }
  }, [isLoading, isAuthenticated, redirectTarget, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  // Password validation: 6+ chars, 1 uppercase, 1 lowercase
  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const isPasswordValid = hasMinLength && hasUppercase && hasLowercase;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) {
      setError('Password must be at least 6 characters and include 1 uppercase and 1 lowercase letter.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your confirm password.');
      return;
    }
    if (nid.trim().length < 10) {
      setError('National ID (NID) must be at least 10 digits for verification.');
      return;
    }

    setLoading(true);
    setError(null);

    const res = await register({
      nid,
      name,
      email,
      contact,
      password
    });

    setLoading(false);
    if (res.success) {
      navigate(redirectTarget, { replace: true });
    } else {
      setError(res.error || 'Registration could not be completed.');
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-[#fafcfc] dark:bg-[#070d12] py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
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
            Create Your Account
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Join Care.xyz with Firebase Authentication
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* NID No */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">NID No</label>
            <input
              type="text"
              required
              value={nid}
              onChange={(e) => setNid(e.target.value)}
              placeholder="Enter your NID number"
              className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#111c26] text-slate-900 dark:text-white rounded-lg text-xs font-mono focus:ring-1 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          {/* Full Name */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#111c26] text-slate-900 dark:text-white rounded-lg text-xs focus:ring-1 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

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

          {/* Contact Number */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Contact Number</label>
            <input
              type="text"
              required
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Enter your phone number"
              className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#111c26] text-slate-900 dark:text-white rounded-lg text-xs focus:ring-1 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#111c26] text-slate-900 dark:text-white rounded-lg text-xs focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Confirm Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#111c26] text-slate-900 dark:text-white rounded-lg text-xs focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Password rule note from mockup */}
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
            Password must be at least 6 characters and include 1 uppercase and 1 lowercase letter.
          </p>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#059669] hover:bg-[#047857] text-white font-semibold rounded-md transition-colors text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Register</span>}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
          <span className="bg-white dark:bg-[#0e1720] px-3 text-[11px] text-slate-400 dark:text-slate-500">
            or sign up with
          </span>
        </div>

        {/* Google Social Login Button */}
        <button
          type="button"
          onClick={async () => {
            setLoading(true);
            setError(null);
            const res = await googleLogin();
            setLoading(false);
            if (res.success) {
              navigate(redirectTarget, { replace: true });
            } else {
              setError(res.error || 'Google login failed.');
            }
          }}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#111c26] rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Sign up with Google (Firebase)</span>
        </button>

        {/* Footer text */}
        <div className="text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4">
          Already have an account?{' '}
          <Link
            href={`/login?redirect=${encodeURIComponent(redirectTarget)}`}
            className="text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
          >
            Login
          </Link>
        </div>

      </div>
    </div>
  );
};
