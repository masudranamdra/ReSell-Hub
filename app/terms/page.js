'use client';

import React from 'react';
import { Scale, Heart, ShoppingBag, ShieldAlert, BadgeInfo } from 'lucide-react';
import Link from 'next/link';

export default function TermsAndConditions() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 transition-colors duration-300">
      <div className="text-left space-y-4 mb-12">
        <span className="bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Legal center
        </span>
        <h1 className="text-4xl font-extrabold text-gray-950 dark:text-white flex items-center gap-2">
          <Scale className="text-primary-500" size={32} /> Terms & Conditions
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          Last updated: June 27, 2026. Please read our marketplace guidelines carefully.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-10 space-y-8 text-left shadow-sm">
        
        {/* Workspace Rules */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Heart size={20} className="text-primary-500" /> 1. Workspace Code of Conduct
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
            ReSell Hub connects buyers and sellers to encourage circular commerce. All users are expected to trade honestly. Listing fake items, spamming reviews, or using incorrect details will result in account suspension or blockages by administrators.
          </p>
        </div>

        <hr className="border-gray-150 dark:border-gray-800" />

        {/* Listing Guidelines */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ShoppingBag size={20} className="text-primary-500" /> 2. Seller Listing Policy
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
            Sellers must represent their pre-loved product condition (Excellent, Good, Fair) accurately. Products submitted undergo an admin approval process before becoming visible in the public marketplace listings to maintain trust.
          </p>
        </div>

        <hr className="border-gray-150 dark:border-gray-800" />

        {/* Disputes */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ShieldAlert size={20} className="text-primary-500" /> 3. Transaction Disclaimers
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
            We provide payment integration facilities and logging services for order transparency. ReSell Hub does not take liability for physical shipping delays or quality disputes. Sellers are solely responsible for package fulfillment.
          </p>
        </div>

        <hr className="border-gray-150 dark:border-gray-800" />

        {/* Terms updates */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BadgeInfo size={20} className="text-primary-500" /> 4. Updates to Terms
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
            We reserve the right to modify these rules to adapt to platform scale. Your continued usage of the marketplace dashboard and search listings represents consent to our regulations.
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
