'use client';

import React, { useState, useEffect, useContext, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, RotateCcw, MapPin, Heart, ShoppingCart, BarChart3, ShieldCheck } from 'lucide-react';
import { AuthContext, API_URL } from '../../components/Providers';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { token } = useContext(AuthContext);

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
  const [wishlist, setWishlist] = useState([]);
  const [compareList, setCompareList] = useState([]);
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

    // Load compare list
    const compare = JSON.parse(localStorage.getItem('compare_list') || '[]');
    setCompareList(compare.map(item => item._id));
  }, []);

  // Fetch wishlist
  useEffect(() => {
    if (!token) return;
    async function loadWishlist() {
      try {
        const res = await fetch(`${API_URL}/api/users/wishlist`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setWishlist(data.wishlist.map(item => item.productId?._id || item.productId));
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadWishlist();
  }, [token]);

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

  const toggleWishlist = async (productId) => {
    if (!token) {
      toast.error('Please login to manage wishlist');
      return router.push('/login');
    }
    const isWishlisted = wishlist.includes(productId);
    try {
      const method = isWishlisted ? 'DELETE' : 'POST';
      const res = await fetch(`${API_URL}/api/users/wishlist/${productId}`, {
        method,
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        if (isWishlisted) {
          setWishlist(wishlist.filter(id => id !== productId));
          toast.success('Removed from wishlist');
        } else {
          setWishlist([...wishlist, productId]);
          toast.success('Added to wishlist!');
        }
      }
    } catch (err) {
      toast.error('Error updating wishlist');
    }
  };

  const addToCart = (product) => {
    const currentCart = JSON.parse(localStorage.getItem('cart_items') || '[]');
    const exists = currentCart.some(item => item._id === product._id);
    if (exists) {
      toast.error('Item is already in your cart!');
      return;
    }
    currentCart.push({
      _id: product._id,
      title: product.title,
      price: product.price,
      image: product.images[0],
      category: product.category,
      condition: product.condition,
      sellerInfo: product.sellerInfo,
      quantity: 1
    });
    localStorage.setItem('cart_items', JSON.stringify(currentCart));
    toast.success('Added to cart!');
    window.dispatchEvent(new Event('cartUpdate'));
  };

  const toggleComparison = (product) => {
    let list = JSON.parse(localStorage.getItem('compare_list') || '[]');
    const isCompared = compareList.includes(product._id);
    if (isCompared) {
      list = list.filter(item => item._id !== product._id);
      localStorage.setItem('compare_list', JSON.stringify(list));
      setCompareList(compareList.filter(id => id !== product._id));
      toast.success('Removed from comparison');
    } else {
      if (list.length >= 3) {
        toast.error('You can compare a maximum of 3 products');
        return;
      }
      list.push({
        _id: product._id,
        title: product.title,
        price: product.price,
        condition: product.condition,
        category: product.category,
        image: product.images[0],
        sellerRating: product.sellerInfo?.rating || '4.5'
      });
      localStorage.setItem('compare_list', JSON.stringify(list));
      setCompareList([...compareList, product._id]);
      toast.success('Added to comparison!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors duration-300">
      <div className="text-left space-y-2 mb-8">
        <h1 className="text-3xl font-extrabold text-gray-950 dark:text-white">Explore Marketplace</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Search and filter through hundreds of verified second-hand items</p>
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
          <div className="space-y-1.5 text-left">
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
          <div className="space-y-1.5 text-left">
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
          <div className="space-y-1.5 text-left">
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
          <div className="space-y-2 text-left">
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
          <div className="space-y-1.5 text-left">
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
        <div className="lg:col-span-3">
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
                <div key={n} className="border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
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
                  className="group bg-white dark:bg-gray-800 border border-slate-200/80 dark:border-gray-700/80 rounded-3xl shadow-md hover:shadow-xl transition-all duration-350 flex flex-col justify-between overflow-hidden relative min-h-[580px] text-left"
                >
                  {/* Image & Badge Cover */}
                  <div className="relative h-56 overflow-hidden bg-slate-100 dark:bg-gray-800 flex-shrink-0">
                    <img
                      src={product.images[0] || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=300'}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                      <span className="bg-gradient-to-r from-primary-600 to-primary-750 text-white text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-lg shadow-primary-600/30">
                        {product.condition}
                      </span>
                      <span className="bg-slate-900/85 text-white text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-lg">
                        {product.category}
                      </span>
                    </div>
                    {product.sellerInfo?.verified && (
                      <div className="absolute top-4 right-4 bg-emerald-500 text-white rounded-full p-2 border-2 border-white dark:border-gray-900 shadow-lg" title="Verified Seller">
                        <ShieldCheck size={14} fill="currentColor" className="text-white" />
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-grow flex flex-col justify-between ">
                    <div className="space-y-1">
                      <h3 className="font-brand font-black text-slate-800 dark:text-slate-100 text-base group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug line-clamp-2">
                        {product.title}
                      </h3>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-black text-primary-650 dark:text-primary-400">
                          ${product.price}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${product.stock > 0 ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400'}`}>
                          {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    <div className="border-t pt-6 border-slate-100 dark:border-gray-700 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <div className="w-7 h-7 rounded-full bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center font-bold text-xs text-primary-600 dark:text-primary-400 flex-shrink-0">
                            {product.sellerInfo?.name?.[0]?.toUpperCase() || 'S'}
                          </div>
                          <div className="min-w-0">
                            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block text-xs">{product.sellerInfo?.name || 'Seller'}</span>
                            <span className="text-[9px] text-slate-400 dark:text-slate-500 block leading-none truncate">{product.sellerInfo?.email || 'No email'}</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Seller Phone</span>
                          <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">{product.sellerInfo?.phone || 'N/A'}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1 text-[11px] font-semibold">
                          <MapPin size={11} className="text-primary-500 flex-shrink-0" /> {product.location}
                        </span>
                        <span className="text-[10px] text-slate-450 dark:text-slate-500 font-medium">
                          {product.createdAt ? `Posted: ${new Date(product.createdAt).toLocaleDateString()}` : ''}
                        </span>
                      </div>

                      {/* Interactive Buttons */}
                      <div className="grid grid-cols-5 gap-1.5 pt-2">
                        <button
                          onClick={() => addToCart(product)}
                          className="w-full rounded-xl bg-primary-50 hover:bg-primary-100 dark:bg-primary-955/20 dark:hover:bg-primary-950/40 text-primary-750 dark:text-primary-400 py-2.5 flex items-center justify-center gap-1 transition duration-200 shadow-sm border border-primary-100 dark:border-primary-900/40"
                          title="Add To Cart"
                        >
                          <ShoppingCart size={13} />
                        </button>
                        <button
                          onClick={() => toggleWishlist(product._id)}
                          className={`w-full rounded-xl border py-2.5 flex items-center justify-center transition duration-200 shadow-sm ${wishlist.includes(product._id)
                              ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
                              : 'border-slate-200 dark:border-gray-700 text-slate-650 dark:text-slate-400 hover:border-red-400 hover:text-red-600 dark:hover:border-red-600 hover:bg-red-50/10'
                            }`}
                          title="Add To Wishlist"
                        >
                          <Heart size={13} fill={wishlist.includes(product._id) ? 'currentColor' : 'none'} />
                        </button>
                        <button
                          onClick={() => toggleComparison(product)}
                          className={`w-full rounded-xl border py-2.5 flex items-center justify-center transition duration-200 shadow-sm ${compareList.includes(product._id)
                              ? 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-300 dark:border-indigo-805 text-indigo-600 dark:text-indigo-400'
                              : 'border-slate-200 dark:border-gray-700 text-slate-650 dark:text-slate-400 hover:border-indigo-400 hover:text-indigo-600 dark:hover:border-indigo-600 hover:bg-indigo-50/10'
                            }`}
                          title="Compare Product"
                        >
                          <BarChart3 size={13} />
                        </button>
                        <Link href={`/products/${product._id}`} className="w-full block">
                          <span className="w-full inline-flex items-center justify-center dark:border-gray-700 bg-slate-50 hover:bg-slate-100 dark:bg-gray-800 dark:hover:bg-gray-750 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-primary-400 transition duration-200 shadow-sm cursor-pointer">
                            Details
                          </span>
                        </Link>
                        <Link href={`/checkout?productId=${product._id}`} className="w-full block">
                          <span className="w-full inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-primary-600 to-indigo-650 hover:from-primary-700 hover:to-indigo-750 py-2.5 text-xs font-bold text-white transition duration-200 shadow-md cursor-pointer">
                            Buy
                          </span>
                        </Link>
                      </div>
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
            <div className="flex items-center justify-center gap-3 pt-8 border-t border-slate-100 dark:border-gray-800 text-xs font-extrabold text-slate-500 dark:text-slate-400">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="hover:text-primary-650 dark:hover:text-primary-400 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer flex items-center gap-1 font-brand uppercase tracking-wider text-[11px]"
              >
                &lt; Previous
              </button>
              
              <span className="text-slate-300 dark:text-gray-700">|</span>

              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p, idx) => (
                <React.Fragment key={p}>
                  <button
                    onClick={() => setPage(p)}
                    className={`px-3 py-1.5 transition rounded-lg ${page === p
                        ? 'text-primary-650 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/20 font-black'
                        : 'hover:text-primary-650 dark:hover:text-primary-400 font-semibold'
                      }`}
                  >
                    {p}
                  </button>
                  {idx < pagination.pages - 1 && (
                    <span className="text-slate-300 dark:text-gray-700">|</span>
                  )}
                </React.Fragment>
              ))}

              <span className="text-slate-300 dark:text-gray-700">|</span>

              <button
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
                className="hover:text-primary-650 dark:hover:text-primary-400 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer flex items-center gap-1 font-brand uppercase tracking-wider text-[11px]"
              >
                Next &gt;
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
