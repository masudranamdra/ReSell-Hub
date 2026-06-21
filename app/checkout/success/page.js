'use client';

import React, { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ShoppingBag, ArrowRight, Calendar, Receipt } from 'lucide-react';
import confetti from 'canvas-confetti';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const transactionId = searchParams.get('transactionId');
  const amount = searchParams.get('amount');
  const title = searchParams.get('title');
  const quantity = searchParams.get('qty');
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    // Confetti explosion
    const duration = 2 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-8 animate-fade-in transition-colors duration-300">
      <div className="space-y-3">
        <CheckCircle className="mx-auto text-success-500" size={64} />
        <h1 className="text-3xl font-extrabold text-gray-950 dark:text-white">Payment Successful!</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Thank you for your purchase. Your order has been registered.</p>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl text-left space-y-4 shadow-sm">
        <h3 className="font-bold text-gray-950 dark:text-white text-sm border-b border-gray-100 dark:border-gray-800 pb-2 flex items-center gap-1.5">
          <Receipt size={16} className="text-primary-500" /> Transaction Receipt
        </h3>
        
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Transaction ID:</span>
            <span className="font-semibold text-gray-900 dark:text-white">{transactionId || 'MOCK-TRX-12345'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Payment Amount:</span>
            <span className="font-bold text-primary-600 dark:text-primary-400">${Number(amount || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Date & Time:</span>
            <span className="text-gray-700 dark:text-gray-300 flex items-center gap-1">
              <Calendar size={12} /> {new Date().toLocaleDateString()}
            </span>
          </div>
          <hr className="border-gray-100 dark:border-gray-800" />
          <div className="space-y-1">
            <p className="text-[10px] font-semibold text-gray-400 uppercase">Item Purchased</p>
            <p className="font-semibold text-gray-900 dark:text-white line-clamp-1">{decodeURIComponent(title || 'Product')}</p>
            <p className="text-xs text-gray-500">Quantity: {quantity || 1} units</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center">
        <Link
          href="/dashboard/orders"
          className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-xs shadow transition text-center flex items-center justify-center gap-1.5"
        >
          <ShoppingBag size={14} /> Go To My Orders
        </Link>
        <Link
          href="/products"
          className="px-6 py-3 border border-gray-300 hover:border-primary-500 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:border-gray-700 font-bold rounded-xl text-xs transition text-center flex items-center justify-center gap-1.5"
        >
          Continue Shopping <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccess() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading invoice details...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
