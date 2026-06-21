'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { API_URL } from '../../../../components/Providers';
import { ShieldCheck, Star, Calendar, MapPin, ArrowLeft, Layers } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function SellerPublicProfile() {
  const { id } = useParams();
  const router = useRouter();

  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSellerInfo() {
      try {
        // 1. Fetch public profile
        const profileRes = await fetch(`${API_URL}/api/users/seller/${id}`);
        const profileData = await profileRes.json();
        if (profileData.success) {
          setSeller(profileData.seller);
        } else {
          toast.error('Seller profile not found');
          router.push('/products');
          return;
        }

        // 2. Fetch products by this seller
        const productsRes = await fetch(`${API_URL}/api/products?sellerId=${id}`);
        const productsData = await productsRes.json();
        if (productsData.success) {
          setProducts(productsData.products);
        }
      } catch (err) {
        console.error(err);
        toast.error('Connection error loading seller profile');
      } finally {
        setLoading(false);
      }
    }
    loadSellerInfo();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 space-y-6 animate-pulse">
        <div className="bg-gray-200 dark:bg-gray-800 h-40 rounded-3xl skeleton-shimmer"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="border border-gray-200 dark:border-gray-800 rounded-2xl p-4 h-64 skeleton-shimmer"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!seller) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors duration-300">
      <div className="mb-6">
        <button onClick={() => router.back()} className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary-600 transition">
          <ArrowLeft size={14} /> Back
        </button>
      </div>

      {/* Seller Header Banner */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 sm:p-8 rounded-3xl shadow-sm mb-10 flex flex-col sm:flex-row items-center gap-6">
        <div className="relative">
          <img
            src={seller.photo || 'https://i.pravatar.cc/300?img=9'}
            alt={seller.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-primary-500 shadow-sm"
          />
          {seller.verified && (
            <span className="absolute bottom-0 right-0 bg-success-500 text-white rounded-full p-1.5 border-2 border-white dark:border-gray-900" title="Verified Trusted Seller">
              <ShieldCheck size={16} fill="currentColor" className="text-white dark:text-gray-950" />
            </span>
          )}
        </div>

        <div className="text-center sm:text-left space-y-2 flex-grow">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-extrabold text-gray-950 dark:text-white leading-none">
              {seller.name}
            </h1>
            {seller.verified && (
              <span className="bg-success-50 text-success-600 dark:bg-success-950/20 text-[10px] px-2 py-0.5 rounded-full font-bold">
                Verified Seller
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <MapPin size={14} className="text-primary-500" /> {seller.location || 'Dhaka, Bangladesh'}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={14} className="text-primary-500" /> Joined {new Date(seller.createdAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Layers size={14} className="text-primary-500" /> {products.length} Active Listings
            </span>
          </div>

          <div className="flex justify-center sm:justify-start items-center gap-1 text-sm text-amber-500 pt-1">
            <Star size={14} fill="currentColor" />
            <Star size={14} fill="currentColor" />
            <Star size={14} fill="currentColor" />
            <Star size={14} fill="currentColor" />
            <Star size={14} fill="currentColor" />
            <span className="text-xs text-gray-500 ml-1">(5.0/5 Star Reputation)</span>
          </div>
        </div>
      </div>

      {/* Seller Listings */}
      <div className="space-y-6">
        <h2 className="text-xl font-extrabold text-gray-950 dark:text-white">Active Product Listings</h2>
        
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col h-full animate-fade-in"
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
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex items-center justify-between text-xs text-gray-500">
                    <span>{product.location}</span>
                    <Link
                      href={`/products/${product._id}`}
                      className="px-3.5 py-1.5 bg-gray-100 hover:bg-primary-600 hover:text-white dark:bg-gray-800 dark:hover:bg-primary-500 text-gray-800 dark:text-gray-200 font-semibold rounded-lg transition"
                    >
                      View details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-xs text-gray-500 dark:text-gray-400 border border-dashed border-gray-200 dark:border-gray-800 rounded-3xl">
            This seller doesn't have any active listings currently. Check back soon!
          </div>
        )}
      </div>
    </div>
  );
}
