'use client';

import React, { useState, useContext, useEffect } from 'react';
import Link from 'next/link';
import { AuthContext, ThemeContext } from '../../components/Providers';
import { Mail, Lock, User, Phone, MapPin, Upload, Loader2, CheckSquare, Square } from 'lucide-react';
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
    photo: ''
  });

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

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
                toast.error(res.error || 'Google sign-up failed');
              }
            } catch (err) {
              console.error(err);
              toast.error('Google sign-up failed');
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
            text: 'signup_with',
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

  // ImageBB upload flow helper
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const toastId = toast.loading('Uploading profile image to ImageBB...');

    try {
      const uploadData = new FormData();
      uploadData.append('image', file);

      // Using a fallback ImageBB API key for seamless demonstration, or custom config if set
      const apiKey = '8ca6992d99d1944747ebc79f323a7bbd';
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: uploadData
      });
      const data = await res.json();

      if (data.success) {
        setFormData(prev => ({ ...prev, photo: data.data.url }));
        toast.success('Image uploaded successfully!', { id: toastId });
      } else {
        toast.error('Upload failed. Using default photo instead.', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to connect to ImageBB.', { id: toastId });
    } finally {
      setUploading(false);
    }
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
      formData.location
    );
    setLoading(false);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-md w-full space-y-8 glass p-8 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800">
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
          <div className="space-y-1">
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
          <div className="space-y-1">
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
            <div className="space-y-1">
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
            <div className="space-y-1">
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
          <div className="space-y-1">
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
          <div className="space-y-1">
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

          {/* Image Upload Input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Profile Image</label>
            <div className="flex items-center gap-4">
              {formData.photo ? (
                <img
                  src={formData.photo}
                  alt="Profile Preview"
                  className="w-12 h-12 rounded-full object-cover border border-primary-500"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700">
                  <User className="text-gray-400" size={20} />
                </div>
              )}
              <label className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-xs font-semibold rounded-lg cursor-pointer transition">
                {uploading ? (
                  <>
                    <Loader2 className="animate-spin text-primary-500" size={14} /> Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={14} /> Upload Image
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
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
            disabled={loading || uploading}
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

        {/* Google Registration Button */}
        <div className="flex justify-center w-full min-h-[44px]">
          <div id="google-signin-btn" className="w-full flex justify-center"></div>
        </div>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          Already have an account?{' '}
          <Link href="/login" className="text-primary-600 hover:underline font-semibold">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
