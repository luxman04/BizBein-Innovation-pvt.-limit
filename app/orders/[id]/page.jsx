'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle,
  Truck,
  Printer,
  ArrowRight,
  ShieldCheck,
  FileText,
  Clock,
  Phone,
  Mail,
  MapPin,
  AlertCircle
} from 'lucide-react';
import { companyDetails } from '../../../data/products';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderId) return;

    fetch(`/api/orders/${orderId}`)
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Failed to load order details.');
        }
        return res.json();
      })
      .then((data) => {
        setOrder(data.order);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="order-loading-screen">
        <div className="spinner"></div>
        <p>Loading your order proforma invoice...</p>
        <style jsx>{`
          .order-loading-screen {
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

  if (error || !order) {
    return (
      <div className="order-error-screen">
        <AlertCircle size={48} className="text-red" />
        <h2>Order Not Found</h2>
        <p>{error || 'The requested order could not be located.'}</p>
        <Link href="/products" className="btn btn-primary">
          Back to Equipment Catalog
        </Link>
        <style jsx>{`
          .order-error-screen {
            padding: 80px 20px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
            max-width: 500px;
            margin: 0 auto;
          }
          .text-red {
            color: #ef4444;
          }
          h2 {
            color: #13192B;
            margin: 0;
          }
          p {
            color: #64748b;
            margin: 0;
            font-size: 14px;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="order-confirmation-page">
      <div className="order-container">
        {/* Success Header Banner */}
        <div className="success-banner">
          <div className="success-icon-wrap">
            <CheckCircle size={38} className="text-green" />
          </div>
          <div className="success-content">
            <div className="success-tag">Order Confirmed • Commercial Proforma Issued</div>
            <h1 className="success-heading">Thank You! Order #{order.orderId} is Received</h1>
            <p className="success-desc">
              Your equipment order has been registered in the BizBein factory production pipeline. 
              An official commercial confirmation has been queued for email and WhatsApp dispatch.
            </p>
          </div>
          <div className="success-actions">
            <button type="button" onClick={handlePrint} className="btn-print">
              <Printer size={16} />
              <span>Print Invoice</span>
            </button>
          </div>
        </div>

        {/* Invoice Body Card */}
        <div className="invoice-sheet" id="printable-invoice">
          {/* Invoice Header */}
          <div className="invoice-header">
            <div className="invoice-brand">
              <img
                src="/bizbein-innovations-logo.png"
                alt="BizBein Innovations"
                className="invoice-logo"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="company-text">
                <strong>BizBein Innovations Pvt. Ltd.</strong>
                <span>Industrial Conveying, Coding & Packaging Equipment</span>
                <span>Zirakpur, SAS Nagar, Punjab - 140603, India</span>
                <span>GSTIN: 03AABCB9876F1Z4 | CIN: U29309PB2021PTC054321</span>
              </div>
            </div>

            <div className="invoice-meta-box">
              <div className="meta-badge">COMMERCIAL PROFORMA</div>
              <div className="meta-row">
                <span>Order ID:</span>
                <strong className="order-id-code">{order.orderId}</strong>
              </div>
              <div className="meta-row">
                <span>Date:</span>
                <strong>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</strong>
              </div>
              <div className="meta-row">
                <span>Order Status:</span>
                <span className="status-badge status-confirmed">{order.orderStatus}</span>
              </div>
              <div className="meta-row">
                <span>Payment:</span>
                <span className="status-badge status-pending">{order.paymentStatus}</span>
              </div>
            </div>
          </div>

          {/* Consignee & Dispatch Information */}
          <div className="consignee-grid">
            <div className="info-box">
              <div className="info-box-header">
                <MapPin size={15} className="text-gold" />
                <h4>Consignee & Delivery Address</h4>
              </div>
              <p>
                <strong>{order.shippingAddress.fullName || order.customerName}</strong><br />
                {order.companyName && <><strong>Company:</strong> {order.companyName}<br /></>}
                {order.gstin && <><strong>GSTIN:</strong> {order.gstin}<br /></>}
                {order.shippingAddress.address}<br />
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}<br />
                <strong>Contact Phone:</strong> {order.shippingAddress.phone || order.customerPhone}
              </p>
            </div>

            <div className="info-box">
              <div className="info-box-header">
                <Truck size={15} className="text-gold" />
                <h4>Dispatch & Payment Terms</h4>
              </div>
              <p>
                <strong>Payment Method:</strong> {order.paymentMethod}<br />
                <strong>Freight / Transit:</strong> All-India Insured Direct Factory Dispatch<br />
                <strong>Commissioning:</strong> On-Site Technical Commissioning by BizBein Engineers<br />
                <strong>Warranty:</strong> 12 Months Comprehensive Factory Warranty
              </p>
            </div>
          </div>

          {/* Itemized Products Table */}
          <div className="table-responsive">
            <table className="order-items-table">
              <thead>
                <tr>
                  <th>Item Description</th>
                  <th className="text-center">Category</th>
                  <th className="text-center">Qty</th>
                  <th className="text-right">Unit Price</th>
                  <th className="text-right">Total (INR)</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <div className="table-item-cell">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="table-item-img"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80';
                          }}
                        />
                        <div>
                          <strong className="item-name">{item.name}</strong>
                          <span className="item-brand">{item.brand || 'BizBein'} • {item.unit || 'Standard Unit'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="text-center">{item.category}</td>
                    <td className="text-center font-bold">{item.qty}</td>
                    <td className="text-right">₹{item.price.toLocaleString('en-IN')}</td>
                    <td className="text-right font-bold">₹{(item.price * item.qty).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & Financial Summary */}
          <div className="invoice-footer-grid">
            <div className="payment-instructions-card">
              <h4>Bank Settlement Instructions</h4>
              <p>Please remit transfer referencing Order ID <strong>{order.orderId}</strong>:</p>
              <div className="bank-meta-grid">
                <div><span>Beneficiary:</span> <strong>BizBein Innovations Pvt. Ltd.</strong></div>
                <div><span>Account No:</span> <strong>50200084920194</strong></div>
                <div><span>Bank & Branch:</span> <strong>HDFC Bank, Zirakpur</strong></div>
                <div><span>IFSC Code:</span> <strong>HDFC0001234</strong></div>
              </div>
              <span className="note-text">*For immediate dispatch, share UTR receipt on WhatsApp: +91 99158-56540.</span>
            </div>

            <div className="totals-summary-box">
              <div className="sum-row">
                <span>Subtotal (Excl. Tax)</span>
                <strong>₹{order.subtotal.toLocaleString('en-IN')}</strong>
              </div>
              <div className="sum-row">
                <span>GST (18% Input Credit)</span>
                <strong>₹{order.gst.toLocaleString('en-IN')}</strong>
              </div>
              <div className="sum-row">
                <span>Freight & Packing</span>
                <span className="text-green font-bold">FREE Dispatch</span>
              </div>
              <div className="grand-total-row">
                <span>Grand Total Amount</span>
                <span className="grand-total-val">₹{order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Authorized Signatory Line */}
          <div className="invoice-signatory-row">
            <div className="terms-copy">
              <span>This is an official computer-generated proforma invoice issued by BizBein Innovations Pvt. Ltd.</span>
            </div>
            <div className="sign-box">
              <div className="sign-line">For BizBein Innovations Pvt. Ltd.</div>
              <span className="sign-role">Authorized Factory Signatory</span>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="order-bottom-bar">
          <Link href="/account/orders" className="btn btn-outline">
            View All My Orders
          </Link>
          <Link href="/products" className="btn btn-primary">
            <span>Continue Procurement</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <style jsx>{`
        .order-confirmation-page {
          background: #f8fafc;
          min-height: 100vh;
          padding: 30px 16px 60px;
        }

        .order-container {
          max-width: 960px;
          margin: 0 auto;
        }

        .success-banner {
          display: flex;
          align-items: center;
          gap: 20px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-left: 6px solid #16a34a;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 4px 15px rgba(15, 23, 42, 0.04);
        }

        .success-icon-wrap {
          flex-shrink: 0;
        }

        .text-green {
          color: #16a34a;
        }

        .text-gold {
          color: #F8B50E;
        }

        .success-content {
          flex: 1;
        }

        .success-tag {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          color: #16a34a;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }

        .success-heading {
          font-size: 20px;
          font-weight: 800;
          color: #13192B;
          margin: 0 0 6px;
        }

        .success-desc {
          font-size: 13.5px;
          color: #64748b;
          margin: 0;
          line-height: 1.4;
        }

        .success-actions {
          flex-shrink: 0;
        }

        .btn-print {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: #f1f5f9;
          color: #1e293b;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-print:hover {
          background: #e2e8f0;
        }

        .invoice-sheet {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 36px;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
          margin-bottom: 24px;
        }

        .invoice-header {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          padding-bottom: 24px;
          border-bottom: 2px solid #13192B;
          margin-bottom: 24px;
        }

        .invoice-brand {
          display: flex;
          gap: 16px;
        }

        .invoice-logo {
          height: 52px;
          width: auto;
          object-fit: contain;
        }

        .company-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
          font-size: 12px;
          color: #64748b;
        }

        .company-text strong {
          font-size: 15px;
          color: #13192B;
        }

        .invoice-meta-box {
          text-align: right;
          display: flex;
          flex-direction: column;
          gap: 5px;
          min-width: 240px;
        }

        .meta-badge {
          display: inline-block;
          align-self: flex-end;
          background: #13192B;
          color: #F8B50E;
          font-size: 11px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 4px;
          letter-spacing: 0.05em;
          margin-bottom: 6px;
        }

        .meta-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
        }

        .meta-row span {
          color: #64748b;
        }

        .order-id-code {
          font-family: monospace;
          color: #13192B;
        }

        .status-badge {
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .status-confirmed {
          background: #dcfce7;
          color: #15803D;
        }

        .status-pending {
          background: #fef3c7;
          color: #b45309;
        }

        .consignee-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 24px;
        }

        .info-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 16px;
        }

        .info-box-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .info-box-header h4 {
          margin: 0;
          font-size: 13px;
          font-weight: 700;
          color: #13192B;
          text-transform: uppercase;
        }

        .info-box p {
          margin: 0;
          font-size: 12.5px;
          color: #475569;
          line-height: 1.5;
        }

        .table-responsive {
          overflow-x: auto;
          margin-bottom: 24px;
        }

        .order-items-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }

        .order-items-table th {
          background: #f1f5f9;
          padding: 10px 12px;
          color: #475569;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 11.5px;
          border-bottom: 2px solid #cbd5e1;
        }

        .order-items-table td {
          padding: 12px;
          border-bottom: 1px solid #e2e8f0;
          color: #334155;
        }

        .table-item-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .table-item-img {
          width: 44px;
          height: 44px;
          object-fit: cover;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
        }

        .item-name {
          display: block;
          color: #0f172a;
          font-size: 13px;
        }

        .item-brand {
          display: block;
          font-size: 11px;
          color: #64748b;
        }

        .text-center {
          text-align: center;
        }

        .text-right {
          text-align: right;
        }

        .font-bold {
          font-weight: 700;
        }

        .invoice-footer-grid {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 24px;
          align-items: flex-start;
          margin-bottom: 24px;
        }

        .payment-instructions-card {
          background: #fef7ea;
          border: 1px solid #fed7aa;
          border-radius: 8px;
          padding: 16px;
        }

        .payment-instructions-card h4 {
          margin: 0 0 6px;
          color: #92400e;
          font-size: 13.5px;
        }

        .payment-instructions-card p {
          margin: 0 0 10px;
          font-size: 12.5px;
          color: #78350f;
        }

        .bank-meta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          font-size: 12px;
          margin-bottom: 8px;
        }

        .bank-meta-grid span {
          color: #92400e;
        }

        .bank-meta-grid strong {
          color: #451a03;
        }

        .note-text {
          font-size: 11px;
          color: #92400e;
          font-style: italic;
        }

        .totals-summary-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .sum-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: #64748b;
        }

        .sum-row strong {
          color: #1e293b;
        }

        .grand-total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 2px solid #e2e8f0;
          padding-top: 10px;
          margin-top: 4px;
          font-size: 14.5px;
          font-weight: 700;
          color: #13192B;
        }

        .grand-total-val {
          font-size: 19px;
          font-weight: 800;
          color: #b45309;
        }

        .invoice-signatory-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          padding-top: 24px;
          border-top: 1px solid #f1f5f9;
        }

        .terms-copy {
          font-size: 11px;
          color: #94a3b8;
          max-width: 400px;
        }

        .sign-box {
          text-align: right;
          font-size: 12px;
        }

        .sign-line {
          font-weight: 700;
          color: #13192B;
          margin-bottom: 20px;
        }

        .sign-role {
          display: block;
          border-top: 1px solid #cbd5e1;
          padding-top: 4px;
          color: #64748b;
        }

        .order-bottom-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }

        @media print {
          body {
            background: #ffffff !important;
          }
          .success-banner,
          .order-bottom-bar,
          header,
          footer,
          .store-toast-banner,
          .whatsapp-floating {
            display: none !important;
          }
          .invoice-sheet {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
          }
        }

        @media (max-width: 768px) {
          .success-banner {
            flex-direction: column;
            align-items: flex-start;
          }
          .consignee-grid,
          .invoice-footer-grid {
            grid-template-columns: 1fr;
          }
          .invoice-header {
            flex-direction: column;
          }
          .invoice-meta-box {
            text-align: left;
            min-width: 0;
            width: 100%;
          }
          .meta-badge {
            align-self: flex-start;
          }
        }

        @media (max-width: 640px) {
          .invoice-sheet {
            padding: 18px 14px;
          }
          .invoice-brand {
            flex-direction: column;
            gap: 10px;
          }
          .bank-meta-grid {
            grid-template-columns: 1fr;
          }
          .invoice-signatory-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
          }
          .sign-box {
            text-align: left;
            width: 100%;
          }
          .order-bottom-bar {
            flex-direction: column-reverse;
            align-items: stretch;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
}
