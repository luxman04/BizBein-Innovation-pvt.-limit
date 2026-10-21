'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Shield, Check, X, Info, Lock, BarChart3, Target, ChevronRight } from 'lucide-react';

export default function CookieSettingsModal() {
  const {
    consent,
    cookieSettingsOpen,
    closeCookieSettings,
    saveCustomConsent,
    acceptAllCookies,
    rejectNonEssentialCookies
  } = useStore();

  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [marketingEnabled, setMarketingEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'necessary' | 'analytics' | 'marketing'

  useEffect(() => {
    if (consent) {
      setAnalyticsEnabled(Boolean(consent.analytics));
      setMarketingEnabled(Boolean(consent.marketing));
    }
  }, [consent, cookieSettingsOpen]);

  if (!cookieSettingsOpen) return null;

  const handleSave = () => {
    saveCustomConsent({
      analytics: analyticsEnabled,
      marketing: marketingEnabled
    });
    closeCookieSettings();
  };

  const handleAcceptAll = () => {
    acceptAllCookies();
    closeCookieSettings();
  };

  const handleRejectAll = () => {
    rejectNonEssentialCookies();
    closeCookieSettings();
  };

  return (
    <div className="cookie-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="cookie-settings-title">
      <div className="cookie-modal-card">
        {/* Header */}
        <div className="cookie-modal-header">
          <div className="header-title-box">
            <div className="shield-badge">
              <Shield size={20} className="shield-icon" />
            </div>
            <div>
              <h2 id="cookie-settings-title" className="cookie-title">Cookie &amp; Privacy Preferences</h2>
              <p className="cookie-subtitle">BizBein Innovations Pvt. Ltd. — Data Protection Management</p>
            </div>
          </div>
          <button
            type="button"
            className="cookie-close-btn"
            onClick={closeCookieSettings}
            aria-label="Close Cookie Settings"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="cookie-nav-tabs">
          <button
            type="button"
            className={`cookie-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            type="button"
            className={`cookie-tab-btn ${activeTab === 'necessary' ? 'active' : ''}`}
            onClick={() => setActiveTab('necessary')}
          >
            Necessary (3)
          </button>
          <button
            type="button"
            className={`cookie-tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
          <button
            type="button"
            className={`cookie-tab-btn ${activeTab === 'marketing' ? 'active' : ''}`}
            onClick={() => setActiveTab('marketing')}
          >
            Marketing
          </button>
        </div>

        {/* Body Content */}
        <div className="cookie-modal-body">
          {activeTab === 'overview' && (
            <div className="overview-pane">
              <p className="overview-text">
                We use cookies and secure storage to ensure the integrity of our industrial storefront, persist your machinery shopping cart, maintain enterprise login sessions, and evaluate anonymous platform analytics. You may adjust your choices below at any time.
              </p>
              
              <div className="categories-list">
                {/* 1. Necessary */}
                <div className="category-row">
                  <div className="cat-info">
                    <div className="cat-title-row">
                      <Lock size={15} className="cat-icon text-gold" />
                      <strong>Strictly Necessary Cookies</strong>
                      <span className="badge-locked">Always Active</span>
                    </div>
                    <p className="cat-desc">
                      Required for login session validation, CSRF defense, and industrial shopping cart persistence. These cannot be disabled.
                    </p>
                  </div>
                </div>

                {/* 2. Analytics */}
                <div className="category-row">
                  <div className="cat-info">
                    <div className="cat-title-row">
                      <BarChart3 size={15} className="cat-icon text-cyan" />
                      <strong>Analytics &amp; Performance</strong>
                    </div>
                    <p className="cat-desc">
                      Measures anonymous interaction metrics and catalog searches to improve conveyor, coder, and packaging machine discovery.
                    </p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={analyticsEnabled}
                      onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                      aria-label="Toggle Analytics Cookies"
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                {/* 3. Marketing */}
                <div className="category-row">
                  <div className="cat-info">
                    <div className="cat-title-row">
                      <Target size={15} className="cat-icon text-purple" />
                      <strong>Marketing &amp; Personalization</strong>
                    </div>
                    <p className="cat-desc">
                      Enables tailored machinery quote suggestions and regional dispatch lead tracking.
                    </p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={marketingEnabled}
                      onChange={(e) => setMarketingEnabled(e.target.checked)}
                      aria-label="Toggle Marketing Cookies"
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'necessary' && (
            <div className="detail-pane">
              <div className="detail-header-info">
                <Info size={16} className="text-gold" />
                <span>Strictly necessary cookies are essential for you to browse the site and use its core industrial features.</span>
              </div>
              <div className="cookie-table-wrapper">
                <table className="cookie-audit-table">
                  <thead>
                    <tr>
                      <th>Cookie Name</th>
                      <th>Storage Type</th>
                      <th>Lifespan</th>
                      <th>Purpose</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>bizbein_session_token</code></td>
                      <td>HttpOnly Cookie</td>
                      <td>7 Days</td>
                      <td>Enterprise user authentication session, verified on backend via cryptographic JWT token.</td>
                    </tr>
                    <tr>
                      <td><code>bizbein_cart</code></td>
                      <td>Secure Cookie / Storage</td>
                      <td>180 Days</td>
                      <td>Retains selected industrial conveyors, coders, and packaging units across browser restarts with server-validated prices.</td>
                    </tr>
                    <tr>
                      <td><code>bizbein_cookie_consent</code></td>
                      <td>First-Party Cookie</td>
                      <td>180 Days</td>
                      <td>Persists user privacy selections (Accept All, Reject Non-Essential, or Custom).</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="detail-pane">
              <div className="detail-toggle-banner">
                <div>
                  <strong>Enable Anonymous Analytics Cookies</strong>
                  <p>Helps our engineering team optimize site speed and track equipment catalog interest.</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={analyticsEnabled}
                    onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="cookie-table-wrapper">
                <table className="cookie-audit-table">
                  <thead>
                    <tr>
                      <th>Service</th>
                      <th>Data Collected</th>
                      <th>PII Policy</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>BizBein Telemetry</td>
                      <td>Page views, equipment filter queries, session latency</td>
                      <td>Strictly Anonymized. Never collects passwords, OTPs, or financial details.</td>
                    </tr>
                    <tr>
                      <td>Firebase Analytics (Optional)</td>
                      <td>Anonymous machine interactions, browser device telemetry</td>
                      <td>Compliant with Google privacy terms; loaded only with explicit consent.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'marketing' && (
            <div className="detail-pane">
              <div className="detail-toggle-banner">
                <div>
                  <strong>Enable Industrial Marketing Cookies</strong>
                  <p>Enables tailored machine recommendations and proforma quotation tracking.</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={marketingEnabled}
                    onChange={(e) => setMarketingEnabled(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="cookie-table-wrapper">
                <table className="cookie-audit-table">
                  <thead>
                    <tr>
                      <th>Cookie Name</th>
                      <th>Service</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>bizbein_lead_src</code></td>
                      <td>First-Party Marketing</td>
                      <td>Remembers quotation referral tags to connect inquiries with regional sales engineers.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="cookie-modal-footer">
          <button type="button" className="btn-cookie-outline" onClick={handleRejectAll}>
            Reject Non-Essential
          </button>
          <div className="footer-right-actions">
            <button type="button" className="btn-cookie-save" onClick={handleSave}>
              Save Preferences
            </button>
            <button type="button" className="btn-cookie-primary" onClick={handleAcceptAll}>
              Accept All
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .cookie-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(11, 21, 38, 0.72);
          backdrop-filter: blur(5px);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          animation: modalFadeIn 0.2s ease-out;
        }

        .cookie-modal-card {
          width: 100%;
          max-width: 680px;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.28);
          border: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          max-height: 90vh;
          overflow: hidden;
          animation: cardSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .cookie-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 24px;
          background: #0b1526;
          color: #ffffff;
          border-bottom: 2px solid #f8b50e;
        }

        .header-title-box {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .shield-badge {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: rgba(248, 181, 14, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #f8b50e;
        }

        .cookie-title {
          font-size: 16px;
          font-weight: 700;
          margin: 0;
          color: #ffffff;
        }

        .cookie-subtitle {
          font-size: 11.5px;
          color: #94a3b8;
          margin: 2px 0 0;
        }

        .cookie-close-btn {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: #cbd5e1;
          width: 32px;
          height: 32px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .cookie-close-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          color: #ffffff;
        }

        .cookie-nav-tabs {
          display: flex;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          padding: 0 16px;
          gap: 8px;
          overflow-x: auto;
        }

        .cookie-tab-btn {
          background: transparent;
          border: none;
          padding: 12px 14px;
          font-size: 13px;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.15s ease;
          white-space: nowrap;
        }

        .cookie-tab-btn:hover {
          color: #0b1526;
        }

        .cookie-tab-btn.active {
          color: #0b1526;
          border-bottom-color: #f8b50e;
          font-weight: 700;
        }

        .cookie-modal-body {
          padding: 20px 24px;
          overflow-y: auto;
          flex: 1;
        }

        .overview-text {
          font-size: 13px;
          color: #475569;
          line-height: 1.55;
          margin: 0 0 16px;
        }

        .categories-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .category-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 14px 16px;
          border-radius: 8px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          gap: 16px;
        }

        .cat-info {
          flex: 1;
        }

        .cat-title-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }

        .cat-title-row strong {
          font-size: 13.5px;
          color: #0f172a;
        }

        .cat-desc {
          font-size: 12px;
          color: #64748b;
          line-height: 1.45;
          margin: 0;
        }

        .badge-locked {
          font-size: 10.5px;
          font-weight: 700;
          text-transform: uppercase;
          background: #ecfdf5;
          color: #059669;
          padding: 2px 7px;
          border-radius: 4px;
        }

        /* Toggle switch */
        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          inset: 0;
          background-color: #cbd5e1;
          transition: 0.2s;
          border-radius: 24px;
        }

        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: 0.2s;
          border-radius: 50%;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }

        .toggle-switch input:checked + .toggle-slider {
          background-color: #f8b50e;
        }

        .toggle-switch input:checked + .toggle-slider:before {
          transform: translateX(20px);
        }

        /* Detail tab panes */
        .detail-header-info {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          background: #fffbeb;
          border: 1px solid #fef3c7;
          border-radius: 6px;
          font-size: 12.5px;
          color: #92400e;
          margin-bottom: 16px;
        }

        .detail-toggle-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          margin-bottom: 16px;
        }

        .detail-toggle-banner strong {
          display: block;
          font-size: 13.5px;
          color: #0f172a;
        }

        .detail-toggle-banner p {
          font-size: 12px;
          color: #64748b;
          margin: 2px 0 0;
        }

        .cookie-table-wrapper {
          overflow-x: auto;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
        }

        .cookie-audit-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
          text-align: left;
        }

        .cookie-audit-table th {
          background: #f1f5f9;
          padding: 8px 12px;
          color: #334155;
          font-weight: 700;
          border-bottom: 1px solid #e2e8f0;
        }

        .cookie-audit-table td {
          padding: 10px 12px;
          border-bottom: 1px solid #f1f5f9;
          color: #475569;
          vertical-align: top;
        }

        .cookie-audit-table code {
          background: #e2e8f0;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 11px;
          color: #0f172a;
          font-weight: 600;
        }

        /* Footer buttons */
        .cookie-modal-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 24px;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
          gap: 12px;
          flex-wrap: wrap;
        }

        .footer-right-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .btn-cookie-outline {
          background: transparent;
          border: 1px solid #cbd5e1;
          color: #475569;
          font-size: 12.5px;
          font-weight: 600;
          padding: 8px 14px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-cookie-outline:hover {
          background: #e2e8f0;
          color: #0f172a;
        }

        .btn-cookie-save {
          background: #0b1526;
          color: #ffffff;
          border: none;
          font-size: 12.5px;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-cookie-save:hover {
          background: #1e293b;
        }

        .btn-cookie-primary {
          background: #f8b50e;
          color: #0b1526;
          border: none;
          font-size: 12.5px;
          font-weight: 700;
          padding: 8px 18px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-cookie-primary:hover {
          background: #e5a407;
        }

        .text-gold { color: #d97706; }
        .text-cyan { color: #0284c7; }
        .text-purple { color: #7c3aed; }

        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes cardSlideUp {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (max-width: 600px) {
          .cookie-modal-footer {
            flex-direction: column-reverse;
            align-items: stretch;
          }
          .footer-right-actions {
            flex-direction: column;
            width: 100%;
          }
          .btn-cookie-outline, .btn-cookie-save, .btn-cookie-primary {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
