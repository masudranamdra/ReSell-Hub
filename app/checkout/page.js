'use client';

import React, { useState, useEffect, useContext, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AuthContext, API_URL } from '../../components/Providers';
import { CreditCard, MapPin, Phone, User, Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { token, user, authLoading } = useContext(AuthContext);

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

  // Payment popup & card states
  const [selectedBrand, setSelectedBrand] = useState('visa'); // 'visa' | 'mastercard' | 'amex'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(1); // 1 or 2
  const [cardDetails, setCardDetails] = useState({
    number: '',
    holder: '',
    expiry: '',
    cvc: ''
  });

  const [touchedFields, setTouchedFields] = useState({
    holder: false,
    number: false,
    expiry: false,
    cvc: false
  });

  // Validation getters
  const isHolderValid = cardDetails.holder.trim().length >= 3;
  const isNumberValid = cardDetails.number.replace(/\s/g, '').length === (selectedBrand === 'amex' ? 15 : 16);
  const isExpiryValid = /^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(cardDetails.expiry);
  const isCvcValid = cardDetails.cvc.length === (selectedBrand === 'amex' ? 4 : 3);

  // Dynamic preview helper
  const getCardNumberDisplay = () => {
    const num = cardDetails.number.replace(/\s/g, '');
    const limit = selectedBrand === 'amex' ? 15 : 16;
    let formatted = '';
    for (let i = 0; i < limit; i++) {
      if (selectedBrand === 'amex') {
        if (i === 4 || i === 10) formatted += ' ';
      } else {
        if (i > 0 && i % 4 === 0) formatted += ' ';
      }
      if (i < num.length) {
        formatted += num[i];
      } else {
        formatted += '•';
      }
    }
    return formatted;
  };

  // Load product & user info
  useEffect(() => {
    if (authLoading) return;
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
  }, [productId, token, user, authLoading]);

  const handleDeliveryChange = (e) => {
    setDelivery({ ...delivery, [e.target.name]: e.target.value });
  };

  const handleCardDetailsChange = (e) => {
    let { name, value } = e.target;
    setTouchedFields({ ...touchedFields, [name]: true });

    if (name === 'number') {
      value = value.replace(/\D/g, '');
      const limit = selectedBrand === 'amex' ? 15 : 16;
      value = value.substring(0, limit);
      const matches = value.match(/\d{4,20}/g);
      const match = (matches && matches[0]) || '';
      const parts = [];
      for (let i = 0, len = match.length; i < len; i += 4) {
        parts.push(match.substring(i, i + 4));
      }
      if (parts.length > 0) {
        value = parts.join(' ');
      } else {
        value = value.replace(/(\d{4})/g, '$1 ').trim();
      }
    } else if (name === 'expiry') {
      value = value.replace(/\D/g, '');
      value = value.substring(0, 4);
      if (value.length >= 3) {
        value = `${value.slice(0, 2)}/${value.slice(2)}`;
      }
    } else if (name === 'cvc') {
      value = value.replace(/\D/g, '');
      const limit = selectedBrand === 'amex' ? 4 : 3;
      value = value.substring(0, limit);
    }
    setCardDetails({ ...cardDetails, [name]: value });
  };

  const handleOpenPaymentModal = (e) => {
    e.preventDefault();
    if (!delivery.phone.trim()) return toast.error('Phone number is required for shipping');
    if (!delivery.address.trim()) return toast.error('Delivery address is required');
    
    // Reset validations and modal
    setTouchedFields({
      holder: false,
      number: false,
      expiry: false,
      cvc: false
    });
    setCardDetails({
      number: '',
      holder: '',
      expiry: '',
      cvc: ''
    });
    setIsModalOpen(true);
    setModalStep(1);
  };

  const handleFinalPayment = async () => {
    setTouchedFields({
      holder: true,
      number: true,
      expiry: true,
      cvc: true
    });

    if (!isHolderValid) return toast.error('Please enter a valid cardholder name');
    if (!isNumberValid) return toast.error(`Please enter a valid ${selectedBrand === 'amex' ? '15' : '16'}-digit card number`);
    if (!isExpiryValid) return toast.error('Please enter a valid expiry date (MM/YY)');
    if (!isCvcValid) return toast.error(`Please enter a valid CVC (${selectedBrand === 'amex' ? '4' : '3'}-digits)`);

    setIsModalOpen(false);
    setProcessing(true);
    const toastId = toast.loading('Initiating payment transaction...');

    try {
      const amount = product.price * quantity;

      // 1. Get Payment Intent
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

      toast.loading('Processing payment securely...', { id: toastId });
      await new Promise((r) => setTimeout(r, 2000));

      const transactionId = `ST-TRX-${Math.floor(100000 + Math.random() * 900000)}`;

      // 2. Place Order
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
        // 3. Log Payment
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

  if (loading || authLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center animate-pulse">
        <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mx-auto mb-6 skeleton-shimmer"></div>
        <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-3xl skeleton-shimmer"></div>
      </div>
    );
  }

  if (!product) return null;

  const total = product.price * quantity;

  // Visual configuration based on selected card brand
  const cardDesign = {
    visa: {
      bg: 'bg-gradient-to-tr from-blue-700 via-indigo-800 to-purple-800',
      logo: 'VISA',
      label: 'Visa Card'
    },
    mastercard: {
      bg: 'bg-gradient-to-tr from-orange-600 via-red-700 to-amber-700',
      logo: 'mastercard',
      label: 'Mastercard'
    },
    amex: {
      bg: 'bg-gradient-to-tr from-emerald-800 via-teal-900 to-cyan-900',
      logo: 'AMEX',
      label: 'American Express'
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors duration-300 relative">
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

        {/* Right: Shipping & card brand selectors */}
        <form onSubmit={handleOpenPaymentModal} className="md:col-span-2 space-y-6">
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

          {/* Secure Payment Card Brand Selector */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider flex items-center gap-1">
              <CreditCard size={16} className="text-primary-500" /> Select Card Method
            </h3>

            {/* Clickable Mini Brand Cards */}
            <div className="grid grid-cols-3 gap-2">
              {Object.keys(cardDesign).map((brand) => {
                const isSelected = selectedBrand === brand;
                const config = cardDesign[brand];
                return (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => setSelectedBrand(brand)}
                    className={`relative p-3 rounded-2xl border text-left flex flex-col justify-between h-20 transition-all duration-300 ${
                      isSelected
                        ? 'border-primary-500 ring-2 ring-primary-500/20 scale-105'
                        : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                    }`}
                  >
                    <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase">{config.label}</span>
                    <span className="text-xs font-black text-gray-850 dark:text-white tracking-wider">
                      {config.logo}
                    </span>
                    {isSelected && (
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary-600 animate-pulse"></span>
                    )}
                  </button>
                );
              })}
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
                'Proceed to Secure Payment'
              )}
            </button>
          </div>
        </form>
      </div>      {/* Premium Multi-step Interactive PopUp Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl w-full max-w-md p-6 shadow-2xl relative space-y-6 flex flex-col">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-gray-900 dark:text-white text-base">Secure Card Checkout</h3>
                <p className="text-[10px] text-gray-500 uppercase font-semibold">Step {modalStep} of 2</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-650 transition text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Virtual Credit Card Preview */}
            <div className={`w-full h-44 rounded-2xl p-5 text-white flex flex-col justify-between shadow-xl transition-all duration-550 ${cardDesign[selectedBrand].bg} relative overflow-hidden`}>
              {/* Subtle background circles decoration */}
              <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-white/5 pointer-events-none"></div>
              <div className="absolute -left-10 -top-10 w-28 h-28 rounded-full bg-white/5 pointer-events-none"></div>
              
              <div className="flex justify-between items-start">
                <span className="text-[10px] tracking-widest font-black uppercase text-white/80">
                  SECURE PLATFORM
                </span>
                <span className="font-black text-sm italic tracking-tighter">
                  {cardDesign[selectedBrand].logo.toUpperCase()}
                </span>
              </div>

              {/* Card Chip decoration */}
              <div className="w-9 h-7 rounded bg-amber-400/80 border border-amber-500/20 shadow-inner flex items-center justify-center opacity-85"></div>

              {/* Card Number display with character-by-character replacements */}
              <div className="font-mono text-base tracking-widest text-left mt-2">
                {getCardNumberDisplay()}
              </div>

              <div className="flex justify-between items-end text-left text-[10px]">
                <div className="flex-grow pr-4">
                  <p className="text-[8px] text-white/60 uppercase">Card Holder</p>
                  <p className="font-bold tracking-wider truncate uppercase text-white/90">
                    {cardDetails.holder || 'CARDHOLDER NAME'}
                  </p>
                </div>
                <div className="flex-shrink-0 text-right pr-4">
                  <p className="text-[8px] text-white/60 uppercase">Expires</p>
                  <p className="font-mono font-bold text-white/90">{cardDetails.expiry || 'MM/YY'}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-[8px] text-white/60 uppercase">CVC</p>
                  <p className="font-mono font-bold text-white/90">{cardDetails.cvc || '•••'}</p>
                </div>
              </div>
            </div>

            {/* Steps Container */}
            <div className="flex-grow space-y-4">
              {modalStep === 1 ? (
                <div className="space-y-4 text-left animate-slide-in">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-gray-500 uppercase flex justify-between">
                      <span>Cardholder Name</span>
                      {touchedFields.holder && !isHolderValid && <span className="text-red-500 text-[8px] font-bold">Invalid</span>}
                    </label>
                    <input
                      type="text"
                      name="holder"
                      value={cardDetails.holder}
                      onChange={handleCardDetailsChange}
                      className={`w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-950/40 border rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 ${
                        touchedFields.holder && !isHolderValid
                          ? 'border-red-500 focus:ring-red-500/20'
                          : 'border-gray-250 dark:border-gray-800 focus:ring-primary-500'
                      }`}
                      placeholder="e.g. JOHN DOE"
                      required
                    />
                    {touchedFields.holder && !isHolderValid && (
                      <p className="text-[9px] font-bold text-red-500 mt-0.5">Please enter cardholder's full name</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-gray-500 uppercase flex justify-between">
                      <span>Card Number</span>
                      {touchedFields.number && !isNumberValid && <span className="text-red-500 text-[8px] font-bold">Invalid</span>}
                    </label>
                    <input
                      type="text"
                      name="number"
                      value={cardDetails.number}
                      onChange={handleCardDetailsChange}
                      className={`w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-950/40 border rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 font-mono ${
                        touchedFields.number && !isNumberValid
                          ? 'border-red-500 focus:ring-red-500/20'
                          : 'border-gray-250 dark:border-gray-800 focus:ring-primary-500'
                      }`}
                      placeholder="4242 4242 4242 4242"
                      required
                    />
                    {touchedFields.number && !isNumberValid && (
                      <p className="text-[9px] font-bold text-red-500 mt-0.5">Card number must be {selectedBrand === 'amex' ? '15' : '16'} digits</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-left animate-slide-in">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-gray-500 uppercase flex justify-between">
                        <span>Expiry Date</span>
                        {touchedFields.expiry && !isExpiryValid && <span className="text-red-500 text-[8px] font-bold">Invalid</span>}
                      </label>
                      <input
                        type="text"
                        name="expiry"
                        value={cardDetails.expiry}
                        onChange={handleCardDetailsChange}
                        className={`w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-950/40 border rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 font-mono ${
                          touchedFields.expiry && !isExpiryValid
                            ? 'border-red-500 focus:ring-red-500/20'
                            : 'border-gray-250 dark:border-gray-800 focus:ring-primary-500'
                        }`}
                        placeholder="MM/YY"
                        required
                      />
                      {touchedFields.expiry && !isExpiryValid && (
                        <p className="text-[9px] font-bold text-red-500 mt-0.5">Use MM/YY format</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-gray-500 uppercase flex justify-between">
                        <span>CVC / CVV</span>
                        {touchedFields.cvc && !isCvcValid && <span className="text-red-500 text-[8px] font-bold">Invalid</span>}
                      </label>
                      <input
                        type="text"
                        name="cvc"
                        value={cardDetails.cvc}
                        onChange={handleCardDetailsChange}
                        className={`w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-950/40 border rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 font-mono ${
                          touchedFields.cvc && !isCvcValid
                            ? 'border-red-500 focus:ring-red-500/20'
                            : 'border-gray-250 dark:border-gray-800 focus:ring-primary-500'
                        }`}
                        placeholder="123"
                        required
                      />
                      {touchedFields.cvc && !isCvcValid && (
                        <p className="text-[9px] font-bold text-red-500 mt-0.5">Must be {selectedBrand === 'amex' ? '4' : '3'} digits</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Controls */}
            <div className="flex gap-3">
              {modalStep === 1 ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2.5 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-950 text-gray-700 dark:text-gray-300 font-semibold rounded-xl text-xs transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTouchedFields({ ...touchedFields, holder: true, number: true });
                      if (!isHolderValid) {
                        return toast.error("Please enter a valid cardholder's name");
                      }
                      if (!isNumberValid) {
                        return toast.error(`Please enter a valid ${selectedBrand === 'amex' ? '15' : '16'}-digit card number`);
                      }
                      setModalStep(2);
                    }}
                    className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl text-xs transition"
                  >
                    Next Step
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setModalStep(1)}
                    className="flex-1 py-2.5 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-950 text-gray-700 dark:text-gray-300 font-semibold rounded-xl text-xs transition"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleFinalPayment}
                    className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl text-xs shadow-lg transition"
                  >
                    Pay ${total.toFixed(2)}
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      )}

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
