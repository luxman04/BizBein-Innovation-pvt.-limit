'use client';

import React from 'react';
import { Home, Phone, MapPin, ShoppingCart, Mail } from 'lucide-react';
import { companyDetails } from '../data/products';

export default function MobileBottomNav({
  cartCount,
  onOpenCart,
  onOpenContact
}) {
  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Quick Actions">
      <a href="#machinery-catalog" className="bottom-nav-item">
        <Home size={20} />
        <span>Catalog</span>
      </a>

      <a
        href={`tel:${companyDetails.primaryPhone.replace(/[^0-9+]/g, '')}`}
        className="bottom-nav-item bottom-nav-call"
        aria-label="Direct Factory Call"
      >
        <div className="call-icon-wrap">
          <Phone size={18} />
        </div>
        <span>Call Desk</span>
      </a>

      <button
        type="button"
        onClick={onOpenCart}
        className="bottom-nav-item bottom-nav-cart"
        aria-label={`View Cart. ${cartCount} items`}
      >
        <div className="cart-badge-wrap">
          <ShoppingCart size={20} />
          {cartCount > 0 && <span className="bottom-badge">{cartCount}</span>}
        </div>
        <span>Inquiry</span>
      </button>

      <button
        type="button"
        onClick={onOpenContact}
        className="bottom-nav-item"
        aria-label="View Plant Location and Address"
      >
        <MapPin size={20} />
        <span>Works</span>
      </button>

      <a
        href={`mailto:${companyDetails.salesEmail}`}
        className="bottom-nav-item"
        aria-label="Send Sales RFQ Email"
      >
        <Mail size={20} />
        <span>Email</span>
      </a>

      <style jsx>{`
        .mobile-bottom-nav {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #ffffff;
          border-top: 2px solid var(--bizbein-navy-700);
          box-shadow: 0 -4px 16px rgba(26, 32, 53, 0.15);
          z-index: 250;
          padding: 6px 8px env(safe-area-inset-bottom, 8px);
          justify-content: space-around;
          align-items: center;
        }

        .bottom-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          color: var(--color-text-secondary);
          text-decoration: none;
          background: transparent;
          border: none;
          font-family: inherit;
          font-size: 11px;
          font-weight: 600;
          padding: 4px 8px;
          cursor: pointer;
          min-width: 54px;
        }

        .bottom-nav-item:active {
          color: var(--bizbein-gold-600);
        }

        .bottom-nav-call {
          color: var(--bizbein-navy-900);
        }

        .call-icon-wrap {
          background-color: var(--bizbein-gold-500);
          color: var(--bizbein-navy-900);
          padding: 8px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: -12px;
          box-shadow: 0 4px 8px rgba(248, 181, 14, 0.4);
        }

        .cart-badge-wrap {
          position: relative;
          display: flex;
        }

        .bottom-badge {
          position: absolute;
          top: -6px;
          right: -8px;
          background-color: var(--bizbein-gold-500);
          color: var(--bizbein-navy-900);
          font-size: 10px;
          font-weight: 800;
          border-radius: 10px;
          padding: 1px 5px;
          min-width: 16px;
          text-align: center;
        }

        @media (max-width: 768px) {
          .mobile-bottom-nav {
            display: flex;
          }
        }
      `}</style>
    </nav>
  );
}
