'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Compass, BarChart3, ShieldCheck, Heart, Leaf, Award, Star } from 'lucide-react';
import { API_URL } from '../components/Providers';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    products: 48,
    sellers: 15,
    buyers: 32,
    orders: 26
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch featured products
        const prodRes = await fetch(`${API_URL}/api/products?limit=3`);
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

  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="space-y-20 pb-20 overflow-x-hidden">
      {/* SECTION 1: HERO BANNER */}
      <section className="relative min-h-[85vh] flex items-center bg-gradient-to-b from-primary-50 via-white to-white dark:from-gray-900 dark:via-gray-950 dark:to-gray-950 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          {/* Animated Hero Text */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-6 text-left"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-700 dark:bg-primary-950 dark:text-primary-300">
              <Award size={12} /> Second-Hand Marketplace Platform
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-950 dark:text-white leading-[1.1] font-sans">
              Give Unused Items A <br />
              <span className="bg-gradient-to-r from-primary-600 to-indigo-500 bg-clip-text text-transparent">
                Second Life
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl">
              Buy and sell pre-owned goods securely. Save money, declutter your home, and protect the planet by keeping usable goods out of landfills.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition duration-200"
              >
                <Compass size={18} /> Browse Products
              </Link>
              <Link
                href="/dashboard/add-product"
                className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 hover:border-primary-500 text-gray-700 dark:text-gray-300 dark:border-gray-700 hover:text-primary-600 dark:hover:text-primary-400 font-semibold rounded-xl transition duration-200"
              >
                <ShoppingCart size={18} /> Start Selling
              </Link>
            </div>

            {/* Quick Hero stats */}
            <div className="grid grid-cols-3 gap-6 border-t border-gray-200 dark:border-gray-800 pt-8 mt-6">
              <div>
                <p className="text-2xl font-bold text-gray-950 dark:text-white">10k+</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Listed Items</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-950 dark:text-white">5k+</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Verified Sellers</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-950 dark:text-white">15k+</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Happy Buyers</p>
              </div>
            </div>
          </motion.div>

          {/* Animated Hero Banner Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center items-center"
          >
            {/* Ambient gradients */}
            <div className="absolute w-72 h-72 bg-primary-500/20 rounded-full blur-3xl -top-12 -left-12"></div>
            <div className="absolute w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl -bottom-12 -right-12"></div>

            <div className="relative glass p-6 rounded-3xl shadow-2xl border border-white/20 max-w-md w-full">
              <div className="relative rounded-2xl overflow-hidden shadow-lg bg-gray-100 dark:bg-gray-800">
                <img
                  src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600&auto=format&fit=crop"
                  alt="Marketplace Hero Showcase"
                  className="w-full h-64 object-cover transform hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-success-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  Like New
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">Premium Mechanical Keyboard</h3>
                  <span className="text-primary-600 dark:text-primary-400 font-extrabold text-xl">$85.00</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <MapPinIcon /> Dhaka, Bangladesh
                </p>
                <div className="flex items-center gap-2 border-t border-gray-100 dark:border-gray-800 pt-3 mt-2">
                  <img
                    src="https://i.pravatar.cc/300?img=11"
                    alt="Seller avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="text-left">
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">Sarah K. (Verified)</p>
                    <div className="flex items-center text-[10px] text-amber-500">
                      <Star size={10} fill="currentColor" />
                      <Star size={10} fill="currentColor" />
                      <Star size={10} fill="currentColor" />
                      <Star size={10} fill="currentColor" />
                      <Star size={10} fill="currentColor" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-3xl font-extrabold text-gray-950 dark:text-white tracking-tight">
            Featured Products
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Discover the latest listings added by trusted community sellers.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="border border-gray-200 dark:border-gray-800 rounded-2xl p-4 space-y-4">
                <div className="skeleton-shimmer h-48 rounded-xl"></div>
                <div className="skeleton-shimmer h-6 rounded w-3/4"></div>
                <div className="skeleton-shimmer h-4 rounded w-1/2"></div>
                <div className="skeleton-shimmer h-10 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {featured.length > 0 ? (
              featured.map((product) => (
                <motion.div
                  key={product._id}
                  variants={itemVariants}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col h-full"
                >
                  <div className="card-image-wrapper">
                    <img src={product.images[0]} alt={product.title} />
                    <span className="absolute top-3 left-3 bg-primary-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full capitalize">
                      {product.condition}
                    </span>
                  </div>

                  <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1">
                          {product.title}
                        </h3>
                        <span className="text-primary-600 dark:text-primary-400 font-extrabold text-lg flex-shrink-0">
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
                          Seller: {product.sellerInfo?.name || 'User'}
                        </p>
                        <p className="text-[10px]">{product.location}</p>
                      </div>
                      <Link
                        href={`/products/${product._id}`}
                        className="px-3.5 py-2 bg-gray-100 hover:bg-primary-600 hover:text-white dark:bg-gray-800 dark:hover:bg-primary-500 text-gray-800 dark:text-gray-200 text-xs font-semibold rounded-lg transition"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400">
                No featured products listed yet. Check back soon!
              </div>
            )}
          </motion.div>
        )}
      </section>

      {/* SECTION 3: POPULAR CATEGORIES */}
      <section id="categories" className="bg-gray-50 dark:bg-gray-900/40 py-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-10">
            <h2 className="text-3xl font-extrabold text-gray-950 dark:text-white tracking-tight">
              Popular Categories
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Browse listings by curated categories to find exactly what you need.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.length > 0 ? (
              categories.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/products?category=${encodeURIComponent(cat.name)}`}
                  className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl text-center shadow-sm hover:shadow-md transition hover:-translate-y-1 duration-200 flex flex-col items-center space-y-3"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 dark:border-gray-800 group-hover:border-primary-500 transition"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-primary-500 transition">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      {cat.productCount || 0} Products
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              // Boilerplate standard categories if DB has not populated yet
              ['Electronics', 'Furniture', 'Vehicles', 'Fashion', 'Mobile Phones'].map((name, i) => {
                const images = [
                  'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=200',
                  'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=200',
                  'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=200',
                  'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=200',
                  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=200'
                ];
                return (
                  <Link
                    key={name}
                    href={`/products?category=${encodeURIComponent(name)}`}
                    className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl text-center shadow-sm hover:shadow-md transition hover:-translate-y-1 duration-200 flex flex-col items-center space-y-3"
                  >
                    <img
                      src={images[i]}
                      alt={name}
                      className="w-16 h-16 rounded-full object-cover border border-gray-100 dark:border-gray-800"
                    />
                    <div>
                      <h3 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-primary-500 transition">
                        {name}
                      </h3>
                      <p className="text-xs text-gray-400 dark:text-gray-500">View Products</p>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* SECTION 4: SUCCESS STORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-3xl font-extrabold text-gray-950 dark:text-white tracking-tight">
            Success Stories
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Read how ReSell Hub is helping our community trade and promote reuse.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Story 1 */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm flex items-start gap-4">
            <img
              src="https://i.pravatar.cc/300?img=33"
              alt="Testimonial Buyer"
              className="w-16 h-16 rounded-2xl object-cover flex-shrink-0"
            />
            <div className="space-y-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-success-50 text-success-600 dark:bg-success-950/30 dark:text-success-400">
                Buyer Story
              </span>
              <p className="text-sm italic text-gray-600 dark:text-gray-300">
                &ldquo;I found a fully-functional study desk for half the retail price! The checkout process with Stripe was smooth, and the seller was extremely helpful.&rdquo;
              </p>
              <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200">- Rakib H., Student</h4>
            </div>
          </div>

          {/* Story 2 */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm flex items-start gap-4">
            <img
              src="https://i.pravatar.cc/300?img=32"
              alt="Testimonial Seller"
              className="w-16 h-16 rounded-2xl object-cover flex-shrink-0"
            />
            <div className="space-y-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary-50 text-primary-600 dark:bg-primary-950/30 dark:text-primary-400">
                Seller Story
              </span>
              <p className="text-sm italic text-gray-600 dark:text-gray-300">
                &ldquo;ReSell Hub made it incredibly simple to sell my old DSLR camera. It was sitting in my closet collecting dust, and now it has a new home and I earned extra cash!&rdquo;
              </p>
              <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200">- Nusrat J., Photographer</h4>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: MARKETPLACE STATISTICS */}
      <section className="bg-primary-600 dark:bg-primary-950 py-12 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            <div className="space-y-2">
              <p className="text-4xl sm:text-5xl font-extrabold">{stats.products}+</p>
              <p className="text-xs uppercase tracking-wider text-primary-200">Total Products</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl sm:text-5xl font-extrabold">{stats.sellers}+</p>
              <p className="text-xs uppercase tracking-wider text-primary-200">Total Sellers</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl sm:text-5xl font-extrabold">{stats.buyers}+</p>
              <p className="text-xs uppercase tracking-wider text-primary-200">Total Buyers</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl sm:text-5xl font-extrabold">{stats.orders}+</p>
              <p className="text-xs uppercase tracking-wider text-primary-200">Completed Orders</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 6: SUSTAINABILITY IMPACT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 text-success-600 dark:text-success-400 font-semibold text-sm">
            <Leaf size={18} /> Our Carbon Footprint Mission
          </div>
          <h2 className="text-3xl font-extrabold text-gray-950 dark:text-white tracking-tight">
            Promoting Re-use, Minimizing Waste
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-400">
            Every second-hand transaction has a direct positive impact on our environment. Manufacturing new items consumes large amounts of energy, water, and raw materials. By trading existing products, we:
          </p>
          <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-success-500"></span>
              Reduce landfill mass by keeping items in circulation.
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-success-500"></span>
              Lower CO2 emissions related to heavy manufacturing and logistics.
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-success-500"></span>
              Foster a local circular economy of shared value.
            </li>
          </ul>
        </div>
        <div className="rounded-3xl overflow-hidden shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=600"
            alt="Sustainability Earth Green"
            className="w-full h-80 object-cover"
          />
        </div>
      </section>

      {/* SECTION 7: TRUSTED SELLERS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-3xl font-extrabold text-gray-950 dark:text-white tracking-tight">
            Trusted Sellers Showcase
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Purchase with absolute peace of mind from our verified, top-rated sellers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Seller 1 */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm text-center space-y-4">
            <div className="relative inline-block">
              <img
                src="https://i.pravatar.cc/300?img=60"
                alt="Seller Profile"
                className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-primary-500"
              />
              <span className="absolute bottom-0 right-0 bg-success-500 text-white rounded-full p-1 border-2 border-white dark:border-gray-900">
                <ShieldCheck size={14} />
              </span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Anisul Islam</h3>
              <p className="text-xs text-gray-400">Joined September 2024</p>
            </div>
            <div className="flex justify-center items-center gap-1 text-sm text-amber-500">
              <Star size={14} fill="currentColor" />
              <Star size={14} fill="currentColor" />
              <Star size={14} fill="currentColor" />
              <Star size={14} fill="currentColor" />
              <Star size={14} fill="currentColor" />
              <span className="text-xs text-gray-500 ml-1">(4.9/5)</span>
            </div>
          </div>

          {/* Seller 2 */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm text-center space-y-4">
            <div className="relative inline-block">
              <img
                src="https://i.pravatar.cc/300?img=47"
                alt="Seller Profile"
                className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-primary-500"
              />
              <span className="absolute bottom-0 right-0 bg-success-500 text-white rounded-full p-1 border-2 border-white dark:border-gray-900">
                <ShieldCheck size={14} />
              </span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Riya Sengupta</h3>
              <p className="text-xs text-gray-400">Joined January 2025</p>
            </div>
            <div className="flex justify-center items-center gap-1 text-sm text-amber-500">
              <Star size={14} fill="currentColor" />
              <Star size={14} fill="currentColor" />
              <Star size={14} fill="currentColor" />
              <Star size={14} fill="currentColor" />
              <span className="text-gray-300"><Star size={14} /></span>
              <span className="text-xs text-gray-500 ml-1">(4.2/5)</span>
            </div>
          </div>

          {/* Seller 3 */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm text-center space-y-4">
            <div className="relative inline-block">
              <img
                src="https://i.pravatar.cc/300?img=12"
                alt="Seller Profile"
                className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-primary-500"
              />
              <span className="absolute bottom-0 right-0 bg-success-500 text-white rounded-full p-1 border-2 border-white dark:border-gray-900">
                <ShieldCheck size={14} />
              </span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Imran Khan</h3>
              <p className="text-xs text-gray-400">Joined June 2024</p>
            </div>
            <div className="flex justify-center items-center gap-1 text-sm text-amber-500">
              <Star size={14} fill="currentColor" />
              <Star size={14} fill="currentColor" />
              <Star size={14} fill="currentColor" />
              <Star size={14} fill="currentColor" />
              <Star size={14} fill="currentColor" />
              <span className="text-xs text-gray-500 ml-1">(5.0/5)</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Simple icons
function MapPinIcon() {
  return (
    <svg className="w-3 h-3 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
