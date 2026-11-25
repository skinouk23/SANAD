import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, logout, isAuthenticated, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = (location.state as {from?: {pathname?: string;};} | undefined)?.from?.pathname
    || '/admin/dashboard';

  useEffect(() => {
    if (!isLoading && isAuthenticated && isAdmin) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, isAdmin, isLoading, navigate, redirectTo]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const authenticatedUser = await login(email, password);

      if (authenticatedUser.role !== 'admin') {
        logout();
        setError('Access restricted to administrators.');
        return;
      }

      navigate(redirectTo, { replace: true });
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : 'Unable to sign in. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex font-sans">
      <div className="hidden lg:flex lg:w-[45%] bg-slate-900 relative overflow-hidden flex-col justify-between p-12">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />

        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-teal-600/5 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <img
              src="/Sanad.png"
              alt="Sanad"
              className="w-10 h-10 rounded-lg object-contain"
            />
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Sanad</h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">
                Administration
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-white leading-tight">
              Platform
              <br />
              Control Center
            </h2>
            <p className="text-slate-400 mt-4 text-sm leading-relaxed max-w-sm">
              Manage providers, moderation, platform operations, and financial activity
              from one secure dashboard.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                label: 'Admin Provider Oversight',
                desc: 'Review, update, suspend, approve, and remove providers'
              },
              {
                label: 'Operational Visibility',
                desc: 'Track platform activity, risk points, and service health'
              },
              {
                label: 'Secure Access',
                desc: 'Real backend authentication with renewable admin sessions'
              }
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-slate-200">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} Sanad Tunisia. All rights reserved.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <img
              src="/Sanad.png"
              alt="Sanad"
              className="w-9 h-9 rounded-lg object-contain"
            />
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">Sanad</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">
                Admin Portal
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
                <ShieldCheck className="w-3.5 h-3.5" />
                Secured Admin Access
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-4">
                Sign in
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Use your admin account to continue to the control center.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setError('');
                    }}
                    placeholder="admin@sanad.tn"
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setError('');
                    }}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-lg"
                >
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <p className="text-xs text-red-700 dark:text-red-400">{error}</p>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting || isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
