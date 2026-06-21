'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, RotateCcw, MapPin } from 'lucide-react';
import { API_URL } from '../../components/Providers';

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Search & Filter States
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [condition, setCondition] = useState('');
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  // Data States
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 6, pages: 1 });
  const [loading, setLoading] = useState(true);

  // Load categories
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch(`${API_URL}/api/categories`);
        const data = await res.json();
        if (data.success) setCategories(data.categories);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    }
    loadCategories();
  }, []);

  // Fetch products whenever filters or pagination change
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (search) queryParams.append('search', search);
        if (category) queryParams.append('category', category);
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
  }, [search, category, condition, location, minPrice, maxPrice, sort, page]);

  const resetFilters = () => {
    setSearch('');
    setCategory('');
    setCondition('');
    setLocation('');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    setPage(1);
    router.push('/products');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors duration-300">
      <div className="text-left space-y-2 mb-8">
        <h1 className="text-3xl font-extrabold text-gray-950 dark:text-white">Explore Marketplace</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Search and filter through hundreds of verified second-hand items</p>
      </div>

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
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Search Name</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={16} />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-9 pr-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
                placeholder="Search products..."
              />
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Category</label>
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              className="w-full px-3 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-xs text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
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
            <span className="text-xs text-gray-500 dark:text-gray-400">
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
                <div
                  key={product._id}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col h-full animate-fade-in"
                >
                  <div className="card-image-wrapper">
                    <img src={product.images[0]} alt={product.title} />
                    <span className="absolute top-3 left-3 bg-primary-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize">
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

                    <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <div>
                        <p className="font-medium text-gray-700 dark:text-gray-300">
                          {product.sellerInfo?.name}
                        </p>
                        <p className="text-[10px]">{product.location}</p>
                      </div>
                      <Link
                        href={`/products/${product._id}`}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-primary-600 hover:text-white dark:bg-gray-800 dark:hover:bg-primary-500 text-gray-800 dark:text-gray-200 text-xs font-semibold rounded-lg transition"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center space-y-3 bg-gray-50 dark:bg-gray-900/10 border border-dashed border-gray-200 dark:border-gray-800 rounded-3xl">
              <SlidersHorizontal className="mx-auto text-gray-400" size={32} />
              <h3 className="font-bold text-gray-900 dark:text-white text-base">No Products Found</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                We couldn't find any products matching your active filters. Try adjusting your search query or reset.
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

export default function Products() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-sm text-gray-500">Loading marketplace listings...</p>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
