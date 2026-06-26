'use client';

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext, API_URL } from '../../../components/Providers';
import { ShoppingBag, Loader2, Calendar, User, Phone, MapPin, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageOrders() {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (token) {
      loadSellerOrders();
    }
  }, [token]);

  const loadSellerOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/api/orders/seller`, {
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

  const handleUpdateStatus = async (orderId, nextStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success(data.message || `Order status set to ${nextStatus}`);
        setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus: nextStatus } : o));
      } else {
        toast.error(data.message || 'Update failed');
      }
    } catch (err) {
      toast.error('Network error updating status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order record?')) return;
    try {
      const res = await fetch(`${API_URL}/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || 'Order record deleted successfully');
        setOrders(orders.filter(o => o._id !== orderId));
      } else {
        toast.error(data.message || 'Failed to delete order record');
      }
    } catch (err) {
      toast.error('Network error deleting order record');
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
        <h2 className="text-2xl font-extrabold text-gray-950 dark:text-white">Customer Orders</h2>
        <p className="text-xs text-gray-500">Manage order fulfillment status for items purchased by buyers</p>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => {
            const status = order.orderStatus;

            return (
              <div
                key={order._id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl shadow-sm space-y-4 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6"
              >
                <div className="space-y-3 flex-grow">
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="font-bold bg-primary-100 text-primary-800 dark:bg-primary-950 dark:text-primary-400 px-2 py-0.5 rounded-full uppercase">
                      Order ID: #{order._id.substring(12)}
                    </span>
                    <span className="text-gray-400 flex items-center gap-1">
                      <Calendar size={12} /> {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">
                      {order.productTitle}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Unit Price: ${order.productPrice} | Quantity: {order.quantity} | Total Total: ${order.totalAmount}
                    </p>
                  </div>

                  {/* Buyer Contact Details card */}
                  <div className="border-t border-gray-100 dark:border-gray-800 pt-3 space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
                    <p className="font-bold text-gray-950 dark:text-white text-[10px] uppercase tracking-wider mb-1">
                      Shipping Details
                    </p>
                    <p className="flex items-center gap-1.5">
                      <User size={12} className="text-primary-500" /> Buyer Name: {order.buyerInfo?.name} ({order.buyerInfo?.email})
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Phone size={12} className="text-primary-500" /> Contact Phone: {order.buyerInfo?.phone}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin size={12} className="text-primary-500" /> Shipping Address: {order.buyerInfo?.address}
                    </p>
                  </div>
                </div>

                {/* Dispatch operations status control */}
                <div className="flex flex-row lg:flex-col lg:items-end justify-between items-center gap-4 lg:min-w-[200px] border-t lg:border-t-0 border-gray-100 dark:border-gray-800 pt-4 lg:pt-0">
                  <div className="text-left lg:text-right">
                    <p className="text-[10px] text-gray-400 uppercase font-semibold">Order Status</p>
                    <span className={`inline-block px-2.5 py-0.5 mt-1 text-xs font-bold rounded-full capitalize ${
                      status === 'delivered' ? 'bg-success-50 text-success-600 dark:bg-success-950/20' :
                      status === 'cancelled' ? 'bg-danger-50 text-danger-500 dark:bg-danger-950/20' :
                      'bg-amber-50 text-amber-600 dark:bg-amber-950/20'
                    }`}>
                      {status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 justify-end">
                    {/* Status flow operations */}
                    {status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(order._id, 'accepted')}
                          disabled={updatingId === order._id}
                          className="px-3 py-1.5 bg-success-500 hover:bg-success-600 text-white text-xs font-semibold rounded-lg shadow transition flex items-center gap-1"
                        >
                          <CheckCircle size={12} /> Accept
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(order._id, 'cancelled')}
                          disabled={updatingId === order._id}
                          className="px-3 py-1.5 border border-danger-200 hover:bg-danger-500 hover:text-white text-danger-500 text-xs font-semibold rounded-lg transition flex items-center gap-1"
                        >
                          <XCircle size={12} /> Reject
                        </button>
                      </>
                    )}

                    {status === 'accepted' && (
                      <button
                        onClick={() => handleUpdateStatus(order._id, 'processing')}
                        disabled={updatingId === order._id}
                        className="px-3.5 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-lg shadow transition"
                      >
                        Start Processing
                      </button>
                    )}

                    {status === 'processing' && (
                      <button
                        onClick={() => handleUpdateStatus(order._id, 'shipped')}
                        disabled={updatingId === order._id}
                        className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow transition"
                      >
                        Ship Package
                      </button>
                    )}

                    {status === 'shipped' && (
                      <button
                        onClick={() => handleUpdateStatus(order._id, 'delivered')}
                        disabled={updatingId === order._id}
                        className="px-3.5 py-1.5 bg-success-500 hover:bg-success-600 text-white text-xs font-semibold rounded-lg shadow transition"
                      >
                        Mark Delivered
                      </button>
                    )}

                    {/* Final state feedback */}
                    {status === 'delivered' && (
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-xs text-success-600 dark:text-success-400 font-semibold">
                          ✓ Package Fulfilled
                        </span>
                        <button
                          onClick={() => handleDeleteOrder(order._id)}
                          className="px-3 py-1.5 bg-danger-55 hover:bg-danger-500 text-danger-600 hover:text-white text-[10px] font-bold rounded-xl transition flex items-center gap-1 border border-danger-200"
                        >
                          <Trash2 size={12} /> Delete Record
                        </button>
                      </div>
                    )}

                    {status === 'cancelled' && (
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-xs text-danger-500 font-semibold">
                          ✕ Order Cancelled
                        </span>
                        <button
                          onClick={() => handleDeleteOrder(order._id)}
                          className="px-3 py-1.5 bg-danger-55 hover:bg-danger-500 text-danger-600 hover:text-white text-[10px] font-bold rounded-xl transition flex items-center gap-1 border border-danger-200"
                        >
                          <Trash2 size={12} /> Delete Record
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center space-y-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl">
          <ShoppingBag className="mx-auto text-gray-400" size={32} />
          <h3 className="font-bold text-gray-900 dark:text-white text-base">No Customer Orders</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
            You don't have any incoming orders from buyers yet. Once a client purchases your listed items, they will appear here!
          </p>
        </div>
      )}
    </div>
  );
}
