'use client';

import React from 'react';
import {
  MapPin,
  ExternalLink,
  ChevronUp,
  CreditCard,
  ShieldCheck
} from 'lucide-react';
import { companyDetails } from '../data/products';

export default function Footer({ onOpenContact }) {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="clean-light-footer" role="contentinfo">
      {/* Main 4-Column Section with Vertical Accent Dividers */}
      <div className="footer-top-tier">
        <div className="footer-container main-content-grid">
          {/* Column 1: Brand Logo, Description & Small Map Box */}
          <div className="footer-col col-brand">
            <div className="brand-logo-wrap">
              <img
                src="/bizbein-innovations-logo.png"
                alt="BizBein Innovations Pvt. Ltd."
                className="footer-brand-logo"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fb = document.getElementById('footer-fallback-logo');
                  if (fb) fb.style.display = 'block';
                }}
              />
              <div id="footer-fallback-logo" className="fallback-logo-text" style={{ display: 'none' }}>
                <span className="fallback-title">BIZ BEIN</span>
                <span className="fallback-sub">INNOVATIONS PVT. LTD.</span>
              </div>
            </div>

            <p className="brand-text">
              BizBein Innovations specializes in providing advanced solutions for conveying, 
              packaging and coding. We offer a comprehensive range of machinery designed to 
              streamline and enhance various industrial processes, including conveying, filling, 
              sealing, labeling, and continuous inkjet coding.
            </p>

            {/* Small Compact Google Map Box */}
            <div className="small-map-box">
              <div className="map-header">
                <MapPin size={14} className="map-pin-icon" />
                <span className="map-title">Plant Works & Office (Zirakpur)</span>
              </div>

              <div className="map-frame-wrapper">
                <iframe
                  title="BizBein Plant Works Location Map"
                  src="https://maps.google.com/maps?q=Plot%205,%20NK%20Sharma%20Rd,%20Badal%20Colony,%20Zirakpur,%20Punjab%20140603&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  className="map-iframe"
                  loading="lazy"
                  allowFullScreen
                ></iframe>
              </div>

              <div className="map-footer-row">
                <span className="map-address-snip">Plot 5, NK Sharma Rd, Zirakpur, Punjab</span>
                <a
                  href={companyDetails.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="map-open-link"
                >
                  <span>Open Map</span>
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: USEFULL-LINKS */}
          <div className="footer-col">
            <div className="col-header-wrap">
              <span className="col-accent-bar">|</span>
              <h4 className="col-title">USEFULL-LINKS</h4>
            </div>

            <ul className="links-list">
              <li>
                <a href="#featured-products" className="footer-text-link">Shop</a>
              </li>
              <li>
                <a href="#about-us" className="footer-text-link">About-Us</a>
              </li>
              <li>
                <a href="#contact-info" onClick={onOpenContact} className="footer-text-link">Contact-Us</a>
              </li>
              <li>
                <a href="#machinery-catalog" className="footer-text-link">Conveyor Systems</a>
              </li>
              <li>
                <a href="#machinery-catalog" className="footer-text-link">Packaging Machinery</a>
              </li>
              <li>
                <a href="#machinery-catalog" className="footer-text-link">CIJ Coding Printers</a>
              </li>
            </ul>
          </div>

          {/* Column 3: LET US HELP YOU */}
          <div className="footer-col">
            <div className="col-header-wrap">
              <span className="col-accent-bar">|</span>
              <h4 className="col-title">LET US HELP YOU</h4>
            </div>

            <ul className="links-list">
              <li>
                <a href="#" className="footer-text-link">Privacy-Policy</a>
              </li>
              <li>
                <a href="#" className="footer-text-link">Terms and Conditions</a>
              </li>
              <li>
                <a href="#" className="footer-text-link">Delivery-Information</a>
              </li>
              <li>
                <a href="#" className="footer-text-link">Return &amp; Refund Policy</a>
              </li>
              <li>
                <a href="#" className="footer-text-link">Machinery Warranty Policy</a>
              </li>
              <li>
                <a href="#" className="footer-text-link">On-Site Engineer Support</a>
              </li>
            </ul>
          </div>

          {/* Column 4: HELPFUL LINKS */}
          <div className="footer-col">
            <div className="col-header-wrap">
              <span className="col-accent-bar">|</span>
              <h4 className="col-title">HELPFUL LINKS</h4>
            </div>

            <ul className="links-list">
              <li>
                <a
                  href="https://www.indiamart.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-text-link"
                >
                  Visit India Mart
                </a>
              </li>
              <li>
                <a
                  href="https://www.amazon.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-text-link"
                >
                  Visit Amazon Store
                </a>
              </li>
              <li>
                <a
                  href="https://www.flipkart.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-text-link"
                >
                  Visit Flipkart
                </a>
              </li>
              <li>
                <a href="#sitemap" className="footer-text-link">SiteMap</a>
              </li>
              <li>
                <a href="#track-order" className="footer-text-link">Track Order Status</a>
              </li>
              <li>
                <a href={`tel:${companyDetails.primaryPhone.replace(/[^0-9+]/g, '')}`} className="footer-text-link">
                  Direct Helpline: {companyDetails.primaryPhone}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Line */}
      <div className="footer-copyright-tier">
        <div className="footer-container">
          <p className="copyright-line">
            © 2023-{currentYear} {companyDetails.name}. All Rights Reserved By {companyDetails.name}
          </p>
        </div>
      </div>

      {/* Payment Methods Bar & Scroll To Top */}
      <div className="footer-payment-tier">
        <div className="footer-container payment-container">
          <div className="payment-content">
            <span className="payment-heading">We accept the following paying methods</span>
            
            <div className="payment-badges-row">
              <span className="pay-badge pay-paytm">Paytm</span>
              <span className="pay-badge pay-gpay">G Pay</span>
              <span className="pay-badge pay-upi">UPI</span>
              <span className="pay-badge pay-cod">COD</span>
              <span className="pay-badge pay-phonepe">PhonePe</span>
              <span className="pay-badge pay-net">Net Banking</span>
              <span className="pay-badge pay-rupay">RuPay</span>
              <span className="pay-badge pay-visa">VISA</span>
              <span className="pay-badge pay-master">Mastercard</span>
            </div>
          </div>

          {/* Red Scroll to Top Button */}
          <button
            type="button"
            className="scroll-top-btn"
            onClick={scrollToTop}
            aria-label="Scroll to top"
            title="Scroll to top"
          >
            <ChevronUp size={20} />
          </button>
        </div>
      </div>

      <style jsx>{`
        .clean-light-footer {
          background-color: #f7f7f8;
          color: #555555;
          font-family: inherit;
          border-top: 1px solid #e5e7eb;
          position: relative;
        }

        .footer-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* 1. Main 4-Column Grid */
        .footer-top-tier {
          padding: 48px 0 36px;
        }

        .main-content-grid {
          display: grid;
          grid-template-columns: 1.45fr 1fr 1fr 1fr;
          gap: 40px;
        }

        .footer-col {
          display: flex;
          flex-direction: column;
        }

        /* Column 1: Brand & Description */
        .col-brand {
          padding-right: 12px;
        }

        .brand-logo-wrap {
          margin-bottom: 16px;
        }

        .footer-brand-logo {
          height: 48px;
          width: auto;
          object-fit: contain;
          display: block;
        }

        .fallback-logo-text {
          display: flex;
          flex-direction: column;
        }

        .fallback-title {
          font-size: 20px;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -0.02em;
        }

        .fallback-sub {
          font-size: 10px;
          font-weight: 700;
          color: #d97706;
          letter-spacing: 0.05em;
        }

        .brand-text {
          font-size: 13.5px;
          line-height: 1.65;
          color: #666666;
          margin: 0 0 18px;
        }

        /* Small Map Box */
        .small-map-box {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 10px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
          max-width: 380px;
        }

        .map-header {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;
        }

        .map-pin-icon {
          color: #dc2626;
        }

        .map-title {
          font-size: 12px;
          font-weight: 700;
          color: #1e293b;
        }

        .map-frame-wrapper {
          width: 100%;
          height: 110px;
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid #cbd5e1;
          background: #f1f5f9;
        }

        .map-iframe {
          width: 100%;
          height: 100%;
          border: none;
          display: block;
        }

        .map-footer-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 8px;
          gap: 8px;
        }

        .map-address-snip {
          font-size: 11px;
          color: #64748b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .map-open-link {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-size: 11px;
          font-weight: 700;
          color: #dc2626;
          text-decoration: none;
          flex-shrink: 0;
        }

        .map-open-link:hover {
          text-decoration: underline;
        }

        /* Column Headers with Accent Bar */
        .col-header-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
        }

        .col-accent-bar {
          color: #dc2626;
          font-weight: 900;
          font-size: 15px;
          line-height: 1;
        }

        .col-title {
          font-size: 13.5px;
          font-weight: 800;
          color: #111827;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin: 0;
        }

        /* Clean Links List */
        .links-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-text-link {
          font-size: 13.5px;
          color: #555555;
          text-decoration: none;
          transition: color 0.15s ease, transform 0.15s ease;
          display: inline-block;
        }

        .footer-text-link:hover {
          color: #dc2626;
          transform: translateX(3px);
        }

        /* 2. Copyright Tier */
        .footer-copyright-tier {
          padding: 18px 0;
          text-align: center;
          border-top: 1px solid #e5e7eb;
          border-bottom: 1px solid #e5e7eb;
          background: #f9f9f9;
        }

        .copyright-line {
          font-size: 13px;
          color: #666666;
          margin: 0;
        }

        /* 3. Payment Methods Tier */
        .footer-payment-tier {
          background-color: #ffffff;
          padding: 16px 0;
        }

        .payment-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
        }

        .payment-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          gap: 10px;
        }

        .payment-heading {
          font-size: 12.5px;
          color: #666666;
          font-weight: 500;
        }

        .payment-badges-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .pay-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          color: #1e293b;
        }

        .pay-paytm {
          color: #002970;
          border-color: #00b9f5;
        }

        .pay-gpay {
          color: #4285f4;
        }

        .pay-upi {
          color: #5f259f;
        }

        .pay-cod {
          background: #f8fafc;
          color: #059669;
        }

        .pay-phonepe {
          color: #6739b7;
        }

        .pay-rupay {
          color: #0076bf;
        }

        .pay-visa {
          color: #1a1f71;
          font-weight: 800;
        }

        .pay-master {
          color: #eb001b;
        }

        /* Red Scroll to Top Button */
        .scroll-top-btn {
          position: absolute;
          right: 24px;
          top: 50%;
          transform: translateY(-50%);
          background-color: #dc2626;
          color: #ffffff;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color 0.2s ease, transform 0.2s ease;
          box-shadow: 0 2px 6px rgba(220, 38, 38, 0.35);
        }

        .scroll-top-btn:hover {
          background-color: #b91c1c;
          transform: translateY(-54%);
        }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
          .main-content-grid {
            grid-template-columns: 1fr 1fr;
            gap: 32px;
          }
          .scroll-top-btn {
            position: static;
            transform: none;
            margin-top: 10px;
          }
          .payment-container {
            flex-direction: column;
            gap: 12px;
          }
        }

        @media (max-width: 640px) {
          .main-content-grid {
            grid-template-columns: 1fr;
            gap: 28px;
          }
          .small-map-box {
            max-width: 100%;
          }
        }
      `}</style>
    </footer>
  );
}
