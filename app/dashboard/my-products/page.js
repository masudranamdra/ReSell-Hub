'use client';

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext, API_URL } from '../../../components/Providers';
import { Layers, Edit3, Trash2, Search, Loader2, Eye, Plus, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function MyProducts() {
  const { token, user } = useContext(AuthContext);

  // Lists and loading
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Editing state
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    category: '',
    condition: 'Used',
    price: '',
    stock: '',
    location: '',
    brand: '',
    model: '',
    features: '',
    images: []
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (token) {
      loadProducts();
      loadCategories();
    }
  }, [token]);

  const loadProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products/seller`, {
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

  const loadCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/api/categories`);
      const data = await res.json();
      if (data.success) setCategories(data.categories);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product listing? This action cannot be undone.')) return;

    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || 'Product deleted successfully!');
        setProducts(products.filter((p) => p._id !== id));
      } else {
        toast.error(data.message || 'Failed to delete listing');
      }
    } catch (err) {
      toast.error('Network error deleting product');
    }
  };

  // Trigger edit modal
  const startEdit = (product) => {
    setEditingProduct(product);
    setEditForm({
      title: product.title,
      description: product.description,
      category: product.category,
      condition: product.condition,
      price: product.price.toString(),
      stock: product.stock.toString(),
      location: product.location,
      brand: product.brand || '',
      model: product.model || '',
      features: Array.isArray(product.features) ? product.features.join(', ') : '',
      images: product.images
    });
  };


  const removeEditImage = (idxToRemove) => {
    setEditForm(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== idxToRemove)
    }));
  };

  // Save changes
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (Number(editForm.price) <= 0) return toast.error('Price must be greater than 0');
    if (Number(editForm.stock) < 0) return toast.error('Stock cannot be negative');
    if (editForm.images.length === 0) return toast.error('At least one image is required');

    const featuresArr = editForm.features
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    setUpdating(true);
    try {
      const res = await fetch(`${API_URL}/api/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...editForm,
          price: Number(editForm.price),
          stock: Number(editForm.stock),
          features: featuresArr
        })
      });
      const data = await res.json();

      if (data.success) {
        toast.success('Product updated! Awaiting re-moderation.');
        // Refresh products list
        loadProducts();
        setEditingProduct(null);
      } else {
        toast.error(data.message || 'Failed to update product');
      }
    } catch (err) {
      toast.error('Network error during save');
    } finally {
      setUpdating(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? p.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

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
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-950 dark:text-white">My Products</h2>
          <p className="text-xs text-gray-500">View and update your listed second-hand marketplace products</p>
        </div>
        <Link
          href="/dashboard/add-product"
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow transition"
        >
          + Add Product
        </Link>
      </div>

      {/* Search & filters controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-3 text-gray-400" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
            placeholder="Search listed products..."
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-xs text-gray-700 dark:text-gray-300 outline-none focus:ring-1 focus:ring-primary-500"
        >
          <option value="">All Statuses</option>
          <option value="available">Available (Active)</option>
          <option value="pending">Pending Approval</option>
          <option value="rejected">Rejected</option>
          <option value="sold">Sold Out</option>
        </select>
      </div>

      {/* Products list table */}
      {filteredProducts.length > 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-950 text-gray-500 dark:text-gray-400 font-bold border-b border-gray-100 dark:border-gray-800">
                  <th className="p-4">Listing</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Approval Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredProducts.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50 dark:hover:bg-gray-850/40 transition">
                    <td className="p-4">
                      <div className="flex gap-3 items-center">
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          className="w-10 h-10 rounded-lg object-cover border border-gray-200 dark:border-gray-700"
                        />
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white line-clamp-1">{p.title}</p>
                          <span className="text-[10px] text-gray-400 capitalize">{p.condition}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{p.category}</td>
                    <td className="p-4 font-bold text-gray-900 dark:text-white">${p.price}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{p.stock}</td>
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
                          title="View Listing"
                        >
                          <Eye size={14} />
                        </Link>
                        <button
                          onClick={() => startEdit(p)}
                          className="p-1.5 bg-gray-100 hover:bg-primary-600 hover:text-white dark:bg-gray-800 dark:hover:bg-primary-500 rounded-lg text-gray-700 dark:text-gray-300 transition"
                          title="Edit Listing"
                        >
                          <Edit3 size={14} />
                        </button>
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="py-16 text-center space-y-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl">
          <Layers className="mx-auto text-gray-400" size={32} />
          <h3 className="font-bold text-gray-900 dark:text-white text-base">No Listings Found</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
            You haven't listed any products matching the current criteria. Let's create your first catalog listing!
          </p>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <form
            onSubmit={handleUpdateSubmit}
            className="bg-white dark:bg-gray-900 max-w-2xl w-full p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto animate-fade-in"
          >
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3">
              <h3 className="font-extrabold text-gray-950 dark:text-white text-base">Edit Product Details</h3>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Category</label>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-xs text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-primary-500"
                >
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Condition</label>
                <select
                  value={editForm.condition}
                  onChange={(e) => setEditForm({ ...editForm, condition: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-xs text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="Used">Used</option>
                  <option value="Like New">Like New</option>
                  <option value="Refurbished">Refurbished</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Price ($)</label>
                <input
                  type="number"
                  value={editForm.price}
                  onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                  required
                  min="0.01"
                  step="0.01"
                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Stock</label>
                <input
                  type="number"
                  value={editForm.stock}
                  onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                  required
                  min="0"
                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Location</label>
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
                />
              </div>

              {/* Brand */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Brand</label>
                <input
                  type="text"
                  value={editForm.brand}
                  onChange={(e) => setEditForm({ ...editForm, brand: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
                  placeholder="e.g. Sony"
                />
              </div>

              {/* Model */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Model</label>
                <input
                  type="text"
                  value={editForm.model}
                  onChange={(e) => setEditForm({ ...editForm, model: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
                  placeholder="e.g. PlayStation 5"
                />
              </div>

              {/* Features */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Product Features (Comma-separated)</label>
                <input
                  type="text"
                  value={editForm.features}
                  onChange={(e) => setEditForm({ ...editForm, features: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
                  placeholder="e.g. 100% Genuine, Water Resistant, Original Box"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  required
                  rows={3}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
                />
              </div>

              {/* Images — URL inputs */}
              <div className="space-y-3 sm:col-span-2">
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  <ImageIcon size={13} className="text-primary-500" /> Product Images (URLs)
                </label>

                {/* Existing images list with remove */}
                {editForm.images.map((img, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    {img && (
                      <img
                        src={img}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover border border-gray-200 dark:border-gray-700 flex-shrink-0"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    )}
                    <input
                      type="url"
                      value={img}
                      onChange={(e) => {
                        const updated = [...editForm.images];
                        updated[idx] = e.target.value;
                        setEditForm(prev => ({ ...prev, images: updated }));
                      }}
                      className="flex-grow px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
                      placeholder={`Image URL ${idx + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeEditImage(idx)}
                      className="p-1.5 bg-danger-500 hover:bg-danger-600 text-white rounded-lg transition flex-shrink-0"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}

                {/* Add another URL */}
                <button
                  type="button"
                  onClick={() => setEditForm(prev => ({ ...prev, images: [...prev.images, ''] }))}
                  className="flex items-center gap-1.5 text-xs text-primary-600 dark:text-primary-400 font-semibold hover:underline"
                >
                  <Plus size={13} /> Add another image URL
                </button>
                <p className="text-[10px] text-gray-400">Use ImageBB, Cloudinary, or any direct image URL.</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updating}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white text-xs font-semibold rounded-xl shadow transition"
              >
                {updating ? <Loader2 className="animate-spin mr-1 inline" size={12} /> : null}
                Save Updates
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
