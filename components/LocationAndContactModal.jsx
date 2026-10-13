'use client';

import React, { useEffect } from 'react';
import {
  X,
  MapPin,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  Navigation,
  Building2,
  Share2
} from 'lucide-react';
import { companyDetails } from '../data/products';

export default function LocationAndContactModal({ isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-card contact-modal-card"
        onClick={(e) => e.stopPropagation()}
        aria-labelledby="contact-modal-title"
      >
        <div className="contact-modal-header">
          <div className="header-meta">
            <span className="badge badge-bestseller">FACTORY WORKS & HEADQUARTERS</span>
            <h3 id="contact-modal-title" className="contact-title">
              {companyDetails.name}
            </h3>
            <span className="contact-subline">{companyDetails.division}</span>
          </div>

          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close location modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="contact-modal-body">
          {/* Physical Address Section */}
          <div className="info-block">
            <div className="info-icon-col">
              <MapPin size={22} className="text-gold" />
            </div>
            <div className="info-content-col">
              <span className="info-label">Works & Manufacturing Facility</span>
              <p className="info-val-address">{companyDetails.address}</p>
              <a
                href={companyDetails.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary map-cta-btn"
              >
                <Navigation size={16} />
                <span>Open in Google Maps Navigation</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>

          {/* Telephone & Fax Lines */}
          <div className="info-block">
            <div className="info-icon-col">
              <Phone size={22} className="text-gold" />
            </div>
            <div className="info-content-col">
              <span className="info-label">Direct Lines / Phone & Fax</span>
              <div className="phones-grid">
                <a
                  href={`tel:${companyDetails.primaryPhone.replace(/[^0-9+]/g, '')}`}
                  className="phone-touch-card"
                >
                  <span className="phone-type">Primary Order Desk</span>
                  <strong className="phone-num">{companyDetails.primaryPhone}</strong>
                </a>

                <a
                  href={`tel:${companyDetails.secondaryPhone.replace(/[^0-9+]/g, '')}`}
                  className="phone-touch-card"
                >
                  <span className="phone-type">Technical Support Line</span>
                  <strong className="phone-num">{companyDetails.secondaryPhone}</strong>
                </a>
              </div>
            </div>
          </div>

          {/* Official Inquiries & Emails */}
          <div className="info-block">
            <div className="info-icon-col">
              <Mail size={22} className="text-gold" />
            </div>
            <div className="info-content-col">
              <span className="info-label">Official Email Contacts</span>
              <div className="emails-grid">
                <a
                  href={`mailto:${companyDetails.salesEmail}`}
                  className="email-touch-card"
                >
                  <span className="email-type">Sales & Commercial Proposals</span>
                  <strong className="email-addr">{companyDetails.salesEmail}</strong>
                </a>

                <a
                  href={`mailto:${companyDetails.infoEmail}`}
                  className="email-touch-card"
                >
                  <span className="email-type">General Inquiries & Logistics</span>
                  <strong className="email-addr">{companyDetails.infoEmail}</strong>
                </a>
              </div>
            </div>
          </div>

          {/* Operational Hours */}
          <div className="info-block">
            <div className="info-icon-col">
              <Clock size={22} className="text-gold" />
            </div>
            <div className="info-content-col">
              <span className="info-label">Factory & Dispatch Operating Hours</span>
              <p className="info-hours">
                <strong>Monday to Saturday:</strong> 9:00 AM – 7:00 PM IST<br />
                <em>(Sunday: Emergency On-Call Factory Support for Production Lines)</em>
              </p>
            </div>
          </div>

          {/* Social Media Channels */}
          <div className="socials-block">
            <span className="socials-label">Connect on Official Social Channels:</span>
            <div className="social-links-row">
              <a
                href={companyDetails.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn"
                aria-label="BizBein Instagram Profile"
              >
                Instagram
              </a>
              <a
                href={companyDetails.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn"
                aria-label="BizBein Facebook Page"
              >
                Facebook
              </a>
              <a
                href={companyDetails.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn"
                aria-label="BizBein LinkedIn Company Page"
              >
                LinkedIn
              </a>
              <a
                href={companyDetails.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn"
                aria-label="BizBein YouTube Machine Demonstrations"
              >
                YouTube
              </a>
              <a
                href={companyDetails.socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn"
                aria-label="BizBein Twitter / X Updates"
              >
                Twitter / X
              </a>
            </div>
          </div>
        </div>

        <div className="contact-modal-footer">
          <button type="button" className="btn btn-secondary full-btn" onClick={onClose}>
            Back to Equipment Catalog
          </button>
        </div>
      </div>

      <style jsx>{`
        .contact-modal-card {
          max-width: 620px;
        }

        .contact-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 24px;
          background-color: var(--bizbein-navy-900);
          color: #ffffff;
          border-top-left-radius: var(--radius-xl);
          border-top-right-radius: var(--radius-xl);
        }

        .contact-title {
          font-size: 20px;
          font-weight: 800;
          color: #ffffff;
          margin: 6px 0 2px;
        }

        .contact-subline {
          font-size: 12px;
          color: var(--bizbein-gold-400);
          font-weight: 600;
        }

        .modal-close-btn {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: #ffffff;
          padding: 8px;
          border-radius: 6px;
          cursor: pointer;
        }

        .contact-modal-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .info-block {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }

        .info-icon-col {
          background: var(--bizbein-navy-100);
          padding: 10px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--bizbein-gold-600);
        }

        .text-gold {
          color: var(--bizbein-gold-600);
        }

        .info-content-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .info-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--color-text-secondary);
          letter-spacing: 0.05em;
        }

        .info-val-address {
          font-size: 14px;
          font-weight: 600;
          color: var(--bizbein-navy-900);
          line-height: 1.45;
        }

        .map-cta-btn {
          margin-top: 8px;
          width: fit-content;
        }

        .phones-grid,
        .emails-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 4px;
        }

        .phone-touch-card,
        .email-touch-card {
          background: var(--color-surface-subtle);
          border: 1px solid var(--color-border-subtle);
          border-radius: var(--radius-md);
          padding: 10px 12px;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          transition: border-color 0.15s ease, background-color 0.15s ease;
        }

        .phone-touch-card:hover,
        .email-touch-card:hover {
          border-color: var(--bizbein-navy-700);
          background-color: var(--bizbein-navy-100);
        }

        .phone-type,
        .email-type {
          font-size: 10px;
          text-transform: uppercase;
          color: var(--color-text-secondary);
          font-weight: 600;
        }

        .phone-num,
        .email-addr {
          font-size: 13px;
          color: var(--bizbein-navy-900);
        }

        .info-hours {
          font-size: 13px;
          color: var(--color-text-primary);
          line-height: 1.5;
        }

        .socials-block {
          background: var(--color-surface-alt);
          border-radius: var(--radius-md);
          padding: 14px;
          border: 1px solid var(--color-border-subtle);
        }

        .socials-label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--color-text-secondary);
          margin-bottom: 8px;
        }

        .social-links-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .social-btn {
          background: #ffffff;
          border: 1px solid var(--color-border-default);
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          font-size: 12px;
          font-weight: 600;
          color: var(--bizbein-navy-900);
          text-decoration: none;
          transition: all 0.15s ease;
        }

        .social-btn:hover {
          background: var(--bizbein-navy-700);
          color: #ffffff;
          border-color: var(--bizbein-navy-700);
        }

        .contact-modal-footer {
          padding: 16px 24px;
          background: var(--color-surface-alt);
          border-top: 1px solid var(--color-border-subtle);
          border-bottom-left-radius: var(--radius-xl);
          border-bottom-right-radius: var(--radius-xl);
        }

        .full-btn {
          width: 100%;
        }

        @media (max-width: 600px) {
          .phones-grid,
          .emails-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
