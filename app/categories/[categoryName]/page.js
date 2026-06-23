'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, RotateCcw, MapPin, Tag, Compass, Loader2 } from 'lucide-react';
import { API_URL } from '../../../components/Providers';
import { motion } from 'framer-motion';

function CategoryContent() {
  const { categoryName } = useParams();
  const router = useRouter();

  // Category Info states
  const [matchedCategory, setMatchedCategory] = useState(null);
  const [catStats, setCatStats] = useState({ total: 0, avgPrice: 0, minPrice: 0, maxPrice: 0 });

  // Search & Filter states
  const [search, setSearch] = useState('');
  const [condition, setCondition] = useState('');
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  // Data states
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 6, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [catLoading, setCatLoading] = useState(true);

  // Load category and compute stats
  useEffect(() => {
    async function loadCategoryInfo() {
      try {
        const res = await fetch(`${API_URL}/api/categories`);
        const data = await res.json();
        if (data.success) {
          const category = data.categories.find(
            (c) => c.name.toLowerCase().replace(/\s+/g, '-') === categoryName || c.name.toLowerCase() === categoryName
          );
          if (category) {
            setMatchedCategory(category);
            
            // Fetch stats (all products in this category)
            const statsRes = await fetch(`${API_URL}/api/products?category=${encodeURIComponent(category.name)}&limit=100`);
            const statsData = await statsRes.json();
            if (statsData.success && statsData.products.length > 0) {
              const prices = statsData.products.map(p => p.price);
              const sum = prices.reduce((a, b) => a + b, 0);
              setCatStats({
                total: statsData.products.length,
                avgPrice: Math.round(sum / statsData.products.length),
                minPrice: Math.min(...prices),
                maxPrice: Math.max(...prices)
              });
            } else {
              setCatStats({ total: 0, avgPrice: 0, minPrice: 0, maxPrice: 0 });
            }
          }
        }
      } catch (err) {
        console.error('Error fetching category info:', err);
      } finally {
        setCatLoading(false);
      }
    }
    loadCategoryInfo();
  }, [categoryName]);

  // Fetch category products
  useEffect(() => {
    if (!matchedCategory) return;

    async function fetchProducts() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        queryParams.append('category', matchedCategory.name);
        if (search) queryParams.append('search', search);
        if (condition) queryParams.append('condition', condition);
        if (location) queryParams.append('location', location);
        if (minPrice) queryParams.append('minPrice', minPrice);
        if (maxPrice) queryParams.append('maxPrice', maxPrice);
        if (sort) queryParams.append('sort', sort);
        queryParams.append('page', page);
        queryParams.append('limit', '6');

        const res = await fetch(`${API_URL}/api/products?${queryParams.toString()}`);
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
          setPagination(data.pagination);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [matchedCategory, search, condition, location, minPrice, maxPrice, sort, page]);

  const resetFilters = () => {
    setSearch('');
    setCondition('');
    setLocation('');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    setPage(1);
  };

  if (catLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-40">
        <Loader2 className="animate-spin text-primary-500 mb-2" size={40} />
        <p className="text-xs text-gray-500 font-semibold">Loading Category details...</p>
      </div>
    );
  }

  if (!matchedCategory) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <Tag size={48} className="mx-auto text-gray-400" />
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Category Not Found</h2>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          The category you are looking for does not exist or has been deleted by an administrator.
        </p>
        <Link href="/categories" className="inline-block px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-xl transition">
          Browse Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors duration-300 space-y-8">
      {/* Category Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-800 bg-gray-900 text-white min-h-[220px] flex items-center p-8 sm:p-12">
        <img
          src={matchedCategory.image || 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200'}
          alt={matchedCategory.name}
          className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-900/90 to-transparent"></div>
        
        <div className="relative z-10 space-y-3 max-w-2xl text-left">
          <span className="bg-primary-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
            Marketplace Category
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">{matchedCategory.name}</h1>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-medium">
            {matchedCategory.description || 'Browse listed products in this category.'}
          </p>
        </div>
      </div>

      {/* Category Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl shadow-sm text-center">
          <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">Total Listings</p>
          <p className="text-xl font-extrabold text-gray-950 dark:text-white mt-1">{catStats.total} Items</p>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl shadow-sm text-center">
          <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">Average Price</p>
          <p className="text-xl font-extrabold text-gray-950 dark:text-white mt-1">${catStats.avgPrice}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl shadow-sm text-center">
          <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">Lowest Price</p>
          <p className="text-xl font-extrabold text-gray-950 dark:text-white mt-1">${catStats.minPrice}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl shadow-sm text-center">
          <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">Highest Price</p>
          <p className="text-xl font-extrabold text-gray-950 dark:text-white mt-1">${catStats.maxPrice}</p>
        </div>
      </div>

      {/* Main Grid section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="space-y-6 lg:col-span-1 bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 h-fit">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 text-sm">
              <SlidersHorizontal size={16} className="text-primary-500" /> Filters
            </h3>
            <button
              onClick={resetFilters}
              className="text-xs text-gray-500 hover:text-primary-600 flex items-center gap-1 transition"
            >
              <RotateCcw size={12} /> Reset
            </button>
          </div>

          {/* Search bar */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={16} />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-9 pr-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
                placeholder="Search listings..."
              />
            </div>
          </div>

          {/* Condition Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Condition</label>
            <select
              value={condition}
              onChange={(e) => { setCondition(e.target.value); setPage(1); }}
              className="w-full px-3 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-xs text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="">All Conditions</option>
              <option value="Like New">Like New</option>
              <option value="Refurbished">Refurbished</option>
              <option value="Used">Used</option>
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Price Range ($)</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                className="w-1/2 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
                placeholder="Min"
              />
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                className="w-1/2 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
                placeholder="Max"
              />
            </div>
          </div>

          {/* Location Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 text-gray-400" size={14} />
              <input
                type="text"
                value={location}
                onChange={(e) => { setLocation(e.target.value); setPage(1); }}
                className="w-full pl-8 pr-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
                placeholder="e.g. Dhaka"
              />
            </div>
          </div>
        </div>

        {/* Products Grid & Controls */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Sort Controls */}
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3 flex-wrap gap-3">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
              Showing {products.length} of {pagination.total} products
            </span>
            <div className="flex items-center gap-2">
              <ArrowUpDown size={14} className="text-gray-400" />
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-xs text-gray-700 dark:text-gray-300 outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Grid View */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="border border-gray-200 dark:border-gray-800 rounded-2xl p-4 space-y-4">
                  <div className="skeleton-shimmer h-40 rounded-xl"></div>
                  <div className="skeleton-shimmer h-5 rounded w-3/4"></div>
                  <div className="skeleton-shimmer h-4 rounded w-1/2"></div>
                  <div className="skeleton-shimmer h-8 rounded"></div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={product._id}
                  className="bg-white border border-gray-200/80 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-[450px] overflow-hidden group text-left relative"
                >
                  {/* Image & Badge Cover */}
                  <div className="relative h-52 overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                      <span className="bg-primary-600/90 text-white text-[9px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider shadow">
                        {product.condition}
                      </span>
                      <span className="bg-indigo-600/90 text-white text-[9px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider shadow">
                        {product.category}
                      </span>
                    </div>
                    {product.sellerInfo?.verified && (
                      <div className="absolute top-3 right-3 bg-success-500 text-white rounded-full p-1 border-2 border-white shadow-lg" title="Verified Seller">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-extrabold text-sm sm:text-base text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
                          {product.title}
                        </h3>
                        <span className="text-primary-600 font-extrabold text-base sm:text-lg flex-shrink-0">
                          ${product.price}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    <div className="border-t border-gray-100 pt-3 space-y-3">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div>
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Seller</span>
                          <p className="font-bold text-gray-700 truncate max-w-[120px]">{product.sellerInfo?.name || 'Seller'}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Location</span>
                          <p className="text-[10px] font-bold flex items-center justify-end gap-0.5 text-gray-600">
                            <MapPin size={10} className="text-primary-500" /> {product.location}
                          </p>
                        </div>
                      </div>

                      {/* Interactive Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1.5">
                        <Link href={`/products/${product._id}`} className="block">
                          <span className="w-full h-full inline-flex items-center justify-center py-2 border border-gray-200 hover:border-primary-500 hover:text-primary-600 font-bold text-[10px] rounded-xl text-gray-700 shadow-sm transition hover:scale-105 active:scale-95 cursor-pointer">
                            View Details
                          </span>
                        </Link>
                        <Link href={`/checkout?productId=${product._id}`} className="block">
                          <span className="w-full h-full inline-flex items-center justify-center py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-[10px] rounded-xl shadow-md transition hover:scale-105 active:scale-95 cursor-pointer">
                            Buy Now
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center space-y-3 bg-gray-50 dark:bg-gray-900/10 border border-dashed border-gray-200 dark:border-gray-800 rounded-3xl">
              <SlidersHorizontal className="mx-auto text-gray-400" size={32} />
              <h3 className="font-bold text-gray-900 dark:text-white text-base">No Products Found</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                We couldn't find any products in this category matching your filters.
              </p>
              <button
                onClick={resetFilters}
                className="mt-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-xl shadow transition"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 disabled:opacity-50 transition"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 text-xs font-bold rounded-lg transition ${
                    page === p
                      ? 'bg-primary-600 text-white shadow'
                      : 'border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
                className="p-2 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 disabled:opacity-50 transition"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DynamicCategory() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Loader2 className="animate-spin text-primary-500 mx-auto mb-2" size={32} />
        <p className="text-sm text-gray-500">Loading category page...</p>
      </div>
    }>
      <CategoryContent />
    </Suspense>
  );
}
