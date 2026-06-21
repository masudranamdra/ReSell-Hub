'use client';

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext, API_URL } from '../../../components/Providers';
import { CreditCard, Calendar, Receipt } from 'lucide-react';
import Link from 'next/link';

export default function PaymentHistory() {
  const { token } = useContext(AuthContext);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      loadPayments();
    }
  }, [token]);

  const loadPayments = async () => {
    try {
      const res = await fetch(`${API_URL}/api/payments/history`, {
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

  if (loading) {
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
        <h2 className="text-2xl font-extrabold text-gray-950 dark:text-white">Payment History</h2>
        <p className="text-xs text-gray-500">Overview of all transactions processed through your card securely</p>
      </div>

      {payments.length > 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-950 text-gray-500 dark:text-gray-400 font-bold border-b border-gray-100 dark:border-gray-800">
                  <th className="p-4">Transaction ID</th>
                  <th className="p-4">Product / Order</th>
                  <th className="p-4">Amount Paid</th>
                  <th className="p-4">Payment Method</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 dark:divide-gray-800">
                {payments.map((pay) => (
                  <tr key={pay._id} className="hover:bg-gray-50 dark:hover:bg-gray-850 transition">
                    <td className="p-4 font-semibold text-gray-900 dark:text-white">
                      {pay.transactionId}
                    </td>
                    <td className="p-4 text-gray-700 dark:text-gray-300">
                      {pay.orderId?.productTitle || 'Marketplace Order'}
                    </td>
                    <td className="p-4 font-bold text-primary-600 dark:text-primary-400">
                      ${pay.amount}
                    </td>
                    <td className="p-4 capitalize text-gray-500">{pay.paymentMethod}</td>
                    <td className="p-4 text-gray-500">
                      {new Date(pay.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-success-50 text-success-600 dark:bg-success-950/20 capitalize">
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
          <CreditCard className="mx-auto text-gray-300" size={32} />
          <h3 className="font-bold text-gray-900 dark:text-white text-base">No Payments Found</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
            You don't have any billing records. Complete your checkout details to process payments.
          </p>
        </div>
      )}
    </div>
  );
}
