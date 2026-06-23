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
    <div className="min-h-[90vh] bg-gray-50 dark:bg-gray-950 flex flex-col md:flex-row transition-colors duration-300">
      {/* Mobile Sidebar Header */}
      <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 flex justify-between items-center">
        <span className="font-bold text-sm text-gray-700 dark:text-gray-300">
          Dashboard Panel <span className="text-primary-500 capitalize">({user.role})</span>
        </span>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar Sidebar */}
      <aside
        className={`w-full md:w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-shrink-0 transition-all ${
          sidebarOpen ? 'block' : 'hidden md:block'
        }`}
      >
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
          <img
            src={user.photo || 'https://i.pravatar.cc/300?img=9'}
            alt=""
            className="w-10 h-10 rounded-full object-cover border border-primary-500"
          />
          <div>
            <h4 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">{user.name}</h4>
            <span className="text-[10px] text-gray-500 capitalize bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full font-semibold">
              {user.role}
            </span>
          </div>
        </div>

        {/* View Switcher Toggle for Sellers */}
        {user.role === 'seller' && (
          <div className="px-4 py-3 mx-4 my-3 bg-gray-50 dark:bg-gray-850 rounded-xl border border-gray-100 dark:border-gray-800">
            <label className="text-[9px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-bold block mb-1.5">
              Dashboard View Mode
            </label>
            <div className="grid grid-cols-2 gap-1 p-0.5 bg-gray-200/50 dark:bg-gray-900 rounded-lg">
              <button
                onClick={() => handleViewModeChange('seller')}
                className={`py-1 rounded-md text-[10px] font-bold transition-all ${
                  viewMode === 'seller'
                    ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 shadow-sm border border-gray-100 dark:border-gray-700/50'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Seller
              </button>
              <button
                onClick={() => handleViewModeChange('buyer')}
                className={`py-1 rounded-md text-[10px] font-bold transition-all ${
                  viewMode === 'buyer'
                    ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 shadow-sm border border-gray-100 dark:border-gray-700/50'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Buyer
              </button>
            </div>
          </div>
        )}

        <nav className="p-4 space-y-1.5">
          {menuLinks.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
                isActive(item.path)
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400'
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
          <button
            onClick={() => {
              setSidebarOpen(false);
              logout();
            }}
            className="flex items-center gap-3 w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold text-danger-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main View Container */}
      <main className="flex-grow p-6 sm:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
}
