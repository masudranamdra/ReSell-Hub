'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export const AuthContext = createContext();
export const ThemeContext = createContext();

export const API_URL = 'http://localhost:5000';

export function Providers({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [theme, setTheme] = useState('light');

  // Load theme and auth token on mount
  useEffect(() => {
    // 1. Theme Configuration
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // 2. Auth Session Configuration
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      fetchUserProfile(savedToken);
    } else {
      setAuthLoading(false);
    }
  }, []);

  // Fetch Current Logged-in User (Session restore)
  const fetchUserProfile = async (authToken) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
      } else {
        // Token expired or invalid
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setAuthLoading(false);
    }
  };

  // Toggle Dark/Light Mode
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Email / Password Login
  const login = async (email, password, rememberMe) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        toast.success(`Welcome back, ${data.user.name}!`);
        router.push('/dashboard');
        return { success: true };
      } else {
        toast.error(data.message || 'Login failed');
        return { success: false, error: data.message };
      }
    } catch (err) {
      toast.error('Connection error. Server may be down.');
      return { success: false, error: err.message };
    }
  };

  // Email / Password Registration
  const register = async (name, email, password, confirmPassword, photo, phone, location) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, confirmPassword, photo, phone, location })
      });
      const data = await res.json();

      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        toast.success(`Account registered! Welcome, ${data.user.name}`);
        router.push('/dashboard');
        return { success: true };
      } else {
        toast.error(data.message || 'Registration failed');
        return { success: false, error: data.message };
      }
    } catch (err) {
      toast.error('Connection error. Server may be down.');
      return { success: false, error: err.message };
    }
  };

  // Google Sign-in Simulator
  const loginWithGoogle = async (name, email, photo, googleId) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, photo, googleId })
      });
      const data = await res.json();

      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        toast.success(`Logged in with Google as ${data.user.name}`);
        router.push('/dashboard');
        return { success: true };
      } else {
        toast.error(data.message || 'Google Auth failed');
        return { success: false, error: data.message };
      }
    } catch (err) {
      toast.error('Google Auth server connection failed');
      return { success: false, error: err.message };
    }
  };

  // Log Out
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
    router.push('/');
  };

  // Profile Update
  const updateProfile = async (formData) => {
    try {
      const res = await fetch(`${API_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success) {
        setUser(data.user);
        toast.success(data.message || 'Profile updated successfully!');
        return { success: true };
      } else {
        toast.error(data.message || 'Profile update failed');
        return { success: false, error: data.message };
      }
    } catch (err) {
      toast.error('Connection error during profile update.');
      return { success: false, error: err.message };
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <AuthContext.Provider
        value={{
          user,
          token,
          authLoading,
          login,
          register,
          loginWithGoogle,
          logout,
          updateProfile,
          fetchUserProfile
        }}
      >
        {children}
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}
