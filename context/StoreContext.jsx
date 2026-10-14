'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { featuredProducts } from '../data/products';

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [cartItems, setCartItems] = useState([
    {
      ...featuredProducts[0],
      qty: 1
    }
  ]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Modals & Drawers
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [activeQuoteProduct, setActiveQuoteProduct] = useState(null);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [expertModalOpen, setExpertModalOpen] = useState(false);
  const [trackModalOpen, setTrackModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Hydrate from localStorage once mounted
  useEffect(() => {
    try {
      const saved = localStorage.getItem('bizbein_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCartItems(parsed);
        }
      }
    } catch (e) {
      // LocalStorage access safe catch
    }
    setIsLoaded(true);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('bizbein_cart', JSON.stringify(cartItems));
      } catch (e) {}
    }
  }, [cartItems, isLoaded]);

  const addToCart = (product, qty = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + qty } : item
        );
      }
      return [...prev, { ...product, qty }];
    });
    setCartDrawerOpen(true);
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

  const openQuoteModal = (product) => {
    setActiveQuoteProduct(product || featuredProducts[0]);
    setQuoteModalOpen(true);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + (item.qty || 1), 0);

  const value = {
    cartItems,
    addToCart,
    updateQty,
    removeItem,
    totalCartCount,
    cartDrawerOpen,
    openCartDrawer: () => setCartDrawerOpen(true),
    closeCartDrawer: () => setCartDrawerOpen(false),
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
