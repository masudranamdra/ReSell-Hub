'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Trash2, ArrowRight, ArrowLeft, ArrowUpRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cart_items') || '[]');
    setCartItems(items);
  }, []);

  const updateQuantity = (id, newQty) => {
    if (newQty < 1) return;
    const updated = cartItems.map((item) => {
      if (item._id === id) {
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setCartItems(updated);
    localStorage.setItem('cart_items', JSON.stringify(updated));
    window.dispatchEvent(new Event('cartUpdate'));
  };

  const removeItem = (id) => {
    const updated = cartItems.filter((item) => item._id !== id);
    setCartItems(updated);
    localStorage.setItem('cart_items', JSON.stringify(updated));
    toast.success('Removed item from cart');
    window.dispatchEvent(new Event('cartUpdate'));
  };

  const clearCart = () => {
    localStorage.removeItem('cart_items');
    setCartItems([]);
    toast.success('Cleared cart successfully');
    window.dispatchEvent(new Event('cartUpdate'));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors duration-300">
      <div className="mb-6 text-left">
        <Link href="/products" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-primary-600 transition">
          <ArrowLeft size={14} /> Back to Products
        </Link>
      </div>

      <div className="text-left space-y-2 mb-8">
        <h1 className="text-3xl font-extrabold text-gray-950 dark:text-white flex items-center gap-2">
          <ShoppingCart className="text-primary-500" size={28} /> Shopping Cart
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Review and purchase items you have saved to your cart</p>
      </div>

      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
          {/* Cart List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900/30 px-6 py-3 rounded-2xl border border-gray-100 dark:border-gray-800">
              <span className="text-xs text-gray-500 font-bold uppercase">Items ({cartItems.length})</span>
              <button onClick={clearCart} className="text-xs text-danger-500 hover:underline font-bold">
                Clear Cart
              </button>
            </div>

            {cartItems.map((item) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={item._id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 rounded-2xl object-cover border border-gray-100 dark:border-gray-800 flex-shrink-0"
                  />
                  <div>
                    <h3 className="font-extrabold text-sm text-gray-950 dark:text-white line-clamp-1 hover:text-primary-600 transition">
                      <Link href={`/products/${item._id}`}>{item.title}</Link>
                    </h3>
                    <div className="flex gap-2 items-center mt-1">
                      <span className="bg-primary-55 text-primary-600 dark:bg-primary-950/20 dark:text-primary-400 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {item.condition}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">{item.category}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:gap-12">
                  {/* Quantity Adjustment */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="w-7 h-7 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center text-xs font-bold border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 transition"
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-gray-900 dark:text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="w-7 h-7 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center text-xs font-bold border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 transition"
                    >
                      +
                    </button>
                  </div>

                  {/* Price and Checkout Action */}
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <p className="text-sm font-black text-gray-950 dark:text-white">${(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-[9px] text-gray-400">Unit: ${item.price}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/checkout?productId=${item._id}&qty=${item.quantity}`}
                        className="px-3.5 py-2 bg-primary-600 hover:bg-primary-700 text-white text-[10px] font-bold rounded-xl flex items-center gap-1 shadow-sm transition"
                      >
                        Buy <ArrowUpRight size={12} />
                      </Link>
                      <button
                        onClick={() => removeItem(item._id)}
                        className="p-2 border border-danger-200 text-danger-500 hover:bg-danger-500 hover:text-white rounded-xl transition"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Checkout Summary Card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl space-y-6 shadow-sm sticky top-24">
              <h3 className="font-bold text-gray-950 dark:text-white text-sm uppercase tracking-wider">
                Cart Summary
              </h3>

              <div className="space-y-3 text-xs text-gray-600 dark:text-gray-400 font-medium">
                <div className="flex justify-between">
                  <span>Cart Items Count</span>
                  <span>{cartItems.length} items</span>
                </div>
                <div className="flex justify-between border-t border-gray-100 dark:border-gray-800 pt-3 font-bold text-gray-900 dark:text-white text-sm">
                  <span>Total Amount</span>
                  <span className="text-primary-600 dark:text-primary-400 text-base">
                    ${cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-primary-50 dark:bg-primary-950/20 border border-dashed border-primary-200 dark:border-primary-800 rounded-xl space-y-1.5">
                <p className="text-[10px] text-primary-700 dark:text-primary-300 font-bold uppercase">Transaction Notice</p>
                <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
                  Second-hand goods are dispatched directly by individual sellers. Please purchase each item individually using the "Buy" actions to checkout securely via Stripe.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-24 text-center space-y-4 bg-gray-50 dark:bg-gray-900/10 border border-dashed border-gray-200 dark:border-gray-800 rounded-3xl max-w-xl mx-auto">
          <ShoppingCart size={36} className="mx-auto text-gray-400" />
          <h3 className="font-bold text-gray-900 dark:text-white text-lg">Your Cart is Empty</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
            You haven't added any products to your shopping cart yet. Browse our products listings and select "Add To Cart" to get started.
          </p>
          <Link
            href="/products"
            className="inline-block px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-xl shadow transition"
          >
            Find Products
          </Link>
        </div>
      )}
    </div>
  );
}
