'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trash2, ShieldCheck, Star } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CompareProducts() {
  const [list, setList] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('compare_list') || '[]');
    setList(saved);
  }, []);

  const removeCompare = (id) => {
    const updated = list.filter((item) => item._id !== id);
    localStorage.setItem('compare_list', JSON.stringify(updated));
    setList(updated);
    toast.success('Removed product from comparison');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors duration-300">
      <div className="mb-6">
        <Link href="/products" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-primary-600 transition">
          <ArrowLeft size={14} /> Back to Products
        </Link>
      </div>

      <div className="text-left space-y-2 mb-8">
        <h1 className="text-3xl font-extrabold text-gray-950 dark:text-white">Product Comparison</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Compare second-hand item metrics side-by-side to make the right buying decision</p>
      </div>

      {list.length > 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-800">
            {/* Table Header Column */}
            <div className="p-6 bg-gray-50 dark:bg-gray-950 font-bold text-gray-700 dark:text-gray-300 space-y-12 hidden md:block">
              <div className="h-40">Features</div>
              <div className="py-2 text-sm">Price</div>
              <div className="py-2 text-sm">Condition</div>
              <div className="py-2 text-sm">Category</div>
              <div className="py-2 text-sm">Seller Rating</div>
              <div className="py-2 text-sm">Action</div>
            </div>

            {/* Product Columns */}
            {list.map((item) => (
              <div key={item._id} className="p-6 space-y-6 md:space-y-12 text-center flex flex-col justify-between">
                {/* Details Top Card */}
                <div className="space-y-4 h-fit md:h-40">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-24 h-24 object-cover mx-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
                  />
                  <h3 className="font-extrabold text-sm text-gray-950 dark:text-white hover:text-primary-600 line-clamp-2">
                    <Link href={`/products/${item._id}`}>{item.title}</Link>
                  </h3>
                </div>

                {/* Price Row */}
                <div className="space-y-1 md:space-y-0">
                  <span className="text-xs text-gray-400 md:hidden block font-semibold">Price:</span>
                  <span className="text-xl font-black text-primary-600 dark:text-primary-400">
                    ${item.price}
                  </span>
                </div>

                {/* Condition Row */}
                <div className="space-y-1 md:space-y-0">
                  <span className="text-xs text-gray-400 md:hidden block font-semibold">Condition:</span>
                  <span className="inline-block px-2.5 py-0.5 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 text-xs font-semibold rounded-full capitalize">
                    {item.condition}
                  </span>
                </div>

                {/* Category Row */}
                <div className="space-y-1 md:space-y-0">
                  <span className="text-xs text-gray-400 md:hidden block font-semibold">Category:</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {item.category}
                  </span>
                </div>

                {/* Seller Rating Row */}
                <div className="space-y-1 md:space-y-0">
                  <span className="text-xs text-gray-400 md:hidden block font-semibold">Seller Rating:</span>
                  <div className="flex items-center justify-center gap-1 text-sm text-amber-500">
                    <Star size={14} fill="currentColor" />
                    <span>{item.sellerRating}</span>
                  </div>
                </div>

                {/* Actions Row */}
                <div className="pt-2 md:pt-0 flex gap-2 justify-center">
                  <Link
                    href={`/products/${item._id}`}
                    className="flex-grow md:flex-grow-0 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-xl shadow transition text-center"
                  >
                    View details
                  </Link>
                  <button
                    onClick={() => removeCompare(item._id)}
                    className="p-2 border border-danger-200 text-danger-500 hover:bg-danger-500 hover:text-white rounded-xl transition"
                    title="Remove from comparison"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            {/* Empty slots placeholders up to 3 */}
            {Array.from({ length: Math.max(0, 3 - list.length) }).map((_, idx) => (
              <div
                key={idx}
                className="p-12 text-center border-t md:border-t-0 md:border-l border-dashed border-gray-200 dark:border-gray-800 text-gray-400 dark:text-gray-600 flex flex-col items-center justify-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center text-2xl font-bold">
                  +
                </div>
                <div>
                  <p className="text-xs font-bold">Empty Slot</p>
                  <p className="text-[10px] mt-0.5">Add an item to compare side-by-side</p>
                </div>
                <Link
                  href="/products"
                  className="px-3 py-1.5 border border-gray-300 dark:border-gray-700 hover:border-primary-500 text-gray-600 dark:text-gray-400 hover:text-primary-600 text-[10px] font-bold rounded-lg transition"
                >
                  Find products
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="py-24 text-center space-y-4 bg-gray-50 dark:bg-gray-900/10 border border-dashed border-gray-200 dark:border-gray-800 rounded-3xl max-w-xl mx-auto">
          <Trash2 size={36} className="mx-auto text-gray-400" />
          <h3 className="font-bold text-gray-900 dark:text-white text-lg">No Items to Compare</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
            You haven't added any products to compare yet. Browse our products listings and select "Compare Product" to get started.
          </p>
          <Link
            href="/products"
            className="inline-block px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-xl shadow transition"
          >
            Find Products
          </Link>
        </div>
      )}
    </div>
  );
}
