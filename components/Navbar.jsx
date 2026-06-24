'use client';

import React, { useContext, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthContext, ThemeContext } from '../components/Providers';
import { Sun, Moon, Menu, X, ChevronDown, User, LogOut, LayoutDashboard, ShoppingBag, ShoppingCart } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const items = JSON.parse(localStorage.getItem('cart_items') || '[]');
      setCartCount(items.length);
    };
    updateCount();
    window.addEventListener('cartUpdate', updateCount);
    return () => window.removeEventListener('cartUpdate', updateCount);
  }, []);

  const isActive = (path) => pathname === path;

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Categories', path: '/categories' }
  ];

  return (
    <nav className="sticky top-0 z-50 glass border-b border-gray-200 dark:border-gray-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img
                src="https://i.ibb.co.com/BV1jk40k/faiz00-s-7207516.png"
                alt="ReSell Hub Logo"
                className="h-10 sm:h-12 w-auto object-contain"
              />
              <span className="hidden sm:inline-block text-4xl font-extrabold text-gray-800 dark:text-gray-200">ReSellHub</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-400'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {user && (
              <Link
                href="/dashboard"
                className={`text-sm font-medium transition-colors ${
                  pathname.startsWith('/dashboard')
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-400'
                }`}
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* User Controls & Theme Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart Link with Badge */}
            <Link
              href="/cart"
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition relative"
              aria-label="View shopping cart"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-primary-600 text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white dark:border-gray-900 animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <img
                    src={user.photo || 'https://i.pravatar.cc/300?img=9'}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover border-2 border-primary-500"
                  />
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 leading-none">
                      {user.name}
                    </p>
                    <span className="text-[10px] text-gray-500 capitalize">{user.role}</span>
                  </div>
                  <ChevronDown size={14} className="text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl shadow-xl py-2 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-100 dark:border-gray-700 animate-fade-in">
                    {/* User profile brief */}
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 pb-2 mb-1 flex items-center gap-2.5">
                      <img
                        src={user.photo || 'https://i.pravatar.cc/300?img=9'}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover border border-primary-500"
                      />
                      <div className="text-left">
                        <p className="text-xs font-bold text-gray-900 dark:text-white line-clamp-1 leading-none">{user.name}</p>
                        <span className="text-[9px] text-gray-400 capitalize">{user.role}</span>
                      </div>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-750 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <LayoutDashboard size={15} />
                      My Profile
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-750 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <User size={15} />
                      Setting
                    </Link>
                    <Link
                      href="/dashboard/orders"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-750 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <ShoppingBag size={15} />
                      Orders
                    </Link>
                    <hr className="border-gray-100 dark:border-gray-700 my-1" />
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-xs font-semibold text-danger-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <img
                        src={user.photo || 'https://i.pravatar.cc/300?img=9'}
                        alt=""
                        className="w-5 h-5 rounded-full object-cover border border-danger-500"
                      />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 md:hidden">
            {/* Mobile Cart Link */}
            <Link
              href="/cart"
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition relative"
              aria-label="View shopping cart"
            >
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-primary-600 text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white dark:border-gray-900 animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {mobileOpen && (
        <div className="md:hidden px-2 pt-2 pb-4 space-y-1 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive(link.path)
                  ? 'bg-primary-50 text-primary-600 dark:bg-gray-800 dark:text-primary-400'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/cart"
            onClick={() => setMobileOpen(false)}
            className={`block px-3 py-2 rounded-md text-base font-medium flex items-center justify-between ${
              isActive('/cart')
                ? 'bg-primary-50 text-primary-600 dark:bg-gray-800 dark:text-primary-400'
                : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
          >
            <span>Shopping Cart</span>
            {cartCount > 0 && (
              <span className="bg-primary-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
          {user && (
            <Link
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname.startsWith('/dashboard')
                  ? 'bg-primary-50 text-primary-600 dark:bg-gray-800 dark:text-primary-400'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
            >
              Dashboard
            </Link>
          )}

          <hr className="border-gray-100 dark:border-gray-800 my-2" />

          {user ? (
            <div className="space-y-1">
              <div className="flex items-center gap-3 px-3 py-2">
                <img
                  src={user.photo || 'https://i.pravatar.cc/300?img=9'}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border border-primary-500"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 leading-none">
                    {user.name}
                  </p>
                  <span className="text-xs text-gray-500 capitalize">{user.role}</span>
                </div>
              </div>
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                My Profile
              </Link>
              <Link
                href="/dashboard/profile"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Setting
              </Link>
              <Link
                href="/dashboard/orders"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Orders
              </Link>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  logout();
                }}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-danger-500 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2"
              >
                <img
                  src={user.photo || 'https://i.pravatar.cc/300?img=9'}
                  alt=""
                  className="w-6 h-6 rounded-full object-cover border border-danger-500"
                />
                Logout
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 px-3 pt-2">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
