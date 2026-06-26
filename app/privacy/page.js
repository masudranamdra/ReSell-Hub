'use client';

import React from 'react';
import { Shield, Eye, Lock, RefreshCw, FileText } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 transition-colors duration-300">
      <div className="text-left space-y-4 mb-12">
        <span className="bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Legal center
        </span>
        <h1 className="text-4xl font-extrabold text-gray-950 dark:text-white flex items-center gap-2">
          <Shield className="text-primary-500" size={32} /> Privacy Policy
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          Last updated: June 27, 2026. Learn how we handle your private credentials securely.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-10 space-y-8 text-left shadow-sm">
        
        {/* Intro */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Eye size={20} className="text-primary-500" /> 1. Information We Collect
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
            To provide a secure second-hand marketplace, ReSell Hub collects details including your name, email address, contact phone number, shipping address, and profile photo when you set up your account. If you register via third-party services like Google Auth, we retrieve session token info with your consent.
          </p>
        </div>

        <hr className="border-gray-150 dark:border-gray-800" />

        {/* Security */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Lock size={20} className="text-primary-500" /> 2. Payments & Transaction Security
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
            Payment transactions processed on our site are secured via Stripe SSL encryption. We do not store raw credit card numbers or CVC records directly inside our server databases. Transaction IDs, product price calculations, and logging records are monitored strictly to prevent any client-side tampering.
          </p>
        </div>

        <hr className="border-gray-150 dark:border-gray-800" />

        {/* Data Sharing */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <RefreshCw size={20} className="text-primary-500" /> 3. Data Protection Rights
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
            You hold rights to request access, correction, or deletion of your profile account metadata. Sellers' transaction histories and listings remain stored securely for auditing and compliance records but can be managed inside the individual workspace.
          </p>
        </div>

        <hr className="border-gray-150 dark:border-gray-800" />

        {/* Cookies */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText size={20} className="text-primary-500" /> 4. Cookies & Persistent Tokens
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
            We store persistent tokens inside your browser's Local Storage to remember login states and maintain your active theme parameters (Light/Dark mode) across sessions. You can configure cookies settings via browser setups anytime.
          </p>
        </div>

        {/* Back button */}
        <div className="pt-6">
          <Link
            href="/products"
            className="inline-block px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl shadow transition"
          >
            Back to Marketplace
          </Link>
        </div>

      </div>
    </div>
  );
}
