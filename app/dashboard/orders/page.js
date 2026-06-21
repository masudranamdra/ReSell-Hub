'use client';

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext, API_URL } from '../../../components/Providers';
import { ShoppingBag, Loader2, Calendar, Receipt, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function MyOrders() {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    if (token) {
      loadOrders();
    }
  }, [token]);

  const loadOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/api/orders/buyer`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (id) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    setCancelling(id);
    try {
      const res = await fetch(`${API_URL}/api/orders/${id}/cancel`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || 'Order cancelled successfully');
        // Update local state
        setOrders(orders.map(o => o._id === id ? { ...o, orderStatus: 'cancelled', paymentStatus: 'refunded' } : o));
      } else {
        toast.error(data.message || 'Failed to cancel order');
      }
    } catch (err) {
      toast.error('Network error cancelling order');
    } finally {
      setCancelling(null);
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
        <h2 className="text-2xl font-extrabold text-gray-950 dark:text-white">My Orders</h2>
        <p className="text-xs text-gray-500">Track shipment status and view transactions invoices</p>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => {
            const isCancelable = ['pending', 'accepted'].includes(order.orderStatus);
            
            return (
              <div
                key={order._id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-sm space-y-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div className="space-y-2 flex-grow">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] bg-primary-100 text-primary-800 dark:bg-primary-950 dark:text-primary-400 font-bold px-2 py-0.5 rounded-full uppercase">
                      ID: #{order._id.substring(12)}
                    </span>
                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                      <Calendar size={12} /> {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-sm text-gray-950 dark:text-white hover:text-primary-600">
                    <Link href={`/products/${order.productId}`}>{order.productTitle}</Link>
                  </h3>
                  
                  <div className="text-xs text-gray-500 space-y-0.5">
                    <p>Unit Price: ${order.productPrice} | Qty: {order.quantity}</p>
                    <p>Transaction: {order.transactionId}</p>
                    <p>Shipping Address: {order.buyerInfo?.address}</p>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col md:items-end justify-between items-center gap-2 min-w-[150px] border-t md:border-t-0 border-gray-100 dark:border-gray-800 pt-3 md:pt-0">
                  <div className="text-left md:text-right">
                    <span className="text-base font-extrabold text-gray-900 dark:text-white block">
                      Total: ${order.totalAmount}
                    </span>
                    <span className={`inline-block px-2.5 py-0.5 mt-1 text-[10px] font-bold rounded-full capitalize ${
                      order.orderStatus === 'delivered' ? 'bg-success-50 text-success-600 dark:bg-success-950/20' :
                      order.orderStatus === 'cancelled' ? 'bg-danger-50 text-danger-500 dark:bg-danger-950/20' :
                      'bg-amber-50 text-amber-600 dark:bg-amber-950/20'
                    }`}>
                      {order.orderStatus}
                    </span>
                  </div>

                  {isCancelable && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      disabled={cancelling === order._id}
                      className="px-3 py-1.5 border border-danger-200 hover:bg-danger-500 text-danger-500 hover:text-white disabled:opacity-50 text-[10px] font-bold rounded-lg transition flex items-center gap-1"
                    >
                      {cancelling === order._id ? (
                        <Loader2 className="animate-spin" size={10} />
                      ) : (
                        <XCircle size={10} />
                      )}
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center space-y-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl">
          <ShoppingBag className="mx-auto text-gray-400" size={32} />
          <h3 className="font-bold text-gray-900 dark:text-white text-base">No Orders Found</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
            You haven't placed any orders yet. Visit the products catalog to make a purchase!
          </p>
          <Link
            href="/products"
            className="inline-block px-4 py-2 bg-primary-600 text-white text-xs font-semibold rounded-xl shadow transition"
          >
            Catalog
          </Link>
        </div>
      )}
    </div>
  );
}
