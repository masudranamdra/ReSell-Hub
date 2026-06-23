'use client';

import React, { useState, useContext, useEffect, useRef } from 'react';
import Link from 'next/link';
import { AuthContext, ThemeContext } from '../../components/Providers';
import { Mail, Lock, User, Phone, MapPin, Image as ImageIcon, Loader2, CheckSquare, Square, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Register() {
  const { register, loginWithGoogle } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    password: '',
    confirmPassword: '',
    photo: '',
    role: 'buyer' // Local registration role
  });

  const [acceptTerms, setAcceptTerms] = useState(false);
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
                toast.error(res.error || 'Google signup failed');
              } else {
                setShowGoogleModal(false);
              }
            } catch (err) {
              console.error(err);
              toast.error('Google signup failed');
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
            text: 'signup_with',
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

    // Validations
    if (!formData.name.trim()) return toast.error('Full name is required');
    if (!formData.email.trim()) return toast.error('Email is required');
    if (!formData.password) return toast.error('Password is required');
    if (formData.password.length < 6) return toast.error('Password must be at least 6 characters');
    if (formData.password !== formData.confirmPassword) return toast.error('Passwords do not match');
    if (!acceptTerms) return toast.error('You must accept the terms & conditions');

    setLoading(true);
    await register(
      formData.name,
      formData.email,
      formData.password,
      formData.confirmPassword,
      formData.photo,
      formData.phone,
      formData.location,
      formData.role
    );
    setLoading(false);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-md w-full space-y-8 glass p-8 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Join ReSell Hub and start trading today
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-sm text-gray-900 dark:text-white"
                placeholder="Rakib Hasan"
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-sm text-gray-900 dark:text-white"
                placeholder="rakib@gmail.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Phone Field */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Phone (Optional)</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-gray-400" size={16} />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-sm text-gray-900 dark:text-white"
                  placeholder="+88017..."
                />
              </div>
            </div>

            {/* Location Field */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Location (Optional)</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400" size={16} />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-sm text-gray-900 dark:text-white"
                  placeholder="Dhaka"
                />
              </div>
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-sm text-gray-900 dark:text-white"
                placeholder="******"
              />
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-sm text-gray-900 dark:text-white"
                placeholder="******"
              />
            </div>
          </div>

          {/* Register Role Field */}
          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Register As</label>
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

          {/* Profile Photo URL */}
          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Profile Photo URL (Optional)</label>
            <div className="flex items-center gap-3">
              {formData.photo ? (
                <img
                  src={formData.photo}
                  alt="Preview"
                  className="w-10 h-10 rounded-full object-cover border-2 border-primary-500 flex-shrink-0"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700 flex-shrink-0">
                  <User className="text-gray-400" size={18} />
                </div>
              )}
              <div className="relative flex-grow">
                <ImageIcon className="absolute left-3 top-3 text-gray-400" size={15} />
                <input
                  type="url"
                  name="photo"
                  value={formData.photo}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-sm text-gray-900 dark:text-white"
                  placeholder="https://i.ibb.co/your-photo.jpg"
                />
              </div>
            </div>
            <p className="text-[10px] text-gray-400">Paste an image URL from ImageBB, Cloudinary, or any direct image link.</p>
          </div>

          {/* Accept Terms Checkbox */}
          <button
            type="button"
            onClick={() => setAcceptTerms(!acceptTerms)}
            className="flex items-center gap-2 text-left py-1 text-sm text-gray-600 dark:text-gray-400 focus:outline-none"
          >
            {acceptTerms ? (
              <CheckSquare className="text-primary-600" size={18} />
            ) : (
              <Square className="text-gray-400" size={18} />
            )}
            <span>I accept the Terms and Conditions of ReSell Hub</span>
          </button>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-bold rounded-xl shadow-lg transition"
          >
            {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
            Register
          </button>
        </form>

        {/* Separator */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="border-t border-gray-200 dark:border-gray-800 w-full"></div>
          <span className="absolute bg-white dark:bg-gray-900 px-3 text-xs text-gray-400">Or continue with</span>
        </div>

        {/* Custom Google signup triggers modal first */}
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
          Already have an account?{' '}
          <Link href="/login" className="text-primary-600 hover:underline font-semibold">
            Login here
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
                Select your role before signing up with Google.
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
