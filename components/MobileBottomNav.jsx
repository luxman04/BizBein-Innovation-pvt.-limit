'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Phone, MapPin, ShoppingCart, User } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { companyDetails } from '../data/products';

export default function MobileBottomNav({
  cartCount,
  onOpenCart,
  onOpenContact
}) {
  const pathname = usePathname();
  const { user } = useStore();
  const isProductDetailPage =
    pathname &&
    pathname.startsWith('/products/') &&
    pathname.split('/').filter(Boolean).length >= 3;

  if (isProductDetailPage) {
    return null;
  }

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

      <Link
        href="/contact"
        className="bottom-nav-item"
        aria-label="View Plant Location and Contact Page"
      >
        <MapPin size={20} />
        <span>Contact</span>
      </Link>

      <Link
        href={user ? "/orders" : "/login"}
        className={`bottom-nav-item bottom-nav-account ${user ? 'logged-in' : ''}`}
        aria-label={user ? `My Account (${user.name})` : "Sign In to Account"}
        title={user ? user.name : "Sign In"}
      >
        <div className="account-icon-wrap">
          <User size={20} />
          {user && <span className="account-avatar-dot" />}
        </div>
        <span>{user ? 'Account' : 'Sign In'}</span>
      </Link>

      <style jsx>{`
        .mobile-bottom-nav {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #ffffff;
          border-top: 1px solid #e2e8f0;
          box-shadow: 0 -4px 16px rgba(15, 23, 42, 0.1);
          z-index: 250;
          padding: 6px 2px calc(6px + env(safe-area-inset-bottom, 0px));
          grid-template-columns: repeat(5, minmax(0, 1fr));
          align-items: flex-end;
          gap: 0;
        }

        .bottom-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          color: #475569;
          text-decoration: none;
          background: transparent;
          border: none;
          font-family: inherit;
          font-size: 11px;
          font-weight: 600;
          padding: 3px 1px;
          cursor: pointer;
          min-width: 0;
          width: 100%;
          text-align: center;
          box-sizing: border-box;
          transition: color 0.15s ease;
        }

        .bottom-nav-item span {
          display: block;
          width: 100%;
          max-width: 100%;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 10.5px;
          line-height: 1.2;
        }

        .bottom-nav-item:active {
          color: #d97706;
        }

        .bottom-nav-call {
          color: #0f172a;
        }

        .call-icon-wrap {
          background-color: #F8B50E;
          color: #0f172a;
          padding: 8px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: -12px;
          box-shadow: 0 4px 10px rgba(248, 181, 14, 0.45);
        }

        .cart-badge-wrap,
        .account-icon-wrap {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .bottom-badge {
          position: absolute;
          top: -6px;
          right: -8px;
          background-color: #F8B50E;
          color: #0f172a;
          font-size: 10px;
          font-weight: 800;
          border-radius: 10px;
          padding: 1px 5px;
          min-width: 16px;
          text-align: center;
        }

        .account-avatar-dot {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10b981;
          border: 1.5px solid #ffffff;
        }

        .bottom-nav-account.logged-in {
          color: #0f172a;
        }

        @media (max-width: 768px) {
          .mobile-bottom-nav {
            display: grid;
          }
        }
      `}</style>
    </nav>
  );
}
