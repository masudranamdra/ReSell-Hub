'use client';

import React from 'react';
import { Leaf, ShieldCheck, Heart, Award } from 'lucide-react';
import Link from 'next/link';

export default function AboutUs() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 transition-colors duration-300">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-success-50 text-success-700 dark:bg-success-950/30 dark:text-success-400">
          Our Sustainable Purpose
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-950 dark:text-white sm:text-5xl">
          Empowering Pre-Owned Trading
        </h1>
        <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed">
          ReSell Hub was founded with a clear objective: to build a secure, user-friendly second-hand marketplace that encourages reuse, cuts carbon footprints, and allows community members to earn and save money.
        </p>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl space-y-4">
          <div className="p-3 bg-success-50 text-success-600 dark:bg-success-950/20 rounded-xl w-fit">
            <Leaf size={24} />
          </div>
          <h3 className="font-bold text-gray-950 dark:text-white text-lg">Eco Sustainability</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            Trading second-hand keeps fully functional electronics, furniture, clothing, and vehicles out of landfills, promoting a circular carbon-reduction economy.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl space-y-4">
          <div className="p-3 bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-400 rounded-xl w-fit">
            <ShieldCheck size={24} />
          </div>
          <h3 className="font-bold text-gray-950 dark:text-white text-lg">Secure Transactions</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            All checkouts utilize the Stripe credit card processing gateway, protecting financial information and securely updating inventory.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl space-y-4">
          <div className="p-3 bg-danger-50 text-danger-500 dark:bg-danger-950/20 rounded-xl w-fit">
            <Heart size={24} fill="currentColor" />
          </div>
          <h3 className="font-bold text-gray-950 dark:text-white text-lg">Community Focus</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            We sync ratings, reviews, verification badges, and product comparison tools so buyers can interact with verified sellers transparently.
          </p>
        </div>
      </div>

      {/* Sustainable Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-indigo-600 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold">Ready to start trading?</h2>
          <p className="text-sm text-primary-100 max-w-xl">
            Join thousands of active buyers and sellers listed on the platform. Build your catalog and publish listings today!
          </p>
        </div>
        <Link
          href="/products"
          className="px-6 py-3 bg-white text-primary-600 hover:bg-gray-100 text-xs sm:text-sm font-bold rounded-xl shadow-lg transition duration-200 whitespace-nowrap"
        >
          Explore Catalog
        </Link>
      </div>
    </div>
  );
}
