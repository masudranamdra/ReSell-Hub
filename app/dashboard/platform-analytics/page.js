'use client';

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext, API_URL } from '../../../components/Providers';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Users, Layers, ShoppingBag, DollarSign, Loader2 } from 'lucide-react';

export default function PlatformAnalytics() {
  const { token } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      loadPlatformStats();
    }
  }, [token]);

  const loadPlatformStats = async () => {
    try {
      const res = await fetch(`${API_URL}/api/analytics/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/4 skeleton-shimmer"></div>
        <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl skeleton-shimmer"></div>
      </div>
    );
  }

  const { metrics, charts } = data;
  const COLORS = ['#8b5cf6', '#10b981', '#f59e0b', '#3b82f6', '#ec4899'];

  return (
    <div className="space-y-8 animate-fade-in transition-colors duration-300">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-950 dark:text-white">Platform Analytics</h2>
        <p className="text-xs text-gray-500">Track registrations, billing statistics, order counts and category metrics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-400 rounded-lg">
            <Users size={18} />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 font-semibold uppercase">Total Users</p>
            <h3 className="text-lg font-bold text-gray-950 dark:text-white">{metrics.totalUsers}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-success-50 text-success-600 dark:bg-success-950/20 rounded-lg">
            <Layers size={18} />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 font-semibold uppercase">Total Products</p>
            <h3 className="text-lg font-bold text-gray-950 dark:text-white">{metrics.totalProducts}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 rounded-lg">
            <ShoppingBag size={18} />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 font-semibold uppercase">Total Orders</p>
            <h3 className="text-lg font-bold text-gray-950 dark:text-white">{metrics.totalOrders}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 text-amber-500 dark:bg-amber-950/20 rounded-lg">
            <DollarSign size={18} />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 font-semibold uppercase">Total Revenue</p>
            <h3 className="text-lg font-bold text-gray-950 dark:text-white">${metrics.totalRevenue}</h3>
          </div>
        </div>
      </div>

      {/* Analytics Charts Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Growth Line Chart */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl space-y-4 shadow-sm">
          <h3 className="font-bold text-gray-950 dark:text-white text-sm uppercase tracking-wider">
            User Registration Growth (Last 6 Months)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.userGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-100 dark:stroke-gray-800" />
                <XAxis dataKey="month" className="text-[10px] fill-gray-400" />
                <YAxis className="text-[10px] fill-gray-400" />
                <Tooltip contentStyle={{ fontSize: '12px', background: '#0b0f19', color: '#fff', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="Users" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Orders & Revenue Trend Bar Chart */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl space-y-4 shadow-sm">
          <h3 className="font-bold text-gray-950 dark:text-white text-sm uppercase tracking-wider">
            Monthly Orders and Billing Analytics
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.monthlyOrders} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-100 dark:stroke-gray-800" />
                <XAxis dataKey="month" className="text-[10px] fill-gray-400" />
                <YAxis className="text-[10px] fill-gray-400" />
                <Tooltip contentStyle={{ fontSize: '12px', background: '#0b0f19', color: '#fff', borderRadius: '8px' }} />
                <Bar dataKey="Orders" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Performance Pie Chart */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl space-y-4 shadow-sm">
          <h3 className="font-bold text-gray-955 dark:text-white text-sm uppercase tracking-wider">
            Category Popularity Distribution
          </h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.categoryPerformance}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {charts.categoryPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: '12px', background: '#0b0f19', color: '#fff', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
            {/* Custom legends */}
            <div className="text-left text-xs space-y-1.5 min-w-[120px] max-w-[200px]">
              {charts.categoryPerformance.map((entry, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                  <span className="text-gray-500 font-semibold truncate" title={entry.name}>
                    {entry.name}: {entry.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products performance list */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl space-y-4 shadow-sm">
          <h3 className="font-bold text-gray-955 dark:text-white text-sm uppercase tracking-wider">
            Top Selling Products Summary
          </h3>
          <div className="space-y-4">
            {charts?.topSellingProducts?.map((p, idx) => (
              <div key={idx} className="flex justify-between items-center border-b border-gray-50 dark:border-gray-800 pb-2">
                <div className="space-y-0.5">
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">{p.name}</h4>
                  <p className="text-[10px] text-gray-500">Unit Sales: {p.sales} orders</p>
                </div>
                <span className="font-extrabold text-xs text-primary-600 dark:text-primary-400">
                  Gross: ${p.revenue}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
