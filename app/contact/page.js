'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_URL } from '../../components/Providers';

export default function ContactUs() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      return toast.error('Please fill all contact fields');
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(form.email.trim())) {
      return toast.error('Please enter a valid email address');
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          subject: form.subject.trim(),
          message: form.message.trim()
        })
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message || 'Your message has been sent successfully!');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        toast.error(data.message || 'Failed to dispatch email. Please try again.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error. Failed to send message.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 transition-colors duration-300">
      <div className="text-center space-y-3 mb-12">
        <h1 className="text-4xl font-extrabold text-gray-950 dark:text-white tracking-tight">Contact Us</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          Have queries, feedback, or need moderation dispute support? Get in touch with our help center.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-start">
        {/* Left Info Panel */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl space-y-6 shadow-sm">
            <h3 className="font-bold text-gray-950 dark:text-white text-base">Support Channels</h3>
            
            <div className="space-y-4">
              <div className="flex gap-3 items-center">
                <div className="p-2.5 bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 rounded-xl">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase">Email Support</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">support@resellhub.com</p>
                </div>
              </div>

              <div className="flex gap-3 items-center">
                <div className="p-2.5 bg-success-50 dark:bg-success-950/20 text-success-600 dark:bg-success-400 rounded-xl">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase">Call Helpline</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">+880 1712 345678</p>
                </div>
              </div>

              <div className="flex gap-3 items-center">
                <div className="p-2.5 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-xl">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase">Head Office</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Dhaka, Bangladesh</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Contact Form */}
        <form onSubmit={handleSubmit} className="md:col-span-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 sm:p-8 rounded-3xl space-y-4 shadow-sm">
          <h3 className="font-bold text-gray-955 dark:text-white text-base mb-2">Send a Message</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Your Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full px-3 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
                placeholder="Full Name"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full px-3 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
                placeholder="yourmail@domain.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Subject</label>
            <input
              type="text"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              required
              className="w-full px-3 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
              placeholder="Query subject..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Message</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
              rows={4}
              className="w-full px-3 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
              placeholder="Describe your question or moderation report..."
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
          >
            {submitting ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
