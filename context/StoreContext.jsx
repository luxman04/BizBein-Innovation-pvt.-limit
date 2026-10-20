'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { featuredProducts, products as initialProducts } from '../data/products';
import { createClient } from '../utils/supabase/client';

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  // Dynamic Products Catalog
  const [products, setProducts] = useState(initialProducts);

  const refreshProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/products', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
          return data.products;
        }
      }
    } catch (err) {
      console.warn('[StoreContext] Dynamic products fetch skipped:', err);
    }
    return initialProducts;
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  // Cart State (Hydrated from localStorage)
  const [cartItems, setCartItems] = useState([
    {
      ...featuredProducts[0],
      qty: 1
    }
  ]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Authentication State
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Toast Notification State
  const [toast, setToast] = useState(null);

  // Modals & Drawers
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [activeQuoteProduct, setActiveQuoteProduct] = useState(null);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [expertModalOpen, setExpertModalOpen] = useState(false);
  const [trackModalOpen, setTrackModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // ---------------- TOAST NOTIFICATIONS ----------------
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // ---------------- AUTHENTICATION CHECK ----------------
  const refreshUser = useCallback(async () => {
    try {
      setAuthLoading(true);
      const res = await fetch('/api/auth/me', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
          return data.user;
        }
      }
      setUser(null);
      return null;
    } catch (err) {
      setUser(null);
      return null;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  // Hydrate user and cart on mount
  useEffect(() => {
    refreshUser();

    try {
      const saved = localStorage.getItem('bizbein_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCartItems(parsed);
        }
      }
    } catch (e) {}

    setIsLoaded(true);
  }, [refreshUser]);

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('bizbein_cart', JSON.stringify(cartItems));
      } catch (e) {}
    }
  }, [cartItems, isLoaded]);

  // ---------------- PENDING ADD TO CART EXECUTION ----------------
  // Executes pending item addition after user registers or logs in
  const executePendingAddToCart = useCallback((currentUser) => {
    if (!currentUser) return;

    try {
      const raw = localStorage.getItem('bizbein_pending_add');
      if (!raw) return;

      const pending = JSON.parse(raw);
      if (pending && pending.product) {
        // Prevent duplicate items while allowing quantity increment
        const qtyToAdd = Math.max(1, parseInt(pending.qty, 10) || 1);

        setCartItems((prev) => {
          const existing = prev.find((item) => item.id === pending.product.id);
          if (existing) {
            return prev.map((item) =>
              item.id === pending.product.id
                ? { ...item, qty: item.qty + qtyToAdd }
                : item
            );
          }
          return [...prev, { ...pending.product, qty: qtyToAdd }];
        });

        // Clear pending item immediately to avoid duplicate addition on page reloads
        localStorage.removeItem('bizbein_pending_add');

        showToast(`"${pending.product.name}" was added to your cart!`, 'success');
        setCartDrawerOpen(true);
      }
    } catch (err) {
      console.warn('[Pending Cart] Failed to process pending cart action:', err);
    }
  }, [showToast]);

  // When user signs in, trigger pending action if any
  useEffect(() => {
    if (user && isLoaded) {
      executePendingAddToCart(user);
    }
  }, [user, isLoaded, executePendingAddToCart]);

  // ---------------- CART OPERATIONS ----------------
  const addToCart = (product, qty = 1, options = {}) => {
    const quantity = Math.max(1, parseInt(qty, 10) || 1);

    // Requirement 1: Check active authenticated session
    if (!user) {
      try {
        const pendingData = {
          product,
          qty: quantity,
          variant: options?.variant || null,
          savedAt: Date.now()
        };
        localStorage.setItem('bizbein_pending_add', JSON.stringify(pendingData));
      } catch (e) {}

      showToast('Please sign in or create an account to add items to your cart.', 'info');

      // Preserve existing cart contents and current path during redirection
      const returnUrl = encodeURIComponent(window.location.pathname || '/products');
      router.push(`/login?redirect=${returnUrl}&pendingAdd=1`);
      return false;
    }

    // Authenticated user: add to cart immediately
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + quantity } : item
        );
      }
      return [...prev, { ...product, qty: quantity }];
    });

    showToast(`"${product.name}" added to cart!`, 'success');
    setCartDrawerOpen(true);
    return true;
  };

  const buyNow = (product, qty = 1, options = {}) => {
    const quantity = Math.max(1, parseInt(qty, 10) || 1);

    if (!user) {
      try {
        const pendingData = {
          product,
          qty: quantity,
          variant: options?.variant || null,
          savedAt: Date.now()
        };
        localStorage.setItem('bizbein_pending_add', JSON.stringify(pendingData));
      } catch (e) {}

      showToast('Please sign in or create an account to proceed to checkout.', 'info');
      router.push('/login?redirect=/checkout&pendingAdd=1');
      return false;
    }

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + quantity } : item
        );
      }
      return [...prev, { ...product, qty: quantity }];
    });

    setCartDrawerOpen(false);
    router.push('/checkout');
    return true;
  };

  const updateQty = (id, newQty) => {
    if (newQty <= 0) {
      removeItem(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty: newQty } : item))
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
    try {
      localStorage.removeItem('bizbein_cart');
    } catch (e) {}
  };

  // ---------------- AUTH OPERATIONS ----------------
  const supabase = createClient();

  const login = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Try Supabase Auth password login
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password
      });

      if (!error && data?.user) {
        // Sync verified session to cookie
        const res = await fetch('/api/auth/supabase-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.name || '',
            phone: data.user.user_metadata?.phone || ''
          })
        });
        const sessionData = await res.json();
        const appUser = sessionData.user || {
          id: data.user.id,
          name: data.user.user_metadata?.name || cleanEmail.split('@')[0],
          email: data.user.email,
          phone: data.user.user_metadata?.phone || '',
          role: 'customer'
        };

        setUser(appUser);
        showToast(`Welcome back, ${appUser.name}!`, 'success');
        executePendingAddToCart(appUser);
        return { user: appUser };
      }
    } catch (e) {
      // Continue to local login
    }

    // 2. Fallback to local DB login
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, password })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed. Please check your credentials.');
    }

    if (data.otpRequired) {
      return data;
    }

    if (data.user) {
      setUser(data.user);
      showToast(`Welcome back, ${data.user?.name || 'User'}!`, 'success');
      executePendingAddToCart(data.user);
    }
    return data.user || data;
  };

  const register = async (name, email, phone, password) => {
    const cleanEmail = email.trim().toLowerCase();

    // Requirement 3: Use the existing Supabase client to call supabase.auth.signUp()
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          name: name ? name.trim() : '',
          phone: phone ? phone.trim() : ''
        }
      }
    });

    if (error) {
      if (error.message?.toLowerCase().includes('confirmation email')) {
        throw new Error(
          'Email delivery rejected by SMTP: Resend test mode (onboarding@resend.dev) only allows sending to your account email (bizbein8@gmail.com). To send to ' + cleanEmail + ', configure Gmail SMTP in Supabase Dashboard or verify your custom domain in Resend.'
        );
      }
      throw new Error(error.message || 'Registration failed.');
    }

    // Supabase Auth sends OTP to email. Session is null until verified.
    return {
      otpRequired: true,
      email: cleanEmail,
      cooldownSeconds: 60,
      user: data?.user
    };
  };

  const verifyOtp = async (arg1, arg2, arg3) => {
    const email = ((arg3 !== undefined ? arg2 : arg1) || '').trim().toLowerCase();
    const token = ((arg3 !== undefined ? arg3 : arg2) || '').trim();

    // Requirement 6: Verify the OTP using supabase.auth.verifyOtp({ email, token, type: "signup" })
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'signup'
    });

    if (error) {
      throw new Error(error.message || 'Verification failed. Please check the code.');
    }

    const verifiedUser = data?.user;
    if (!verifiedUser) {
      throw new Error('Verification failed. No verified user returned.');
    }

    // Sync verified Supabase user to application session (cookie) so middleware & pages work
    const res = await fetch('/api/auth/supabase-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: verifiedUser.id,
        email: verifiedUser.email,
        name: verifiedUser.user_metadata?.name || '',
        phone: verifiedUser.user_metadata?.phone || ''
      })
    });

    const sessionData = await res.json();
    const appUser = sessionData.user || {
      id: verifiedUser.id,
      name: verifiedUser.user_metadata?.name || email.split('@')[0],
      email: verifiedUser.email,
      phone: verifiedUser.user_metadata?.phone || '',
      role: 'customer'
    };

    setUser(appUser);
    showToast(`Welcome to BizBein, ${appUser.name}! Account verified.`, 'success');
    executePendingAddToCart(appUser);
    return appUser;
  };

  const resendOtp = async (arg1, arg2) => {
    const email = ((arg2 !== undefined ? arg2 : arg1) || '').trim().toLowerCase();

    // Requirement 7: Add a resend OTP button with a 60-second countdown and appropriate cooldown handling.
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email
    });

    if (error) {
      throw new Error(error.message || 'Failed to resend verification code.');
    }

    showToast('A new 6-digit verification code has been sent.', 'success');
    return { success: true, cooldownSeconds: 60 };
  };

  const loginWithGoogle = async () => {
    const { auth, googleProvider, isFirebaseConfigured } = await import('../lib/firebase');
    if (!isFirebaseConfigured || !auth) {
      throw new Error('Firebase configuration missing. Please add your NEXT_PUBLIC_FIREBASE_* keys to .env.local.');
    }
    const { signInWithPopup } = await import('firebase/auth');
    const result = await signInWithPopup(auth, googleProvider);
    const fbUser = result.user;

    const res = await fetch('/api/auth/firebase-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: fbUser.email,
        name: fbUser.displayName,
        phone: fbUser.phoneNumber,
        uid: fbUser.uid
      })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to sync Firebase session.');
    }

    setUser(data.user);
    showToast(`Welcome, ${data.user.name}! Signed in with Google.`, 'success');
    executePendingAddToCart(data.user);
    return data.user;
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut().catch(() => {});
    } catch (e) {}
    try {
      const { auth } = await import('../lib/firebase');
      if (auth) {
        const { signOut } = await import('firebase/auth');
        await signOut(auth).catch(() => {});
      }
    } catch (e) {}
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    setUser(null);
    showToast('Signed out successfully.', 'info');
    router.push('/');
  };

  const openQuoteModal = (product) => {
    setActiveQuoteProduct(product || featuredProducts[0]);
    setQuoteModalOpen(true);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + (item.qty || 1), 0);

  const value = {
    // Cart
    cartItems,
    addToCart,
    buyNow,
    updateQty,
    removeItem,
    clearCart,
    totalCartCount,
    cartDrawerOpen,
    openCartDrawer: () => setCartDrawerOpen(true),
    closeCartDrawer: () => setCartDrawerOpen(false),

    // Auth
    user,
    authLoading,
    login,
    register,
    loginWithGoogle,
    verifyOtp,
    resendOtp,
    logout,
    refreshUser,
    executePendingAddToCart,

    // Feedback
    toast,
    showToast,
    hideToast,

    // Modals
    quoteModalOpen,
    activeQuoteProduct,
    openQuoteModal,
    closeQuoteModal: () => setQuoteModalOpen(false),
    contactModalOpen,
    openContactModal: () => setContactModalOpen(true),
    closeContactModal: () => setContactModalOpen(false),
    expertModalOpen,
    openExpertModal: () => setExpertModalOpen(true),
    closeExpertModal: () => setExpertModalOpen(false),
    trackModalOpen,
    openTrackModal: () => setTrackModalOpen(true),
    closeTrackModal: () => setTrackModalOpen(false),

    // Products Catalog
    products,
    refreshProducts,
    getProductById: (id) =>
      products.find((p) => p.id?.toString().toLowerCase() === id?.toString().toLowerCase()) || null,

    // Search
    searchQuery,
    setSearchQuery
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return ctx;
}
