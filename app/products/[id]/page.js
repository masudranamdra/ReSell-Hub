'use client';

import React, { useState, useEffect, useContext } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthContext, API_URL } from '../../../components/Providers';
import { Star, Heart, AlertTriangle, ShieldCheck, ShoppingCart, BarChart3, Bell, ArrowLeft, User, Sparkles, MapPin, Layers, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useContext(AuthContext);

  // States
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [wishlisted, setWishlisted] = useState(false);
  const [inComparison, setInComparison] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  // Review form states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Report modal states
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState('Suspicious listing');
  const [reporting, setReporting] = useState(false);

  // Alert state
  const [subscribedAlert, setSubscribedAlert] = useState(false);

  // Fetch product data
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/products/${id}`);
        const data = await res.json();
        if (data.success) {
          setProduct(data.product);
          setReviews(data.reviews);
          
          // Track recently viewed products
          trackRecentlyViewed(data.product);

          // Fetch related products
          const relRes = await fetch(`${API_URL}/api/products?category=${encodeURIComponent(data.product.category)}&limit=5`);
          const relData = await relRes.json();
          if (relData.success) {
            setRelatedProducts(relData.products.filter(p => p._id !== data.product._id));
          }
        } else {
          toast.error('Product not found');
          router.push('/products');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  // Check wishlist state on user/token update
  useEffect(() => {
    if (token && product) {
      checkWishlistStatus();
    }
    if (product) {
      checkComparisonStatus();
    }
  }, [token, product]);

  const checkWishlistStatus = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users/wishlist`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        const hasIt = data.wishlist.some(item => item.productId && item.productId._id === product._id);
        setWishlisted(hasIt);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const checkComparisonStatus = () => {
    const list = JSON.parse(localStorage.getItem('compare_list') || '[]');
    setInComparison(list.some(item => item._id === product._id));
  };

  // Recently viewed tracker
  const trackRecentlyViewed = (prod) => {
    let viewed = JSON.parse(localStorage.getItem('recently_viewed') || '[]');
    viewed = viewed.filter(item => item._id !== prod._id); // Remove duplicate
    viewed.unshift({
      _id: prod._id,
      title: prod.title,
      price: prod.price,
      image: prod.images[0],
      condition: prod.condition
    });
    // Keep max 4
    if (viewed.length > 4) viewed.pop();
    localStorage.setItem('recently_viewed', JSON.stringify(viewed));
  };

  // Wishlist Action
  const toggleWishlist = async () => {
    if (!token) {
      toast.error('Please login to manage wishlist');
      return router.push('/login');
    }

    try {
      const method = wishlisted ? 'DELETE' : 'POST';
      const res = await fetch(`${API_URL}/api/users/wishlist/${product._id}`, {
        method,
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setWishlisted(!wishlisted);
        toast.success(method === 'POST' ? 'Added to wishlist!' : 'Removed from wishlist!');
      } else {
        toast.error(data.message || 'Operation failed');
      }
    } catch (err) {
      toast.error('Network error updating wishlist');
    }
  };

  // Add to cart helper
  const addToCart = () => {
    const currentCart = JSON.parse(localStorage.getItem('cart_items') || '[]');
    const exists = currentCart.some(item => item._id === product._id);
    if (exists) {
      toast.error('Item is already in your cart!');
      return;
    }
    currentCart.push({
      _id: product._id,
      title: product.title,
      price: product.price,
      image: product.images[0],
      category: product.category,
      condition: product.condition,
      sellerInfo: product.sellerInfo,
      quantity: 1
    });
    localStorage.setItem('cart_items', JSON.stringify(currentCart));
    toast.success('Added to cart!');
    window.dispatchEvent(new Event('cartUpdate'));
  };

  // Comparison toggle
  const toggleComparison = () => {
    let list = JSON.parse(localStorage.getItem('compare_list') || '[]');
    if (inComparison) {
      list = list.filter(item => item._id !== product._id);
      localStorage.setItem('compare_list', JSON.stringify(list));
      setInComparison(false);
      toast.success('Removed from product comparison');
    } else {
      if (list.length >= 3) {
        toast.error('You can compare a maximum of 3 products at a time');
        return;
      }
      list.push({
        _id: product._id,
        title: product.title,
        price: product.price,
        condition: product.condition,
        category: product.category,
        image: product.images[0],
        sellerRating: product.sellerInfo?.rating || '4.5'
      });
      localStorage.setItem('compare_list', JSON.stringify(list));
      setInComparison(true);
      toast.success('Added to product comparison!');
    }
  };

  // Report submit
  const handleReport = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error('Please login to file a report');
      return router.push('/login');
    }

    setReporting(true);
    try {
      const res = await fetch(`${API_URL}/api/products/${product._id}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ reason: reportReason })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Product reported successfully. Admins will review.');
        setReportOpen(false);
      } else {
        toast.error(data.message || 'Reporting failed');
      }
    } catch (err) {
      toast.error('Network error reporting product');
    } finally {
      setReporting(false);
    }
  };

  // Alert Restock Subscription
  const handleAlertSubscription = async () => {
    if (!token) {
      toast.error('Please login to subscribe to availability alerts');
      return router.push('/login');
    }

    try {
      const res = await fetch(`${API_URL}/api/products/${product._id}/alert`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSubscribedAlert(true);
        toast.success('Subscribed to alerts successfully!');
      } else {
        toast.error(data.message || 'Subscription failed');
      }
    } catch (err) {
      toast.error('Network error subscribing');
    }
  };

  // Submit Review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error('Please login to submit a review');
      return router.push('/login');
    }
    if (!comment.trim()) {
      return toast.error('Review comment cannot be empty');
    }

    setSubmittingReview(true);
    try {
      const res = await fetch(`${API_URL}/api/products/${product._id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ rating, comment })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Review submitted successfully!');
        setReviews([data.review, ...reviews]);
        setComment('');
      } else {
        toast.error(data.message || 'Failed to submit review');
      }
    } catch (err) {
      toast.error('Network error submitting review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 space-y-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-gray-200 dark:bg-gray-800 h-96 rounded-3xl skeleton-shimmer"></div>
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-3/4 skeleton-shimmer"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/4 skeleton-shimmer"></div>
            <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded skeleton-shimmer"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors duration-300">
      {/* Product top path */}
      <div className="mb-6 text-left">
        <button onClick={() => router.back()} className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary-600 transition">
          <ArrowLeft size={14} /> Back to Products
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-left">
        {/* Left Column: Images Panel */}
        <div className="space-y-4">
          <div className="rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 h-[450px] relative shadow-lg">
            <img
              src={product.images[activeImage] || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600'}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                <span className="bg-danger-500 text-white font-extrabold text-lg px-6 py-2 rounded-xl shadow-lg uppercase tracking-wide">
                  Sold Out
                </span>
              </div>
            )}
          </div>
          {/* Thumbnails if multiple images */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`w-20 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition ${
                    activeImage === index ? 'border-primary-500 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Information Panel */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 bg-primary-100 text-primary-850 dark:bg-primary-950/40 dark:text-primary-300 text-[10px] font-bold uppercase tracking-wider rounded-full">
                {product.condition}
              </span>
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-wider rounded-full">
                {product.category}
              </span>
            </div>
            <h1 className="text-3xl font-black text-gray-950 dark:text-white leading-tight">
              {product.title}
            </h1>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <MapPin size={12} className="text-primary-500" /> Location: {product.location}
            </p>
          </div>

          <div className="flex items-baseline gap-4 border-b border-gray-200 dark:border-gray-800 pb-4">
            <span className="text-3xl font-black bg-gradient-to-r from-primary-600 to-indigo-500 bg-clip-text text-transparent">
              ${product.price}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-lg">
              Stock available: {product.stock} units
            </span>
          </div>

          {/* Model and Brand Details */}
          {(product.brand || product.model) && (
            <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-900/30 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
              {product.brand && (
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Brand</span>
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{product.brand}</span>
                </div>
              )}
              {product.model && (
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Model</span>
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{product.model}</span>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">Product Description</h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Product Features */}
          {product.features && product.features.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-1">
                <Sparkles size={14} className="text-primary-500" /> Key Features
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400 font-medium">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-900/20 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-gray-800/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Seller Information */}
          <div className="bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl space-y-3 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white text-xs uppercase tracking-wider">
              Seller Information
            </h3>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 dark:bg-primary-950 dark:text-primary-400 flex items-center justify-center font-bold">
                  {product.sellerInfo?.name?.charAt(0) || 'S'}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/sellers/${product.sellerInfo?.userId}`}
                      className="font-bold text-sm text-gray-900 dark:text-white hover:text-primary-600 transition"
                    >
                      {product.sellerInfo?.name || 'Seller'}
                    </Link>
                    {product.sellerInfo?.verified && (
                      <span className="text-success-500" title="Verified Seller">
                        <ShieldCheck size={16} fill="currentColor" className="text-white dark:text-gray-950" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{product.sellerInfo?.email}</p>
                </div>
              </div>
              <Link
                href={`/sellers/${product.sellerInfo?.userId}`}
                className="text-xs text-primary-600 hover:underline font-semibold"
              >
                View Profile
              </Link>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            {isOutOfStock ? (
              <button
                onClick={handleAlertSubscription}
                disabled={subscribedAlert}
                className="flex-grow flex items-center justify-center gap-2 py-3 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold rounded-xl border border-gray-200 dark:border-gray-700 transition"
              >
                <Bell size={18} />
                {subscribedAlert ? 'Subscribed to Alerts' : 'Alert When Available'}
              </button>
            ) : (
              <>
                <button
                  onClick={addToCart}
                  className="flex-grow sm:w-1/3 flex items-center justify-center gap-2 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-primary-600 hover:text-white dark:hover:bg-primary-500 text-gray-800 dark:text-gray-200 font-bold rounded-xl transition shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <ShoppingCart size={18} /> Add To Cart
                </button>
                <Link
                  href={`/checkout?productId=${product._id}`}
                  className="flex-grow flex items-center justify-center gap-2 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg transition"
                >
                  Buy Now
                </Link>
              </>
            )}

            <div className="flex gap-2">
              <button
                onClick={toggleWishlist}
                className={`p-3 rounded-xl border flex items-center justify-center transition ${
                  wishlisted
                    ? 'bg-primary-50 border-primary-500 text-primary-600 dark:bg-primary-950/30'
                    : 'border-gray-300 hover:border-primary-500 text-gray-500 hover:text-primary-600 dark:border-gray-700'
                }`}
                title="Add to Wishlist"
              >
                <Heart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
              </button>

              <button
                onClick={toggleComparison}
                className={`px-4 py-3 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
                  inComparison
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-600 dark:bg-indigo-950/30'
                    : 'border-gray-300 hover:border-indigo-500 text-gray-500 hover:text-indigo-600 dark:border-gray-700'
                }`}
              >
                <BarChart3 size={16} />
                {inComparison ? 'Compared' : 'Compare'}
              </button>

              <button
                onClick={() => setReportOpen(true)}
                className="px-4 py-3 rounded-xl border border-gray-300 hover:border-danger-500 text-gray-500 hover:text-danger-500 dark:border-gray-700 text-xs font-bold transition flex items-center gap-1.5"
              >
                <AlertTriangle size={16} />
                Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12 border-t border-gray-200 dark:border-gray-800 pt-10 text-left">
        {/* Left: Review summary & submit form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-950 dark:text-white">Customer Reviews</h2>
            <p className="text-xs text-gray-500">Read what other buyers think of this seller's products</p>
          </div>

          <form onSubmit={handleSubmitReview} className="space-y-4 bg-gray-50 dark:bg-gray-900/40 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-900 dark:text-white">Leave a Review</h3>
            
            {/* Rating Selector */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Rating</label>
              <div className="flex gap-1 text-amber-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star size={20} fill={star <= rating ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Field */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                required
                className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
                placeholder="Write your review here..."
              />
            </div>

            <button
              type="submit"
              disabled={submittingReview}
              className="w-full py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-semibold text-xs rounded-xl shadow transition"
            >
              Submit Review
            </button>
          </form>
        </div>

        {/* Right: Reviews List */}
        <div className="lg:col-span-2 space-y-4">
          {reviews.length > 0 ? (
            reviews.map((rev) => (
              <div
                key={rev._id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-xs text-gray-600 dark:text-gray-400">
                      {rev.reviewerInfo?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                        {rev.reviewerInfo?.name}
                      </p>
                      <span className="text-[10px] text-gray-400">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        fill={i < rev.rating ? 'currentColor' : 'none'}
                        className="text-amber-500"
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  {rev.comment}
                </p>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-xs text-gray-500 dark:text-gray-400 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
              No reviews left for this product yet. Be the first to leave one!
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 border-t border-gray-250 dark:border-gray-800 pt-10 space-y-6 text-left">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-gray-950 dark:text-white flex items-center gap-2">
              <Layers className="text-primary-500" size={20} /> Related Products
            </h2>
            <Link href="/products" className="text-xs text-primary-600 hover:underline font-bold">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <Link
                key={rel._id}
                href={`/products/${rel._id}`}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col group"
              >
                <div className="h-32 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
                  <img
                    src={rel.images[0]}
                    alt={rel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2 left-2 bg-primary-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full capitalize">
                    {rel.condition}
                  </span>
                </div>
                <div className="mt-3 space-y-1 flex-grow flex flex-col justify-between">
                  <div>
                    <h4 className="font-extrabold text-xs text-gray-900 dark:text-white line-clamp-1 group-hover:text-primary-600 transition">
                      {rel.title}
                    </h4>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-1">
                      {rel.location}
                    </p>
                  </div>
                  <div className="flex justify-between items-center pt-2 mt-1 border-t border-gray-50 dark:border-gray-800/80">
                    <span className="text-xs font-black text-primary-600 dark:text-primary-400">
                      ${rel.price}
                    </span>
                    <span className="text-[9px] font-bold text-gray-400 capitalize">
                      {rel.category}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Report Product Modal */}
      {reportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <form
            onSubmit={handleReport}
            className="bg-white dark:bg-gray-900 max-w-md w-full p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl space-y-4 animate-fade-in"
          >
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-2">
              <h3 className="font-extrabold text-gray-900 dark:text-white text-base">Report Inappropriate Listing</h3>
              <button
                type="button"
                onClick={() => setReportOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                &times;
              </button>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Reason for report</label>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-xs text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="Suspicious listing">Suspicious listing / Scammer profile</option>
                <option value="Misleading details">Misleading details / Incorrect condition</option>
                <option value="Inappropriate picture">Inappropriate pictures or language</option>
                <option value="Counterfeit item">Counterfeit / Fake product trademark</option>
                <option value="Stolen property">Stolen property reporting</option>
              </select>
            </div>

            <div className="flex gap-3 justify-end pt-2 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setReportOpen(false)}
                className="px-4 py-2 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={reporting}
                className="px-4 py-2 bg-danger-500 hover:bg-danger-600 text-white text-xs font-semibold rounded-xl shadow transition"
              >
                Submit Report
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
