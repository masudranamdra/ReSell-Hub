'use client';

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext, API_URL } from '../../../../components/Providers';
import { ShoppingCart, Loader2, Plus, Image as ImageIcon, Sparkles, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AddProduct() {
  const { token, user, applySeller } = useContext(AuthContext);
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    condition: 'Used',
    price: '',
    stock: '1',
    location: '',
    brand: '',
    model: '',
    imageUrl: '',
    features: ''
  });

  const [additionalImages, setAdditionalImages] = useState(['']);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);

  const handleApplySeller = async () => {
    setApplying(true);
    await applySeller();
    setApplying(false);
  };

  useEffect(() => {
    // Load categories
    async function loadCategories() {
      try {
        const res = await fetch(`${API_URL}/api/categories`);
        const data = await res.json();
        if (data.success) setCategories(data.categories);
      } catch (err) {
        console.error(err);
      }
    }
    loadCategories();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!formData.title.trim()) return toast.error('Product title is required');
    if (!formData.description.trim()) return toast.error('Product description is required');
    if (!formData.category) return toast.error('Please select a category');
    if (Number(formData.price) <= 0) return toast.error('Price must be greater than 0');
    if (Number(formData.stock) < 1) return toast.error('Stock must be at least 1');
    if (!formData.location.trim()) return toast.error('Location is required');
    if (!formData.imageUrl.trim()) return toast.error('Image URL is required');

    // Parse image URLs into array
    const images = [formData.imageUrl.trim()];
    additionalImages.forEach((img) => {
      if (img.trim()) {
        images.push(img.trim());
      }
    });

    // Parse features (comma separated string -> array of strings)
    const features = formData.features
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          condition: formData.condition,
          price: Number(formData.price),
          stock: Number(formData.stock),
          location: formData.location,
          brand: formData.brand,
          model: formData.model,
          images,
          features
        })
      });
      const data = await res.json();

      if (data.success) {
        toast.success('Product listed successfully! Awaiting admin approval.');
        // Reset form
        setFormData({
          title: '',
          description: '',
          category: '',
          condition: 'Used',
          price: '',
          stock: '1',
          location: '',
          brand: '',
          model: '',
          imageUrl: '',
          features: ''
        });
        setAdditionalImages(['']);
        router.push('/dashboard/my-products');
      } else {
        toast.error(data.message || 'Listing creation failed');
      }
    } catch (err) {
      toast.error('Network error creating listing');
    } finally {
      setLoading(false);
    }
  };

  if (user && user.role !== 'seller' && user.role !== 'admin') {
    return (
      <div className="space-y-6 animate-fade-in text-left">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-950 dark:text-white flex items-center gap-2">
            <ShoppingCart className="text-primary-500" size={24} /> Add Product
          </h2>
          <p className="text-xs text-gray-500">Sell your unused items and help promote sustainable trading</p>
        </div>

        <div className="max-w-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 rounded-3xl shadow-xl space-y-6">
          <div className="flex items-center gap-3 text-amber-600 dark:text-amber-500 bg-amber-500/10 p-4 rounded-xl border border-amber-500/20">
            <ShieldAlert size={20} className="flex-shrink-0" />
            <p className="text-xs font-semibold">
              Seller approval is required before listing products.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Become a Seller</h3>
            <p className="text-xs text-gray-500">
              To start listing products on our marketplace, you need to apply for seller status. Admin verification is required to maintain platform trust.
            </p>
          </div>

          <div>
            {(!user.sellerRequestStatus || user.sellerRequestStatus === 'none') && (
              <button
                onClick={handleApplySeller}
                disabled={applying}
                className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all animate-fade-in"
              >
                {applying ? 'Submitting...' : 'Apply to become a Seller'}
              </button>
            )}
            {user.sellerRequestStatus === 'pending' && (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-xl animate-fade-in">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Seller Application Pending Admin Approval
              </span>
            )}
            {user.sellerRequestStatus === 'rejected' && (
              <div className="space-y-4 animate-fade-in">
                <p className="text-xs text-danger-500 font-semibold bg-danger-50 dark:bg-danger-950/20 border border-danger-100 dark:border-danger-950/30 p-3 rounded-lg">
                  Your previous application was rejected. Please review your profile details or contact support.
                </p>
                <button
                  onClick={handleApplySeller}
                  disabled={applying}
                  className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all"
                >
                  {applying ? 'Submitting...' : 'Apply again'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in transition-colors duration-300">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-950 dark:text-white flex items-center gap-2">
          <ShoppingCart className="text-primary-500" size={24} /> Add Product
        </h2>
        <p className="text-xs text-gray-500">Sell your unused items and help promote sustainable trading</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 sm:p-8 rounded-3xl shadow-xl max-w-4xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Title */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Product Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
                placeholder="e.g. Vintage Leather Jacket"
              />
            </div>

            {/* Category Dropdown */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Condition Dropdown */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Condition</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="Used">Used</option>
                <option value="Like New">Like New</option>
                <option value="Refurbished">Refurbished</option>
              </select>
            </div>

            {/* Brand */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
                placeholder="e.g. Levi's"
              />
            </div>

            {/* Model */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Model</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
                placeholder="e.g. 501 Original"
              />
            </div>

            {/* Price */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Price ($)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0.01"
                step="0.01"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
                placeholder="e.g. 45.00"
              />
            </div>

            {/* Stock Quantity */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Stock Quantity</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
              />
            </div>

            {/* Location */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Location (City, Area)</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
                placeholder="e.g. Banani, Dhaka"
              />
            </div>

            {/* Description */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Product Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
                placeholder="Detailed description of the product (condition, usage, flaws etc.)..."
              />
            </div>

            {/* Image URL Input */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <ImageIcon size={14} className="text-primary-500" /> Product Image URL
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
                placeholder="https://i.ibb.co/example.jpg"
              />
            </div>

            {/* Additional Image URLs */}
            <div className="space-y-3 sm:col-span-2">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <ImageIcon size={14} className="text-gray-450" /> Additional Image URLs (Optional)
              </label>

              {additionalImages.map((img, idx) => (
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
                      const updated = [...additionalImages];
                      updated[idx] = e.target.value;
                      setAdditionalImages(updated);
                    }}
                    className="flex-grow px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
                    placeholder="https://i.ibb.co/example.jpg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setAdditionalImages(additionalImages.filter((_, i) => i !== idx));
                    }}
                    className="p-2.5 bg-danger-500 hover:bg-danger-600 text-white rounded-xl transition flex-shrink-0"
                  >
                    <Plus className="rotate-45" size={14} />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => setAdditionalImages([...additionalImages, ''])}
                className="flex items-center gap-1.5 text-xs text-primary-600 dark:text-primary-400 font-semibold hover:underline"
              >
                <Plus size={13} /> Add another image URL
              </button>
            </div>

            {/* Product Features */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <Sparkles size={14} className="text-indigo-500" /> Product Features (Comma-separated)
              </label>
              <input
                type="text"
                name="features"
                value={formData.features}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
                placeholder="e.g. 100% Genuine, Water Resistant, Original Box"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-lg transition flex items-center justify-center gap-1.5"
          >
            {loading ? <Loader2 className="animate-spin" size={14} /> : null}
            Submit Product Listing
          </button>
        </form>
      </motion.div>
    </div>
  );
}
