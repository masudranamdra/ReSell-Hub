'use client';

import React from 'react';
import Link from 'next/link';
import { Home, ShieldAlert } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-4 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="space-y-6 max-w-md">
        {/* Flag Icon Illustration */}
        <div className="relative inline-flex items-center justify-center p-6 bg-primary-100 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 rounded-full shadow-inner animate-pulse">
          <ShieldAlert size={48} />
        </div>

        <div className="space-y-2">
          <h1 className="text-6xl font-black text-primary-600 dark:text-primary-400">404</h1>
          <h2 className="text-2xl font-extrabold text-gray-950 dark:text-white">Page Not Found</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Sorry, the page you are looking for does not exist, has been removed, or is temporarily unavailable.
          </p>
        </div>

        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg transition duration-200 text-xs sm:text-sm"
          >
            <Home size={16} /> Back To Home
          </Link>
        </div>
      </div>
    </div>
  );
}
