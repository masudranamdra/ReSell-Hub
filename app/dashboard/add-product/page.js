'use client';

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext, API_URL } from '../../../components/Providers';
import { ShoppingCart, Upload, Loader2, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function AddProduct() {
  const { token, user } = useContext(AuthContext);
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    condition: 'Used',
    price: '',
    stock: '1',
    location: '',
    images: []
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Redirect if not seller
    if (user && user.role !== 'seller') {
      toast.error('Only sellers can access this page');
      router.push('/dashboard');
    }

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

  // Upload multiple images to ImageBB
  const handleMultipleImagesUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const toastId = toast.loading(`Uploading ${files.length} image(s) to ImageBB...`);

    try {
      const uploadedUrls = [];
      const apiKey = '8ca6992d99d1944747ebc79f323a7bbd';

      for (const file of files) {
        const uploadData = new FormData();
        uploadData.append('image', file);

        const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
          method: 'POST',
          body: uploadData
        });
        const data = await res.json();
        if (data.success) {
          uploadedUrls.push(data.data.url);
        }
      }

      if (uploadedUrls.length > 0) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...uploadedUrls]
        }));
        toast.success(`Successfully uploaded ${uploadedUrls.length} image(s)!`, { id: toastId });
      } else {
        toast.error('Failed to upload images.', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error('Connection error during upload.', { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
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
    if (formData.images.length === 0) return toast.error('At least one product image is required');

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
          images: formData.images
        })
      });
      const data = await res.json();

      if (data.success) {
        toast.success(data.message || 'Product listed successfully for approval!');
        // Reset form
        setFormData({
          title: '',
          description: '',
          category: '',
          condition: 'Used',
          price: '',
          stock: '1',
          location: '',
          images: []
        });
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

  return (
    <div className="space-y-6 animate-fade-in transition-colors duration-300">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-950 dark:text-white">List a Product</h2>
        <p className="text-xs text-gray-500">Sell your unused items and help promote sustainable trading</p>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 sm:p-8 rounded-3xl shadow-sm max-w-3xl">
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
                className="w-full px-3 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
                placeholder="e.g. Used iPhone 13 Pro Max - 256GB"
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
                className="w-full px-3 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-xs text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-primary-500"
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
                className="w-full px-3 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-xs text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="Used">Used</option>
                <option value="Like New">Like New</option>
                <option value="Refurbished">Refurbished</option>
              </select>
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
                className="w-full px-3 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
                placeholder="e.g. 599.99"
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
                className="w-full px-3 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
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
                className="w-full px-3 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
                placeholder="e.g. Gulshan, Dhaka"
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
                className="w-full px-3 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
                placeholder="Describe your product condition, usage duration, box/accessories details..."
              />
            </div>

            {/* Images Panel */}
            <div className="space-y-2 sm:col-span-2">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Product Images</label>
              
              <div className="flex flex-wrap gap-4 items-center">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    <img src={img} alt="Product preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-danger-500 hover:bg-danger-600 text-white rounded-full transition shadow"
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                ))}

                <label className="w-20 h-20 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 transition gap-1 bg-gray-50 dark:bg-gray-950/20">
                  <Plus className="text-gray-400" size={16} />
                  <span className="text-[10px] text-gray-500">Add</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleMultipleImagesUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
              <p className="text-[10px] text-gray-400">Submit at least 1 image. Multiple files selection supported.</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || uploading}
            className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center gap-1.5"
          >
            {loading ? <Loader2 className="animate-spin" size={14} /> : null}
            Submit Product Listing
          </button>
        </form>
      </div>
    </div>
  );
}
