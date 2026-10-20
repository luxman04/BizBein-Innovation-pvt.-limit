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
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

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
      <a href="#machinery-catalog" className="bottom-nav-item">
        <div className="item-icon-box">
          <Home size={20} />
        </div>
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
        aria-label={`View Cart. ${displayCartCount} items`}
      >
        <div className="item-icon-box">
          <ShoppingCart size={20} />
          {displayCartCount > 0 && <span className="bottom-badge">{displayCartCount}</span>}
        </div>
        <span>Inquiry</span>
      </button>

      <Link
        href="/contact"
        className="bottom-nav-item"
        aria-label="View Plant Location and Contact Page"
      >
        <div className="item-icon-box">
          <MapPin size={20} />
        </div>
        <span>Contact</span>
      </Link>

      <Link
        href={currentUser ? "/orders" : "/login"}
        className={`bottom-nav-item bottom-nav-account ${currentUser ? 'logged-in' : ''}`}
        aria-label={currentUser ? `My Account (${currentUser.name})` : "Sign In to Account"}
        title={currentUser ? currentUser.name : "Sign In"}
      >
        <div className="item-icon-box">
          <User size={20} />
          {currentUser && <span className="account-avatar-dot" />}
        </div>
        <span>{currentUser ? 'Account' : 'Sign In'}</span>
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
          box-shadow: 0 -4px 16px rgba(15, 23, 42, 0.08);
          z-index: 250;
          padding: 6px 0 calc(6px + env(safe-area-inset-bottom, 0px));
          grid-template-columns: repeat(5, 1fr);
          align-items: flex-end;
          gap: 0;
        }

        .bottom-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          gap: 4px;
          color: #64748b;
          text-decoration: none;
          background: transparent;
          border: none;
          font-family: inherit;
          padding: 2px 2px 4px;
          cursor: pointer;
          min-width: 0;
          width: 100%;
          text-align: center;
          box-sizing: border-box;
          transition: color 0.15s ease;
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
          font-weight: 600;
          line-height: 1.2;
          color: inherit;
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
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: -12px;
          box-shadow: 0 4px 10px rgba(248, 181, 14, 0.45);
        }

        .item-icon-box {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
        }

        .bottom-badge {
          position: absolute;
          top: -5px;
          right: -9px;
          background-color: #F8B50E;
          color: #0f172a;
          font-size: 10px;
          font-weight: 800;
          border-radius: 10px;
          padding: 1px 5px;
          min-width: 16px;
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

        @media (max-width: 768px) {
          .mobile-bottom-nav {
            display: grid;
          }
        }
      `}</style>
    </nav>
  );
}
