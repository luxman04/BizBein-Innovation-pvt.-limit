'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { featuredProducts, products as initialProducts } from '../data/products';
import {
  getCookie,
  setCookie,
  getStoredConsent,
  saveStoredConsent,
  getStoredPreferences,
  saveStoredPreferences,
  DEFAULT_CONSENT,
  DEFAULT_PREFERENCES,
  CART_COOKIE_KEY
} from '../lib/cookies';
import {
  initAnalytics,
  trackAddToCart as sendAnalyticsAddToCart,
  trackQuoteRequest as sendAnalyticsQuoteRequest,
  trackSearch as sendAnalyticsSearch
} from '../lib/analytics';

const StoreContext = createContext(null);

// ---------------- TRUSTED PRODUCT CART VALIDATION ----------------
// Validates product IDs, quantities, and prices against authoritative catalog data
function validateAndSanitizeCart(rawList, catalog) {
  if (!Array.isArray(rawList)) return [];
  const sanitized = [];

  for (const raw of rawList) {
    if (!raw || !raw.id) continue;

    // Must match a genuine catalog product
    const trusted = catalog.find(
      (p) => p.id?.toString().toLowerCase() === raw.id?.toString().toLowerCase()
    );
    if (!trusted) continue;

    // Enforce integer quantity bounds (1 to 99)
    const validQty = Math.min(99, Math.max(1, parseInt(raw.qty, 10) || 1));

    // Overwrite any manipulated price, name, or metadata with trusted product data
    sanitized.push({
      ...trusted,
      qty: validQty,
      variant: raw.variant || null
    });
  }

  return sanitized;
}

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

  // Cart State
  const [cartItems, setCartItems] = useState([]);
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

  // ---------------- USER PREFERENCES & COOKIE CONSENT ----------------
  const [consent, setConsent] = useState(DEFAULT_CONSENT);
  const [cookieBannerOpen, setCookieBannerOpen] = useState(false);
  const [cookieSettingsOpen, setCookieSettingsOpen] = useState(false);
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);

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

  // ---------------- AUTHENTICATION & FIREBASE SESSION ----------------
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

  // Listen to Firebase Auth state with browserLocalPersistence & onAuthStateChanged
  useEffect(() => {
    let unsubscribe = null;
    let isCancelled = false;

    async function initAuthListener() {
      try {
        const { auth, ensureAuthPersistence, isFirebaseConfigured } = await import('../lib/firebase');
        if (isFirebaseConfigured && auth) {
          await ensureAuthPersistence();
          const { onAuthStateChanged } = await import('firebase/auth');

          // Ultra-fast session check: prevents UI lag while restoring authenticated session
          const safetyTimer = setTimeout(() => {
            if (!isCancelled) {
              setAuthLoading(false);
            }
          }, 250);

          unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
            clearTimeout(safetyTimer);
            if (isCancelled) return;

            if (fbUser) {
              // Firebase session found in browser persistence: sync session cookie for middleware protection
              try {
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

                if (res.ok) {
                  const data = await res.json();
                  if (data.user) {
                    setUser(data.user);
                    setAuthLoading(false);
                    return;
                  }
                }
              } catch (e) {
                console.warn('[StoreContext] Firebase session sync error:', e);
              }

              // Direct user representation fallback if backend sync was delayed
              setUser({
                id: fbUser.uid,
                name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
                email: fbUser.email,
                phone: fbUser.phoneNumber || '',
                role: 'customer'
              });
              setAuthLoading(false);
            } else {
              // No active Firebase session: check for direct email/password cookie session
              try {
                const res = await fetch('/api/auth/me', { cache: 'no-store' });
                if (res.ok) {
                  const data = await res.json();
                  if (data.authenticated && data.user) {
                    setUser(data.user);
                    setAuthLoading(false);
                    return;
                  }
                }
              } catch (e) {}

              setUser(null);
              setAuthLoading(false);
            }
          });

          return;
        }
      } catch (err) {
        console.warn('[StoreContext] Firebase auth listener setup failed:', err);
      }

      // Fallback to cookie check if Firebase not configured
      refreshUser();
    }

    initAuthListener();

    return () => {
      isCancelled = true;
      if (unsubscribe) unsubscribe();
    };
  }, [refreshUser]);

  // Hydrate cart, consent, preferences, and analytics on mount
  useEffect(() => {
    initAnalytics();

    // 1. Consent Hydration
    const storedConsent = getStoredConsent();
    setConsent(storedConsent);
    if (!storedConsent.consentGiven) {
      setCookieBannerOpen(true);
    }

    // 2. Preferences Hydration
    const storedPrefs = getStoredPreferences();
    setPreferences(storedPrefs);
    if (storedPrefs.theme && typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', storedPrefs.theme);
    }

    // 3. Cart Hydration with Product Catalog Validation
    try {
      let rawCart = null;
      const localCart = localStorage.getItem('bizbein_cart');
      if (localCart) {
        rawCart = JSON.parse(localCart);
      } else {
        const cookieCart = getCookie(CART_COOKIE_KEY);
        if (cookieCart) {
          rawCart = JSON.parse(cookieCart);
        }
      }

      if (rawCart && Array.isArray(rawCart) && rawCart.length > 0) {
        const validated = validateAndSanitizeCart(rawCart, initialProducts);
        setCartItems(validated);
      }
    } catch (e) {
      console.warn('[StoreContext] Cart hydration warning:', e);
    }

    setIsLoaded(true);
  }, [refreshUser]);

  // Sync cart to localStorage and cookie whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        const validated = validateAndSanitizeCart(cartItems, products);
        const serialized = JSON.stringify(validated);
        localStorage.setItem('bizbein_cart', serialized);

        // Store minimal representation in cookie for persistence across browser sessions
        const minimalCart = validated.map((it) => ({
          id: it.id,
          qty: it.qty,
          variant: it.variant || null
        }));
        setCookie(CART_COOKIE_KEY, JSON.stringify(minimalCart), { days: 180 });
      } catch (e) {}
    }
  }, [cartItems, isLoaded, products]);

  // Re-verify cart against updated dynamic products catalog
  useEffect(() => {
    if (isLoaded && products.length > 0) {
      setCartItems((prev) => {
        if (prev.length === 0) return prev;
        return validateAndSanitizeCart(prev, products);
      });
    }
  }, [products, isLoaded]);

  // ---------------- PENDING ADD TO CART EXECUTION ----------------
  const executePendingAddToCart = useCallback((currentUser) => {
    if (!currentUser) return;

    try {
      const raw = localStorage.getItem('bizbein_pending_add');
      if (!raw) return;

      const pending = JSON.parse(raw);
      if (pending && pending.product) {
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

        localStorage.removeItem('bizbein_pending_add');
        showToast(`"${pending.product.name}" was added to your cart!`, 'success');
        setCartDrawerOpen(true);
      }
    } catch (err) {
      console.warn('[Pending Cart] Failed to process pending cart action:', err);
    }
  }, [showToast]);

  useEffect(() => {
    if (user && isLoaded) {
      executePendingAddToCart(user);
    }
  }, [user, isLoaded, executePendingAddToCart]);

  // ---------------- CART OPERATIONS ----------------
  const addToCart = (product, qty = 1, options = {}) => {
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

      showToast('Please sign in or create an account to add items to your cart.', 'info');
      const returnUrl = encodeURIComponent(window.location.pathname || '/products');
      router.push(`/login?redirect=${returnUrl}&pendingAdd=1`);
      return false;
    }

    // Authenticated user: add and sanitize immediately
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + quantity } : item
        );
      }
      return [...prev, { ...product, qty: quantity }];
    });

    sendAnalyticsAddToCart(product, quantity);
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

    sendAnalyticsAddToCart(product, quantity);
    setCartDrawerOpen(false);
    router.push('/checkout');
    return true;
  };

  const updateQty = (id, newQty) => {
    if (newQty <= 0) {
      removeItem(id);
      return;
    }
    const safeQty = Math.min(99, Math.max(1, parseInt(newQty, 10) || 1));
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty: safeQty } : item))
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
    try {
      localStorage.removeItem('bizbein_cart');
      setCookie(CART_COOKIE_KEY, '[]', { days: 0 });
    } catch (e) {}
  };

  // ---------------- AUTH OPERATIONS ----------------
  const login = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, password })
    });

    const data = await res.json();
    if (!res.ok || !data.user) {
      throw new Error(data.error || 'Invalid email or password.');
    }

    setUser(data.user);
    showToast(`Welcome back, ${data.user.name || 'User'}!`, 'success');
    executePendingAddToCart(data.user);
    return { user: data.user };
  };

  const register = async (name, email, phone, password) => {
    const cleanEmail = email.trim().toLowerCase();

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name ? name.trim() : '',
        email: cleanEmail,
        phone: phone ? phone.trim() : '',
        password
      })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed.');
    }

    if (data.user) {
      setUser(data.user);
      showToast(`Welcome to BizBein, ${data.user.name || 'User'}! Account created successfully.`, 'success');
      executePendingAddToCart(data.user);
      return { user: data.user };
    }

    return data;
  };

  const verifyOtp = async () => ({ success: true });
  const resendOtp = async () => ({ success: true });

  const loginWithGoogle = async () => {
    const { auth, googleProvider, isFirebaseConfigured, ensureAuthPersistence } = await import('../lib/firebase');
    if (!isFirebaseConfigured || !auth) {
      throw new Error('Firebase configuration missing. Please add your NEXT_PUBLIC_FIREBASE_* keys to .env.local.');
    }
    // Ensure Firebase browserLocalPersistence is ready
    await ensureAuthPersistence();

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

  const sendPhoneOtp = async (phoneNumber, appVerifier) => {
    const { auth, isFirebaseConfigured, ensureAuthPersistence } = await import('../lib/firebase');
    if (!isFirebaseConfigured || !auth) {
      throw new Error('Firebase configuration missing. Please check .env.local.');
    }
    await ensureAuthPersistence();
    const { signInWithPhoneNumber } = await import('firebase/auth');
    return signInWithPhoneNumber(auth, phoneNumber, appVerifier);
  };

  const confirmPhoneOtp = async (confirmationResult, otpCode, name = '') => {
    if (!confirmationResult || !confirmationResult.confirm) {
      throw new Error('Verification session expired. Please request a new OTP.');
    }
    const result = await confirmationResult.confirm(otpCode);
    const fbUser = result.user;

    const res = await fetch('/api/auth/firebase-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: fbUser.email,
        name: name || fbUser.displayName,
        phone: fbUser.phoneNumber,
        uid: fbUser.uid
      })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to sync phone session.');
    }

    setUser(data.user);
    showToast(`Welcome, ${data.user.name}! Signed in via Contact Number.`, 'success');
    executePendingAddToCart(data.user);
    return data.user;
  };

  const logout = async () => {
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

  // ---------------- USER PREFERENCES HANDLERS ----------------
  const updatePreference = useCallback((key, value) => {
    setPreferences((prev) => {
      const updated = saveStoredPreferences({ [key]: value });
      if (key === 'theme' && typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', value);
      }
      return updated;
    });
  }, []);

  // ---------------- COOKIE CONSENT HANDLERS ----------------
  const acceptAllCookies = useCallback(() => {
    const updated = saveStoredConsent({
      necessary: true,
      analytics: true,
      marketing: true
    });
    setConsent(updated);
    setCookieBannerOpen(false);
    showToast('All cookies accepted. Thank you for customizing your experience!', 'success');
  }, [showToast]);

  const rejectNonEssentialCookies = useCallback(() => {
    const updated = saveStoredConsent({
      necessary: true,
      analytics: false,
      marketing: false
    });
    setConsent(updated);
    setCookieBannerOpen(false);
    showToast('Non-essential cookies declined. Strictly necessary cookies remain active.', 'info');
  }, [showToast]);

  const saveCustomConsent = useCallback((choices) => {
    const updated = saveStoredConsent({
      necessary: true,
      analytics: Boolean(choices.analytics),
      marketing: Boolean(choices.marketing)
    });
    setConsent(updated);
    setCookieBannerOpen(false);
    showToast('Your cookie and privacy preferences have been saved.', 'success');
  }, [showToast]);

  const openCookieSettings = useCallback(() => setCookieSettingsOpen(true), []);
  const closeCookieSettings = useCallback(() => setCookieSettingsOpen(false), []);

  const openQuoteModal = (product) => {
    const targetProduct = product || featuredProducts[0];
    setActiveQuoteProduct(targetProduct);
    setQuoteModalOpen(true);
    sendAnalyticsQuoteRequest(targetProduct);
  };

  const handleSetSearchQuery = (query) => {
    setSearchQuery(query);
    if (query && query.trim().length > 2) {
      sendAnalyticsSearch(query.trim());
    }
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
    sendPhoneOtp,
    confirmPhoneOtp,
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

    // User Preferences
    preferences,
    updatePreference,

    // Cookie Consent Banner & Modal
    consent,
    cookieBannerOpen,
    cookieSettingsOpen,
    openCookieSettings,
    closeCookieSettings,
    acceptAllCookies,
    rejectNonEssentialCookies,
    saveCustomConsent,

    // Products Catalog
    products,
    refreshProducts,
    getProductById: (id) =>
      products.find((p) => p.id?.toString().toLowerCase() === id?.toString().toLowerCase()) || null,

    // Search
    searchQuery,
    setSearchQuery: handleSetSearchQuery
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
