'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, SlidersHorizontal, Check, X } from 'lucide-react';

export default function CookieConsentBanner() {
  const {
    consent,
    cookieBannerOpen,
    acceptAllCookies,
    rejectNonEssentialCookies,
    openCookieSettings
  } = useStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid rendering during SSR to prevent any hydration mismatch
  if (!mounted || !cookieBannerOpen) return null;

  return (
    <aside
      className="cookie-banner-wrapper"
      role="region"
      aria-label="Cookie and Privacy Consent"
    >
      <div className="cookie-banner-inner">
        <div className="cookie-banner-content">
          <div className="cookie-badge-icon">
            <ShieldCheck size={22} className="shield-icon" />
          </div>
          <div className="cookie-text-block">
            <h3 className="cookie-heading">We Value Your Privacy &amp; Data Security</h3>
            <p className="cookie-desc">
              BizBein Innovations uses strictly necessary cookies to keep your machinery shopping cart intact, secure enterprise sign-ins, and safeguard transactions. With your consent, we also use privacy-friendly analytics and personalization cookies to measure machinery catalog interest and optimize your engineering procurement experience.
            </p>
          </div>
        </div>

        <div className="cookie-banner-actions">
          <button
            type="button"
            className="cookie-btn cookie-btn-customize"
            onClick={openCookieSettings}
            title="Configure individual cookie permissions"
          >
            <SlidersHorizontal size={14} />
            <span>Customize</span>
          </button>

          <button
            type="button"
            className="cookie-btn cookie-btn-reject"
            onClick={rejectNonEssentialCookies}
            title="Decline non-essential analytics and marketing cookies"
          >
            Reject Non-Essential
          </button>

          <button
            type="button"
            className="cookie-btn cookie-btn-accept"
            onClick={acceptAllCookies}
            title="Accept all necessary, analytics, and marketing cookies"
          >
            <Check size={14} />
            <span>Accept All</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        .cookie-banner-wrapper {
          position: fixed;
          bottom: 20px;
          left: 20px;
          right: 20px;
          max-width: 1200px;
          margin: 0 auto;
          z-index: 9998;
          animation: bannerSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .cookie-banner-inner {
          background: #0b1526;
          color: #ffffff;
          border-radius: 12px;
          padding: 16px 22px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
          border: 1.5px solid rgba(248, 181, 14, 0.35);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .cookie-banner-content {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
        }

        .cookie-badge-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: rgba(248, 181, 14, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #f8b50e;
          flex-shrink: 0;
        }

        .cookie-text-block {
          flex: 1;
        }

        .cookie-heading {
          font-size: 14.5px;
          font-weight: 700;
          margin: 0 0 4px;
          color: #ffffff;
          letter-spacing: -0.01em;
        }

        .cookie-desc {
          font-size: 12px;
          line-height: 1.5;
          color: #cbd5e1;
          margin: 0;
        }

        .cookie-banner-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .cookie-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-family: inherit;
          font-size: 12.5px;
          font-weight: 600;
          padding: 9px 15px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
          border: none;
        }

        .cookie-btn-customize {
          background: rgba(255, 255, 255, 0.08);
          color: #e2e8f0;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .cookie-btn-customize:hover {
          background: rgba(255, 255, 255, 0.16);
          color: #ffffff;
        }

        .cookie-btn-reject {
          background: transparent;
          color: #cbd5e1;
          border: 1px solid #475569;
        }

        .cookie-btn-reject:hover {
          background: rgba(255, 255, 255, 0.06);
          color: #ffffff;
          border-color: #94a3b8;
        }

        .cookie-btn-accept {
          background: #f8b50e;
          color: #0b1526;
          font-weight: 700;
        }

        .cookie-btn-accept:hover {
          background: #e5a407;
          transform: translateY(-1px);
        }

        @keyframes bannerSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 900px) {
          .cookie-banner-inner {
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
            padding: 16px;
          }

          .cookie-banner-actions {
            justify-content: flex-end;
            flex-wrap: wrap;
          }

          .cookie-btn {
            flex: 1;
            min-width: 110px;
          }
        }

        @media (max-width: 768px) {
          .cookie-banner-wrapper {
            bottom: calc(72px + env(safe-area-inset-bottom, 0px));
            left: 12px;
            right: 12px;
          }

          .cookie-banner-content {
            align-items: flex-start;
          }
        }
      `}</style>
    </aside>
  );
}
