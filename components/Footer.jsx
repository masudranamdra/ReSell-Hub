import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 dark:bg-gray-950 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <span className="text-2xl font-extrabold bg-gradient-to-r from-primary-600 to-indigo-500 bg-clip-text text-transparent tracking-wide">
              ReSell<span className="text-primary-500">Hub</span>
            </span>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              The premier marketplace to buy, sell, and list pre-loved products. Promote sustainability by reducing waste, helping our ecology, and earning money from unused items.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-500 transition" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition" aria-label="Github">
                <Github size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Explore
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition">
                  Home Page
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/#categories" className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Guidelines / Info Column */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Support & Legals
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition">
                  Frequently Asked Questions
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition">
                  Report a Problem
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400">
                <MapPin size={16} className="text-primary-500 mt-0.5 flex-shrink-0" />
                <span>Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Phone size={16} className="text-primary-500 flex-shrink-0" />
                <span>+880 1712 345678</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Mail size={16} className="text-primary-500 flex-shrink-0" />
                <span>info@resellhub.com</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-200 dark:border-gray-800 my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            &copy; {new Date().getFullYear()} ReSell Hub. All rights reserved. Made for sustainable trading.
          </p>
          <div className="flex space-x-6 text-xs text-gray-400 dark:text-gray-500">
            <span>Designed for Recruiter Review</span>
            <span>Secure SSL Encrypted</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
