'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LayoutGrid, Loader2, ArrowRight } from 'lucide-react';
import { API_URL } from '../../components/Providers';

export default function CategoriesExplorer() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(`${API_URL}/api/categories`);
        const data = await res.json();
        if (data.success) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-colors duration-300">
      <div className="text-left space-y-2 mb-10">
        <h1 className="text-3xl font-extrabold text-gray-950 dark:text-white flex items-center gap-2.5">
          <LayoutGrid className="text-primary-500" size={28} /> Browse Categories
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Discover second-hand bargains categorized for simple navigation
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-primary-500" size={32} />
        </div>
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/categories/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden hover:shadow-xl hover:border-primary-500/50 transition-all duration-300 flex flex-col h-full"
            >
              {/* Category Image Cover */}
              <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                  src={category.image || 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=300'}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <span className="bg-primary-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                    {category.productCount || 0} Listings Available
                  </span>
                </div>
              </div>

              {/* Category Info */}
              <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-extrabold text-gray-950 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
                    {category.description || 'Browse listed products in this category.'}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs font-bold text-primary-600 dark:text-primary-400">
                  <span>Explore Items</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-gray-200 dark:border-gray-800 rounded-3xl text-gray-500 text-sm">
          No categories found. Check back later!
        </div>
      )}
    </div>
  );
}
