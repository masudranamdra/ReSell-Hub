'use client';

import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, Compass, BarChart3, ShieldCheck, Heart, Leaf,
  Award, Star, Mail, MapPin, Send, ArrowRight, Sparkles,
  UserCheck, CheckCircle2, X, RefreshCw, ShieldAlert, Zap,
  Laptop, Sofa, Car, Shirt, Smartphone, BookOpen, Layers,
  Activity, TrendingUp, Percent, ArrowRightCircle
} from 'lucide-react';
import { AuthContext, API_URL } from '../components/Providers';
import toast from 'react-hot-toast';

// Icon mapper helper
const getCategoryIcon = (name) => {
  const normalized = name.toLowerCase();
  if (normalized.includes('electronic') || normalized.includes('tech')) return Laptop;
  if (normalized.includes('furniture') || normalized.includes('chair') || normalized.includes('sofa')) return Sofa;
  if (normalized.includes('vehicle') || normalized.includes('car') || normalized.includes('bike')) return Car;
  if (normalized.includes('fashion') || normalized.includes('apparel') || normalized.includes('cloth') || normalized.includes('wear')) return Shirt;
  if (normalized.includes('phone') || normalized.includes('mobile')) return Smartphone;
  if (normalized.includes('book')) return BookOpen;
  return Layers;
};

// Mock items helper for Category popup modal
const getMockFeatured = (catName) => {
  const name = catName.toLowerCase();
  if (name.includes('elect')) {
    return [
      { _id: 'mock-el-1', title: 'iPhone 13 Pro Max - 256GB', price: 649, location: 'Dhaka', images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=200'], condition: 'Like New' },
      { _id: 'mock-el-2', title: 'Dell XPS 13 Laptop', price: 799, location: 'Chittagong', images: ['https://images.unsplash.com/photo-1496181130204-755241544e35?q=80&w=200'], condition: 'Excellent' }
    ];
  }
  if (name.includes('furn')) {
    return [
      { _id: 'mock-fu-1', title: 'Ergonomic Office Chair', price: 110, location: 'Sylhet', images: ['https://images.unsplash.com/photo-1505797149-43b0069ec26b?q=80&w=200'], condition: 'Excellent' },
      { _id: 'mock-fu-2', title: 'Nordic Wooden Dining Table', price: 220, location: 'Dhaka', images: ['https://images.unsplash.com/photo-1530018607912-eff2df114f11?q=80&w=200'], condition: 'Good' }
    ];
  }
  if (name.includes('vehic') || name.includes('car')) {
    return [
      { _id: 'mock-ve-1', title: 'Toyota Aqua Hybrid 2018', price: 12500, location: 'Dhaka', images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=200'], condition: 'Good' },
      { _id: 'mock-ve-2', title: 'Giant Escape 3 Bicycle', price: 290, location: 'Khulna', images: ['https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=200'], condition: 'Excellent' }
    ];
  }
  if (name.includes('fash') || name.includes('apparel') || name.includes('cloth')) {
    return [
      { _id: 'mock-fa-1', title: 'Vintage Leather Jacket', price: 95, location: 'Dhaka', images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=200'], condition: 'Like New' },
      { _id: 'mock-fa-2', title: 'Retro Windbreaker Jacket', price: 45, location: 'Rajshahi', images: ['https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=200'], condition: 'Excellent' }
    ];
  }
  if (name.includes('phone')) {
    return [
      { _id: 'mock-ph-1', title: 'Samsung Galaxy S22 Ultra', price: 549, location: 'Dhaka', images: ['https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?q=80&w=200'], condition: 'Excellent' },
      { _id: 'mock-ph-2', title: 'iPhone 12 - 128GB Blue', price: 379, location: 'Chittagong', images: ['https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=200'], condition: 'Good' }
    ];
  }
  return [
    { _id: 'mock-bk-1', title: 'Clean Code (Robert C. Martin)', price: 18, location: 'Dhaka', images: ['https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=200'], condition: 'Like New' },
    { _id: 'mock-bk-2', title: 'Sapiens: A Brief History', price: 12, location: 'Sylhet', images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=200'], condition: 'Good' }
  ];
};

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
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const prodRes = await fetch(`${API_URL}/api/products?limit=6`);
        const prodData = await prodRes.json();
        if (prodData.success) {
          setFeatured(prodData.products);
        }

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

  // Build a list of 6 categories to show on orbit and mobile carousel
  const orbitCategories = categories.length > 0
    ? categories.slice(0, 6)
    : [
      { name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=200', productCount: 48 },
      { name: 'Furniture', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=200', productCount: 15 },
      { name: 'Vehicles', image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=200', productCount: 10 },
      { name: 'Fashion', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=200', productCount: 26 },
      { name: 'Mobile Phones', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=200', productCount: 32 },
      { name: 'Books', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=200', productCount: 18 }
    ].slice(0, 6);

  // Dynamic filter of products for Category Popup
  const getCategoryPopupProducts = (cat) => {
    if (!cat) return [];
    const catName = cat.name.toLowerCase();
    const matched = featured.filter(p => {
      const pCat = (p.category || '').toLowerCase();
      return pCat === catName || catName.includes(pCat) || pCat.includes(catName);
    });
    return matched.length > 0 ? matched.slice(0, 2) : getMockFeatured(cat.name);
  };

  return (
    <div className="space-y-0 pb-0 overflow-x-hidden bg-slate-50/50 dark:bg-gray-950 transition-colors duration-300 font-sans">

      {/* SECTION 1: HERO CONTAINER */}
      <section className="relative w-full min-h-[90vh] lg:min-h-[95vh] overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center py-20 lg:py-0">
        {/* Professional Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentHeroIdx}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.25, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0 w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${heroImages[currentHeroIdx]})` }}
            />
          </AnimatePresence>
          {/* Clean Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50/90 via-white/80 to-slate-50 dark:from-gray-950/95 dark:via-gray-900/90 dark:to-gray-950 z-10" />
          
          {/* Active Banner Indicator Dots */}
          <div className="absolute bottom-6 right-6 z-20 flex gap-2">
            {heroImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentHeroIdx(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  currentHeroIdx === idx 
                    ? 'bg-primary-600 dark:bg-primary-400 w-8' 
                    : 'bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Professional Accent Elements */}
          <div className="absolute w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-3xl -top-56 -left-48 z-10 animate-pulse duration-5000" />
          <div className="absolute w-[500px] h-[500px] bg-indigo-500/8 rounded-full blur-3xl -bottom-40 -right-40 z-10" />
        </div>

        {/* Content & Orbit Layout Split */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full flex flex-col justify-center py-6 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">

            {/* Left Content Column */}
            <div className="col-span-1 lg:col-span-7 md:-mt-40 text-left space-y-6 sm:space-y-8">
              <div className="space-y-6">
                {/* Visual Highlight Badge */}
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-full text-[11px] sm:text-xs font-bold bg-gradient-to-r from-primary-100 to-indigo-100 dark:from-primary-950 dark:to-indigo-950 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800 w-fit shadow-md">
                  ✓ <span>Trusted Marketplace with Secure Escrow</span>
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08] text-gray-900 dark:text-white font-brand">
                  Shop Second-Hand,<br />
                  <span className="bg-gradient-to-r from-primary-600 via-indigo-600 to-primary-500 dark:from-primary-400 dark:via-indigo-400 dark:to-primary-300 bg-clip-text text-transparent">
                    Save Smart. Save Earth.
                  </span>
                </h1>

                <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 font-medium leading-relaxed max-w-xl">
                  Join thousands of buyers and sellers trading verified pre-owned electronics, furniture, apparel, and books. Protect the environment and save up to 60% with complete transaction escrow security.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <Link
                    href="/products"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-bold text-sm rounded-2xl shadow-lg transition duration-200 border border-primary-600 hover:border-primary-700 font-brand"
                  >
                    <Compass size={18} /> Explore Catalog <ArrowRight size={16} />
                  </Link>
                  <Link
                    href="/dashboard/seller/add-product"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-gray-900 font-bold text-sm rounded-2xl shadow-md transition duration-200 border border-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white dark:border-gray-700 font-brand"
                  >
                    <ShoppingCart size={18} /> Start Selling
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-6 text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-semibold border-t border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-success-500" /> <span>Stripe Secure</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserCheck size={16} className="text-primary-500" /> <span>Vetted Sellers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RefreshCw size={16} className="text-primary-500" /> <span>Eco Friendly</span>
                  </div>
                </div>

                {/* Mobile Categories Swiper Layout (Visible only on Mobile/Tablet in Hero) */}
                <div className="lg:hidden space-y-3 pt-6 border-t border-slate-900">
                  <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
                    Touch & Explore Categories
                  </h3>
                  <div className="w-full overflow-x-auto pb-2 flex gap-4 scrollbar-none snap-x">
                    {orbitCategories.map((cat) => {
                      const Icon = getCategoryIcon(cat.name);
                      return (
                        <button
                          key={cat.name}
                          onClick={() => handleCategoryClick(cat)}
                          className="flex-shrink-0 w-32 h-32 rounded-2xl bg-slate-900/60 border border-slate-800 p-3 shadow-md flex flex-col items-center justify-between text-center relative hover:border-primary-500 transition-colors snap-start"
                        >
                          <div className="relative w-12 h-12 rounded-full overflow-hidden border border-slate-800 bg-slate-800 flex items-center justify-center shadow-inner">
                            <img src={cat.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-75" />
                            <div className="absolute inset-0 bg-slate-950/30" />
                            <div className="absolute text-primary-400">
                              <Icon size={16} />
                            </div>
                          </div>
                          <div className="space-y-0.5">
                            <h4 className="font-extrabold text-[11px] text-white truncate max-w-[110px] leading-snug">
                              {cat.name}
                            </h4>
                            <span className="text-[8px] text-slate-400 font-bold bg-slate-950 px-1.5 py-0.5 rounded-full block w-fit mx-auto">
                              {cat.productCount || 0} Items
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content Column (Desktop Only) */}
            <div className="col-span-1 lg:col-span-5 hidden lg:block">
              <div className="relative">
                <div className="grid grid-cols-3 gap-4">
                  {orbitCategories.slice(0, 6).map((cat) => {
                    const Icon = getCategoryIcon(cat.name);
                    return (
                      <button
                        key={cat.name}
                        onClick={() => handleCategoryClick(cat)}
                        className="group bg-white hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-800 border border-gray-200/80 dark:border-gray-700/80 hover:border-primary-400 dark:hover:border-primary-500/70 p-4 rounded-2xl text-center shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col items-center space-y-3"
                      >
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary-200 dark:border-primary-900 bg-primary-50 dark:bg-primary-950/30 group-hover:border-primary-500 transition duration-300 flex-shrink-0 shadow-sm flex items-center justify-center relative">
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-full h-full object-cover opacity-70 group-hover:opacity-85 transition duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-950/5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition">
                            {cat.name}
                          </h4>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium mt-1">
                            {cat.productCount || 0} items
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

            {/* Floating statistics cards on desktop */}
            <div className="absolute bottom-16 left-0 right-0 z-20 hidden lg:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-gray-800 backdrop-blur-xl rounded-3xl px-10 py-8 grid grid-cols-4 gap-8 text-center shadow-2xl border border-gray-200 dark:border-gray-700">
              <div>
                <div className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Active Listings</div>
                <p className="text-4xl font-black text-primary-600 dark:text-primary-400">{stats.products}+</p>
              </div>
              <div className="border-l border-gray-200 dark:border-gray-700 pl-8">
                <div className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Verified Sellers</div>
                <p className="text-4xl font-black text-primary-600 dark:text-primary-400">{stats.sellers}+</p>
              </div>
              <div className="border-l border-gray-200 dark:border-gray-700 pl-8">
                <div className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Active Buyers</div>
                <p className="text-4xl font-black text-primary-600 dark:text-primary-400">{stats.buyers}+</p>
              </div>
              <div className="border-l border-gray-200 dark:border-gray-700 pl-8">
                <div className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Secure Deals</div>
                <p className="text-4xl font-black text-primary-600 dark:text-primary-400">{stats.orders}+</p>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* SECTION 2: POPULAR CATEGORIES GRID (UPGRADED STYLING) */}
      <section id="categories" className="py-24 bg-white dark:bg-gray-900 border-b border-slate-100 dark:border-gray-800 transition-colors duration-300 relative">
        <div className="absolute inset-0 bg-dot-pattern opacity-20 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 text-left">
            <div>
              <span className="text-primary-600 dark:text-primary-400 font-extrabold text-xs uppercase tracking-wider block mb-1">
                Top Classifications
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight font-brand">
                Shop By Category
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Click a category card to open its product parameter details and active listings highlights.
              </p>
            </div>
            <Link
              href="/categories"
              className="mt-4 md:mt-0 text-xs font-black text-primary-600 dark:text-primary-400 hover:text-primary-750 flex items-center gap-1.5 transition-colors font-brand"
            >
              Browse All Categories <ArrowRightCircle size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {orbitCategories.map((cat) => {
              const Icon = getCategoryIcon(cat.name);
              return (
                <button
                  key={cat.name}
                  onClick={() => handleCategoryClick(cat)}
                  className="group bg-white hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-800 border border-gray-200/80 dark:border-gray-700/80 hover:border-primary-400 dark:hover:border-primary-500/70 p-6 rounded-2xl text-center shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col items-center space-y-4"
                >
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary-200 dark:border-primary-900 bg-primary-50 dark:bg-primary-950/30 group-hover:border-primary-500 transition duration-300 flex-shrink-0 shadow-sm flex items-center justify-center relative">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-85 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-950/5" />
                    <div className="absolute text-white drop-shadow">
                      <Icon size={20} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition">
                      {cat.name}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-extrabold mt-1.5 bg-slate-100 dark:bg-gray-800/80 px-2.5 py-0.5 rounded-full">
                      {cat.productCount || 0} Products
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION 3: FEATURED ACTIVE LISTINGS (PREMIUM DESIGN CARDS) */}
      <section className="py-24 bg-slate-50/30 dark:bg-gray-950/40 border-b border-slate-100 dark:border-gray-900 transition-colors duration-300 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="text-center space-y-2 mb-16">
            <span className="text-primary-600 dark:text-primary-400 font-extrabold text-xs uppercase tracking-wider block">
              Hot Picks
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight font-brand">
              Featured Active Listings
            </h2>
            <div className="w-12 h-1 bg-gradient-to-r from-primary-500 to-indigo-600 mx-auto rounded-full mt-3" />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="border border-slate-200 dark:border-gray-800 rounded-3xl p-4 bg-white dark:bg-gray-900 space-y-4 shadow-sm">
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
                    className="group bg-white dark:bg-gray-800 border border-slate-200/80 dark:border-gray-700/80 rounded-3xl shadow-md hover:shadow-xl transition-all duration-350 flex flex-col justify-between overflow-hidden relative min-h-[460px]"
                  >
                    {/* Image and Badges */}
                    <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-gray-800 flex-shrink-0">
                      <img
                        src={product.images[0] || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=300'}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {/* Condition & Category Badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                        <span className="bg-gradient-to-r from-primary-600 to-primary-750 text-white text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-lg shadow-primary-600/30">
                          {product.condition}
                        </span>
                        <span className="bg-slate-900/85 text-white text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-lg">
                          {product.category}
                        </span>
                      </div>

                      {/* Verified Seller Badge */}
                      {product.sellerInfo?.verified && (
                        <div className="absolute top-4 right-4 bg-emerald-500 text-white rounded-full p-2 border-2 border-white dark:border-gray-900 shadow-lg" title="Verified Seller">
                          <ShieldCheck size={14} className="text-white" fill="currentColor" />
                        </div>
                      )}
                    </div>

                    {/* Card details */}
                    <div className="p-4 flex-grow flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start gap-3">
                          <h3 className="font-brand font-black text-slate-800 dark:text-slate-100 text-sm group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug line-clamp-2">
                            {product.title}
                          </h3>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-black text-primary-650 dark:text-primary-400">
                            ${product.price}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${product.stock > 0 ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400'}`}>
                            {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
                          </span>
                        </div>

                        {(product.brand || product.model) && (
                          <div className="flex gap-2 text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-gray-800/40 p-2 rounded-xl">
                            {product.brand && <span>Brand: <strong className="text-slate-700 dark:text-slate-200">{product.brand}</strong></span>}
                            {product.model && <span className="border-l border-slate-200 dark:border-gray-700 pl-2">Model: <strong className="text-slate-700 dark:text-slate-200">{product.model}</strong></span>}
                          </div>
                        )}

                        {product.features && product.features.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {product.features.slice(0, 3).map((feat, i) => (
                              <span key={i} className="bg-slate-100 dark:bg-gray-800 text-slate-650 dark:text-gray-400 px-2 py-0.5 rounded text-[8px] font-bold">
                                # {feat}
                              </span>
                            ))}
                          </div>
                        )}

                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium line-clamp-2">
                          {product.description}
                        </p>
                      </div>

                      {/* Footer info */}
                      <div className="border-t border-slate-100 dark:border-gray-700 pt-2 space-y-3">
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

                        {/* Control buttons */}
                        <div className="grid grid-cols-3 gap-2 pt-2">
                          <button
                            onClick={() => toggleWishlist(product._id)}
                            className={`w-full rounded-xl border py-2.5 flex items-center justify-center text-sm font-bold transition duration-200 ${wishlist.includes(product._id)
                                ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 shadow-sm'
                                : 'border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-650 dark:text-slate-400 hover:border-red-400 hover:text-red-650 dark:hover:border-red-650 hover:bg-red-55/10 shadow-sm'
                              }`}
                            title="Add to Wishlist"
                          >
                            <Heart size={14} fill={wishlist.includes(product._id) ? 'currentColor' : 'none'} />
                          </button>

                          <Link href={`/products/${product._id}`} className="block">
                            <span className="w-full inline-flex items-center justify-center rounded-xl border border-slate-250 dark:border-gray-700 bg-slate-50 hover:bg-slate-100 dark:bg-gray-800 dark:hover:bg-gray-750 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-primary-400 transition duration-200 shadow-sm cursor-pointer">
                              Details
                            </span>
                          </Link>

                          <Link href={`/checkout?productId=${product._id}`} className="block">
                            <span className="w-full inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-primary-600 to-indigo-650 hover:from-primary-700 hover:to-indigo-750 py-2.5 text-xs font-bold text-white transition duration-200 shadow-md cursor-pointer">
                              Buy Now
                            </span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-850 rounded-3xl space-y-2">
                  <p className="text-sm text-slate-500 dark:text-gray-400 font-semibold">No featured listings found.</p>
                  <p className="text-xs text-slate-400 font-medium">All newly registered items are undergoing admin vetting.</p>
                </div>
              )}
            </div>
          )}

        </div>
      </section>

      {/* SECTION 4: PLATFORM METRICS SHOWCASE (DARK MODERN LOOK) */}
      <section className="py-24 bg-gradient-to-br from-slate-900 bg-indigo-950 text-white relative overflow-hidden border-t border-b border-slate-900">
        <div className="absolute inset-0 bg-dot-pattern opacity-20" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-3xl -z-10" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto space-y-3 mb-20">
            <span className="text-amber-400 font-extrabold text-xs uppercase tracking-wider block">
              Platform Scope
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-brand">
              ReSell Hub In Figures
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              Providing an automated, escrow-backed marketplace for second-hand transactions
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 text-center">

            <div className="space-y-4">
              <div className="p-3 bg-white/5 rounded-2xl w-fit mx-auto border border-white/10 text-amber-400 shadow-inner">
                <Layers size={24} />
              </div>
              <div>
                <div className="text-4xl sm:text-5xl font-black text-white font-brand">{stats.products}+</div>
                <p className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-400 font-bold mt-2">Total Products</p>
                <p className="text-[10px] text-slate-400 mt-1 hidden sm:block font-medium">Pre-vetted active listings</p>
              </div>
            </div>

            <div className="space-y-4 border-l border-white/10">
              <div className="p-3 bg-white/5 rounded-2xl w-fit mx-auto border border-white/10 text-amber-400 shadow-inner">
                <UserCheck size={24} />
              </div>
              <div>
                <div className="text-4xl sm:text-5xl font-black text-white font-brand">{stats.sellers}+</div>
                <p className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-400 font-bold mt-2">Active Sellers</p>
                <p className="text-[10px] text-slate-400 mt-1 hidden sm:block font-medium">Verified merchant sellers</p>
              </div>
            </div>

            <div className="space-y-4 border-l border-white/10">
              <div className="p-3 bg-white/5 rounded-2xl w-fit mx-auto border border-white/10 text-amber-400 shadow-inner">
                <TrendingUp size={24} />
              </div>
              <div>
                <div className="text-4xl sm:text-5xl font-black text-white font-brand">{stats.buyers}+</div>
                <p className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-400 font-bold mt-2">Total Buyers</p>
                <p className="text-[10px] text-slate-400 mt-1 hidden sm:block font-medium">Active bidding buyers</p>
              </div>
            </div>

            <div className="space-y-4 border-l border-white/10">
              <div className="p-3 bg-white/5 rounded-2xl w-fit mx-auto border border-white/10 text-amber-400 shadow-inner">
                <ShieldCheck size={24} />
              </div>
              <div>
                <div className="text-4xl sm:text-5xl font-black text-white font-brand">{stats.orders}+</div>
                <p className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-400 font-bold mt-2">Success Deals</p>
                <p className="text-[10px] text-slate-400 mt-1 hidden sm:block font-medium">Secure escrow checkouts</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 5: TRUSTED SELLERS SHOWCASE */}
      <section className="py-24 bg-white dark:bg-gray-900 border-b border-slate-100 dark:border-gray-800 transition-colors duration-300 relative">
        <div className="absolute inset-0 bg-dot-pattern opacity-20 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="text-center space-y-2 mb-16">
            <span className="text-primary-600 dark:text-primary-400 font-extrabold text-xs uppercase tracking-wider block">
              Top Ranked
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight font-brand">
              Trusted Sellers Showcase
            </h2>
            <div className="w-12 h-1 bg-gradient-to-r from-primary-500 to-indigo-650 mx-auto rounded-full mt-3" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Anisul Islam', join: 'September 2024', rating: 4.9, img: 'https://i.pravatar.cc/300?img=60', sales: 48 },
              { name: 'Riya Sengupta', join: 'January 2025', rating: 4.5, img: 'https://i.pravatar.cc/300?img=47', sales: 32 },
              { name: 'Imran Khan', join: 'June 2024', rating: 5.0, img: 'https://i.pravatar.cc/300?img=12', sales: 64 }
            ].map((seller, idx) => (
              <div
                key={idx}
                className="bg-slate-50/40 dark:bg-slate-900/30 border border-slate-150 dark:border-gray-850 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 text-center space-y-4"
              >
                <div className="relative inline-block">
                  <img
                    src={seller.img}
                    alt={seller.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-primary-500 shadow-md"
                  />
                  <span className="absolute bottom-0 right-1 bg-success-500 text-white rounded-full p-1.5 border-2 border-white dark:border-gray-900 shadow-md">
                    <UserCheck size={11} />
                  </span>
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-gray-900 dark:text-white font-brand">{seller.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 font-medium">Joined {seller.join}</p>
                </div>
                <div className="flex justify-center items-center gap-1 text-sm text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill={i < Math.floor(seller.rating) ? 'currentColor' : 'none'} className="text-amber-500" />
                  ))}
                  <span className="text-xs font-bold text-slate-500 dark:text-gray-400 ml-1">({seller.rating}/5.0)</span>
                </div>
                <div className="pt-3 border-t border-slate-200/50 dark:border-gray-800/60 flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span>Deals Completed</span>
                  <span className="font-extrabold text-gray-800 dark:text-white font-brand">{seller.sales} Sales</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 6: SUCCESS STORIES TESTIMONIALS */}
      <section className="py-24 bg-slate-50/50 dark:bg-gray-950 transition-colors duration-300 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center space-y-2 mb-16">
            <span className="text-primary-600 dark:text-primary-400 font-extrabold text-xs uppercase tracking-wider block">
              Customer Stories
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight font-brand">
              Community Success Stories
            </h2>
            <div className="w-12 h-1 bg-gradient-to-r from-primary-500 to-indigo-655 mx-auto rounded-full mt-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

            <div className="bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-850 p-8 sm:p-10 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-350 flex flex-col sm:flex-row items-start gap-6 text-left">
              <img
                src="https://i.pravatar.cc/300?img=33"
                alt="Testimonial Buyer"
                className="w-16 h-16 rounded-2xl object-cover flex-shrink-0 border border-slate-100 dark:border-gray-800 shadow"
              />
              <div className="space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                  <CheckCircle2 size={10} /> Buyer Review
                </span>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed italic font-medium">
                  &ldquo;I found a fully-functional study desk for half the retail price! The checkout process with Stripe was smooth, and the seller was extremely helpful.&rdquo;
                </p>
                <h4 className="font-extrabold text-xs text-gray-900 dark:text-white font-brand">- Rakib H., Student</h4>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-855 p-8 sm:p-10 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-350 flex flex-col sm:flex-row items-start gap-6 text-left">
              <img
                src="https://i.pravatar.cc/300?img=32"
                alt="Testimonial Seller"
                className="w-16 h-16 rounded-2xl object-cover flex-shrink-0 border border-slate-100 dark:border-gray-800 shadow"
              />
              <div className="space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 text-[10px] font-black uppercase tracking-wider">
                  <CheckCircle2 size={10} /> Seller Review
                </span>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed italic font-medium">
                  &ldquo;ReSell Hub made it incredibly simple to sell my old DSLR camera. It was sitting in my closet collecting dust, and now it has a new home and I earned extra cash!&rdquo;
                </p>
                <h4 className="font-extrabold text-xs text-gray-900 dark:text-white font-brand">- Nusrat J., Photographer</h4>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 7: SUSTAINABILITY IMPACT */}
      <section className="py-24 bg-white dark:bg-gray-900 transition-colors duration-300 relative">
        <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <div className="space-y-6 text-left relative z-10">
            <div className="inline-flex items-center gap-2 text-success-600 dark:text-success-400 font-black text-sm uppercase tracking-wider">
              <Leaf size={18} className="text-success-500" /> Environmental Mission
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-tight font-brand">
              Promoting Re-use,<br />Minimizing Global Landfill Waste
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Every single second-hand transaction reduces manufacturing demand, saving tons of CO2 emissions and precious global resources. By supporting the circular economy on ReSell Hub, you actively:
            </p>
            <ul className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-gray-400 font-semibold">
              <li className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-success-500 mt-0.5 flex-shrink-0" />
                <span>Extend the lifecycle of electronic and household products, lowering landfill waste.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-success-500 mt-0.5 flex-shrink-0" />
                <span>Decrease global carbon footprints from inter-continental transportation processes.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-success-500 mt-0.5 flex-shrink-0" />
                <span>Provide quality items to local buyers at highly accessible second-hand rates.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-100 dark:border-gray-800 relative h-96 group relative z-10">
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
      <section className="py-20 bg-slate-50/30 dark:bg-gray-950/20 transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-gradient-to-tr from-sky-500 via-sky-400 to-indigo-650 rounded-3xl p-10 sm:p-16 text-center text-white relative overflow-hidden shadow-2xl border border-sky-400/25">
            <div className="absolute w-80 h-80 bg-white/10 rounded-full blur-3xl -top-16 -left-16" />
            <div className="absolute w-80 h-80 bg-white/10 rounded-full blur-3xl -bottom-16 -right-16" />

            <div className="relative z-10 max-w-xl mx-auto space-y-6">
              <div className="w-14 h-14 bg-white/15 rounded-full flex items-center justify-center mx-auto shadow-inner border border-white/10 text-white">
                <Mail size={26} />
              </div>
              <h2 className="text-3xl font-black tracking-tight font-brand">Stay updated with latest bargains!</h2>
              <p className="text-xs sm:text-sm text-sky-100 font-medium leading-relaxed">
                Subscribe to our monthly newsletter and never miss out on second-hand trends and popular local products.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-grow px-5 py-3.5 bg-white/70 placeholder-sky-250 border border-white/50 rounded-xl text-white/5 text-xs outline-none focus:ring-2 focus:ring-white/40"
                />
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-white hover:bg-slate-100 active:scale-95 text-primary-650 font-black text-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow"
                >
                  Subscribe <Send size={12} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* DYNAMIC CATEGORY PREVIEW MODAL (UPGRADED DOUBLE COLUMN LAYOUT) */}
      <AnimatePresence>
        {selectedCat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 dark:bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 26, stiffness: 360 }}
              className="bg-white dark:bg-gray-900 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200/60 dark:border-gray-800 p-0 text-left relative flex flex-col md:flex-row min-h-[480px]"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedCat(null)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 hover:bg-slate-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-all cursor-pointer z-50 shadow-md border border-slate-100 dark:border-gray-700 active:scale-95"
                aria-label="Close modal"
              >
                <X size={15} />
              </button>

              {/* Side Cover Panel */}
              <div className="md:w-5/12 relative h-48 md:h-auto bg-slate-100 dark:bg-gray-850 flex-shrink-0 overflow-hidden group">
                <img
                  src={selectedCat.image}
                  alt={selectedCat.name}
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-950 via-slate-950/50 to-transparent" />

                {/* Float Category Overlay text */}
                <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-6 md:right-6 text-white space-y-1">
                  <div className="p-2.5 bg-primary-600/90 rounded-2xl w-fit flex items-center justify-center mb-2 text-white border border-primary-500/20 shadow-md">
                    {React.createElement(getCategoryIcon(selectedCat.name), { size: 18 })}
                  </div>
                  <h3 className="text-2xl font-black leading-tight font-brand tracking-tight">
                    {selectedCat.name}
                  </h3>
                  <p className="text-[9px] text-primary-200 font-extrabold uppercase tracking-widest leading-none">
                    Vetted Listings Catalog
                  </p>
                </div>
              </div>

              {/* Information & Details Panel */}
              <div className="md:w-7/12 p-6 md:p-8 flex flex-col justify-between space-y-6">

                {/* Subtitle Overview */}
                <div className="space-y-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300 text-[10px] font-black uppercase tracking-wider border border-primary-100/50 dark:border-primary-900/30">
                    <Zap size={10} className="fill-current" /> Escrowed Trading
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    Shop certified second-hand listings under the <strong className="text-slate-800 dark:text-slate-200">{selectedCat.name}</strong> classification. Every transaction is covered under Stripe security guidelines.
                  </p>
                </div>

                {/* Vetting Specs Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-50 dark:bg-gray-800/40 p-3 rounded-2xl border border-slate-100 dark:border-gray-800 text-center">
                    <span className="text-[8px] text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wider block mb-0.5">Listings</span>
                    <p className="text-sm font-black text-primary-600 dark:text-primary-400 font-brand">
                      {selectedCat.productCount || 0}+ Items
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-gray-800/40 p-3 rounded-2xl border border-slate-100 dark:border-gray-800 text-center">
                    <span className="text-[8px] text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wider block mb-0.5">Savings</span>
                    <p className="text-sm font-black text-amber-500 font-brand">
                      Up to 60%
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-gray-800/40 p-3 rounded-2xl border border-slate-100 dark:border-gray-800 text-center">
                    <span className="text-[8px] text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wider block mb-0.5">Sellers</span>
                    <p className="text-sm font-black text-success-600 dark:text-success-400 font-brand">
                      100% Vetted
                    </p>
                  </div>
                </div>

                {/* Highlight Bullet points */}
                <div className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-success-500 flex-shrink-0" />
                    <span>Safe credit-card transactions via Stripe Escrow</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-success-500 flex-shrink-0" />
                    <span>Quality & condition pre-moderated before approval</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-success-500 flex-shrink-0" />
                    <span>Hassle-free shipping or local pickups options</span>
                  </div>
                </div>

                {/* Featured Items from this category */}
                <div className="space-y-2">
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wider block">
                    Featured Highlights
                  </span>
                  <div className="flex gap-3">
                    {getCategoryPopupProducts(selectedCat).map((prod) => (
                      <div
                        key={prod._id}
                        className="flex-1 flex gap-2 items-center bg-slate-50 dark:bg-gray-800/40 p-2 rounded-xl border border-slate-100 dark:border-gray-800 min-w-0"
                      >
                        <img
                          src={prod.images?.[0] || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=100'}
                          alt=""
                          className="w-10 h-10 object-cover rounded-lg flex-shrink-0 border border-slate-100 dark:border-gray-700"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-black text-slate-800 dark:text-white truncate font-brand leading-snug">{prod.title}</p>
                          <div className="flex justify-between items-center text-[9px] text-slate-400 dark:text-slate-500 font-bold mt-0.5">
                            <span className="text-primary-500">${prod.price}</span>
                            <span className="bg-slate-200/60 dark:bg-gray-700 px-1 rounded-sm text-[7px] text-slate-500">{prod.condition}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setSelectedCat(null)}
                    className="flex-1 py-3 border border-slate-200 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-800 font-bold text-xs rounded-xl text-slate-600 dark:text-slate-400 transition cursor-pointer font-brand uppercase tracking-wider active:scale-98"
                  >
                    Close Preview
                  </button>
                  <Link
                    href={`/categories/${selectedCat.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="flex-1"
                    onClick={() => setSelectedCat(null)}
                  >
                    <span className="w-full h-full inline-flex justify-center items-center py-3 bg-gradient-to-r from-primary-600 to-indigo-650 hover:from-primary-750 hover:to-indigo-750 text-white font-extrabold text-xs rounded-xl shadow-md transition hover:shadow-lg hover:shadow-primary-600/10 cursor-pointer font-brand uppercase tracking-wider text-center active:scale-98" style={{ cursor: 'pointer' }}>
                      Explore Category
                    </span>
                  </Link>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
