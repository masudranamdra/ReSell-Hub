'use client';

import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, Compass, BarChart3, ShieldCheck, Heart, Leaf, 
  Award, Star, Mail, MapPin, Send, ArrowRight, Sparkles, 
  UserCheck, CheckCircle2, X, RefreshCw, ShieldAlert, Zap
} from 'lucide-react';
import { AuthContext, API_URL } from '../components/Providers';
import toast from 'react-hot-toast';

export default function Home() {
  const { token } = useContext(AuthContext);
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [stats, setStats] = useState({
    products: 48,
    sellers: 15,
    buyers: 32,
    orders: 26
  });
  const [loading, setLoading] = useState(true);
  const [emailInput, setEmailInput] = useState('');
  const [selectedCat, setSelectedCat] = useState(null);

  // 3 Professional Marketplace Banner Images
  const heroImages = [
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=1600&auto=format&fit=crop'
  ];
  const [currentHeroIdx, setCurrentHeroIdx] = useState(0);

  // Auto slide banner timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIdx((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch featured products (limit to 6)
        const prodRes = await fetch(`${API_URL}/api/products?limit=6`);
        const prodData = await prodRes.json();
        if (prodData.success) {
          setFeatured(prodData.products);
        }

        // Fetch categories
        const catRes = await fetch(`${API_URL}/api/categories`);
        const catData = await catRes.json();
        if (catData.success) {
          setCategories(catData.categories);
        }
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Fetch wishlist state if logged in
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

  const toggleWishlist = async (productId) => {
    if (!token) {
      toast.error('Please login to manage wishlist');
      return;
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

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return toast.error('Please enter a valid email address');
    toast.success('Thank you for subscribing to ReSell Hub newsletters!');
    setEmailInput('');
  };

  const handleCategoryClick = (category) => {
    setSelectedCat(category);
  };

  return (
    <div className="space-y-0 pb-20 overflow-x-hidden transition-colors duration-300 bg-slate-50/50 dark:bg-gray-950">
      
      {/* SECTION 1: DYNAMIC HERO BANNER WITH SLIDER */}
      <section className="relative w-full h-[75vh] md:h-[90vh] lg:h-[95vh] overflow-hidden bg-slate-950 flex items-center justify-center">
        {/* Background Image Slider with Motion */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentHeroIdx}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${heroImages[currentHeroIdx]})` }}
            />
          </AnimatePresence>
          {/* Marketplace Gradient Dim Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/60 to-slate-950/80 z-10" />
          <div className="absolute inset-0 bg-gradient-to-tr from-primary-950/30 via-transparent to-indigo-950/30 z-10" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center text-center text-white py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl space-y-6 sm:space-y-8"
          >
            {/* Visual highlight tag */}
            <div className="flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-black bg-primary-500/90 text-white shadow-xl backdrop-blur-md mx-auto w-fit border border-primary-400/30">
              <Sparkles size={12} className="animate-spin" /> Verfied Circular Economy Escrow
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] drop-shadow-md">
              Upgrade Smarter. <br />
              <span className="bg-gradient-to-r from-yellow-400 via-amber-300 to-primary-400 bg-clip-text text-transparent">
                Spend Less. Live Green.
              </span>
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-slate-200 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow">
              Join thousands of buyers and sellers trading verified pre-owned electronics, furniture, apparel, and books. Protect the environment and save up to 60% with complete transaction escrow security.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2 justify-center items-center">
              <Link
                href="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 hover:scale-105 active:scale-95 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition duration-200 border border-primary-500"
              >
                <Compass size={18} /> Explore Catalog <ArrowRight size={16} />
              </Link>
              <Link
                href="/dashboard/seller/add-product"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 hover:scale-105 active:scale-95 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg border border-white/20 backdrop-blur-md transition duration-200"
              >
                <ShoppingCart size={18} /> Start Selling Listings
              </Link>
            </div>

            {/* Micro Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-6 text-[10px] sm:text-xs text-slate-300 font-semibold">
              <div className="flex items-center gap-1">
                <ShieldCheck size={14} className="text-success-500" /> Stripe Secure Checkout
              </div>
              <div className="flex items-center gap-1">
                <UserCheck size={14} className="text-primary-400" /> Admin Vetted Sellers
              </div>
              <div className="flex items-center gap-1">
                <RefreshCw size={14} className="text-amber-400" /> 100% Eco-sustainability
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Strip Bottom */}
        <div className="absolute bottom-6 left-0 right-0 z-20 hidden md:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/10 px-8 py-5 grid grid-cols-4 gap-6 text-white text-center shadow-2xl">
              <div>
                <p className="text-2xl lg:text-3xl font-black text-amber-400">{stats.products}+</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-300 font-bold mt-1">Listings Approved</p>
              </div>
              <div className="border-l border-white/10">
                <p className="text-2xl lg:text-3xl font-black text-amber-400">{stats.sellers}+</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-300 font-bold mt-1">Verified Sellers</p>
              </div>
              <div className="border-l border-white/10">
                <p className="text-2xl lg:text-3xl font-black text-amber-400">{stats.buyers}+</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-300 font-bold mt-1">Trusted Buyers</p>
              </div>
              <div className="border-l border-white/10">
                <p className="text-2xl lg:text-3xl font-black text-amber-400">{stats.orders}+</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-300 font-bold mt-1">Escrowed Deals</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: POPULAR CATEGORIES WITH PREVIEW MODAL */}
      <section id="categories" className="py-20 bg-white dark:bg-gray-900 border-b border-slate-100 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 text-left">
            <div>
              <span className="text-primary-600 dark:text-primary-400 font-black text-xs uppercase tracking-wider block mb-1">Top Classifications</span>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                Shop By Category
              </h2>
              <p className="text-xs text-gray-500 mt-1">Click a category card to view its product parameters and listing stats</p>
            </div>
            <Link href="/categories" className="mt-4 md:mt-0 text-xs font-black text-primary-600 dark:text-primary-400 hover:text-primary-700 flex items-center gap-1 transition">
              View All Categories <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {categories.length > 0 ? (
              categories.slice(0, 6).map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => handleCategoryClick(cat)}
                  className="group bg-slate-50/50 hover:bg-white dark:bg-slate-900/50 dark:hover:bg-slate-900 border border-slate-100 dark:border-gray-800 hover:border-primary-500 p-6 rounded-2xl text-center shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center space-y-4 cursor-pointer"
                >
                  <div className="w-20 h-20 rounded-full overflow-hidden border border-slate-200 dark:border-gray-800 bg-white group-hover:border-primary-500 transition duration-200 flex-shrink-0 shadow-inner">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xs sm:text-sm text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition">
                      {cat.name}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-bold mt-1 bg-slate-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                      {cat.productCount || 0} Products
                    </p>
                  </div>
                </button>
              ))
            ) : (
              ['Electronics', 'Furniture', 'Vehicles', 'Fashion', 'Mobile Phones', 'Books'].map((name, i) => {
                const dummyImages = [
                  'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=200',
                  'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=200',
                  'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=200',
                  'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=200',
                  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=200',
                  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=200'
                ];
                const placeholderCat = { name, image: dummyImages[i], productCount: Math.floor(Math.random() * 20) + 5 };
                return (
                  <button
                    key={name}
                    onClick={() => handleCategoryClick(placeholderCat)}
                    className="group bg-slate-50/50 hover:bg-white dark:bg-slate-900/50 dark:hover:bg-slate-900 border border-slate-100 dark:border-gray-800 hover:border-primary-500 p-6 rounded-2xl text-center shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center space-y-4 cursor-pointer"
                  >
                    <div className="w-20 h-20 rounded-full overflow-hidden border border-slate-200 dark:border-gray-800 bg-white group-hover:border-primary-500 transition duration-200 flex-shrink-0 shadow-inner">
                      <img
                        src={dummyImages[i]}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                      />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-xs sm:text-sm text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition">
                        {name}
                      </h3>
                      <p className="text-[10px] text-gray-400 font-bold mt-1 bg-slate-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">Explore</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* SECTION 3: FEATURED ACTIVE LISTINGS */}
      <section className="py-20 bg-slate-50/50 dark:bg-gray-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-16">
            <span className="text-primary-600 dark:text-primary-400 font-black text-xs uppercase tracking-wider block">Hot Picks</span>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Featured Active Listings
            </h2>
            <div className="w-12 h-1 bg-primary-600 mx-auto rounded-full mt-2" />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="border border-slate-200 dark:border-gray-800 rounded-3xl p-4 bg-white dark:bg-gray-900 space-y-4">
                  <div className="skeleton-shimmer h-48 rounded-2xl bg-slate-100 dark:bg-gray-800"></div>
                  <div className="skeleton-shimmer h-6 rounded w-3/4 bg-slate-100 dark:bg-gray-800"></div>
                  <div className="skeleton-shimmer h-4 rounded w-1/2 bg-slate-100 dark:bg-gray-800"></div>
                  <div className="skeleton-shimmer h-10 rounded bg-slate-100 dark:bg-gray-800"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {featured.length > 0 ? (
                featured.slice(0, 6).map((product) => (
                  <div
                    key={product._id}
                    className="bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-[460px] overflow-hidden group text-left relative"
                  >
                    {/* Image and Badges */}
                    <div className="relative h-56 overflow-hidden bg-slate-100 dark:bg-gray-800 flex-shrink-0">
                      <img
                        src={product.images[0] || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=300'}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Condition & Category Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                        <span className="bg-primary-600/90 dark:bg-primary-500/90 text-white text-[9px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider shadow">
                          {product.condition}
                        </span>
                        <span className="bg-slate-900/90 text-white text-[9px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider shadow">
                          {product.category}
                        </span>
                      </div>

                      {/* Verified Seller Badge */}
                      {product.sellerInfo?.verified && (
                        <div className="absolute top-3 right-3 bg-success-500 text-white rounded-full p-1 border-2 border-white dark:border-gray-900 shadow-lg" title="Verified Seller">
                          <ShieldCheck size={14} className="text-white" fill="currentColor" />
                        </div>
                      )}
                    </div>

                    {/* Card details */}
                    <div className="p-6 flex-grow flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            {product.title}
                          </h3>
                          <span className="text-primary-600 dark:text-primary-400 font-extrabold text-base sm:text-lg flex-shrink-0">
                            ${product.price}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      {/* Footer actions */}
                      <div className="border-t border-slate-100 dark:border-gray-800 pt-4 mt-4 space-y-4">
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-gray-400">
                          <div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Seller</span>
                            <p className="font-bold text-slate-700 dark:text-slate-300 truncate max-w-[120px]">{product.sellerInfo?.name || 'Seller'}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Location</span>
                            <p className="text-[10px] font-bold flex items-center justify-end gap-0.5 text-slate-600 dark:text-slate-300">
                              <MapPin size={10} className="text-primary-500" /> {product.location}
                            </p>
                          </div>
                        </div>

                        {/* Control buttons */}
                        <div className="grid grid-cols-5 gap-2 pt-1">
                          <button
                            onClick={() => toggleWishlist(product._id)}
                            className={`col-span-1 rounded-xl border flex items-center justify-center transition shadow-sm py-2 hover:scale-105 active:scale-95 ${
                              wishlist.includes(product._id)
                                ? 'bg-red-50 border-red-300 text-red-600 dark:bg-red-950/20 dark:border-red-900'
                                : 'border-slate-200 dark:border-gray-850 text-slate-400 hover:border-red-400 hover:text-red-500'
                            }`}
                            title="Add to Wishlist"
                          >
                            <Heart size={14} fill={wishlist.includes(product._id) ? 'currentColor' : 'none'} />
                          </button>

                          <Link href={`/products/${product._id}`} className="col-span-2">
                            <span className="w-full h-full inline-flex items-center justify-center px-2 py-2 border border-slate-200 dark:border-gray-850 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 font-bold text-[10px] rounded-xl text-slate-700 dark:text-slate-300 shadow-sm transition hover:scale-105 active:scale-95 cursor-pointer">
                              View Details
                            </span>
                          </Link>

                          <Link href={`/checkout?productId=${product._id}`} className="col-span-2">
                            <span className="w-full h-full inline-flex items-center justify-center px-2 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-[10px] rounded-xl shadow-md transition hover:scale-105 active:scale-95 cursor-pointer">
                              Buy Now
                            </span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl space-y-2">
                  <p className="text-sm text-slate-500 dark:text-gray-400 font-semibold">No featured listings found.</p>
                  <p className="text-xs text-slate-400">All newly registered items are undergoing admin vetting.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* SECTION 4: PLATFORM METRICS SHOWCASE */}
      <section className="py-20 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden">
        {/* Subtle backing grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:20px_20px] opacity-70" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl -z-10" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto space-y-3 mb-16">
            <span className="text-amber-400 font-bold text-xs uppercase tracking-wider block">Platform Scope</span>
            <h2 className="text-3xl font-black">ReSell Hub In Figures</h2>
            <p className="text-xs text-slate-300">Providing an automated, escrow-backed marketplace for second-hand transactions</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 text-center">
            <div className="space-y-3">
              <div className="text-4xl sm:text-5xl font-black text-amber-400">{stats.products}+</div>
              <p className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-400 font-bold">Total Products</p>
              <p className="text-[10px] text-slate-300 hidden sm:block">Pre-vetted items listed</p>
            </div>
            <div className="space-y-3 border-l border-white/10">
              <div className="text-4xl sm:text-5xl font-black text-amber-400">{stats.sellers}+</div>
              <p className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-400 font-bold">Active Sellers</p>
              <p className="text-[10px] text-slate-300 hidden sm:block">Verified merchants</p>
            </div>
            <div className="space-y-3 border-l border-white/10">
              <div className="text-4xl sm:text-5xl font-black text-amber-400">{stats.buyers}+</div>
              <p className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-400 font-bold">Total Buyers</p>
              <p className="text-[10px] text-slate-300 hidden sm:block">Active bidding users</p>
            </div>
            <div className="space-y-3 border-l border-white/10">
              <div className="text-4xl sm:text-5xl font-black text-amber-400">{stats.orders}+</div>
              <p className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-400 font-bold">Success Deals</p>
              <p className="text-[10px] text-slate-300 hidden sm:block">Stripe-escrow transactions</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: TRUSTED SELLERS SHOWCASE */}
      <section className="py-20 bg-white dark:bg-gray-900 border-b border-slate-100 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-16">
            <span className="text-primary-600 dark:text-primary-400 font-bold text-xs uppercase tracking-wider block">Top Ranked</span>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Trusted Sellers Showcase
            </h2>
            <div className="w-12 h-1 bg-primary-600 mx-auto rounded-full mt-2" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Anisul Islam', join: 'September 2024', rating: 4.9, img: 'https://i.pravatar.cc/300?img=60', sales: 48 },
              { name: 'Riya Sengupta', join: 'January 2025', rating: 4.5, img: 'https://i.pravatar.cc/300?img=47', sales: 32 },
              { name: 'Imran Khan', join: 'June 2024', rating: 5.0, img: 'https://i.pravatar.cc/300?img=12', sales: 64 }
            ].map((seller, idx) => (
              <div
                key={idx}
                className="bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 text-center space-y-4"
              >
                <div className="relative inline-block">
                  <img
                    src={seller.img}
                    alt={seller.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-primary-500 shadow-md"
                  />
                  <span className="absolute bottom-0 right-1 bg-success-500 text-white rounded-full p-1.5 border-2 border-white dark:border-gray-900 shadow-md">
                    <UserCheck size={12} />
                  </span>
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-gray-900 dark:text-white">{seller.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Joined {seller.join}</p>
                </div>
                <div className="flex justify-center items-center gap-1 text-sm text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill={i < Math.floor(seller.rating) ? 'currentColor' : 'none'} className="text-amber-500" />
                  ))}
                  <span className="text-xs font-bold text-slate-500 dark:text-gray-400 ml-1">({seller.rating}/5.0)</span>
                </div>
                <div className="pt-2 border-t border-slate-200/50 dark:border-gray-800/50 flex justify-between items-center text-[11px] text-slate-500 dark:text-gray-400">
                  <span>Deals Completed</span>
                  <span className="font-bold text-gray-800 dark:text-white">{seller.sales} Sales</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: SUCCESS TESTIMONIAL STORIES */}
      <section className="py-20 bg-slate-50/50 dark:bg-gray-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-16">
            <span className="text-primary-600 dark:text-primary-400 font-bold text-xs uppercase tracking-wider block">Customer Stories</span>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Community Success Stories
            </h2>
            <div className="w-12 h-1 bg-primary-600 mx-auto rounded-full mt-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 p-8 sm:p-10 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row items-start gap-6 text-left">
              <img
                src="https://i.pravatar.cc/300?img=33"
                alt="Testimonial Buyer"
                className="w-16 h-16 rounded-2xl object-cover flex-shrink-0 border border-slate-100 dark:border-gray-800 shadow"
              />
              <div className="space-y-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                  <CheckCircle2 size={10} /> Buyer Review
                </span>
                <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed italic">
                  &ldquo;I found a fully-functional study desk for half the retail price! The checkout process with Stripe was smooth, and the seller was extremely helpful.&rdquo;
                </p>
                <h4 className="font-extrabold text-xs text-gray-900 dark:text-white">- Rakib H., Student</h4>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 p-8 sm:p-10 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row items-start gap-6 text-left">
              <img
                src="https://i.pravatar.cc/300?img=32"
                alt="Testimonial Seller"
                className="w-16 h-16 rounded-2xl object-cover flex-shrink-0 border border-slate-100 dark:border-gray-800 shadow"
              />
              <div className="space-y-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 text-[10px] font-black uppercase tracking-wider">
                  <CheckCircle2 size={10} /> Seller Review
                </span>
                <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed italic">
                  &ldquo;ReSell Hub made it incredibly simple to sell my old DSLR camera. It was sitting in my closet collecting dust, and now it has a new home and I earned extra cash!&rdquo;
                </p>
                <h4 className="font-extrabold text-xs text-gray-900 dark:text-white">- Nusrat J., Photographer</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: SUSTAINABILITY IMPACT */}
      <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6 text-left">
            <div className="inline-flex items-center gap-2 text-success-600 dark:text-success-400 font-black text-sm uppercase tracking-wider">
              <Leaf size={18} className="text-success-500 animate-bounce" /> Environmental Mission
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
              Promoting Re-use, <br />Minimizing Global Landfill Waste
            </h2>
            <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed">
              Every single second-hand transaction reduces manufacturing demand, saving tons of CO2 emissions and precious global resources. By supporting the circular economy on ReSell Hub, you actively:
            </p>
            <ul className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-gray-400 font-semibold">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-success-500 flex-shrink-0" />
                <span>Extend the lifecycle of electronic and household products, lowering landfill waste.</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-success-500 flex-shrink-0" />
                <span>Decrease global carbon footprints from inter-continental transportation processes.</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-success-500 flex-shrink-0" />
                <span>Provide quality items to local buyers at highly accessible second-hand rates.</span>
              </li>
            </ul>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-100 dark:border-gray-800 relative h-96 group">
            <img
              src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=600"
              alt="Sustainability Earth Green"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
          </div>
        </div>
      </section>

      {/* SECTION 8: NEWSLETTER */}
      <section className="py-16 bg-slate-50/50 dark:bg-gray-950 transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-gradient-to-tr from-primary-600 via-primary-700 to-indigo-850 rounded-3xl p-10 sm:p-16 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute w-80 h-80 bg-white/10 rounded-full blur-3xl -top-16 -left-16 animate-pulse" />
            <div className="absolute w-80 h-80 bg-white/10 rounded-full blur-3xl -bottom-16 -right-16 animate-pulse" />

            <div className="relative z-10 max-w-xl mx-auto space-y-6">
              <div className="w-14 h-14 bg-white/15 rounded-full flex items-center justify-center mx-auto shadow-inner border border-white/10">
                <Mail size={26} />
              </div>
              <h2 className="text-3xl font-black tracking-tight">Stay updated with latest bargains!</h2>
              <p className="text-xs sm:text-sm text-primary-100 font-medium leading-relaxed">
                Subscribe to our monthly newsletter and never miss out on second-hand trends and popular local products.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-grow px-5 py-3.5 bg-white/10 placeholder-primary-200 border border-white/20 rounded-xl text-white text-xs outline-none focus:ring-2 focus:ring-white/40"
                />
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-white hover:bg-slate-100 active:scale-95 text-primary-650 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow"
                >
                  Subscribe <Send size={12} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY PREVIEW MODAL */}
      <AnimatePresence>
        {selectedCat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="bg-white dark:bg-gray-900 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 dark:border-gray-800 p-6 space-y-6 text-left relative"
            >
              <button
                onClick={() => setSelectedCat(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-gray-800 hover:bg-slate-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition cursor-pointer"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>

              <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-200 dark:bg-gray-800 shadow-md">
                <img
                  src={selectedCat.image}
                  alt={selectedCat.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <h3 className="absolute bottom-4 left-4 text-2xl font-black text-white">
                  {selectedCat.name}
                </h3>
              </div>

              <div className="space-y-4">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 text-[10px] font-black uppercase tracking-wider">
                  <Zap size={10} /> Platform Category Overview
                </span>
                <p className="text-xs text-slate-500 dark:text-gray-400 leading-relaxed font-medium">
                  Discover high-quality pre-owned listings in the <strong>{selectedCat.name}</strong> catalog. We enforce seller security verification, track listings history, and offer credit-card checkout security via Stripe.
                </p>
                
                <div className="grid grid-cols-2 gap-4 py-3.5 border-t border-b border-slate-100 dark:border-gray-850">
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase block">Active Listings</span>
                    <p className="text-base font-black text-gray-900 dark:text-white mt-0.5">
                      {selectedCat.productCount || 0} items
                    </p>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase block">Inspection Badge</span>
                    <p className="text-xs font-black text-success-600 dark:text-success-400 flex items-center gap-0.5 mt-1">
                      <ShieldCheck size={14} /> 100% Inspected
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setSelectedCat(null)}
                  className="flex-1 py-3 border border-slate-200 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-gray-850 font-bold text-xs rounded-xl text-slate-700 dark:text-slate-350 transition cursor-pointer"
                >
                  Cancel
                </button>
                <Link
                  href={`/categories/${selectedCat.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="flex-1"
                  onClick={() => setSelectedCat(null)}
                >
                  <span className="w-full h-full inline-flex justify-center items-center py-3 bg-primary-600 hover:bg-primary-700 text-white font-extrabold text-xs rounded-xl shadow-md transition hover:scale-102 cursor-pointer">
                    Browse Category
                  </span>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
