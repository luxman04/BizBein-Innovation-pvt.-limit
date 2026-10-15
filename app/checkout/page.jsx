'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '../../context/StoreContext';
import {
  ShieldCheck,
  CheckCircle,
  Truck,
  CreditCard,
  Building,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  FileText,
  Lock,
  ShoppingCart
} from 'lucide-react';

const INDIAN_STATES = [
  'Punjab', 'Haryana', 'Chandigarh', 'Delhi', 'Uttar Pradesh', 'Rajasthan',
  'Maharashtra', 'Gujarat', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Andhra Pradesh',
  'West Bengal', 'Madhya Pradesh', 'Kerala', 'Bihar', 'Odisha', 'Assam', 'Himachal Pradesh',
  'Uttarakhand', 'Jharkhand', 'Chhattisgarh', 'Goa', 'Jammu & Kashmir'
];

export default function CheckoutPage() {
  const router = useRouter();
  const { user, authLoading, cartItems, clearCart, showToast } = useStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Shipping form fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [gstin, setGstin] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Punjab');
  const [pincode, setPincode] = useState('');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState('Direct Bank Transfer (NEFT/RTGS)');
  const [orderNotes, setOrderNotes] = useState('');

  // Protect route: require authentication
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/checkout');
    } else if (user) {
      setFullName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user, authLoading, router]);

  // Calculations
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.qty || 1),
    0
  );
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (cartItems.length === 0) {
      setError('Your cart is empty. Please add items before checking out.');
      return;
    }

    if (!address.trim() || !city.trim() || !state.trim() || !pincode.trim()) {
      setError('Please provide a complete factory/site delivery address.');
      return;
    }

    if (!phone.trim()) {
      setError('Please provide a contact phone number for dispatch logistics.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          qty: item.qty || 1,
          price: item.price
        })),
        shippingAddress: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          companyName: companyName.trim(),
          gstin: gstin.trim().toUpperCase(),
          address: address.trim(),
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim()
        },
        paymentMethod,
        orderNotes: orderNotes.trim()
      };

      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order.');
      }

      // Clear customer's cart
      clearCart();

      showToast(`Order ${data.order.orderId} placed successfully!`, 'success');
      router.push(`/orders/${data.order.orderId}`);
    } catch (err) {
      setError(err.message || 'An error occurred while placing your order.');
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="checkout-loading-screen">
        <div className="spinner"></div>
        <p>Verifying secure checkout session...</p>
        <style jsx>{`
          .checkout-loading-screen {
            padding: 80px 20px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
            font-size: 14px;
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

  if (cartItems.length === 0) {
    return (
      <div className="empty-checkout-container">
        <ShoppingCart size={48} className="text-gold" />
        <h2>Your Cart is Empty</h2>
        <p>You have no equipment in your cart ready for checkout.</p>
        <Link href="/products" className="btn btn-primary">
          Browse Equipment Catalog
        </Link>
        <style jsx>{`
          .empty-checkout-container {
            padding: 80px 20px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
            max-width: 500px;
            margin: 0 auto;
          }
          .text-gold {
            color: #F8B50E;
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
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Breadcrumb / Return */}
        <div className="checkout-top-nav">
          <Link href="/products" className="back-to-shop">
            <ArrowLeft size={15} />
            <span>Continue Shopping</span>
          </Link>
          <div className="secure-badge">
            <Lock size={13} className="text-gold" />
            <span>256-Bit SSL Secured Commercial Checkout</span>
          </div>
        </div>

        <h1 className="checkout-page-title">Commercial Checkout & Dispatch Order</h1>

        {error && (
          <div className="checkout-error-banner" role="alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="checkout-layout-grid">
          {/* LEFT: Shipping & Payment Details */}
          <div className="checkout-main-form">
            {/* Step 1: Delivery & Consignee */}
            <div className="checkout-card">
              <div className="card-header">
                <div className="step-num">1</div>
                <div>
                  <h2 className="card-title">Delivery & Consignee Address</h2>
                  <p className="card-subtitle">Factory or warehouse destination for machinery commissioning</p>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-field">
                  <label htmlFor="fn">Consignee / Contact Name *</label>
                  <input
                    id="fn"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="ph">Phone / WhatsApp Number *</label>
                  <input
                    id="ph"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-field">
                  <label htmlFor="em">Corporate / Dispatch Email *</label>
                  <input
                    id="em"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="cn">Company / Factory Name (Optional)</label>
                  <input
                    id="cn"
                    type="text"
                    placeholder="e.g. Apex Pharma Packaging Ltd."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="gst">GSTIN Number (Optional for 18% Input Tax Credit)</label>
                <input
                  id="gst"
                  type="text"
                  placeholder="e.g. 03AABCB1234F1Z5"
                  maxLength={15}
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label htmlFor="addr">Factory / Site Delivery Address *</label>
                <textarea
                  id="addr"
                  rows={2}
                  required
                  placeholder="Plot No., Industrial Area, Phase, Landmark"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="form-grid-3">
                <div className="form-field">
                  <label htmlFor="cty">City *</label>
                  <input
                    id="cty"
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="st">State *</label>
                  <select
                    id="st"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                  >
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="form-field">
                  <label htmlFor="pin">PIN Code *</label>
                  <input
                    id="pin"
                    type="text"
                    maxLength={6}
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="checkout-card">
              <div className="card-header">
                <div className="step-num">2</div>
                <div>
                  <h2 className="card-title">Commercial Payment Method</h2>
                  <p className="card-subtitle">Select preferred commercial settlement method</p>
                </div>
              </div>

              <div className="payment-options-list">
                <label className={`payment-option-row ${paymentMethod.includes('Bank Transfer') ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Direct Bank Transfer (NEFT/RTGS)"
                    checked={paymentMethod.includes('Bank Transfer')}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="pay-option-content">
                    <div className="pay-option-title-row">
                      <strong>Direct Bank Transfer / NEFT / RTGS (Recommended for Commercial Orders)</strong>
                    </div>
                    <p className="pay-option-desc">
                      Official proforma invoice with BizBein bank account details will be issued upon placement. Direct dispatch upon payment confirmation.
                    </p>
                    {paymentMethod.includes('Bank Transfer') && (
                      <div className="bank-details-box">
                        <div className="bank-row"><span>Beneficiary:</span> <strong>BizBein Innovations Pvt. Ltd.</strong></div>
                        <div className="bank-row"><span>Account No:</span> <strong>50200084920194</strong></div>
                        <div className="bank-row"><span>Bank & Branch:</span> <strong>HDFC Bank, Zirakpur Branch</strong></div>
                        <div className="bank-row"><span>IFSC Code:</span> <strong>HDFC0001234</strong></div>
                      </div>
                    )}
                  </div>
                </label>

                <label className={`payment-option-row ${paymentMethod === 'Pay on Delivery' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Pay on Delivery"
                    checked={paymentMethod === 'Pay on Delivery'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="pay-option-content">
                    <strong>Pay on Delivery / Cash on Delivery</strong>
                    <p className="pay-option-desc">
                      Available for eligible machinery lines and consumable consignments. Pay at time of factory handover.
                    </p>
                  </div>
                </label>

                <label className={`payment-option-row ${paymentMethod === 'UPI / Instant Commercial Invoice' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="UPI / Instant Commercial Invoice"
                    checked={paymentMethod === 'UPI / Instant Commercial Invoice'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="pay-option-content">
                    <strong>UPI / Online Commercial Invoice</strong>
                    <p className="pay-option-desc">
                      Instant dynamic QR code and payment link will be sent to your registered email and WhatsApp.
                    </p>
                  </div>
                </label>
              </div>

              <div className="form-field mt-3">
                <label htmlFor="notes">Special Dispatch or Packaging Instructions</label>
                <textarea
                  id="notes"
                  rows={2}
                  placeholder="e.g. Wooden crate packaging required, forklift available at site..."
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* RIGHT: Order Summary Sidebar */}
          <div className="checkout-summary-sidebar">
            <div className="summary-card">
              <h3 className="summary-title">Order Summary ({cartItems.length} Products)</h3>

              <div className="summary-items-list">
                {cartItems.map((item) => (
                  <div key={item.id} className="summary-item-row">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="summary-item-img"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <div className="summary-item-info">
                      <strong className="summary-item-name">{item.name}</strong>
                      <span className="summary-item-meta">Qty: {item.qty} × ₹{item.price.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="summary-item-total">
                      ₹{((item.price || 0) * (item.qty || 1)).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>

              <div className="cost-breakdown">
                <div className="cost-row">
                  <span>Subtotal</span>
                  <strong>₹{subtotal.toLocaleString('en-IN')}</strong>
                </div>
                <div className="cost-row">
                  <span>GST (18% Input Credit)</span>
                  <strong>₹{gst.toLocaleString('en-IN')}</strong>
                </div>
                <div className="cost-row text-success">
                  <span>Freight & Handling</span>
                  <strong>FREE Factory Dispatch</strong>
                </div>
                <div className="total-row">
                  <span>Grand Total</span>
                  <span className="total-price">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-place-order"
              >
                {loading ? (
                  <span>Generating Proforma & Placing Order...</span>
                ) : (
                  <>
                    <span>Confirm & Place Order</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div className="summary-trust-bullets">
                <div className="trust-bullet">
                  <CheckCircle size={14} className="text-gold" />
                  <span>GST Tax Invoice provided for input tax credit</span>
                </div>
                <div className="trust-bullet">
                  <Truck size={14} className="text-gold" />
                  <span>All-India insured factory transit</span>
                </div>
                <div className="trust-bullet">
                  <ShieldCheck size={14} className="text-gold" />
                  <span>1-Year comprehensive BizBein warranty</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <style jsx>{`
        .checkout-page {
          background: #f8fafc;
          min-height: 100vh;
          padding: 30px 16px 60px;
        }

        .checkout-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .checkout-top-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .back-to-shop {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13.5px;
          color: #64748b;
          font-weight: 600;
          text-decoration: none;
        }

        .back-to-shop:hover {
          color: #13192B;
        }

        .secure-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #16a34a;
          background: #dcfce7;
          padding: 4px 10px;
          border-radius: 9999px;
          font-weight: 600;
        }

        .checkout-page-title {
          font-size: 24px;
          font-weight: 800;
          color: #13192B;
          margin: 0 0 24px;
        }

        .checkout-error-banner {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 13.5px;
          margin-bottom: 24px;
        }

        .checkout-layout-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 28px;
          align-items: flex-start;
        }

        .checkout-main-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .checkout-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 15px rgba(15, 23, 42, 0.04);
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 20px;
          padding-bottom: 14px;
          border-bottom: 1px solid #f1f5f9;
        }

        .step-num {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #F8B50E;
          color: #0f172a;
          font-weight: 800;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .card-title {
          font-size: 17px;
          font-weight: 700;
          color: #13192B;
          margin: 0;
        }

        .card-subtitle {
          font-size: 12.5px;
          color: #64748b;
          margin: 2px 0 0;
        }

        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        .form-grid-3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 16px;
        }

        .form-field:last-child {
          margin-bottom: 0;
        }

        .form-field label {
          font-size: 12.5px;
          font-weight: 600;
          color: #334155;
        }

        .form-field input,
        .form-field textarea,
        .form-field select {
          width: 100%;
          padding: 10px 14px;
          font-size: 13.5px;
          font-family: inherit;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          outline: none;
          background: #ffffff;
          color: #0f172a;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .form-field input:focus,
        .form-field textarea:focus,
        .form-field select:focus {
          border-color: #F8B50E;
          box-shadow: 0 0 0 3px rgba(248, 181, 14, 0.2);
        }

        .payment-options-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .payment-option-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .payment-option-row.selected {
          border-color: #F8B50E;
          background: #fefcf6;
          box-shadow: 0 2px 8px rgba(248, 181, 14, 0.15);
        }

        .payment-option-row input[type='radio'] {
          margin-top: 3px;
          accent-color: #F8B50E;
        }

        .pay-option-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 13.5px;
        }

        .pay-option-desc {
          margin: 0;
          font-size: 12px;
          color: #64748b;
          line-height: 1.4;
        }

        .bank-details-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 10px 14px;
          margin-top: 8px;
          font-size: 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .bank-row {
          display: flex;
          justify-content: space-between;
        }

        .bank-row span {
          color: #64748b;
        }

        .bank-row strong {
          color: #13192B;
        }

        .summary-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 15px rgba(15, 23, 42, 0.04);
          position: sticky;
          top: 90px;
        }

        .summary-title {
          font-size: 16px;
          font-weight: 700;
          color: #13192B;
          margin: 0 0 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid #f1f5f9;
        }

        .summary-items-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 240px;
          overflow-y: auto;
          margin-bottom: 18px;
          padding-right: 4px;
        }

        .summary-item-row {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 12.5px;
        }

        .summary-item-img {
          width: 44px;
          height: 44px;
          object-fit: cover;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
          flex-shrink: 0;
        }

        .summary-item-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .summary-item-name {
          color: #1e293b;
          font-size: 12.5px;
          line-height: 1.3;
        }

        .summary-item-meta {
          color: #64748b;
          font-size: 11.5px;
        }

        .summary-item-total {
          font-weight: 700;
          color: #13192B;
          font-size: 13px;
        }

        .cost-breakdown {
          border-top: 1px solid #e2e8f0;
          padding-top: 14px;
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 13px;
        }

        .cost-row {
          display: flex;
          justify-content: space-between;
          color: #64748b;
        }

        .cost-row strong {
          color: #1e293b;
        }

        .text-success {
          color: #16a34a !important;
        }

        .text-success strong {
          color: #16a34a !important;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 2px solid #e2e8f0;
          padding-top: 12px;
          margin-top: 4px;
          font-size: 15px;
          font-weight: 700;
          color: #13192B;
        }

        .total-price {
          font-size: 20px;
          font-weight: 800;
          color: #b45309;
        }

        .btn-place-order {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px;
          background: #F8B50E;
          color: #0f172a;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          transition: background-color 0.15s ease, transform 0.1s ease;
        }

        .btn-place-order:hover:not(:disabled) {
          background: #e5a407;
          transform: translateY(-1px);
        }

        .btn-place-order:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .summary-trust-bullets {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 18px;
          padding-top: 16px;
          border-top: 1px solid #f1f5f9;
        }

        .trust-bullet {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11.5px;
          color: #64748b;
        }

        .text-gold {
          color: #F8B50E;
          flex-shrink: 0;
        }

        @media (max-width: 900px) {
          .checkout-layout-grid {
            grid-template-columns: 1fr;
          }
          .summary-card {
            position: static;
          }
        }

        @media (max-width: 600px) {
          .form-grid-2,
          .form-grid-3 {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .checkout-page {
            padding: 20px 12px;
          }
          .checkout-card {
            padding: 16px 12px;
          }
          .bank-row {
            flex-wrap: wrap;
            gap: 2px;
          }
          .checkout-top-nav {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
}
