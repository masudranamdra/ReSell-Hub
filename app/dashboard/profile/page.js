'use client';

import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../../components/Providers';
import { User, Phone, MapPin, Lock, Image as ImageIcon, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfileSettings() {
  const { user, token, updateProfile } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: '',
    photo: '',
    phone: '',
    location: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        photo: user.photo || '',
        phone: user.phone || '',
        location: user.location || '',
        password: ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error('Name cannot be empty');
    if (formData.password && formData.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    setLoading(true);
    const result = await updateProfile({
      name: formData.name,
      photo: formData.photo,
      phone: formData.phone,
      location: formData.location,
      password: formData.password || undefined
    });
    setLoading(false);
    
    if (result.success) {
      setFormData(prev => ({ ...prev, password: '' })); // Clear password field
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Account Settings</h2>
        <p className="text-xs text-slate-500 dark:text-gray-400">Configure your public seller identity, contact channels, and credential details.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Left Column - Visual Profile Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 p-8 rounded-3xl shadow-sm text-center relative overflow-hidden group">
            {/* Visual backdrop accent */}
            <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-tr from-primary-600 to-indigo-650 opacity-90" />
            
            <div className="relative pt-12 space-y-4">
              <div className="relative inline-block">
                <img
                  src={formData.photo || 'https://i.pravatar.cc/300?img=9'}
                  alt="User avatar preview"
                  className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white dark:border-gray-900 shadow-md relative z-10"
                  onError={(e) => { e.target.src = 'https://i.pravatar.cc/300?img=9'; }}
                />
                {user.verified && (
                  <span className="absolute bottom-1 right-1 bg-success-500 text-white rounded-full p-1.5 border-2 border-white dark:border-gray-900 shadow z-20" title="Verified Seller Badge">
                    <UserCheck size={12} />
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">{formData.name || 'User Name'}</h3>
                <p className="text-xs text-slate-400 mt-1">{user.email}</p>
              </div>

              <div className="flex justify-center gap-2 pt-1">
                <span className="px-3 py-1 bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 text-[10px] font-black uppercase tracking-wider rounded-full border border-primary-100 dark:border-primary-900/30">
                  {user.role} Hub
                </span>
                <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full border ${
                  user.status === 'active' 
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30' 
                    : 'bg-red-50 text-red-650 dark:bg-red-950/20 border-red-100 dark:border-red-900/30'
                }`}>
                  Status: {user.status}
                </span>
              </div>
            </div>

            {/* Profile statistics */}
            <div className="grid grid-cols-2 gap-4 pt-6 mt-6 border-t border-slate-100 dark:border-gray-800 text-left text-xs text-slate-500 dark:text-gray-400">
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase block">Store Location</span>
                <span className="font-bold text-gray-800 dark:text-white flex items-center gap-0.5 mt-1">
                  <MapPin size={12} className="text-primary-500" /> {formData.location || 'Not Specified'}
                </span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase block">Account Created</span>
                <span className="font-bold text-gray-800 dark:text-white mt-1 block">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'Recently'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Profile Form */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 p-6 sm:p-8 rounded-3xl shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="font-extrabold text-gray-950 dark:text-white text-base border-b border-slate-100 dark:border-gray-800 pb-3">
              Profile Parameters
            </h3>

            {/* Avatar URL Input */}
            <div className="space-y-2 text-left">
              <label className="text-xs font-bold text-slate-500 dark:text-gray-400">Profile Photo Image URL</label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-3 text-slate-400" size={16} />
                <input
                  type="url"
                  name="photo"
                  value={formData.photo}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-950 border border-slate-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 transition"
                  placeholder="https://i.ibb.co/your-photo.jpg"
                />
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Use a direct image link (e.g. ImageBB, Cloudinary, Imgur, etc.)</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="space-y-2 text-left">
                <label className="text-xs font-bold text-slate-500 dark:text-gray-400">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-slate-400" size={16} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-950 border border-slate-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 transition"
                    placeholder="Enter full name"
                  />
                </div>
              </div>

              {/* Email (Disabled) */}
              <div className="space-y-2 text-left">
                <label className="text-xs font-bold text-slate-400">Email Address (Locked)</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-950 border border-slate-200 dark:border-gray-850 text-slate-400 dark:text-gray-500 rounded-xl text-xs cursor-not-allowed font-medium"
                />
              </div>

              {/* Contact Phone */}
              <div className="space-y-2 text-left">
                <label className="text-xs font-bold text-slate-500 dark:text-gray-400">Phone Connection</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-slate-400" size={16} />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-950 border border-slate-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 transition"
                    placeholder="+88017XXXXXXXX"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2 text-left">
                <label className="text-xs font-bold text-slate-500 dark:text-gray-400">Trading Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-slate-400" size={16} />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-950 border border-slate-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 transition"
                    placeholder="Dhaka, Bangladesh"
                  />
                </div>
              </div>

              {/* Change Password */}
              <div className="space-y-2 text-left sm:col-span-2">
                <label className="text-xs font-bold text-slate-500 dark:text-gray-400">Update Password (Leave blank to preserve current)</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-slate-400" size={16} />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-950 border border-slate-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 transition"
                    placeholder="Enter new account password"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-extrabold rounded-xl text-xs shadow-md hover:scale-102 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {loading ? <Loader2 className="animate-spin" size={14} /> : null}
              Save Identity Settings
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
