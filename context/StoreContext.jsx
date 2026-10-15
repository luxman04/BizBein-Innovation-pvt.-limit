'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { featuredProducts, products as initialProducts } from '../data/products';

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
  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed. Please check your credentials.');
    }

    setUser(data.user);
    showToast(`Welcome back, ${data.user.name}!`, 'success');
    executePendingAddToCart(data.user);
    return data.user;
  };

  const register = async (name, email, phone, password) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed.');
    }

    setUser(data.user);
    showToast(`Welcome to BizBein, ${data.user.name}! Account created.`, 'success');
    executePendingAddToCart(data.user);
    return data.user;
  };

  const logout = async () => {
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
