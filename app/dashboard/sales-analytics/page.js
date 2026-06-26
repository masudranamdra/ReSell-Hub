'use client';

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext, API_URL } from '../../../components/Providers';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { BarChart3, TrendingUp, Layers, DollarSign } from 'lucide-react';

export default function SalesAnalytics() {
  const { token } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      loadAnalytics();
    }
  }, [token]);

  const loadAnalytics = async () => {
    try {
      const res = await fetch(`${API_URL}/api/analytics/seller`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const resData = await res.json();
      if (resData.success) {
        setData(resData);
      }
    } catch (err) {
      console.error('Error fetching seller stats:', err);
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

  // Pie chart mock-up structure for inventory distribution
  const inventoryData = [
    { name: 'Active Items', count: metrics.activeProducts || 0, fill: '#8b5cf6' },
    { name: 'Sold Out Items', count: metrics.soldProducts || 0, fill: '#10b981' }
  ];

  return (
    <div className="space-y-8 animate-fade-in transition-colors duration-300">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-950 dark:text-white">Sales Analytics</h2>
        <p className="text-xs text-gray-500">Track monthly trends, earnings performance, and listing stats</p>
      </div>

      {/* Metrics Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-400 rounded-lg">
            <Layers size={18} />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 font-semibold uppercase">Total Listings</p>
            <h3 className="text-lg font-bold text-gray-950 dark:text-white">{metrics.totalProducts}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-success-50 text-success-600 dark:bg-success-950/20 rounded-lg">
            <BarChart3 size={18} />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 font-semibold uppercase">Units Sold</p>
            <h3 className="text-lg font-bold text-gray-950 dark:text-white">{metrics.totalSales}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 rounded-lg">
            <DollarSign size={18} />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 font-semibold uppercase">Gross Earnings</p>
            <h3 className="text-lg font-bold text-gray-950 dark:text-white">${metrics.totalRevenue}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 text-amber-500 dark:bg-amber-950/20 rounded-lg">
            <TrendingUp size={18} />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 font-semibold uppercase">Pending Orders</p>
            <h3 className="text-lg font-bold text-gray-950 dark:text-white">{metrics.pendingOrders}</h3>
          </div>
        </div>
      </div>

      {/* Main Charts Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Monthly Sales Revenue Area Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl space-y-4 shadow-sm">
          <h3 className="font-bold text-gray-950 dark:text-white text-sm uppercase tracking-wider">
            Monthly Earnings Trend ($)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.monthlyRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-100 dark:stroke-gray-800" />
                <XAxis dataKey="month" className="text-[10px] fill-gray-400" />
                <YAxis className="text-[10px] fill-gray-400" />
                <Tooltip contentStyle={{ fontSize: '12px', background: '#0b0f19', color: '#fff', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="Revenue" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inventory distribution Bar chart */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl space-y-4 shadow-sm">
          <h3 className="font-bold text-gray-950 dark:text-white text-sm uppercase tracking-wider">
            Inventory Stats
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={inventoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-100 dark:stroke-gray-800" />
                <XAxis dataKey="name" className="text-[10px] fill-gray-400" />
                <YAxis className="text-[10px] fill-gray-400" />
                <Tooltip contentStyle={{ fontSize: '12px', background: '#0b0f19', color: '#fff', borderRadius: '8px' }} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {inventoryData.map((entry, index) => (
                    <circle key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
