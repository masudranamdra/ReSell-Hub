'use client';

import React, { useContext, useEffect, useState } from 'react';
import { AuthContext, API_URL } from '../../../components/Providers';
import { Users, Layers, ShoppingBag, DollarSign, ShieldAlert, CheckSquare, XSquare, PlusCircle, BarChart3, Clock } from 'lucide-react';
import Link from 'next/link';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, AreaChart, Area } from 'recharts';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const { user, token } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !user) return;

    async function loadStats() {
      try {
        const res = await fetch(`${API_URL}/api/analytics/admin`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setStats(data.metrics);
          setCharts(data.charts);
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
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <div key={n} className="bg-gray-200 dark:bg-gray-800 h-20 rounded-2xl skeleton-shimmer"></div>
          ))}
        </div>
        <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-3xl skeleton-shimmer"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in text-left transition-colors duration-300">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-950 dark:text-white">Admin Control Panel</h2>
        <p className="text-xs text-gray-500">Platform-wide moderation controls, reports, and payments monitoring</p>
      </div>

      {/* Enterprise KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Total Users */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 p-5 rounded-2xl shadow-sm hover:shadow-md transition duration-305 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 dark:text-gray-500 font-extrabold uppercase tracking-wider">Total Users</span>
            <div className="p-2.5 bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 rounded-xl">
              <Users size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-none">{stats?.totalUsers || 0}</h3>
        </div>

        {/* Total Buyers */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 p-5 rounded-2xl shadow-sm hover:shadow-md transition duration-305 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 dark:text-gray-500 font-extrabold uppercase tracking-wider">Total Buyers</span>
            <div className="p-2.5 bg-success-50 dark:bg-success-950/20 text-success-600 dark:text-success-400 rounded-xl">
              <Users size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-none">{stats?.totalBuyers || 0}</h3>
        </div>

        {/* Total Sellers */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 p-5 rounded-2xl shadow-sm hover:shadow-md transition duration-305 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 dark:text-gray-500 font-extrabold uppercase tracking-wider">Total Sellers</span>
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 dark:text-indigo-400 rounded-xl">
              <Users size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-none">{stats?.totalSellers || 0}</h3>
        </div>

        {/* Total Products */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 p-5 rounded-2xl shadow-sm hover:shadow-md transition duration-305 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 dark:text-gray-500 font-extrabold uppercase tracking-wider">Total Products</span>
            <div className="p-2.5 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-xl">
              <Layers size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-none">{stats?.totalProducts || 0}</h3>
        </div>

        {/* Pending Products */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-850 p-5 rounded-2xl shadow-sm hover:shadow-md transition duration-305 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 dark:text-gray-500 font-extrabold uppercase tracking-wider">Pending Prod</span>
            <div className="p-2.5 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-xl">
              <Clock size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-none">{stats?.pendingProducts || 0}</h3>
        </div>

        {/* Approved Products */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 p-5 rounded-2xl shadow-sm hover:shadow-md transition duration-305 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 dark:text-gray-500 font-extrabold uppercase tracking-wider">Approved Prod</span>
            <div className="p-2.5 bg-success-50 dark:bg-success-950/20 text-success-600 dark:text-success-400 rounded-xl">
              <CheckSquare size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-none">{stats?.approvedProducts || 0}</h3>
        </div>

        {/* Rejected Products */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 p-5 rounded-2xl shadow-sm hover:shadow-md transition duration-305 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 dark:text-gray-500 font-extrabold uppercase tracking-wider">Rejected Prod</span>
            <div className="p-2.5 bg-danger-50 dark:bg-danger-950/20 text-danger-600 rounded-xl">
              <XSquare size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-none">{stats?.rejectedProducts || 0}</h3>
        </div>

        {/* Total Orders */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 p-5 rounded-2xl shadow-sm hover:shadow-md transition duration-305 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 dark:text-gray-500 font-extrabold uppercase tracking-wider">Total Orders</span>
            <div className="p-2.5 bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 rounded-xl">
              <ShoppingBag size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-none">{stats?.totalOrders || 0}</h3>
        </div>

        {/* Revenue */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 p-5 rounded-2xl shadow-sm hover:shadow-md transition duration-305 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 dark:text-gray-500 font-extrabold uppercase tracking-wider">Total Revenue</span>
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 dark:text-indigo-400 rounded-xl">
              <DollarSign size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-none">${stats?.totalRevenue || 0}</h3>
        </div>

        {/* Reports */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 p-5 rounded-2xl shadow-sm hover:shadow-md transition duration-305 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 dark:text-gray-500 font-extrabold uppercase tracking-wider">Reports Flag</span>
            <div className={`p-2.5 rounded-xl ${stats?.totalReports > 0 ? 'bg-red-50 text-red-650 dark:bg-red-950/20' : 'bg-slate-50 text-slate-400 dark:bg-gray-800'}`}>
              <ShieldAlert size={16} />
            </div>
          </div>
          <h3 className={`text-2xl font-black leading-none ${stats?.totalReports > 0 ? 'text-red-550' : 'text-gray-900 dark:text-white'}`}>
            {stats?.totalReports || 0}
          </h3>
        </div>
      </div>

      {/* Enterprise Chart Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Growth Line Chart */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-extrabold text-gray-950 dark:text-white text-xs uppercase tracking-wider">
              User Growth Curve
            </h3>
            <p className="text-[10px] text-gray-400">Monthly platform registered users accumulation</p>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts?.userGrowth} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={9} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={9} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="Users" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Performance Bar Chart */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-extrabold text-gray-950 dark:text-white text-xs uppercase tracking-wider">
              Category Performance
            </h3>
            <p className="text-[10px] text-gray-400">Total products listed under top categories</p>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts?.categoryPerformance} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={9} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={9} tickLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Orders Area Chart */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-extrabold text-gray-950 dark:text-white text-xs uppercase tracking-wider">
              Monthly Platform Orders
            </h3>
            <p className="text-[10px] text-gray-400">Total order volume processed by the system</p>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts?.monthlyOrders} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={9} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={9} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="Orders" stroke="#f59e0b" fillOpacity={1} fill="url(#colorOrders)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Administration shortcuts */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl space-y-4 shadow-sm">
        <h3 className="font-bold text-gray-950 dark:text-white text-xs uppercase tracking-wider">
          Moderator Control Panels
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
