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
    <div className="space-y-6 animate-fade-in transition-colors duration-300">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-950 dark:text-white">Profile Settings</h2>
        <p className="text-xs text-gray-500">Manage your profile card and contact details</p>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 sm:p-8 rounded-3xl shadow-sm max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Photo URL */}
          <div className="flex flex-col sm:flex-row items-start gap-6 pb-6 border-b border-gray-100 dark:border-gray-800">
            <img
              src={formData.photo || 'https://i.pravatar.cc/300?img=9'}
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover border-4 border-primary-500 shadow-sm flex-shrink-0"
              onError={(e) => { e.target.src = 'https://i.pravatar.cc/300?img=9'; }}
            />
            <div className="flex-grow space-y-2">
              <h4 className="font-bold text-gray-900 dark:text-white text-sm">Profile Photo URL</h4>
              <p className="text-xs text-gray-400">Paste an ImageBB, Cloudinary, or any direct image link.</p>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-3 text-gray-400" size={15} />
                <input
                  type="url"
                  name="photo"
                  value={formData.photo}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-1 focus:ring-primary-500 outline-none text-xs text-gray-900 dark:text-white"
                  placeholder="https://i.ibb.co/your-photo.jpg"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={16} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-9 pr-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Email (Disabled) */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-400">Email Address (Cannot change)</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-850 border border-gray-200 dark:border-gray-800 text-gray-400 dark:text-gray-500 rounded-xl text-xs cursor-not-allowed"
              />
            </div>

            {/* Contact Phone */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-gray-400" size={16} />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
                  placeholder="+88017..."
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400" size={16} />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
                  placeholder="Dhaka, Bangladesh"
                />
              </div>
            </div>

            {/* Change Password */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Change Password (Leave empty to keep current)</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={16} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
                  placeholder="Enter new password"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center gap-1.5"
          >
            {loading ? <Loader2 className="animate-spin" size={14} /> : null}
            Save Settings
          </button>
        </form>
      </div>
    </div>
  );
}
