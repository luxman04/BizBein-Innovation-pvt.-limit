'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '../../../context/StoreContext';
import {
  Package,
  Calendar,
  CreditCard,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  ExternalLink,
  Clock,
  CheckCircle,
  Truck
} from 'lucide-react';

export default function CustomerOrdersPage() {
  const router = useRouter();
  const { user, authLoading } = useStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/account/orders');
      return;
    }

    if (user) {
      fetch('/api/orders')
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch your orders.');
          return res.json();
        })
        .then((data) => {
          setOrders(data.orders || []);
        })
        .catch((err) => {
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="orders-loading">
        <div className="spinner"></div>
        <p>Loading your order history...</p>
        <style jsx>{`
          .orders-loading {
            padding: 80px 20px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
            color: #64748b;
          }
          .spinner {
            width: 36px;
            height: 36px;
            border: 3px solid #e2e8f0;
            border-top-color: #F8B50E;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="my-orders-page">
      <div className="orders-container">
        <div className="orders-header">
          <div>
            <h1 className="page-title">My Procurement Orders</h1>
            <p className="page-subtitle">Track industrial machinery consignments and download proforma invoices</p>
          </div>
          <Link href="/products" className="btn btn-primary">
            <span>Browse Catalog</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {error && (
          <div className="orders-error">
            <span>{error}</span>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="empty-orders-card">
            <ShoppingBag size={48} className="empty-icon text-gold" />
            <h3>No Orders Found</h3>
            <p>You have not placed any commercial equipment orders under this account yet.</p>
            <Link href="/products" className="btn btn-primary mt-2">
              Explore Industrial Machinery
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((ord) => (
              <div key={ord.orderId} className="order-item-card">
                <div className="order-card-header">
                  <div className="order-id-group">
                    <span className="order-label">Order Reference:</span>
                    <strong className="order-id-val">{ord.orderId}</strong>
                  </div>
                  <div className="order-date-group">
                    <Calendar size={13} className="text-muted" />
                    <span>{new Date(ord.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="status-badges-group">
                    <span className={`status-pill pill-${(ord.orderStatus || 'confirmed').toLowerCase()}`}>
                      {ord.orderStatus}
                    </span>
                    <span className="payment-pill">
                      {ord.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="order-card-body">
                  <div className="order-products-preview">
                    {ord.items.map((it, idx) => (
                      <div key={idx} className="preview-product-chip">
                        <img
                          src={it.image}
                          alt={it.name}
                          className="preview-img"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80';
                          }}
                        />
                        <span className="preview-name">{it.name} (x{it.qty})</span>
                      </div>
                    ))}
                  </div>

                  <div className="order-card-finance">
                    <div className="finance-col">
                      <span className="finance-label">Payment Method:</span>
                      <strong className="finance-val">{ord.paymentMethod}</strong>
                    </div>
                    <div className="finance-col">
                      <span className="finance-label">Grand Total (Incl. GST):</span>
                      <strong className="total-highlight">₹{ord.total.toLocaleString('en-IN')}</strong>
                    </div>
                    <Link href={`/orders/${ord.orderId}`} className="btn-view-invoice">
                      <span>View Proforma Invoice</span>
                      <ExternalLink size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .my-orders-page {
          background: #f8fafc;
          min-height: 100vh;
          padding: 30px 16px 60px;
        }

        .orders-container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .orders-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .page-title {
          font-size: 22px;
          font-weight: 800;
          color: #13192B;
          margin: 0 0 4px;
        }

        .page-subtitle {
          font-size: 13px;
          color: #64748b;
          margin: 0;
        }

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .order-item-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(15, 23, 42, 0.04);
          overflow: hidden;
        }

        .order-card-header {
          background: #f8fafc;
          padding: 12px 20px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          font-size: 13px;
        }

        .order-id-group {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .order-label {
          color: #64748b;
        }

        .order-id-val {
          font-family: monospace;
          color: #13192B;
        }

        .order-date-group {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #64748b;
        }

        .status-badges-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .status-pill {
          padding: 3px 10px;
          border-radius: 9999px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          background: #dcfce7;
          color: #15803D;
        }

        .payment-pill {
          padding: 3px 10px;
          border-radius: 9999px;
          font-size: 11px;
          font-weight: 600;
          background: #fef3c7;
          color: #b45309;
        }

        .order-card-body {
          padding: 18px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .order-products-preview {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          flex: 1;
        }

        .preview-product-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f1f5f9;
          padding: 4px 10px 4px 6px;
          border-radius: 8px;
          font-size: 12px;
        }

        .preview-img {
          width: 30px;
          height: 30px;
          object-fit: cover;
          border-radius: 4px;
        }

        .preview-name {
          color: #1e293b;
          font-weight: 600;
        }

        .order-card-finance {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .finance-col {
          display: flex;
          flex-direction: column;
          gap: 2px;
          font-size: 12px;
        }

        .finance-label {
          color: #64748b;
        }

        .finance-val {
          color: #1e293b;
        }

        .total-highlight {
          color: #b45309;
          font-size: 16px;
        }

        .btn-view-invoice {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: #13192B;
          color: #ffffff;
          border-radius: 6px;
          font-size: 12.5px;
          font-weight: 600;
          text-decoration: none;
          transition: background-color 0.15s ease;
        }

        .btn-view-invoice:hover {
          background: #1e293b;
        }

        .empty-orders-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 60px 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .text-gold {
          color: #F8B50E;
        }

        .empty-orders-card h3 {
          margin: 0;
          color: #13192B;
          font-size: 18px;
        }

        .empty-orders-card p {
          margin: 0;
          color: #64748b;
          font-size: 13.5px;
        }
      `}</style>
    </div>
  );
}
