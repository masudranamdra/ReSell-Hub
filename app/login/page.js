'use client';

import React, { useState, useContext } from 'react';
import Link from 'next/link';
import { AuthContext } from '../../components/Providers';
import { Mail, Lock, Loader2, CheckSquare, Square } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const { login, loginWithGoogle } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

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

  // Google Login simulator trigger
  const handleGoogleLogin = async () => {
    setLoading(true);
    const mockGoogleId = `google_${Date.now()}`;
    await loginWithGoogle(
      'Google User',
      formData.email || `google_user_${Date.now()}@gmail.com`,
      'https://i.pravatar.cc/300?img=12',
      mockGoogleId
    );
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
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 border border-gray-300 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl font-semibold text-sm text-gray-700 dark:text-gray-300 transition"
        >
          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69a5.74 5.74 0 0 1-2.49 3.77v3.12h4.01c2.34-2.16 3.68-5.32 3.68-8.74z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-4.01-3.12c-1.12.75-2.54 1.19-3.95 1.19-3.05 0-5.64-2.06-6.56-4.83H1.31v3.22A12.002 12.002 0 0 0 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.44 14.33c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.53H1.31A11.996 11.996 0 0 0 0 12c0 2.12.55 4.12 1.31 5.47l4.13-3.14z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.22 0 12 0 7.31 0 3.25 2.71 1.31 6.53l4.13 3.22c.92-2.77 3.51-4.83 6.56-4.83z"
            />
          </svg>
          Continue with Google
        </button>

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
