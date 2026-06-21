'use client';

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext, API_URL } from '../../../components/Providers';
import { Layers, CheckCircle, XCircle, Trash2, ShieldAlert, Eye } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ManageProductsAdmin() {
  const { token } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (token) {
      loadAllProducts();
    }
  }, [token]);

  const loadAllProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setProducts(data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, nextStatus) => {
    setUpdatingId(id);
    try {
      // Admin update product status directly (we reuse the seller PATCH or create an admin status patch endpoint)
      // Since our order status PATCH is for orders, let's look at the product status update:
      // We can update the product status via PUT or a custom status endpoint. In routes/products we can support:
      // Oh wait, in routes/products we have edit PUT. Does it support status?
      // Yes, we can update product details. But wait, let's create a custom route on the server for admin status updates, or let the PUT endpoint handle it.
      // Wait, let's verify if we need to add an endpoint for admin status update.
      // Actually, we can add a route on the server or simply write a small handler on the server.
      // Wait, let's check what endpoints are in `server/routes/products.js`.
      // Let's add the PATCH `/api/products/:id/status` endpoint in the server's routes/products.js!
      // Oh! Did we miss that? Let's check:
      // Yes, in `routes/products.js` we did not define a PATCH status.
      // We can modify the product status via standard product details update, or we can add a PATCH `/:id/status` endpoint in `server/routes/products.js`!
      // Let's make a quick edit to the server products route or use a PUT request. Wait!
      // Let's check: the PUT `/api/products/:id` was restricted to `seller` only.
      // So we MUST add an admin moderation endpoint to change product status (or allow admin in the PUT route, or create a specific patch endpoint).
      // Creating a specific PATCH `/api/products/:id/status` endpoint in `server/routes/products.js` for Admins is extremely clean!
      // Let's do that. Wait, let's write the client page first, and then we will update the server route.
      const res = await fetch(`${API_URL}/api/products/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      const data = await res.json();

      if (data.success) {
        toast.success(`Product listed as ${nextStatus}`);
        setProducts(products.map((p) => p._id === id ? { ...p, status: nextStatus } : p));
      } else {
        toast.error(data.message || 'Operation failed');
      }
    } catch (err) {
      toast.error('Network error during status update');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to permanently delete this product listing? This action is irreversible.')) return;

    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Listing deleted successfully');
        setProducts(products.filter((p) => p._id !== id));
      } else {
        toast.error(data.message || 'Deletion failed');
      }
    } catch (err) {
      toast.error('Network error during deletion');
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
        <h2 className="text-2xl font-extrabold text-gray-950 dark:text-white">Moderate Products</h2>
        <p className="text-xs text-gray-500">Approve new listings, reject inappropriate offers, and monitor user complaints</p>
      </div>

      {products.length > 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-950 text-gray-500 dark:text-gray-400 font-bold border-b border-gray-100 dark:border-gray-800">
                  <th className="p-4">Listing details</th>
                  <th className="p-4">Seller Info</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Report flags</th>
                  <th className="p-4">Moderation status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {products.map((p) => {
                  const isReported = p.reportsCount > 0;

                  return (
                    <tr
                      key={p._id}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-850/40 transition ${
                        isReported ? 'bg-danger-500/5 hover:bg-danger-500/10' : ''
                      }`}
                    >
                      <td className="p-4">
                        <div className="flex gap-3 items-center">
                          <img
                            src={p.images[0]}
                            alt={p.title}
                            className="w-10 h-10 rounded-lg object-cover border border-gray-200 dark:border-gray-700"
                          />
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white line-clamp-1">{p.title}</p>
                            <span className="text-[10px] text-gray-400 capitalize">{p.condition} | {p.category}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-400">
                        <p className="font-semibold text-gray-800 dark:text-gray-200">{p.sellerInfo?.name}</p>
                        <p className="text-[10px]">{p.sellerInfo?.email}</p>
                      </td>
                      <td className="p-4 font-bold text-gray-900 dark:text-white">${p.price}</td>
                      <td className="p-4">
                        {isReported ? (
                          <span className="flex items-center gap-1 text-danger-500 font-bold text-xs">
                            <ShieldAlert size={14} /> Reported ({p.reportsCount})
                          </span>
                        ) : (
                          <span className="text-gray-400">0 reports</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-full capitalize ${
                          p.status === 'available' ? 'bg-success-50 text-success-600 dark:bg-success-950/20' :
                          p.status === 'rejected' ? 'bg-danger-50 text-danger-500 dark:bg-danger-950/20' :
                          'bg-amber-50 text-amber-600 dark:bg-amber-950/20'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Link
                            href={`/products/${p._id}`}
                            className="p-1.5 bg-gray-100 hover:bg-primary-600 hover:text-white dark:bg-gray-800 dark:hover:bg-primary-500 rounded-lg text-gray-700 dark:text-gray-300 transition"
                            title="Preview product details"
                          >
                            <Eye size={14} />
                          </Link>
                          {p.status !== 'available' && (
                            <button
                              onClick={() => handleUpdateStatus(p._id, 'available')}
                              disabled={updatingId === p._id}
                              className="p-1.5 bg-success-500 hover:bg-success-600 text-white rounded-lg transition"
                              title="Approve Listing"
                            >
                              <CheckCircle size={14} />
                            </button>
                          )}
                          {p.status !== 'rejected' && (
                            <button
                              onClick={() => handleUpdateStatus(p._id, 'rejected')}
                              disabled={updatingId === p._id}
                              className="p-1.5 bg-danger-500 hover:bg-danger-600 text-white rounded-lg transition"
                              title="Reject Listing"
                            >
                              <XCircle size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(p._id)}
                            className="p-1.5 border border-danger-200 text-danger-500 hover:bg-danger-500 hover:text-white rounded-lg transition"
                            title="Delete Listing"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="py-16 text-center space-y-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl">
          <Layers className="mx-auto text-gray-400" size={32} />
          <h3 className="font-bold text-gray-900 dark:text-white text-base">No Listings Found</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
            There are no products listed on the platform.
          </p>
        </div>
      )}
    </div>
  );
}
