'use client';

import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Compass, BarChart3, ShieldCheck, Heart, Leaf, Award, Star, Mail, MapPin, Send, ArrowRight, Sparkles, UserCheck, CheckCircle2 } from 'lucide-react';
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
    }, 5000);
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

  return (
    <div className="space-y-0 pb-20 overflow-x-hidden transition-colors duration-300 bg-gray-50">
      
      {/* SECTION 1: FULL-WIDTH BANNER HERO SLIDER WITH OVERLAY */}
      <section className="relative w-full h-[65vh] sm:h-[75vh] md:h-[80vh] overflow-hidden bg-gray-950">
        {/* Background Image Slider with Motion */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentHeroIdx}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0 w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${heroImages[currentHeroIdx]})` }}
            />
          </AnimatePresence>
          {/* Marketplace Gradient Dim Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-900/60 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/40 via-transparent to-transparent z-10" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-20 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-start text-left text-white">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-primary-600/90 text-white shadow-lg backdrop-blur-sm">
              <Sparkles size={12} className="animate-spin text-amber-300" /> Declutter & Save Circular Economy
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] drop-shadow-md">
              Upgrade Smarter. <br />
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-primary-500 bg-clip-text text-transparent">
                Spend Less.
              </span>
            </h1>
            
            <p className="text-sm sm:text-base text-gray-200 font-medium drop-shadow leading-relaxed">
              Join thousands of buyers and sellers trading verified pre-owned electronics, furniture, apparel, and books. Protect the environment and save up to 60%.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 hover:scale-105 active:scale-95 text-white font-bold rounded-xl shadow-lg transition duration-200"
              >
                <Compass size={18} /> Explore Products <ArrowRight size={16} />
              </Link>
              <Link
                href="/dashboard/seller/add-product"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 hover:scale-105 active:scale-95 text-white font-bold rounded-xl shadow-lg border border-white/20 backdrop-blur-sm transition duration-200"
              >
                <ShoppingCart size={18} /> Start Selling
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Bounded Stats Strip inside Hero Bottom */}
        <div className="absolute bottom-4 sm:bottom-8 left-0 right-0 z-20 hidden md:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-black/50 backdrop-blur-md rounded-2xl border border-white/10 px-8 py-4 grid grid-cols-4 gap-6 text-white text-center">
              <div>
                <p className="text-xl sm:text-2xl font-black text-amber-400">{stats.products}+</p>
                <p className="text-[10px] uppercase tracking-wider text-gray-300 font-bold">Listings Approved</p>
              </div>
              <div className="border-l border-white/10">
                <p className="text-xl sm:text-2xl font-black text-amber-400">{stats.sellers}+</p>
                <p className="text-[10px] uppercase tracking-wider text-gray-300 font-bold">Active Sellers</p>
              </div>
              <div className="border-l border-white/10">
                <p className="text-xl sm:text-2xl font-black text-amber-400">{stats.buyers}+</p>
                <p className="text-[10px] uppercase tracking-wider text-gray-300 font-bold">Verified Buyers</p>
              </div>
              <div className="border-l border-white/10">
                <p className="text-xl sm:text-2xl font-black text-amber-400">{stats.orders}+</p>
                <p className="text-[10px] uppercase tracking-wider text-gray-300 font-bold">Success Deals</p>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Slider Dot Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-25 bg-black/40 backdrop-blur px-3 py-1.5 rounded-full md:hidden">
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentHeroIdx(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentHeroIdx === idx ? 'bg-white w-4' : 'bg-white/40'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* SECTION 2: POPULAR CATEGORIES */}
      <section id="categories" className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 text-left">
            <div>
              <span className="text-primary-600 font-bold text-xs uppercase tracking-wider block mb-1">Top Classifications</span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                Shop By Category
              </h2>
            </div>
            <Link href="/categories" className="mt-2 sm:mt-0 text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View All Categories <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {categories.length > 0 ? (
              categories.slice(0, 6).map((cat) => (
                <Link
                  key={cat._id}
                  href={`/categories/${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="group bg-gray-50 border border-gray-150 p-4 rounded-2xl text-center shadow-sm hover:shadow-md hover:border-primary-500 hover:-translate-y-1 transition duration-200 flex flex-col items-center space-y-3"
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-200 bg-white group-hover:border-primary-500 transition duration-200">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-200"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-gray-900 group-hover:text-primary-600 transition">
                      {cat.name}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-bold mt-0.5">
                      {cat.productCount || 0} Products
                    </p>
                  </div>
                </Link>
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
                return (
                  <Link
                    key={name}
                    href={`/categories/${name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="group bg-gray-50 border border-gray-150 p-4 rounded-2xl text-center shadow-sm hover:shadow-md hover:border-primary-500 hover:-translate-y-1 transition duration-200 flex flex-col items-center space-y-3"
                  >
                    <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-200 bg-white group-hover:border-primary-500 transition duration-200">
                      <img
                        src={dummyImages[i]}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-200"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs sm:text-sm text-gray-900 group-hover:text-primary-600 transition">
                        {name}
                      </h3>
                      <p className="text-[10px] text-gray-400 font-bold mt-0.5">Explore</p>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* SECTION 3: FEATURED PRODUCTS WITH PREMIUM MARKETPLACE CARDS */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-12">
            <span className="text-primary-600 font-bold text-xs uppercase tracking-wider block">Hot Picks</span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Featured Active Listings
            </h2>
            <div className="w-12 h-1 bg-primary-600 mx-auto rounded-full mt-2" />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="border border-gray-200 rounded-3xl p-4 bg-white space-y-4">
                  <div className="skeleton-shimmer h-48 rounded-2xl bg-gray-100"></div>
                  <div className="skeleton-shimmer h-6 rounded w-3/4 bg-gray-100"></div>
                  <div className="skeleton-shimmer h-4 rounded w-1/2 bg-gray-100"></div>
                  <div className="skeleton-shimmer h-10 rounded bg-gray-100"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              {featured.length > 0 ? (
                featured.slice(0, 6).map((product) => (
                  <div
                    key={product._id}
                    className="bg-white border border-gray-200/80 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-[450px] overflow-hidden group text-left relative"
                  >
                    {/* Badges and Image */}
                    <div className="relative h-52 overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={product.images[0] || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=300'}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Badge Overlays */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                        <span className="bg-primary-600/90 text-white text-[9px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider shadow">
                          {product.condition}
                        </span>
                        <span className="bg-indigo-600/90 text-white text-[9px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider shadow">
                          {product.category}
                        </span>
                      </div>
                      
                      {/* Seller Verification Badge */}
                      {product.sellerInfo?.verified && (
                        <div className="absolute top-3 right-3 bg-success-500 text-white rounded-full p-1 border-2 border-white shadow-lg" title="Verified Seller">
                          <ShieldCheck size={14} className="text-white" fill="currentColor" />
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

                      {/* Card Footer Actions */}
                      <div className="border-t border-gray-100 pt-3 mt-4 space-y-3">
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
                        <div className="grid grid-cols-5 gap-1.5 pt-1.5">
                          <button
                            onClick={() => toggleWishlist(product._id)}
                            className={`col-span-1 rounded-xl border flex items-center justify-center transition shadow-sm py-2 hover:scale-105 active:scale-95 ${
                              wishlist.includes(product._id)
                                ? 'bg-danger-50 border-danger-300 text-danger-550'
                                : 'border-gray-200 text-gray-400 hover:border-danger-400 hover:text-danger-500'
                            }`}
                            title="Add to Wishlist"
                          >
                            <Heart size={14} fill={wishlist.includes(product._id) ? 'currentColor' : 'none'} />
                          </button>
                          
                          <Link href={`/products/${product._id}`} className="col-span-2">
                            <span className="w-full h-full inline-flex items-center justify-center px-2 py-2 border border-gray-200 hover:border-primary-500 hover:text-primary-600 font-bold text-[10px] rounded-xl text-gray-700 shadow-sm transition hover:scale-105 active:scale-95 cursor-pointer">
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
                <div className="col-span-full py-20 text-center bg-white border border-gray-200 rounded-3xl space-y-2">
                  <p className="text-sm text-gray-500 font-semibold">No featured listings found.</p>
                  <p className="text-xs text-gray-400">All newly registered items are undergoing admin vetting.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* SECTION 4: MARKETPLACE MOBILE-FRIENDLY STATISTICS */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-slate-900 text-white relative overflow-hidden">
        {/* Subtle geometric grid backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto space-y-3 mb-12">
            <span className="text-yellow-400 font-bold text-xs uppercase tracking-wider block">Platform Scope</span>
            <h2 className="text-2xl sm:text-3xl font-black">ReSell Hub In Figures</h2>
            <p className="text-xs text-gray-300">Providing an automated, escrow-backed marketplace for second-hand transactions</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-amber-400">{stats.products}+</div>
              <p className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-400 font-bold">Total Products</p>
            </div>
            <div className="space-y-2 border-l border-gray-800">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-amber-400">{stats.sellers}+</div>
              <p className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-400 font-bold">Total Sellers</p>
            </div>
            <div className="space-y-2 border-l border-gray-800">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-amber-400">{stats.buyers}+</div>
              <p className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-400 font-bold">Total Buyers</p>
            </div>
            <div className="space-y-2 border-l border-gray-800">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-amber-400">{stats.orders}+</div>
              <p className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-400 font-bold">Completed Orders</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: TRUSTED SELLERS SHOWCASE */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-12">
            <span className="text-primary-600 font-bold text-xs uppercase tracking-wider block">Top Ranked</span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Trusted Sellers Showcase
            </h2>
            <div className="w-12 h-1 bg-primary-600 mx-auto rounded-full mt-2" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { name: 'Anisul Islam', join: 'September 2024', rating: 4.9, img: 'https://i.pravatar.cc/300?img=60' },
              { name: 'Riya Sengupta', join: 'January 2025', rating: 4.5, img: 'https://i.pravatar.cc/300?img=47' },
              { name: 'Imran Khan', join: 'June 2024', rating: 5.0, img: 'https://i.pravatar.cc/300?img=12' }
            ].map((seller, idx) => (
              <div
                key={idx}
                className="bg-gray-50 border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition duration-200 text-center space-y-4"
              >
                <div className="relative inline-block">
                  <img
                    src={seller.img}
                    alt={seller.name}
                    className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-primary-500 shadow-sm"
                  />
                  <span className="absolute bottom-0 right-0 bg-success-500 text-white rounded-full p-1 border-2 border-white shadow-md">
                    <UserCheck size={12} />
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-gray-900">{seller.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Joined {seller.join}</p>
                </div>
                <div className="flex justify-center items-center gap-1 text-sm text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill={i < Math.floor(seller.rating) ? 'currentColor' : 'none'} className="text-amber-500" />
                  ))}
                  <span className="text-xs font-bold text-gray-600 ml-1">({seller.rating}/5.0)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: SUCCESS STORIES */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-12">
            <span className="text-primary-600 font-bold text-xs uppercase tracking-wider block">Customer Stories</span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Community Success Stories
            </h2>
            <div className="w-12 h-1 bg-primary-600 mx-auto rounded-full mt-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-gray-200 p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-md transition flex flex-col sm:flex-row items-start gap-4 text-left">
              <img
                src="https://i.pravatar.cc/300?img=33"
                alt="Testimonial Buyer"
                className="w-16 h-16 rounded-2xl object-cover flex-shrink-0 border border-gray-100"
              />
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-success-50 text-success-600 text-[10px] font-bold uppercase tracking-wider">
                  <CheckCircle2 size={10} /> Buyer Review
                </span>
                <p className="text-sm text-gray-600 leading-relaxed italic">
                  &ldquo;I found a fully-functional study desk for half the retail price! The checkout process with Stripe was smooth, and the seller was extremely helpful.&rdquo;
                </p>
                <h4 className="font-bold text-xs text-gray-900">- Rakib H., Student</h4>
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-md transition flex flex-col sm:flex-row items-start gap-4 text-left">
              <img
                src="https://i.pravatar.cc/300?img=32"
                alt="Testimonial Seller"
                className="w-16 h-16 rounded-2xl object-cover flex-shrink-0 border border-gray-100"
              />
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-50 text-primary-600 text-[10px] font-bold uppercase tracking-wider">
                  <CheckCircle2 size={10} /> Seller Review
                </span>
                <p className="text-sm text-gray-600 leading-relaxed italic">
                  &ldquo;ReSell Hub made it incredibly simple to sell my old DSLR camera. It was sitting in my closet collecting dust, and now it has a new home and I earned extra cash!&rdquo;
                </p>
                <h4 className="font-bold text-xs text-gray-900">- Nusrat J., Photographer</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: SUSTAINABILITY IMPACT */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-left">
            <div className="inline-flex items-center gap-2 text-success-600 font-bold text-sm uppercase tracking-wider">
              <Leaf size={18} className="text-success-500 animate-pulse" /> Environmental Mission
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">
              Promoting Re-use, <br />Minimizing Landfill Waste
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Every single second-hand transaction reduces manufacturing demand, saving tons of CO2 emissions and precious global resources. By supporting the circular economy on ReSell Hub, you actively:
            </p>
            <ul className="space-y-3.5 text-xs sm:text-sm text-gray-600 font-medium">
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-success-500 flex-shrink-0" />
                <span>Extend the lifecycle of products, lowering waste accumulation.</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-success-500 flex-shrink-0" />
                <span>Decrease global transport carbon footprints from factory to consumers.</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-success-500 flex-shrink-0" />
                <span>Provide items to buyers at accessible, reduced second-hand rates.</span>
              </li>
            </ul>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-lg border border-gray-150 relative h-80 group">
            <img
              src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=600"
              alt="Sustainability Earth Green"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
          </div>
        </div>
      </section>

      {/* SECTION 8: NEWSLETTER */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-gradient-to-tr from-primary-600 to-indigo-700 rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-xl">
            <div className="absolute w-64 h-64 bg-white/10 rounded-full blur-3xl -top-12 -left-12" />
            <div className="absolute w-64 h-64 bg-white/10 rounded-full blur-3xl -bottom-12 -right-12" />
            
            <div className="relative z-10 max-w-xl mx-auto space-y-6">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Mail size={24} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Stay updated with latest bargains!</h2>
              <p className="text-xs sm:text-sm text-primary-100 font-medium">
                Subscribe to our monthly newsletter and never miss out on second-hand trends and popular local products.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-grow px-4 py-3 bg-white/10 placeholder-primary-200 border border-white/20 rounded-xl text-white text-xs outline-none focus:ring-1 focus:ring-white/40"
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-white hover:bg-gray-100 text-primary-600 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow"
                >
                  Subscribe <Send size={12} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
