'use client';

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext, API_URL } from '../../../components/Providers';
import { Heart, Trash2, Eye, Loader2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function Wishlist() {
  const { token } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);

  useEffect(() => {
    if (token) {
      loadWishlist();
    }
  }, [token]);

  const loadWishlist = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users/wishlist`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setItems(data.wishlist);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    setRemoving(productId);
    try {
      const res = await fetch(`${API_URL}/api/users/wishlist/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Removed from wishlist');
        setItems(items.filter(item => item.productId?._id !== productId));
      } else {
        toast.error(data.message || 'Failed to remove');
      }
    } catch (err) {
      toast.error('Network error removing item');
    } finally {
      setRemoving(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/4 skeleton-shimmer"></div>
        <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl skeleton-shimmer"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in transition-colors duration-300">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-950 dark:text-white">My Wishlist</h2>
        <p className="text-xs text-gray-500">Your curated collection of second-hand products</p>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const product = item.productId;
            if (!product) return null; // Safe check for deleted products

            return (
              <div
                key={item._id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full"
              >
                <div className="card-image-wrapper">
                  <img src={product.images[0]} alt={product.title} />
                  <span className="absolute top-3 left-3 bg-primary-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full capitalize">
                    {product.condition}
                  </span>
                </div>

                <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between items-start gap-1">
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-1">
                        {product.title}
                      </h3>
                      <span className="text-primary-600 dark:text-primary-400 font-extrabold text-base flex-shrink-0">
                        ${product.price}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex items-center justify-between text-xs">
                    <span className="text-gray-500">{product.location}</span>
                    <div className="flex gap-2">
                      <Link
                        href={`/products/${product._id}`}
                        className="p-2 bg-gray-100 hover:bg-primary-600 hover:text-white dark:bg-gray-800 dark:hover:bg-primary-500 text-gray-800 dark:text-gray-200 rounded-lg transition"
                        title="View details"
                      >
                        <Eye size={14} />
                      </Link>
                      <button
                        onClick={() => handleRemove(product._id)}
                        disabled={removing === product._id}
                        className="p-2 border border-danger-200 text-danger-500 hover:bg-danger-500 hover:text-white disabled:opacity-50 rounded-lg transition"
                        title="Remove"
                      >
                        {removing === product._id ? (
                          <Loader2 className="animate-spin" size={14} />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center space-y-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl">
          <Heart className="mx-auto text-gray-300" size={32} />
          <h3 className="font-bold text-gray-900 dark:text-white text-base">Your Wishlist is Empty</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
            Explore listings in the catalog and click the heart icon on products you like to save them!
          </p>
          <Link
            href="/products"
            className="inline-block px-4 py-2 bg-primary-600 text-white text-xs font-semibold rounded-xl shadow transition"
          >
            Find Products
          </Link>
        </div>
      )}
    </div>
  );
}
