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
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

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
    setSearchQuery,
    toast,
    hideToast
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

      {/* Floating Toast Notification */}
      {toast && (
        <div className={`store-toast-banner store-toast-${toast.type || 'success'}`} role="status">
          <div className="toast-inner">
            {toast.type === 'error' && <AlertCircle size={18} className="toast-icon text-red" />}
            {toast.type === 'info' && <Info size={18} className="toast-icon text-amber" />}
            {(toast.type === 'success' || !toast.type) && <CheckCircle size={18} className="toast-icon text-green" />}
            <span className="toast-text">{toast.message}</span>
            <button type="button" onClick={hideToast} className="toast-close" aria-label="Dismiss">
              <X size={15} />
            </button>
          </div>
        </div>
      )}

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
          background-color: #ffffff;
        }

        .store-main-viewport {
          flex: 1;
        }

        .store-toast-banner {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 10000;
          animation: slideInToast 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideInToast {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .toast-inner {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #13192B;
          color: #ffffff;
          padding: 12px 18px;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
          border-left: 4px solid #F8B50E;
          font-size: 13.5px;
          font-weight: 500;
          max-width: 420px;
        }

        .store-toast-error .toast-inner {
          border-left-color: #ef4444;
        }

        .store-toast-info .toast-inner {
          border-left-color: #F8B50E;
        }

        .store-toast-success .toast-inner {
          border-left-color: #22c55e;
        }

        .toast-icon {
          flex-shrink: 0;
        }

        .text-green {
          color: #22c55e;
        }

        .text-amber {
          color: #F8B50E;
        }

        .text-red {
          color: #ef4444;
        }

        .toast-text {
          flex: 1;
          line-height: 1.4;
        }

        .toast-close {
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 2px;
          display: flex;
          align-items: center;
          transition: color 0.15s ease;
        }

        .toast-close:hover {
          color: #ffffff;
        }

        @media (max-width: 640px) {
          .store-toast-banner {
            left: 16px;
            right: 16px;
            bottom: 74px;
          }
          .toast-inner {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
