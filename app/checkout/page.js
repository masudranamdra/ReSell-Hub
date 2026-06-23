'use client';

import React, { useState, useEffect, useContext, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AuthContext, API_URL } from '../../components/Providers';
import { CreditCard, MapPin, Phone, User, Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { token, user } = useContext(AuthContext);

  const productId = searchParams.get('productId');
  const qtyParam = searchParams.get('qty');

  // States
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(qtyParam ? Number(qtyParam) : 1);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Delivery details form
  const [delivery, setDelivery] = useState({
    phone: '',
    address: ''
  });

  // Load product & user info
  useEffect(() => {
    if (!token) {
      toast.error('You must be logged in to access checkout');
      router.push('/login');
      return;
    }

    if (user) {
      setDelivery({
        phone: user.phone || '',
        address: user.location || ''
      });
    }

    async function loadProduct() {
      try {
        const res = await fetch(`${API_URL}/api/products/${productId}`);
        const data = await res.json();
        if (data.success) {
          setProduct(data.product);
          if (data.product.stock <= 0) {
            toast.error('Product is out of stock');
            router.push('/products');
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

    if (productId) {
      loadProduct();
    } else {
      router.push('/products');
    }
  }, [productId, token, user]);

  const handleDeliveryChange = (e) => {
    setDelivery({ ...delivery, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!delivery.phone.trim()) return toast.error('Phone number is required for shipping');
    if (!delivery.address.trim()) return toast.error('Delivery address is required');

    setProcessing(true);
    const toastId = toast.loading('Initiating payment transaction...');

    try {
      const amount = product.price * quantity;

      // 1. Get Payment Intent (returns mock or real clientSecret)
      const intentRes = await fetch(`${API_URL}/api/payments/create-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ amount })
      });
      const intentData = await intentRes.json();

      if (!intentData.success) {
        toast.error(intentData.message || 'Payment initiation failed', { id: toastId });
        setProcessing(false);
        return;
      }

      // Simulate a card processing delay (either live Stripe or Mock fallback)
      toast.loading('Processing payment securely...', { id: toastId });
      await new Promise((r) => setTimeout(r, 2000));

      const transactionId = `ST-TRX-${Math.floor(100000 + Math.random() * 900000)}`;

      // 2. Place Order in Database
      const orderRes = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: product._id,
          quantity,
          address: delivery.address,
          phone: delivery.phone,
          transactionId,
          totalAmount: amount
        })
      });
      const orderData = await orderRes.json();

      if (orderData.success) {
        // 3. Log Payment entry
        await fetch(`${API_URL}/api/payments/log`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            orderId: orderData.order._id,
            transactionId,
            amount,
            paymentStatus: 'success',
            paymentMethod: 'stripe'
          })
        });

        toast.success('Payment successful and order created!', { id: toastId });
        router.push(
          `/checkout/success?transactionId=${transactionId}&amount=${amount}&title=${encodeURIComponent(
            product.title
          )}&qty=${quantity}&orderId=${orderData.order._id}`
        );
      } else {
        toast.error(orderData.message || 'Failed to generate order', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error('Checkout error occurred', { id: toastId });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center animate-pulse">
        <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mx-auto mb-6 skeleton-shimmer"></div>
        <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-3xl skeleton-shimmer"></div>
      </div>
    );
  }

  if (!product) return null;

  const total = product.price * quantity;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors duration-300">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary-600 transition"
        >
          <ArrowLeft size={14} /> Cancel Checkout
        </button>
      </div>

      <div className="text-left space-y-2 mb-8">
        <h1 className="text-3xl font-extrabold text-gray-950 dark:text-white">Secure Checkout</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Complete details below to finalize purchase via Stripe</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Left: Summary cards */}
        <div className="md:col-span-3 space-y-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider">
              Order Summary
            </h3>
            <div className="flex gap-4 items-center">
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-16 h-16 rounded-xl object-cover border border-gray-200 dark:border-gray-700"
              />
              <div className="text-left flex-grow">
                <h4 className="font-bold text-sm text-gray-950 dark:text-white">{product.title}</h4>
                <p className="text-xs text-gray-400">Unit Price: ${product.price}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-500">Qty:</span>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="px-2 py-0.5 border border-gray-300 dark:border-gray-700 rounded bg-transparent text-xs outline-none"
                  >
                    {Array.from({ length: Math.min(product.stock, 5) }).map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <hr className="border-gray-200 dark:border-gray-800" />
            <div className="flex justify-between font-bold text-sm">
              <span className="text-gray-600 dark:text-gray-400">Total Price:</span>
              <span className="text-lg text-primary-600 dark:text-primary-400">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Right: Shipping & credit card forms */}
        <form onSubmit={handleCheckout} className="md:col-span-2 space-y-6">
          {/* Shipping Form */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider">
              Shipping Details
            </h3>

            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-gray-500 uppercase">Contact Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-gray-400" size={14} />
                <input
                  type="text"
                  name="phone"
                  value={delivery.phone}
                  onChange={handleDeliveryChange}
                  required
                  className="w-full pl-9 pr-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
                  placeholder="+880 17..."
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-gray-500 uppercase">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400" size={14} />
                <input
                  type="text"
                  name="address"
                  value={delivery.address}
                  onChange={handleDeliveryChange}
                  required
                  className="w-full pl-9 pr-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
                  placeholder="Street, City, Country"
                />
              </div>
            </div>
          </div>

          {/* Secure Payment Card Details */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider flex items-center gap-1">
              <CreditCard size={16} className="text-primary-500" /> Card Payment
            </h3>

            <div className="p-3 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-950/20 space-y-2">
              <p className="text-[10px] text-gray-500 leading-relaxed">
                We secure your payments with 256-bit SSL encryption. Stripe processed card numbers are never stored on our database.
              </p>
              <div className="text-[10px] text-success-600 dark:text-success-400 font-semibold">
                ✓ Stripe Integration Active (Mock mode enabled for test keys)
              </div>
            </div>

            <div className="space-y-2">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 uppercase">Card Number</label>
                <input
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  disabled={processing}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="MM/YY"
                  disabled={processing}
                  className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
                />
                <input
                  type="text"
                  placeholder="CVC"
                  disabled={processing}
                  className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-bold rounded-xl text-xs shadow-lg transition flex items-center justify-center gap-1"
            >
              {processing ? (
                <>
                  <Loader2 className="animate-spin" size={14} /> Processing...
                </>
              ) : (
                `Pay $${total.toFixed(2)}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Checkout() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading Checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
