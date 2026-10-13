'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  FileSpreadsheet,
  CheckCircle,
  Phone,
  Building,
  Mail,
  User,
  MapPin,
  Send,
  Loader2
} from 'lucide-react';
import { companyDetails } from '../data/products';

export default function RequestQuoteModal({ isOpen, onClose, product }) {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    quantity: '1',
    pincode: '',
    notes: ''
  });

  const [status, setStatus] = useState('idle'); // idle | loading | success

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
    }, 1000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        aria-labelledby="rfq-modal-title"
      >
        <div className="modal-header">
          <div className="header-info">
            <span className="modal-eyebrow">COMMERCIAL PROPOSAL DESK</span>
            <h3 id="rfq-modal-title" className="modal-heading">
              Request Technical Quote
            </h3>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close quote modal"
          >
            <X size={20} />
          </button>
        </div>

        {status === 'success' ? (
          <div className="success-view">
            <div className="success-icon-wrap">
              <CheckCircle size={48} className="text-success" />
            </div>
            <h4 className="success-title">Inquiry Submitted Successfully!</h4>
            <p className="success-msg">
              Thank you! Your quotation request for{' '}
              <strong>{product?.name || 'Industrial Equipment'}</strong> has been routed to 
              BizBein Innovations engineering desk.
            </p>
            <div className="success-summary">
              <span>Our technical team will contact you within 2 business hours.</span>
              <span>Need immediate pricing? Call our direct desk:</span>
              <a
                href={`tel:${companyDetails.primaryPhone.replace(/[^0-9+]/g, '')}`}
                className="btn btn-primary direct-call-btn"
              >
                <Phone size={16} />
                <span>Call {companyDetails.primaryPhone}</span>
              </a>
            </div>
            <button
              type="button"
              className="btn btn-outline close-finish-btn"
              onClick={() => {
                setStatus('idle');
                onClose();
              }}
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="rfq-form">
            {/* Selected Product Summary Box */}
            {product && (
              <div className="selected-item-box">
                <img
                  src={product.image}
                  alt={product.name}
                  className="item-thumb"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                <div className="item-meta">
                  <span className="item-model">{product.model}</span>
                  <strong className="item-name">{product.name}</strong>
                  <span className="item-price">Base: {product.price} ({product.unit})</span>
                </div>
              </div>
            )}

            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="companyName">
                  Company / Factory Name <span className="req">*</span>
                </label>
                <div className="input-wrap">
                  <Building size={16} className="field-icon" />
                  <input
                    id="companyName"
                    type="text"
                    required
                    placeholder="e.g. Apex Packaging Solutions"
                    value={formData.companyName}
                    onChange={(e) =>
                      setFormData({ ...formData, companyName: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="contactPerson">
                  Contact Person <span className="req">*</span>
                </label>
                <div className="input-wrap">
                  <User size={16} className="field-icon" />
                  <input
                    id="contactPerson"
                    type="text"
                    required
                    placeholder="e.g. Rajesh Kumar"
                    value={formData.contactPerson}
                    onChange={(e) =>
                      setFormData({ ...formData, contactPerson: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="phone">
                  Mobile / Phone Number <span className="req">*</span>
                </label>
                <div className="input-wrap">
                  <Phone size={16} className="field-icon" />
                  <input
                    id="phone"
                    type="tel"
                    required
                    placeholder="+91 98765-43210"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="email">
                  Official Email ID <span className="req">*</span>
                </label>
                <div className="input-wrap">
                  <Mail size={16} className="field-icon" />
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="procurement@company.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="quantity">Required Quantity</label>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  className="basic-input"
                />
              </div>

              <div className="form-field">
                <label htmlFor="pincode">Delivery Plant Pincode</label>
                <div className="input-wrap">
                  <MapPin size={16} className="field-icon" />
                  <input
                    id="pincode"
                    type="text"
                    placeholder="e.g. 140603"
                    value={formData.pincode}
                    onChange={(e) =>
                      setFormData({ ...formData, pincode: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="form-field full-width">
              <label htmlFor="notes">Custom Application & Conveyor Length Notes</label>
              <textarea
                id="notes"
                rows="3"
                placeholder="Mention specific bottle/carton size, line speed, ink drying requirements, or voltage preference..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              ></textarea>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn btn-primary submit-btn"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 size={16} className="spinner" />
                    <span>Routing to Factory Desk...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Generate Official RFQ Quote</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline"
              >
                Cancel
              </button>
            </div>

            <div className="form-legal-note">
              <span>BizBein Innovations guarantees strict data privacy. Inquiries are handled directly by our engineering works in Zirakpur, Punjab.</span>
            </div>
          </form>
        )}
      </div>

      <style jsx>{`
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          background-color: var(--bizbein-navy-900);
          color: #ffffff;
          border-top-left-radius: var(--radius-xl);
          border-top-right-radius: var(--radius-xl);
        }

        .modal-eyebrow {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.06em;
          color: var(--bizbein-gold-500);
          text-transform: uppercase;
          display: block;
        }

        .modal-heading {
          font-size: 20px;
          font-weight: 700;
          color: #ffffff;
          margin-top: 2px;
        }

        .modal-close-btn {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: #ffffff;
          padding: 8px;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }

        .modal-close-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .rfq-form {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .selected-item-box {
          display: flex;
          align-items: center;
          gap: 14px;
          background-color: var(--color-surface-subtle);
          border: 1px solid var(--color-border-subtle);
          border-radius: var(--radius-md);
          padding: 12px;
        }

        .item-thumb {
          width: 56px;
          height: 56px;
          object-fit: cover;
          border-radius: 4px;
          background: #ffffff;
        }

        .item-meta {
          display: flex;
          flex-direction: column;
        }

        .item-model {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: var(--color-text-secondary);
        }

        .item-name {
          font-size: 14px;
          color: var(--bizbein-navy-900);
        }

        .item-price {
          font-size: 12px;
          color: var(--bizbein-navy-700);
          font-weight: 600;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .full-width {
          grid-column: span 2;
        }

        label {
          font-size: 12px;
          font-weight: 600;
          color: var(--color-text-primary);
        }

        .req {
          color: var(--color-status-error);
        }

        .input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .field-icon {
          position: absolute;
          left: 12px;
          color: var(--color-text-tertiary);
          pointer-events: none;
        }

        .input-wrap input,
        .basic-input {
          width: 100%;
          padding: 10px 12px 10px 36px;
          border: 1.5px solid var(--color-border-default);
          border-radius: var(--radius-md);
          font-family: inherit;
          font-size: 14px;
          color: var(--color-text-primary);
          outline: none;
          transition: border-color 0.15s ease;
        }

        .basic-input {
          padding-left: 12px;
        }

        .input-wrap input:focus,
        .basic-input:focus,
        textarea:focus {
          border-color: var(--bizbein-navy-700);
          box-shadow: 0 0 0 3px rgba(245, 166, 35, 0.25);
        }

        textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1.5px solid var(--color-border-default);
          border-radius: var(--radius-md);
          font-family: inherit;
          font-size: 13px;
          color: var(--color-text-primary);
          outline: none;
          resize: vertical;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }

        .submit-btn {
          flex: 1;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .form-legal-note {
          font-size: 11px;
          color: var(--color-text-tertiary);
          line-height: 1.4;
          text-align: center;
          margin-top: 4px;
        }

        /* Success View */
        .success-view {
          padding: 40px 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .text-success {
          color: var(--color-status-success);
        }

        .success-title {
          font-size: 22px;
          font-weight: 800;
          color: var(--bizbein-navy-900);
        }

        .success-msg {
          font-size: 14px;
          color: var(--color-text-secondary);
          max-width: 440px;
          line-height: 1.5;
        }

        .success-summary {
          background-color: var(--color-surface-subtle);
          border-radius: var(--radius-md);
          padding: 16px;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 13px;
          color: var(--color-text-primary);
        }

        .direct-call-btn {
          margin-top: 6px;
        }

        .close-finish-btn {
          width: 100%;
        }

        @media (max-width: 600px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          .full-width {
            grid-column: span 1;
          }
        }
      `}</style>
    </div>
  );
}
