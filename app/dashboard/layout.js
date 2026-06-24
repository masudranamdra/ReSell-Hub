'use client';

import React, { useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthContext } from '../../components/Providers';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  LayoutDashboard, ShoppingBag, Heart, CreditCard, User, ShoppingCart,
  Layers, BarChart3, Users, CheckSquare, Eye, ShieldAlert, LogOut, Loader2, Menu, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token, authLoading, logout } = useContext(AuthContext);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState('seller');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('dashboardViewMode');
      if (savedMode) {
        setViewMode(savedMode);
      }
    }
  }, []);

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dashboardViewMode', mode);
    }
    if (mode === 'seller') {
      router.push('/dashboard/seller');
    } else {
      router.push('/dashboard/buyer');
    }
  };

  // Guards the dashboard routes against unauthorized access
  useEffect(() => {
    if (authLoading) return;
    if (!token || !user) {
      router.push('/login');
      return;
    }

    const path = pathname;
    
    // Admin-only paths
    const adminOnlyPaths = [
      '/dashboard/admin',
      '/dashboard/users',
      '/dashboard/manage-products',
      '/dashboard/categories',
      '/dashboard/platform-analytics',
      '/dashboard/all-payments'
    ];
    
    // Seller-only paths (Admin also allowed)
    const sellerOnlyPaths = [
      '/dashboard/seller',
      '/dashboard/seller/add-product',
      '/dashboard/my-products',
      '/dashboard/manage-orders',
      '/dashboard/sales-analytics'
    ];

    // Buyer-only paths (Admin also allowed)
    const buyerOnlyPaths = [
      '/dashboard/buyer',
      '/dashboard/orders',
      '/dashboard/wishlist',
      '/dashboard/payments'
    ];

    if (adminOnlyPaths.some(p => path.startsWith(p)) && user.role !== 'admin') {
      toast.error('Access Denied. You are not authorized as Admin.');
      logout();
      router.push('/login');
    } else if (sellerOnlyPaths.some(p => path.startsWith(p)) && user.role !== 'seller' && user.role !== 'admin') {
      if (path === '/dashboard/seller/add-product') {
        // Allow buyers to access add-product page to see approval warning
      } else {
        toast.error('Access Denied. You do not have Seller permissions.');
        router.push('/dashboard/buyer');
      }
    } else if (buyerOnlyPaths.some(p => path.startsWith(p)) && user.role !== 'buyer' && user.role !== 'seller' && user.role !== 'admin') {
      toast.error('Access Denied. You do not have Buyer permissions.');
      logout();
      router.push('/login');
    }
  }, [authLoading, token, user, pathname, router, logout]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loader2 className="animate-spin text-primary-500 mb-2" size={40} />
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Securing session persistence...</p>
      </div>
    );
  }

  if (!user) return null;

  // Sidebar Links based on Roles
  const getSidebarLinks = () => {
    if (user.role === 'admin') {
      return [
        { name: 'Dashboard Overview', path: '/dashboard/admin', icon: <LayoutDashboard size={18} /> },
        { name: 'Manage Users', path: '/dashboard/users', icon: <Users size={18} /> },
        { name: 'Manage Products', path: '/dashboard/manage-products', icon: <Layers size={18} /> },
        { name: 'Category CRUD', path: '/dashboard/categories', icon: <CheckSquare size={18} /> },
        { name: 'Platform Analytics', path: '/dashboard/platform-analytics', icon: <BarChart3 size={18} /> },
        { name: 'Payments Audit', path: '/dashboard/all-payments', icon: <CreditCard size={18} /> },
        { name: 'Profile Settings', path: '/dashboard/profile', icon: <User size={18} /> }
      ];
    }

    if (user.role === 'seller') {
      if (viewMode === 'buyer') {
        return [
          { name: 'Dashboard Overview', path: '/dashboard/buyer', icon: <LayoutDashboard size={18} /> },
          { name: 'My Orders', path: '/dashboard/orders', icon: <ShoppingBag size={18} /> },
          { name: 'Wishlist', path: '/dashboard/wishlist', icon: <Heart size={18} /> },
          { name: 'Payment History', path: '/dashboard/payments', icon: <CreditCard size={18} /> },
          { name: 'Profile Settings', path: '/dashboard/profile', icon: <User size={18} /> }
        ];
      } else {
        return [
          { name: 'Dashboard Overview', path: '/dashboard/seller', icon: <LayoutDashboard size={18} /> },
          { name: 'Add Product', path: '/dashboard/seller/add-product', icon: <ShoppingCart size={18} /> },
          { name: 'My Products', path: '/dashboard/my-products', icon: <Layers size={18} /> },
          { name: 'Manage Orders', path: '/dashboard/manage-orders', icon: <ShoppingBag size={18} /> },
          { name: 'Sales Analytics', path: '/dashboard/sales-analytics', icon: <BarChart3 size={18} /> },
          { name: 'Profile Settings', path: '/dashboard/profile', icon: <User size={18} /> }
        ];
      }
    }

    // Default: buyer role
    return [
      { name: 'Dashboard Overview', path: '/dashboard/buyer', icon: <LayoutDashboard size={18} /> },
      { name: 'My Orders', path: '/dashboard/orders', icon: <ShoppingBag size={18} /> },
      { name: 'Wishlist', path: '/dashboard/wishlist', icon: <Heart size={18} /> },
      { name: 'Payment History', path: '/dashboard/payments', icon: <CreditCard size={18} /> },
      { name: 'Profile Settings', path: '/dashboard/profile', icon: <User size={18} /> }
    ];
  };

  const menuLinks = getSidebarLinks();
  const isActive = (path) => pathname === path;

  return (
    <div className="min-h-[90vh] bg-slate-50/50 dark:bg-gray-950 flex flex-col md:flex-row transition-colors duration-300">
      {/* Mobile Sidebar Header */}
      <div className="md:hidden bg-white dark:bg-gray-900 border-b border-slate-100 dark:border-gray-800 p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <img
            src="https://i.ibb.co.com/BV1jk40k/faiz00-s-7207516.png"
            alt="Logo"
            className="h-8 w-auto object-contain"
          />
          <span className="font-extrabold text-xs text-gray-900 dark:text-white capitalize bg-primary-50 dark:bg-primary-950/30 px-2.5 py-0.5 rounded-full">
            {user.role} Hub
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 border border-slate-200 dark:border-gray-800 rounded-xl text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`w-full md:w-64 bg-white dark:bg-gray-900 border-r border-slate-100 dark:border-gray-800 flex-shrink-0 transition-all duration-300 shadow-sm md:shadow-none flex flex-col ${
          sidebarOpen ? 'block' : 'hidden md:flex'
        }`}
      >
        {/* User Card */}
        <div className="p-6 border-b border-slate-100 dark:border-gray-800 flex items-center gap-3 bg-gradient-to-br from-slate-50/50 to-transparent dark:from-gray-900/50 dark:to-transparent">
          <div className="relative">
            <img
              src={user.photo || 'https://i.pravatar.cc/300?img=9'}
              alt={user.name}
              className="w-11 h-11 rounded-full object-cover border-2 border-primary-500 shadow-sm"
              onError={(e) => { e.target.src = 'https://i.pravatar.cc/300?img=9'; }}
            />
            {user.verified && (
              <span className="absolute bottom-0 right-0 bg-success-500 text-white rounded-full p-0.5 border border-white dark:border-gray-900 shadow">
                <CheckSquare size={8} />
              </span>
            )}
          </div>
          <div className="min-w-0 flex-grow">
            <h4 className="font-extrabold text-sm text-gray-900 dark:text-white truncate" title={user.name}>
              {user.name}
            </h4>
            <span className="text-[9px] text-primary-600 dark:text-primary-400 font-extrabold uppercase tracking-wider block mt-0.5">
              {user.role} Account
            </span>
          </div>
        </div>

        {/* View Switcher for Sellers */}
        {user.role === 'seller' && (
          <div className="px-4 py-3 mx-4 my-4 bg-slate-50 dark:bg-gray-950 rounded-2xl border border-slate-100 dark:border-gray-800">
            <label className="text-[8px] uppercase tracking-wider text-slate-400 dark:text-gray-500 font-black block mb-2">
              Switch Workspace Mode
            </label>
            <div className="grid grid-cols-2 gap-1 p-1 bg-slate-200/50 dark:bg-gray-900 rounded-xl">
              <button
                onClick={() => handleViewModeChange('seller')}
                className={`py-1.5 rounded-lg text-[10px] font-black tracking-wide transition-all cursor-pointer ${
                  viewMode === 'seller'
                    ? 'bg-white dark:bg-gray-800 text-primary-650 dark:text-primary-400 shadow-sm border border-slate-100 dark:border-gray-700/50'
                    : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-slate-350'
                }`}
              >
                Seller
              </button>
              <button
                onClick={() => handleViewModeChange('buyer')}
                className={`py-1.5 rounded-lg text-[10px] font-black tracking-wide transition-all cursor-pointer ${
                  viewMode === 'buyer'
                    ? 'bg-white dark:bg-gray-800 text-primary-650 dark:text-primary-400 shadow-sm border border-slate-100 dark:border-gray-700/50'
                    : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-slate-350'
                }`}
              >
                Buyer
              </button>
            </div>
          </div>
        )}

        {/* Navigation links */}
        <nav className="p-4 space-y-1.5 flex-grow overflow-y-auto">
          {menuLinks.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                href={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all relative ${
                  active
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-500/10'
                    : 'text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-850 hover:text-primary-650 dark:hover:text-primary-450'
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span className="truncate">{item.name}</span>
                {active && (
                  <motion.span
                    layoutId="sidebarActive"
                    className="absolute left-0 w-1.5 h-6 bg-amber-400 rounded-r-md"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Bottom Button */}
        <div className="p-4 mt-auto border-t border-slate-100 dark:border-gray-850">
          <button
            onClick={() => {
              setSidebarOpen(false);
              logout();
            }}
            className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer"
          >
            <LogOut size={16} />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>

      {/* Main View Container */}
      <main className="flex-grow p-6 sm:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
