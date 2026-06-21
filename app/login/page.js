'use client';

import React, { useState, useContext, useEffect } from 'react';
import Link from 'next/link';
import { AuthContext, ThemeContext } from '../../components/Providers';
import { Mail, Lock, Loader2, CheckSquare, Square } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const { login, loginWithGoogle } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let interval;
    const initGoogle = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: '214238079396-c5pssp351ab8d766fqocs9cbdmp29nko.apps.googleusercontent.com',
          callback: async (response) => {
            setLoading(true);
            try {
              const res = await loginWithGoogle(response.credential);
              if (res && !res.success) {
                toast.error(res.error || 'Google login failed');
              }
            } catch (err) {
              console.error(err);
              toast.error('Google login failed');
            } finally {
              setLoading(false);
            }
          },
        });
        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-btn'),
          {
            theme: theme === 'dark' ? 'filled_blue' : 'outline',
            size: 'large',
            width: '380',
            text: 'continue_with',
            shape: 'pill'
          }
        );
        if (interval) clearInterval(interval);
      }
    };

    initGoogle();
    interval = setInterval(initGoogle, 500);
    return () => clearInterval(interval);
  }, [theme, loginWithGoogle]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim()) return toast.error('Email is required');
    if (!formData.password) return toast.error('Password is required');

    setLoading(true);
    await login(formData.email, formData.password, rememberMe);
    setLoading(false);
  };

  const handleForgotPassword = () => {
    if (!formData.email) {
      toast.error('Please enter your email address to reset your password');
    } else {
      toast.success(`Password reset token sent to: ${formData.email}`);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-md w-full space-y-8 glass p-8 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Login to access your ReSell Hub account
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-sm text-gray-900 dark:text-white"
                placeholder="rakib.hasan@gmail.com"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-sm text-gray-900 dark:text-white"
                placeholder="******"
              />
            </div>
          </div>

          {/* Remember me & Forgot Password */}
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <button
              type="button"
              onClick={() => setRememberMe(!rememberMe)}
              className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 focus:outline-none"
            >
              {rememberMe ? (
                <CheckSquare className="text-primary-600" size={16} />
              ) : (
                <Square className="text-gray-400" size={16} />
              )}
              <span>Remember me</span>
            </button>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-primary-600 hover:underline font-semibold"
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center py-3.5 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-bold rounded-xl shadow-lg transition"
          >
            {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
            Login
          </button>
        </form>

        {/* Separator */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="border-t border-gray-200 dark:border-gray-800 w-full"></div>
          <span className="absolute bg-white dark:bg-gray-900 px-3 text-xs text-gray-400">Or continue with</span>
        </div>

        {/* Google Login Button */}
        <div className="flex justify-center w-full min-h-[44px]">
          <div id="google-signin-btn" className="w-full flex justify-center"></div>
        </div>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          Don't have an account yet?{' '}
          <Link href="/register" className="text-primary-600 hover:underline font-semibold">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
