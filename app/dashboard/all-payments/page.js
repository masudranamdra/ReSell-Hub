'use client';

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext, API_URL } from '../../../components/Providers';
import { CreditCard, Search, Loader2, Calendar, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AllPaymentsAudit() {
  const { token } = useContext(AuthContext);

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    if (token) {
      loadAllTransactions();
    }
  }, [token, search, statusFilter]);

  const loadAllTransactions = async () => {
    try {
      const res = await fetch(`${API_URL}/api/payments/admin?search=${search}&status=${statusFilter}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setPayments(data.payments);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && payments.length === 0) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/4 skeleton-shimmer"></div>
        <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl skeleton-shimmer"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in transition-colors duration-300">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-950 dark:text-white">Payments Audit</h2>
        <p className="text-xs text-gray-500">Monitor all transactions processed across the platform securely</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-3 text-gray-400" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
            placeholder="Search transactions by ID..."
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-xs text-gray-700 dark:text-gray-300 outline-none focus:ring-1 focus:ring-primary-500"
        >
          <option value="">All Statuses</option>
          <option value="success">Success</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Transaction Table */}
      {payments.length > 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-950 text-gray-500 dark:text-gray-400 font-bold border-b border-gray-100 dark:border-gray-800">
                  <th className="p-4">Transaction ID</th>
                  <th className="p-4">Buyer details</th>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {payments.map((pay) => (
                  <tr key={pay._id} className="hover:bg-gray-50 dark:hover:bg-gray-850/40 transition">
                    <td className="p-4 font-semibold text-gray-900 dark:text-white">
                      {pay.transactionId}
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-gray-800 dark:text-gray-250">{pay.buyerId?.name || 'User'}</p>
                      <p className="text-[10px] text-gray-400">{pay.buyerId?.email}</p>
                    </td>
                    <td className="p-4 font-mono text-[10px] text-gray-400">
                      #{pay.orderId || 'Order reference'}
                    </td>
                    <td className="p-4 font-bold text-primary-600 dark:text-primary-400">
                      ${pay.amount}
                    </td>
                    <td className="p-4 text-gray-500">
                      {new Date(pay.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-full capitalize ${
                        pay.paymentStatus === 'success' ? 'bg-success-50 text-success-600 dark:bg-success-950/20' : 'bg-danger-50 text-danger-500 dark:bg-danger-950/20'
                      }`}>
                        {pay.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="py-16 text-center space-y-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl">
          <CreditCard className="mx-auto text-gray-400" size={32} />
          <h3 className="font-bold text-gray-900 dark:text-white text-base">No Payments Found</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
            There are no payment records matching the query parameters.
          </p>
        </div>
      )}
    </div>
  );
}
