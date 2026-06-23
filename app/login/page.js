'use client';

import React, { useState, useContext, useEffect, useRef } from 'react';
import Link from 'next/link';
import { AuthContext, ThemeContext } from '../../components/Providers';
import { Mail, Lock, Loader2, CheckSquare, Square, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const { login, loginWithGoogle } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'buyer'
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleRole, setGoogleRole] = useState('buyer');

  const googleRoleRef = useRef('buyer');

  useEffect(() => {
    googleRoleRef.current = googleRole;
  }, [googleRole]);

  useEffect(() => {
    let interval;
    const initGoogle = () => {
      const btnContainer = document.getElementById('google-signin-btn-modal');
      if (window.google?.accounts?.id && btnContainer) {
        window.google.accounts.id.initialize({
          client_id: '214238079396-c5pssp351ab8d766fqocs9cbdmp29nko.apps.googleusercontent.com',
          callback: async (response) => {
            setLoading(true);
            try {
              const res = await loginWithGoogle(response.credential, googleRoleRef.current);
              if (res && !res.success) {
                toast.error(res.error || 'Google login failed');
              } else {
                setShowGoogleModal(false);
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
          btnContainer,
          {
            theme: theme === 'dark' ? 'filled_blue' : 'outline',
            size: 'large',
            width: '320',
            text: 'continue_with',
            shape: 'pill'
          }
        );
        if (interval) clearInterval(interval);
      }
    };

    if (showGoogleModal) {
      initGoogle();
      interval = setInterval(initGoogle, 500);
    }
    return () => clearInterval(interval);
  }, [theme, loginWithGoogle, showGoogleModal]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim()) return toast.error('Email is required');
    if (!formData.password) return toast.error('Password is required');
    if (!formData.role) return toast.error('Role is required');

    setLoading(true);
    await login(formData.email, formData.password, formData.role, rememberMe);
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
      <div className="max-w-md w-full space-y-8 glass p-8 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
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
          <div className="space-y-1 text-left">
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
          <div className="space-y-1 text-left">
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

          {/* Role Selection Dropdown */}
          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Login Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
              <option value="admin">Admin</option>
            </select>
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

        {/* Custom Google login triggers modal first */}
        <div className="flex justify-center w-full">
          <button
            type="button"
            onClick={() => setShowGoogleModal(true)}
            className="w-full flex items-center justify-center gap-2.5 py-3 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition font-semibold text-gray-700 dark:text-gray-300 text-sm shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.727 5.727 0 0 1 8.24 12.8a5.727 5.727 0 0 1 5.751-5.714c1.558 0 2.977.604 4.05 1.585l3.076-3.057C19.167 3.738 16.275 2.5 13.99 2.5c-5.79 0-10.49 4.614-10.49 10.3s4.7 10.3 10.49 10.3c6.04 0 10.046-4.16 10.046-10.033 0-.616-.065-1.205-.182-1.782H12.24Z"
              />
            </svg>
            Continue with Google
          </button>
        </div>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          Don't have an account yet?{' '}
          <Link href="/register" className="text-primary-600 hover:underline font-semibold">
            Register here
          </Link>
        </p>
      </div>

      {/* Google Login Role Selection Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-250 dark:border-gray-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-center space-y-6">
            <button
              onClick={() => setShowGoogleModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={20} />
            </button>
            
            <div>
              <h3 className="text-xl font-bold text-gray-950 dark:text-white">Select User Role</h3>
              <p className="text-xs text-gray-500 mt-1.5">
                Select your role before signing in with Google.
              </p>
            </div>

            {/* Role Options */}
            <div className="grid grid-cols-3 gap-3 text-left">
              {[
                { id: 'buyer', title: 'Buyer', desc: 'Shop pre-owned' },
                { id: 'seller', title: 'Seller', desc: 'List for sale' },
                { id: 'admin', title: 'Admin', desc: 'Manage hub' }
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setGoogleRole(r.id)}
                  className={`p-3.5 border-2 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition text-center ${
                    googleRole === r.id
                      ? 'border-primary-600 bg-primary-50/50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400'
                      : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <span className="font-extrabold text-xs">{r.title}</span>
                  <span className="text-[9px] text-gray-400">{r.desc}</span>
                </button>
              ))}
            </div>

            {/* Google Authentication Render Button */}
            <div className="flex flex-col items-center justify-center space-y-3 pt-2">
              <div id="google-signin-btn-modal" className="w-full flex justify-center min-h-[44px]"></div>
              
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
