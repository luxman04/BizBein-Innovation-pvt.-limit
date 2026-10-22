'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Phone, MapPin, ShoppingCart, User } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { companyDetails } from '../data/products';

function useIsMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}

export default function MobileBottomNav({
  cartCount,
  onOpenCart,
  onOpenContact
}) {
  const pathname = usePathname();
  const { user } = useStore();
  const mounted = useIsMounted();

  const currentUser = mounted ? user : null;
  const displayCartCount = mounted ? cartCount : 0;

  const isProductDetailPage =
    pathname &&
    pathname.startsWith('/products/') &&
    pathname.split('/').filter(Boolean).length >= 3;

  if (isProductDetailPage) {
    return null;
  }

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Quick Actions">
      <Link href="/#machinery-catalog" className="bottom-nav-item">
        <span className="item-icon-box">
          <Home size={20} />
        </span>
        <span>Catalog</span>
      </Link>

      <a
        href={`tel:${companyDetails.primaryPhone.replace(/[^0-9+]/g, '')}`}
        className="bottom-nav-item bottom-nav-call"
        aria-label="Direct Factory Call"
      >
        <span className="item-icon-box">
          <Phone size={20} />
        </span>
        <span>Call Desk</span>
      </a>

      <button
        type="button"
        onClick={onOpenCart}
        className="bottom-nav-item bottom-nav-cart"
        aria-label={`View Cart. ${displayCartCount} items`}
      >
        <span className="item-icon-box">
          <ShoppingCart size={20} />
          {mounted && displayCartCount > 0 && <span className="bottom-badge">{displayCartCount}</span>}
        </span>
        <span>Inquiry</span>
      </button>

      <Link
        href="/contact"
        className="bottom-nav-item"
        aria-label="View Plant Location and Contact Page"
      >
        <span className="item-icon-box">
          <MapPin size={20} />
        </span>
        <span>Contact</span>
      </Link>

      <Link
        href={mounted && currentUser ? "/orders" : "/login"}
        className={`bottom-nav-item bottom-nav-account ${mounted && currentUser ? 'logged-in' : ''}`}
        aria-label={mounted && currentUser ? `My Account (${currentUser.name})` : "Sign In to Account"}
        title={mounted && currentUser ? currentUser.name : "Sign In"}
        suppressHydrationWarning
      >
        <span className="item-icon-box">
          <User size={20} />
          {mounted && currentUser && <span className="account-avatar-dot" />}
        </span>
        <span>{mounted && currentUser ? 'Account' : 'Sign In'}</span>
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
          box-shadow: 0 -3px 12px rgba(15, 23, 42, 0.06);
          z-index: 250;
          padding: 6px 0 calc(6px + env(safe-area-inset-bottom, 0px));
          grid-template-columns: repeat(5, 1fr);
          align-items: center;
          gap: 0;
          box-sizing: border-box;
        }

        .bottom-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          color: #64748b;
          text-decoration: none;
          background: transparent;
          border: none;
          font-family: inherit;
          padding: 4px 2px;
          cursor: pointer;
          min-width: 0;
          width: 100%;
          text-align: center;
          box-sizing: border-box;
          transition: all 0.15s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .bottom-nav-item span {
          display: block;
          width: 100%;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 11px;
          font-weight: 500;
          line-height: 1.2;
          color: inherit;
        }

        .bottom-nav-item:active,
        .bottom-nav-item.active {
          color: #d97706;
        }

        .bottom-nav-item:active .item-icon-box {
          transform: scale(0.92);
        }

        .item-icon-box {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          color: inherit;
          transition: transform 0.15s ease;
        }

        .bottom-badge {
          position: absolute;
          top: -3px;
          right: -7px;
          background-color: #F8B50E;
          color: #0f172a;
          font-size: 10px;
          font-weight: 800;
          border-radius: 10px;
          padding: 1px 5px;
          min-width: 15px;
          height: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }

        .account-avatar-dot {
          position: absolute;
          top: -1px;
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

        .bottom-nav-account.logged-in span {
          font-weight: 600;
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
