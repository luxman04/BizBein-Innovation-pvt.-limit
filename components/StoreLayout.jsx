'use client';

import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import MobileBottomNav from './MobileBottomNav';
import WhatsAppButton from './WhatsAppButton';
import RequestQuoteModal from './RequestQuoteModal';
import QuickInquiryDrawer from './QuickInquiryDrawer';
import ExpertCallModal from './ExpertCallModal';
import TrackOrderModal from './TrackOrderModal';
import LocationAndContactModal from './LocationAndContactModal';
import { useStore } from '../context/StoreContext';

export default function StoreLayout({ children }) {
  const {
    cartItems,
    updateQty,
    removeItem,
    totalCartCount,
    cartDrawerOpen,
    openCartDrawer,
    closeCartDrawer,
    quoteModalOpen,
    activeQuoteProduct,
    openQuoteModal,
    closeQuoteModal,
    contactModalOpen,
    openContactModal,
    closeContactModal,
    expertModalOpen,
    openExpertModal,
    closeExpertModal,
    trackModalOpen,
    openTrackModal,
    closeTrackModal,
    searchQuery,
    setSearchQuery
  } = useStore();

  const [headerCat, setHeaderCat] = useState('all');

  return (
    <div className="store-shell">
      {/* 1. Global Header */}
      <Header
        cartCount={totalCartCount}
        onOpenCart={openCartDrawer}
        onOpenQuote={() => openQuoteModal(null)}
        onOpenExpert={openExpertModal}
        onOpenTrack={openTrackModal}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={headerCat}
        setSelectedCategory={setHeaderCat}
      />

      {/* 2. Page Content */}
      <main id="main-content" className="store-main-viewport">
        {children}
      </main>

      {/* 3. Global Footer */}
      <Footer onOpenContact={openContactModal} />

      {/* 4. Floating WhatsApp */}
      <WhatsAppButton />

      {/* 5. Mobile Bottom Navigation */}
      <MobileBottomNav
        cartCount={totalCartCount}
        onOpenCart={openCartDrawer}
        onOpenContact={openContactModal}
      />

      {/* Global Modals */}
      <RequestQuoteModal
        isOpen={quoteModalOpen}
        onClose={closeQuoteModal}
        product={activeQuoteProduct}
      />

      <QuickInquiryDrawer
        isOpen={cartDrawerOpen}
        onClose={closeCartDrawer}
        cartItems={cartItems}
        onUpdateQty={updateQty}
        onRemoveItem={removeItem}
        onOpenQuoteModal={openQuoteModal}
      />

      <ExpertCallModal
        isOpen={expertModalOpen}
        onClose={closeExpertModal}
      />

      <TrackOrderModal
        isOpen={trackModalOpen}
        onClose={closeTrackModal}
      />

      <LocationAndContactModal
        isOpen={contactModalOpen}
        onClose={closeContactModal}
      />

      <style jsx>{`
        .store-shell {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background-color: #f8fafc;
        }

        .store-main-viewport {
          flex: 1;
        }
      `}</style>
    </div>
  );
}
