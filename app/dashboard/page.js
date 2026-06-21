'use client';

import React, { useContext, useEffect, useState } from 'react';
import { AuthContext, API_URL } from '../../components/Providers';
import { ShoppingBag, Heart, CreditCard, DollarSign, Layers, Users, Star, AlertTriangle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const { user, token } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Buyer Specific states
  const [buyerOrders, setBuyerOrders] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    if (!token || !user) return;

    async function loadStats() {
      try {
        if (user.role === 'admin') {
          const res = await fetch(`${API_URL}/api/analytics/admin`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.success) setStats(data.metrics);
        } else if (user.role === 'seller') {
          const res = await fetch(`${API_URL}/api/analytics/seller`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.success) setStats(data.metrics);
        } else {
          // Buyer: fetch orders and wishlist count
          const ordersRes = await fetch(`${API_URL}/api/orders/buyer`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const ordersData = await ordersRes.json();
          if (ordersData.success) setBuyerOrders(ordersData.orders);

          const wishRes = await fetch(`${API_URL}/api/users/wishlist`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const wishData = await wishRes.json();
          if (wishData.success) setWishlistCount(wishData.wishlist.length);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [user, token]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="bg-gray-200 dark:bg-gray-800 h-28 rounded-2xl skeleton-shimmer"></div>
        ))}
      </div>
    );
  }

  // ==========================================
  // RENDER BUYER VIEW
  // ==========================================
  if (user.role === 'buyer') {
    const completedOrders = buyerOrders.filter((o) => o.orderStatus === 'delivered');
    const recentPurchase = buyerOrders[0];

    return (
      <div className="space-y-8 animate-fade-in">
        {/* Welcome header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-950 dark:text-white">Buyer Dashboard</h2>
            <p className="text-xs text-gray-500">Track purchases, saved products, and profile settings</p>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3.5 bg-primary-100 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 rounded-xl">
              <ShoppingBag size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase">Total Orders</p>
              <h3 className="text-xl font-bold text-gray-950 dark:text-white">{buyerOrders.length}</h3>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3.5 bg-danger-50 text-danger-500 dark:bg-danger-950/20 rounded-xl">
              <Heart size={20} fill="currentColor" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase">Wishlist Count</p>
              <h3 className="text-xl font-bold text-gray-950 dark:text-white">{wishlistCount}</h3>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3.5 bg-success-50 text-success-600 dark:bg-success-950/20 rounded-xl">
              <CreditCard size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase">Recent Purchases</p>
              <h3 className="text-xl font-bold text-gray-950 dark:text-white">{completedOrders.length}</h3>
            </div>
          </div>
        </div>

        {/* Recent Purchases List */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl space-y-4 shadow-sm">
          <h3 className="font-bold text-gray-950 dark:text-white text-sm uppercase tracking-wider">
            Recent Activity
          </h3>
          {recentPurchase ? (
            <div className="border border-gray-100 dark:border-gray-800 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-primary-500">Order ID: #{recentPurchase._id}</p>
                <h4 className="font-bold text-sm text-gray-950 dark:text-white">{recentPurchase.productTitle}</h4>
                <p className="text-xs text-gray-500">
                  Purchased on: {new Date(recentPurchase.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-base font-extrabold text-gray-900 dark:text-white block">
                  ${recentPurchase.totalAmount}
                </span>
                <span className="inline-block px-2 py-0.5 mt-1 bg-primary-100 text-primary-800 dark:bg-primary-950 text-[10px] font-bold rounded-full capitalize">
                  Status: {recentPurchase.orderStatus}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-500 py-6 text-center border border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
              No recent purchases found.
            </p>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER SELLER VIEW
  // ==========================================
  if (user.role === 'seller') {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-950 dark:text-white">Seller Dashboard</h2>
          <p className="text-xs text-gray-500">Monitor active listings, product orders, and sales trends</p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-primary-100 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 rounded-xl">
              <Layers size={18} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-semibold uppercase">Total Products</p>
              <h3 className="text-lg font-bold text-gray-950 dark:text-white">{stats?.totalProducts || 0}</h3>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-success-50 text-success-600 dark:bg-success-950/20 rounded-xl">
              <ShoppingBag size={18} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-semibold uppercase">Total Sales</p>
              <h3 className="text-lg font-bold text-gray-950 dark:text-white">{stats?.totalSales || 0}</h3>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 rounded-xl">
              <DollarSign size={18} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-semibold uppercase">Total Revenue</p>
              <h3 className="text-lg font-bold text-gray-950 dark:text-white">${stats?.totalRevenue || 0}</h3>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-500 dark:bg-amber-950/20 rounded-xl">
              <AlertTriangle size={18} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-semibold uppercase">Pending Orders</p>
              <h3 className="text-lg font-bold text-gray-950 dark:text-white">{stats?.pendingOrders || 0}</h3>
            </div>
          </div>
        </div>

        {/* Quick controls shortcut */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl space-y-4 shadow-sm">
          <h3 className="font-bold text-gray-950 dark:text-white text-sm uppercase tracking-wider">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/dashboard/add-product"
              className="p-4 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl hover:border-primary-500 text-center font-semibold text-xs text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition"
            >
              + List A New Product
            </Link>
            <Link
              href="/dashboard/my-products"
              className="p-4 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl hover:border-primary-500 text-center font-semibold text-xs text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition"
            >
              Manage Listings
            </Link>
            <Link
              href="/dashboard/manage-orders"
              className="p-4 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl hover:border-primary-500 text-center font-semibold text-xs text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition"
            >
              Dispatch Incoming Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER ADMIN VIEW
  // ==========================================
  if (user.role === 'admin') {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-950 dark:text-white">Admin Control Panel</h2>
          <p className="text-xs text-gray-500">Platform-wide moderation controls, reports, and payments monitoring</p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-primary-100 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 rounded-xl">
              <Users size={18} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-semibold uppercase">Total Users</p>
              <h3 className="text-lg font-bold text-gray-950 dark:text-white">{stats?.totalUsers || 0}</h3>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-success-50 text-success-600 dark:bg-success-950/20 rounded-xl">
              <Layers size={18} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-semibold uppercase">Total Products</p>
              <h3 className="text-lg font-bold text-gray-950 dark:text-white">{stats?.totalProducts || 0}</h3>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 rounded-xl">
              <ShoppingBag size={18} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-semibold uppercase">Total Orders</p>
              <h3 className="text-lg font-bold text-gray-950 dark:text-white">{stats?.totalOrders || 0}</h3>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-500 dark:bg-amber-950/20 rounded-xl">
              <DollarSign size={18} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-semibold uppercase">Total Revenue</p>
              <h3 className="text-lg font-bold text-gray-950 dark:text-white">${stats?.totalRevenue || 0}</h3>
            </div>
          </div>
        </div>

        {/* Administration shortcuts */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl space-y-4 shadow-sm">
          <h3 className="font-bold text-gray-950 dark:text-white text-sm uppercase tracking-wider">
            Moderator Dashboards
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/dashboard/users"
              className="p-4 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl hover:border-primary-500 text-center font-semibold text-xs text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition"
            >
              Manage Platform Users
            </Link>
            <Link
              href="/dashboard/manage-products"
              className="p-4 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl hover:border-primary-500 text-center font-semibold text-xs text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition"
            >
              Approve / Moderation Products
            </Link>
            <Link
              href="/dashboard/categories"
              className="p-4 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl hover:border-primary-500 text-center font-semibold text-xs text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition"
            >
              Create Categories (CRUD)
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
