'use client';

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext, API_URL } from '../../../components/Providers';
import { CheckSquare, Edit3, Trash2, Loader2, Plus, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CategoryManagement() {
  const { token } = useContext(AuthContext);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states (handles both create & edit)
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    image: '',
    description: ''
  });

  useEffect(() => {
    if (token) {
      loadCategories();
    }
  }, [token]);

  const loadCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/api/categories`);
      const data = await res.json();
      if (data.success) setCategories(data.categories);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.image || !form.description.trim()) {
      return toast.error('All fields are required');
    }

    setSubmitting(true);
    try {
      const url = editId ? `${API_URL}/api/categories/${editId}` : `${API_URL}/api/categories`;
      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();

      if (data.success) {
        toast.success(data.message || 'Category saved!');
        setForm({ name: '', image: '', description: '' });
        setEditId(null);
        loadCategories();
      } else {
        toast.error(data.message || 'Failed to save category');
      }
    } catch (err) {
      toast.error('Network error saving category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (cat) => {
    setEditId(cat._id);
    setForm({
      name: cat.name,
      image: cat.image,
      description: cat.description
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category? Products listed under it will lose their category association.')) return;

    try {
      const res = await fetch(`${API_URL}/api/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Category deleted successfully');
        setCategories(categories.filter(c => c._id !== id));
      } else {
        toast.error(data.message || 'Failed to delete');
      }
    } catch (err) {
      toast.error('Network error deleting category');
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
        <h2 className="text-2xl font-extrabold text-gray-950 dark:text-white">Category CRUD</h2>
        <p className="text-xs text-gray-500">Create, edit, and moderate marketplace classification categories</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Category Form */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl h-fit space-y-4 shadow-sm">
          <h3 className="font-bold text-gray-990 dark:text-white text-sm uppercase tracking-wider">
            {editId ? 'Edit Category' : 'Create Category'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Category Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
                placeholder="e.g. Video Games"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
                rows={3}
                className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
                placeholder="Short description..."
              />
            </div>

            {/* Category Image URL */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <ImageIcon size={13} className="text-primary-500" /> Category Image URL
              </label>
              {form.image && (
                <img
                  src={form.image}
                  alt="Preview"
                  className="w-full h-28 object-cover rounded-xl border border-gray-200 dark:border-gray-700"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
              <input
                type="url"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                required
                className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
                placeholder="https://i.ibb.co/example-banner.jpg"
              />
              <p className="text-[10px] text-gray-400">ImageBB, Cloudinary or any direct image URL.</p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-grow py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-bold text-xs rounded-xl shadow transition"
              >
                {submitting ? <Loader2 className="animate-spin mr-1 inline" size={12} /> : null}
                {editId ? 'Save Changes' : 'Create Category'}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditId(null);
                    setForm({ name: '', image: '', description: '' });
                  }}
                  className="px-3 py-2 border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-100 rounded-xl text-xs"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Categories Table List */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl shadow-sm space-y-4">
          <h3 className="font-bold text-gray-955 dark:text-white text-sm uppercase tracking-wider">
            Active Categories ({categories.length})
          </h3>

          {categories.length > 0 ? (
            <div className="space-y-3">
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  className="border border-gray-100 dark:border-gray-800 p-4 rounded-2xl flex items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-850/30 transition"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-12 h-12 rounded-xl object-cover border border-gray-200 dark:border-gray-700"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-gray-950 dark:text-white">{cat.name}</h4>
                      <p className="text-[10px] text-gray-400 line-clamp-1">{cat.description}</p>
                      <span className="text-[10px] text-primary-500 font-semibold">
                        {cat.productCount || 0} active products
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="p-1.5 bg-gray-100 hover:bg-primary-600 hover:text-white dark:bg-gray-805 dark:hover:bg-primary-500 rounded-lg text-gray-700 dark:text-gray-300 transition"
                      title="Edit Category"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="p-1.5 border border-danger-200 text-danger-500 hover:bg-danger-500 hover:text-white rounded-lg transition"
                      title="Delete Category"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500 py-6 text-center border border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
              No categories created yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
