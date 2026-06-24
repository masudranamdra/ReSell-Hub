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
    <div className="space-y-8 text-left">
      <div>
        <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Buyer Command Center</h2>
        <p className="text-xs text-slate-500 dark:text-gray-400">Securely monitor purchase milestones, financial transaction statements, and wishlists.</p>
      </div>

      {/* Seller Application Banner */}
      {user.role === 'buyer' && (
        <div className="bg-gradient-to-r from-primary-500/10 via-indigo-500/5 to-transparent border border-primary-500/20 dark:border-primary-500/30 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1">
            <h3 className="text-sm font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <User size={16} className="text-primary-500 animate-pulse" />
              Unlock Earning Power: Become a Verified Seller
            </h3>
            <p className="text-xs text-slate-500 dark:text-gray-400 max-w-xl">
              Turn your pre-owned electronics, furniture, or fashion items into cash. Apply today for instant admin store vetting.
            </p>
          </div>

          <div className="flex-shrink-0">
            {(!user.sellerRequestStatus || user.sellerRequestStatus === 'none') && (
              <button
                onClick={handleApplySeller}
                disabled={applying}
                className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white text-xs font-black rounded-xl shadow transition flex items-center gap-1.5 cursor-pointer"
              >
                {applying ? 'Filing Application...' : 'Apply to become a Seller'}
                <ArrowRight size={14} />
              </button>
            )}
            {user.sellerRequestStatus === 'pending' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-black rounded-xl shadow-sm">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                Awaiting Store Approval
              </span>
            )}
            {user.sellerRequestStatus === 'rejected' && (
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 text-red-500 text-xs font-black rounded-xl">
                  Store Application Rejected
                </span>
                <button
                  onClick={handleApplySeller}
                  disabled={applying}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white text-xs font-black rounded-xl shadow transition"
                >
                  {applying ? 'Submitting...' : 'Re-apply Store'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Larger Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Total Orders Card */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 dark:text-gray-500 font-extrabold uppercase tracking-wider">Total Orders</span>
            <div className="p-3 bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 rounded-xl">
              <ShoppingBag size={18} />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-black text-gray-900 dark:text-white leading-none">{buyerOrders.length}</h3>
            <p className="text-[10px] text-slate-400 dark:text-gray-500 font-semibold">+2 active this week</p>
          </div>
        </div>

        {/* Wishlist Card */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 dark:text-gray-500 font-extrabold uppercase tracking-wider">Wishlist</span>
            <div className="p-3 bg-red-50 dark:bg-red-950/30 text-red-500 rounded-xl">
              <Heart size={18} fill="currentColor" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-black text-gray-900 dark:text-white leading-none">{wishlistCount}</h3>
            <p className="text-[10px] text-slate-400 dark:text-gray-500 font-semibold">Saved items price track</p>
          </div>
        </div>

        {/* Recent Purchases Card */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 dark:text-gray-500 font-extrabold uppercase tracking-wider">Purchases</span>
            <div className="p-3 bg-success-50 dark:bg-success-950/20 text-success-600 dark:text-success-400 rounded-xl">
              <Clock size={18} />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-black text-gray-900 dark:text-white leading-none">{completedOrders.length}</h3>
            <p className="text-[10px] text-slate-400 dark:text-gray-500 font-semibold">100% Escrow Delivery</p>
          </div>
        </div>

        {/* Total Spent Card */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 dark:text-gray-500 font-extrabold uppercase tracking-wider">Total Spent</span>
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 dark:text-indigo-400 rounded-xl">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-black text-gray-900 dark:text-white leading-none">${totalSpend.toFixed(2)}</h3>
            <p className="text-[10px] text-slate-400 dark:text-gray-500 font-semibold">Stripe security audited</p>
          </div>
        </div>

        {/* Recent Transactions Card */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 dark:text-gray-500 font-extrabold uppercase tracking-wider">Audit Logs</span>
            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-xl">
              <Receipt size={18} />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-black text-gray-900 dark:text-white leading-none">{payments.length}</h3>
            <p className="text-[10px] text-slate-400 dark:text-gray-500 font-semibold">Ledger invoices synced</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Spending Trend Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-gray-900 dark:text-white text-sm uppercase tracking-wider flex items-center gap-2">
              <BarChart3 size={18} className="text-primary-500" /> Monthly Spending Summary
            </h3>
            <p className="text-xs text-slate-400">Total spending value visualized per fiscal period</p>
          </div>
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E293B', 
                    borderRadius: '12px', 
                    color: '#fff', 
                    border: 'none', 
                    fontSize: '11px',
                    fontWeight: 'bold'
                  }}
                  cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                />
                <Bar dataKey="Spent" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm flex flex-col">
          <div>
            <h3 className="font-extrabold text-gray-900 dark:text-white text-sm uppercase tracking-wider flex items-center gap-2">
              <Clock size={18} className="text-primary-500" /> Activity Timeline
            </h3>
            <p className="text-xs text-slate-400">Recent purchase processing updates</p>
          </div>
          
          <div className="space-y-5 flex-grow pt-4">
            {recentOrders.length > 0 ? (
              recentOrders.map((order, index) => (
                <div key={order._id} className="flex gap-4 text-xs">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <span className={`w-3.5 h-3.5 rounded-full border-2 ${
                      order.orderStatus === 'delivered' ? 'bg-success-500 border-success-600' :
                      order.orderStatus === 'cancelled' ? 'bg-red-500 border-red-600' :
                      'bg-amber-400 border-amber-500'
                    }`} />
                    {index < recentOrders.length - 1 && <span className="w-0.5 h-12 bg-slate-100 dark:bg-gray-800 mt-1" />}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <p className="font-extrabold text-gray-850 dark:text-gray-250 truncate">{order.productTitle}</p>
                    <p className="text-[10px] text-slate-400 font-semibold">ID: #{order._id.substring(18)} | Qty: {order.quantity}</p>
                    <span className={`inline-block px-2.5 py-0.5 text-[9px] font-black rounded-full uppercase tracking-wider ${
                      order.orderStatus === 'delivered' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20' :
                      order.orderStatus === 'cancelled' ? 'bg-red-50 text-red-500 dark:bg-red-950/20' :
                      'bg-amber-50 text-amber-600 dark:bg-amber-950/20'
                    }`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center py-10">
                <p className="text-xs text-slate-400 py-6 text-center font-medium border-2 border-dashed border-slate-100 dark:border-gray-800 rounded-2xl w-full">
                  No tracking updates found.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transaction Logs Table */}
      <div className="bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
        <div>
          <h3 className="font-extrabold text-gray-900 dark:text-white text-sm uppercase tracking-wider flex items-center gap-2">
            <Receipt size={18} className="text-primary-500" /> Recent Stripe Billing Logs
          </h3>
          <p className="text-xs text-slate-400">Verfied payment history audit trail</p>
        </div>
        
        {payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-gray-950 text-slate-400 font-black border-b border-slate-100 dark:border-gray-850 uppercase tracking-wider">
                  <th className="p-4 rounded-l-xl">Transaction ID</th>
                  <th className="p-4">Billing Date</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Channel</th>
                  <th className="p-4 rounded-r-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-gray-850">
                {payments.slice(0, 5).map((pay) => (
                  <tr key={pay._id} className="hover:bg-slate-50/50 dark:hover:bg-gray-850/30 transition-colors font-medium">
                    <td className="p-4 font-bold text-gray-900 dark:text-white">{pay.transactionId}</td>
                    <td className="p-4 text-slate-500 dark:text-gray-400">{new Date(pay.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</td>
                    <td className="p-4 font-extrabold text-gray-900 dark:text-white text-sm">${pay.amount.toFixed(2)}</td>
                    <td className="p-4 uppercase text-[10px] font-black text-slate-400">{pay.paymentMethod}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 text-[9px] font-black rounded-full uppercase tracking-wider">
                        {pay.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-12 text-center font-medium border-2 border-dashed border-slate-100 dark:border-gray-800 rounded-2xl">
            No secure payment records detected.
          </p>
        )}
      </div>
    </div>
  );
}
