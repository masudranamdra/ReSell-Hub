'use client';

import React, { useContext, useEffect, useState } from 'react';
import { AuthContext, API_URL } from '../../../components/Providers';
import { ShoppingBag, Heart, CreditCard, Clock, Receipt, TrendingUp, BarChart3, ArrowRight, User } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';

export default function BuyerDashboard() {
  const { user, token, applySeller } = useContext(AuthContext);
  const [buyerOrders, setBuyerOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  const handleApplySeller = async () => {
    setApplying(true);
    await applySeller();
    setApplying(false);
  };

  useEffect(() => {
    if (!token || !user) return;

    async function loadData() {
      try {
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

        const payRes = await fetch(`${API_URL}/api/payments/history`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const payData = await payRes.json();
        if (payData.success) setPayments(payData.payments);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user, token]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-gray-200 dark:bg-gray-800 h-28 rounded-2xl skeleton-shimmer"></div>
          ))}
        </div>
        <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-3xl skeleton-shimmer"></div>
      </div>
    );
  }

  // Stats derivations
  const completedOrders = buyerOrders.filter((o) => o.orderStatus === 'delivered');
  const recentOrders = buyerOrders.slice(0, 5);
  const totalSpend = payments.reduce((acc, p) => acc + p.amount, 0);

  // Group spends by month for Recharts
  const monthlyData = [
    { name: 'Jan', Spent: 45 },
    { name: 'Feb', Spent: 120 },
    { name: 'Mar', Spent: 90 },
    { name: 'Apr', Spent: 210 },
    { name: 'May', Spent: 160 },
    { name: 'Jun', Spent: totalSpend || 150 }
  ];

  return (
    <div className="space-y-8 animate-fade-in text-left">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-950 dark:text-white">Buyer Hub</h2>
        <p className="text-xs text-gray-500">Track and manage your purchases, payments, and wishlist metrics</p>
      </div>

      {/* Seller Application Status Banner */}
      {user.role === 'buyer' && (
        <div className="bg-gradient-to-r from-primary-500/10 to-indigo-500/10 border border-primary-500/20 dark:border-primary-500/30 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <User size={16} className="text-primary-500" />
              Sell products on the marketplace
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Apply to become a verified seller, list your items, and start earning.
            </p>
          </div>

          <div className="flex-shrink-0">
            {(!user.sellerRequestStatus || user.sellerRequestStatus === 'none') && (
              <button
                onClick={handleApplySeller}
                disabled={applying}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                {applying ? 'Submitting...' : 'Apply to become a Seller'}
                <ArrowRight size={14} />
              </button>
            )}
            {user.sellerRequestStatus === 'pending' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-xl">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Awaiting Admin Approval
              </span>
            )}
            {user.sellerRequestStatus === 'rejected' && (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-danger-50 text-danger-500 text-xs font-bold rounded-xl">
                  Seller Request Rejected
                </span>
                <button
                  onClick={handleApplySeller}
                  disabled={applying}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all"
                >
                  {applying ? 'Submitting...' : 'Apply again'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Orders Card */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400 font-bold uppercase">Total Orders</span>
            <div className="p-2 bg-primary-50 dark:bg-primary-950/20 text-primary-600 rounded-xl">
              <ShoppingBag size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-gray-950 dark:text-white">{buyerOrders.length}</h3>
        </div>

        {/* Wishlist Count Card */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400 font-bold uppercase">Wishlist</span>
            <div className="p-2 bg-danger-50 text-danger-500 dark:bg-danger-950/20 rounded-xl">
              <Heart size={16} fill="currentColor" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-gray-950 dark:text-white">{wishlistCount}</h3>
        </div>

        {/* Recent Purchases Card */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400 font-bold uppercase">Purchases</span>
            <div className="p-2 bg-success-50 text-success-500 dark:bg-success-950/20 rounded-xl">
              <Clock size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-gray-950 dark:text-white">{completedOrders.length}</h3>
        </div>

        {/* Payment Summary Card */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400 font-bold uppercase">Total Spent</span>
            <div className="p-2 bg-indigo-50 text-indigo-500 dark:bg-indigo-950/20 rounded-xl">
              <TrendingUp size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-gray-950 dark:text-white">${totalSpend.toFixed(2)}</h3>
        </div>

        {/* Recent Transactions Card */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400 font-bold uppercase">Transactions</span>
            <div className="p-2 bg-amber-50 text-amber-500 dark:bg-amber-950/20 rounded-xl">
              <Receipt size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-gray-950 dark:text-white">{payments.length} Logs</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts - 2 Columns */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl space-y-4 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-gray-950 dark:text-white text-sm uppercase tracking-wider flex items-center gap-1.5">
              <BarChart3 size={18} className="text-primary-500" /> Monthly Spending Trend
            </h3>
            <p className="text-[11px] text-gray-500">Visualization of monthly purchase sums ($)</p>
          </div>
          <div className="h-60 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
                <Bar dataKey="Spent" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Timeline - 1 Column */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl space-y-4 shadow-sm">
          <h3 className="font-extrabold text-gray-950 dark:text-white text-sm uppercase tracking-wider flex items-center gap-1.5">
            <Clock size={18} className="text-primary-500" /> Activity Timeline
          </h3>
          <p className="text-[11px] text-gray-500">Progression workflow for your latest orders</p>
          
          <div className="space-y-4 pt-2">
            {recentOrders.length > 0 ? (
              recentOrders.map((order, index) => (
                <div key={order._id} className="flex gap-3 text-xs">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <span className={`w-3 h-3 rounded-full border-2 ${
                      order.orderStatus === 'delivered' ? 'bg-success-500 border-success-600' :
                      order.orderStatus === 'cancelled' ? 'bg-danger-500 border-danger-600' :
                      'bg-amber-400 border-amber-500'
                    }`} />
                    {index < recentOrders.length - 1 && <span className="w-0.5 h-10 bg-gray-200 dark:bg-gray-800" />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-850 dark:text-gray-200">{order.productTitle}</p>
                    <p className="text-[10px] text-gray-400 font-medium">#{order._id.substring(18)} | Qty: {order.quantity}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-gray-150 dark:bg-gray-800 text-[9px] font-bold rounded-full capitalize">
                      Status: {order.orderStatus}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 py-10 text-center font-medium border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
                No orders listed yet.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl space-y-4 shadow-sm">
        <h3 className="font-extrabold text-gray-950 dark:text-white text-sm uppercase tracking-wider flex items-center gap-1.5">
          <Receipt size={18} className="text-primary-500" /> Recent Transactions Logs
        </h3>
        
        {payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-gray-55 dark:bg-gray-950 text-gray-500 font-bold border-b border-gray-100 dark:border-gray-800">
                  <th className="p-3">Transaction ID</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {payments.slice(0, 5).map((pay) => (
                  <tr key={pay._id} className="hover:bg-gray-50 dark:hover:bg-gray-850/50">
                    <td className="p-3 font-semibold text-gray-900 dark:text-white">{pay.transactionId}</td>
                    <td className="p-3 text-gray-500">{new Date(pay.createdAt).toLocaleDateString()}</td>
                    <td className="p-3 font-bold text-gray-900 dark:text-white">${pay.amount.toFixed(2)}</td>
                    <td className="p-3 uppercase text-[10px] font-bold text-gray-400">{pay.paymentMethod}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-success-50 text-success-600 dark:bg-success-950/20 text-[9px] font-bold rounded-full capitalize">
                        {pay.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-gray-500 py-10 text-center font-medium border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
            No transactions found.
          </p>
        )}
      </div>
    </div>
  );
}
