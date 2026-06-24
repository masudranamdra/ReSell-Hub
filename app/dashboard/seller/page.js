'use client';

import React, { useContext, useEffect, useState } from 'react';
import { AuthContext, API_URL } from '../../../components/Providers';
import { ShoppingBag, Layers, DollarSign, AlertTriangle, CheckSquare, Clock, BarChart3, ChevronRight, LayoutDashboard, Plus } from 'lucide-react';
import Link from 'next/link';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, LineChart, Line } from 'recharts';
import { motion } from 'framer-motion';

export default function SellerDashboard() {
  const { user, token } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [recentProducts, setRecentProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !user) return;

    async function loadStats() {
      try {
        const res = await fetch(`${API_URL}/api/analytics/seller`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setStats(data.metrics);
          setCharts(data.charts);
          setRecentProducts(data.recentProducts || []);
          setRecentOrders(data.recentOrders || []);
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
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-gray-200 dark:bg-gray-800 h-24 rounded-2xl skeleton-shimmer"></div>
          ))}
        </div>
        <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-3xl skeleton-shimmer"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in text-left transition-colors duration-300">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-950 dark:text-white">Seller Business Panel</h2>
        <p className="text-xs text-gray-500">Monitor active listings, completed orders, and earnings trends</p>
      </div>

      {/* KPI Display Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
        {/* Total Products */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 p-6 rounded-2xl shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 dark:text-gray-500 font-extrabold uppercase tracking-wider">Total Products</span>
            <div className="p-3 bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 rounded-xl">
              <Layers size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-none">{stats?.totalProducts || 0}</h3>
        </div>

        {/* Total Sales */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 p-6 rounded-2xl shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 dark:text-gray-500 font-extrabold uppercase tracking-wider">Total Sales</span>
            <div className="p-3 bg-success-50 dark:bg-success-950/20 text-success-600 dark:text-success-400 rounded-xl">
              <ShoppingBag size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-none">{stats?.totalSales || 0}</h3>
        </div>

        {/* Total Revenue */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 p-6 rounded-2xl shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 dark:text-gray-500 font-extrabold uppercase tracking-wider">Revenue</span>
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 dark:text-indigo-400 rounded-xl">
              <DollarSign size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-none">${stats?.totalRevenue || 0}</h3>
        </div>

        {/* Pending Orders */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 p-6 rounded-2xl shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 dark:text-gray-500 font-extrabold uppercase tracking-wider">Pending Orders</span>
            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-xl">
              <Clock size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-none">{stats?.pendingOrders || 0}</h3>
        </div>

        {/* Delivered Orders */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 p-6 rounded-2xl shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 dark:text-gray-500 font-extrabold uppercase tracking-wider">Delivered</span>
            <div className="p-3 bg-success-50 dark:bg-success-950/20 text-success-600 dark:text-success-400 rounded-xl">
              <CheckSquare size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-none">{stats?.deliveredOrders || 0}</h3>
        </div>

        {/* Low Stock Products */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 p-6 rounded-2xl shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 dark:text-gray-500 font-extrabold uppercase tracking-wider">Low Stock</span>
            <div className={`p-3 rounded-xl ${stats?.lowStockProducts > 0 ? 'bg-red-50 text-red-650 dark:bg-red-950/20' : 'bg-slate-50 text-slate-400 dark:bg-gray-800'}`}>
              <AlertTriangle size={16} />
            </div>
          </div>
          <h3 className={`text-2xl font-black leading-none ${stats?.lowStockProducts > 0 ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
            {stats?.lowStockProducts || 0}
          </h3>
        </div>
      </div>

      {/* Business Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-extrabold text-gray-950 dark:text-white text-xs uppercase tracking-wider">
              Monthly Revenue Chart
            </h3>
            <p className="text-[10px] text-gray-400">Total generated seller earnings ($) by month</p>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts?.monthlyRevenue} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={9} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={9} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="Revenue" stroke="#4f46e5" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales Trend Chart */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-extrabold text-gray-950 dark:text-white text-xs uppercase tracking-wider">
              Sales Volume Trend
            </h3>
            <p className="text-[10px] text-gray-400">Count of order logs processed per week</p>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts?.salesTrend} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={9} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={9} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="Sales" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Selling Products Chart */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-extrabold text-gray-950 dark:text-white text-xs uppercase tracking-wider">
              Top Selling Products Chart
            </h3>
            <p className="text-[10px] text-gray-400">Your top performing items by volume sales</p>
          </div>
          <div className="h-48 w-full">
            {charts?.topSellingProducts && charts.topSellingProducts.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.topSellingProducts} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#9CA3AF" fontSize={8} tickLine={false} />
                  <YAxis stroke="#9CA3AF" fontSize={9} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-gray-400">
                No selling data logs found
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lists / Tables for recent listings and incoming orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-gray-950 dark:text-white text-xs uppercase tracking-wider">
              Recent Products
            </h3>
            <Link href="/dashboard/my-products" className="text-xs text-primary-600 hover:underline flex items-center gap-0.5 font-bold">
              Manage <ChevronRight size={14} />
            </Link>
          </div>
          
          <div className="divide-y divide-gray-100 dark:divide-gray-850">
            {recentProducts.length > 0 ? (
              recentProducts.map((p) => (
                <div key={p._id} className="py-3 flex items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-2.5">
                    <img src={p.images[0]} alt={p.title} className="w-8 h-8 rounded-lg object-cover border" />
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white line-clamp-1">{p.title}</h4>
                      <p className="text-[10px] text-gray-400 capitalize">{p.category} | {p.condition}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white">${p.price}</p>
                    <span className="inline-block px-1.5 py-0.5 rounded text-[8px] font-bold uppercase bg-amber-50 text-amber-500 dark:bg-amber-950/20">
                      {p.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 py-10 text-center border border-dashed border-gray-200 dark:border-gray-800 rounded-xl font-medium">
                No products listed yet.
              </p>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-gray-950 dark:text-white text-xs uppercase tracking-wider">
              Recent Incoming Orders
            </h3>
            <Link href="/dashboard/manage-orders" className="text-xs text-primary-600 hover:underline flex items-center gap-0.5 font-bold">
              Dispatch <ChevronRight size={14} />
            </Link>
          </div>
          
          <div className="divide-y divide-gray-100 dark:divide-gray-850">
            {recentOrders.length > 0 ? (
              recentOrders.map((o) => (
                <div key={o._id} className="py-3 flex items-center justify-between text-xs gap-3">
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white line-clamp-1">{o.productTitle}</h4>
                    <p className="text-[10px] text-gray-400">Buyer: {o.buyerInfo?.name} | Qty: {o.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white">${o.totalAmount}</p>
                    <span className="inline-block px-1.5 py-0.5 rounded text-[8px] font-bold uppercase bg-primary-50 text-primary-600 dark:bg-primary-950/20">
                      {o.orderStatus}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 py-10 text-center border border-dashed border-gray-200 dark:border-gray-800 rounded-xl font-medium">
                No orders received yet.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Quick controls shortcut */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl space-y-4 shadow-sm">
        <h3 className="font-bold text-gray-950 dark:text-white text-xs uppercase tracking-wider">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/dashboard/seller/add-product"
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
