'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  Trash2,
  Plus,
  Minus,
  Send,
  Phone,
  ShoppingCart,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { companyDetails } from '../data/products';

export default function QuickInquiryDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onOpenQuoteModal
}) {
  const router = useRouter();

  const cartTotal = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.qty || 1),
    0
  );

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
    <div className="drawer-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="drawer-panel"
        onClick={(e) => e.stopPropagation()}
        aria-labelledby="drawer-title"
      >
        <div className="drawer-header">
          <div className="drawer-header-left">
            <ShoppingCart size={20} className="text-gold" />
            <h3 id="drawer-title" className="drawer-title">
              Equipment Inquiry Cart ({cartItems.length})
            </h3>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Close cart drawer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="drawer-content">
          {cartItems.length > 0 ? (
            <ul className="cart-list">
              {cartItems.map((item) => (
                <li key={item.id} className="cart-item">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-img"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80';
                    }}
                  />

                  <div className="cart-item-details">
                    <span className="cart-item-model">{item.model}</span>
                    <strong className="cart-item-name">{item.name}</strong>
                    <span className="cart-item-price">{item.priceDisplay || `₹${item.price.toLocaleString('en-IN')}`} / {item.unit}</span>

                    <div className="cart-item-actions">
                      <div className="qty-control">
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => onUpdateQty(item.id, Math.max(1, item.qty - 1))}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="qty-value">{item.qty}</span>
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => onUpdateQty(item.id, item.qty + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => onRemoveItem(item.id)}
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 size={14} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="drawer-empty-view">
              <ShoppingCart size={48} className="empty-cart-icon text-gold" />
              <h4>Your Inquiry List is Empty</h4>
              <p>
                Browse our industrial coding, conveying, and packaging catalog 
                and add items to generate a consolidated factory quotation.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={onClose}
              >
                Browse Equipment Catalog
              </button>
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="drawer-footer">
            <div className="cart-total-bar">
              <span className="total-label">Estimated Total:</span>
              <strong className="total-value">₹{cartTotal.toLocaleString('en-IN')}</strong>
            </div>

            <button
              type="button"
              className="btn btn-primary checkout-btn"
              onClick={() => {
                onClose();
                router.push('/checkout');
              }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={17} />
            </button>

            <button
              type="button"
              className="btn btn-outline submit-cart-btn"
              onClick={() => {
                onClose();
                onOpenQuoteModal(cartItems[0]);
              }}
            >
              <Send size={15} />
              <span>Or Submit RFQ Inquiry</span>
            </button>

            <div className="footer-notice">
              <ShieldCheck size={14} className="text-gold" />
              <span>100% Genuine Industrial Machines • Direct Factory Dispatch</span>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 20px;
          background: var(--bizbein-navy-900);
          color: #ffffff;
          border-bottom: 2px solid var(--bizbein-gold-500);
        }

        .drawer-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .text-gold {
          color: var(--bizbein-gold-500);
        }

        .drawer-title {
          font-size: 16px;
          font-weight: 700;
          color: #ffffff;
        }

        .drawer-close-btn {
          background: transparent;
          border: none;
          color: #cbd5e1;
          cursor: pointer;
          display: flex;
          padding: 4px;
        }

        .drawer-close-btn:hover {
          color: #ffffff;
        }

        .drawer-content {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
        }

        .cart-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .cart-item {
          display: flex;
          gap: 14px;
          background: var(--color-surface-subtle);
          border: 1px solid var(--color-border-subtle);
          border-radius: var(--radius-md);
          padding: 14px;
        }

        .cart-item-img {
          width: 72px;
          height: 72px;
          object-fit: cover;
          border-radius: 6px;
          background: #ffffff;
          flex-shrink: 0;
        }

        .cart-item-details {
          display: flex;
          flex-direction: column;
          flex: 1;
          gap: 4px;
        }

        .cart-item-model {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: var(--color-text-secondary);
        }

        .cart-item-name {
          font-size: 13px;
          color: var(--bizbein-navy-900);
          line-height: 1.3;
        }

        .cart-item-price {
          font-size: 13px;
          font-weight: 700;
          color: var(--bizbein-navy-700);
        }

        .cart-item-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 8px;
        }

        .qty-control {
          display: flex;
          align-items: center;
          background: #ffffff;
          border: 1px solid var(--color-border-default);
          border-radius: 4px;
        }

        .qty-btn {
          background: transparent;
          border: none;
          padding: 6px 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          color: var(--bizbein-navy-900);
        }

        .qty-value {
          font-size: 13px;
          font-weight: 700;
          padding: 0 8px;
          font-family: 'JetBrains Mono', monospace;
        }

        .remove-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          background: transparent;
          border: none;
          color: var(--color-status-error);
          font-size: 12px;
          cursor: pointer;
        }

        .remove-btn:hover {
          text-decoration: underline;
        }

        .drawer-empty-view {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          height: 100%;
          gap: 14px;
          padding: 40px 20px;
        }

        .empty-cart-icon {
          opacity: 0.8;
        }

        .drawer-empty-view h4 {
          font-size: 18px;
          color: var(--bizbein-navy-900);
        }

        .drawer-empty-view p {
          font-size: 13px;
          color: var(--color-text-secondary);
          line-height: 1.5;
        }

        .drawer-footer {
          padding: 18px 20px;
          background: #ffffff;
          border-top: 1px solid var(--color-border-subtle);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .cart-total-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 0 12px;
          border-bottom: 1px solid #e2e8f0;
        }

        .total-label {
          font-size: 13.5px;
          color: #64748b;
          font-weight: 600;
        }

        .total-value {
          font-size: 19px;
          color: #0f172a;
          font-weight: 800;
        }

        .checkout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 20px;
          font-size: 14.5px;
          font-weight: 700;
          background-color: #F8B50E;
          color: #0f172a;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.15s ease, transform 0.1s ease;
        }

        .checkout-btn:hover {
          background-color: #e5a407;
          transform: translateY(-1px);
        }

        .submit-cart-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 18px;
          font-size: 13.5px;
        }

        .footer-notice {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 11px;
          color: #64748b;
          line-height: 1.4;
          text-align: center;
          padding-top: 4px;
        }
      `}</style>
    </div>
  );
}
