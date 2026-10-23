'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '../context/StoreContext';

function useIsMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}
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
  Truck,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Search,
  Check,
  ChevronDown,
  ChevronUp,
  MapPin,
  Building,
  Phone,
  MessageCircle,
  FileText,
  Copy
} from 'lucide-react';

const CANCELLATION_REASONS = [
  'Changed procurement requirements',
  'Lead time / delivery schedule delay',
  'Ordered incorrect equipment specification / model',
  'Found alternative industrial machinery',
  'Order placed by mistake',
  'Budget / purchase approval revised',
  'Other reason'
];

const SAMPLE_DEMO_ORDERS = [
  {
    orderId: 'ORD-BIZ-20261017-2115',
    customerName: 'Luxman Kumar',
    customerEmail: 'luxmanvnhr628@gmail.com',
    customerPhone: '+91 97803-87265',
    companyName: 'Luxman Engineering Works',
    gstin: '03AAAAA0000A1Z5',
    shippingAddress: {
      fullName: 'Luxman Kumar',
      phone: '+91 97803-87265',
      address: '#419, St 9, Sandhu Colony, Near Jagirpur Road',
      city: 'Ludhiana',
      state: 'Punjab',
      pincode: '141007'
    },
    items: [
      {
        id: 'prod-mod-belt',
        name: 'Modular Belt Conveyor',
        brand: 'BizBein',
        category: 'Conveyor Systems',
        image: '/prod-modular-belt.jpg',
        unit: 'Per Section',
        price: 65000,
        qty: 2,
        subtotal: 130000
      },
      {
        id: 'prod-cij-printer',
        name: 'Industrial Continuous Inkjet (CIJ) Coder',
        brand: 'BizBein Coding',
        category: 'Coding & Printing',
        image: '/cat-coding.jpg',
        unit: 'CIJ System with Conduit & Head',
        price: 145000,
        qty: 1,
        subtotal: 145000
      }
    ],
    subtotal: 275000,
    gst: 49500,
    freight: 0,
    total: 324500,
    paymentMethod: 'Direct Bank Transfer (NEFT/RTGS)',
    paymentStatus: 'Pending Verification',
    orderStatus: 'Confirmed',
    orderNotes: 'Urgent dispatch for Ludhiana industrial bottling unit.',
    createdAt: '2026-10-17T10:41:36.245Z',
    updatedAt: '2026-10-17T10:41:36.245Z'
  },
  {
    orderId: 'ORD-BIZ-20261012-1082',
    customerName: 'Luxman Kumar',
    customerEmail: 'luxmanvnhr628@gmail.com',
    customerPhone: '+91 97803-87265',
    companyName: 'Luxman Engineering Works',
    gstin: '03AAAAA0000A1Z5',
    shippingAddress: {
      fullName: 'Luxman Kumar',
      phone: '+91 97803-87265',
      address: '#419, St 9, Sandhu Colony, Near Jagirpur Road',
      city: 'Ludhiana',
      state: 'Punjab',
      pincode: '141007'
    },
    items: [
      {
        id: 'prod-roller-conv',
        name: 'Powered Roller Conveyor',
        brand: 'BizBein',
        category: 'Conveyor Systems',
        image: '/prod-roller-conveyor.jpg',
        unit: 'Per 3-Meter Section',
        price: 38000,
        qty: 2,
        subtotal: 76000
      }
    ],
    subtotal: 76000,
    gst: 13680,
    freight: 0,
    total: 89680,
    paymentMethod: 'Direct Bank Transfer (NEFT/RTGS)',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    orderNotes: 'Delivered and installed on assembly floor.',
    receivedAt: '2026-10-15T14:20:00.000Z',
    createdAt: '2026-10-12T09:15:00.000Z',
    updatedAt: '2026-10-15T14:20:00.000Z'
  },
  {
    orderId: 'ORD-BIZ-20261005-0941',
    customerName: 'Luxman Kumar',
    customerEmail: 'luxmanvnhr628@gmail.com',
    customerPhone: '+91 97803-87265',
    companyName: 'Luxman Engineering Works',
    gstin: '',
    shippingAddress: {
      fullName: 'Luxman Kumar',
      phone: '+91 97803-87265',
      address: '#419, St 9, Sandhu Colony, Near Jagirpur Road',
      city: 'Ludhiana',
      state: 'Punjab',
      pincode: '141007'
    },
    items: [
      {
        id: 'prod-tiw-highres',
        name: 'High-Resolution TIJ Thermal Inkjet Coder',
        brand: 'BizBein Coding',
        category: 'Coding & Printing',
        image: '/cat-coding.jpg',
        unit: 'Half-inch TIJ Unit',
        price: 52000,
        qty: 1,
        subtotal: 52000
      }
    ],
    subtotal: 52000,
    gst: 9360,
    freight: 0,
    total: 61360,
    paymentMethod: 'Direct Bank Transfer (NEFT/RTGS)',
    paymentStatus: 'Cancelled / Refunded',
    orderStatus: 'Cancelled',
    cancelReason: 'Changed procurement requirements to CIJ continuous inkjet coder.',
    cancelledAt: '2026-10-06T11:30:00.000Z',
    orderNotes: '',
    createdAt: '2026-10-05T08:10:00.000Z',
    updatedAt: '2026-10-06T11:30:00.000Z'
  }
];

export default function OrdersHub() {
  const router = useRouter();
  const { user, authLoading, showToast } = useStore();
  const isMounted = useIsMounted();
  const currentUser = isMounted ? user : null;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'not-received' | 'received' | 'cancelled'
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrders, setExpandedOrders] = useState({});
  const [copiedId, setCopiedId] = useState('');

  // Cancel Modal state
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState(CANCELLATION_REASONS[0]);
  const [cancelNotes, setCancelNotes] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);

  // Guest order lookup
  const [guestLookupId, setGuestLookupId] = useState('');
  const [guestLookupLoading, setGuestLookupLoading] = useState(false);
  const [guestLookupError, setGuestLookupError] = useState('');

  useEffect(() => {
    let unsubscribeFirestore = null;

    async function loadUserOrders() {
      if (!authLoading && user) {
        setLoading(true);
        setError('');

        // 1. Fetch from local backend API
        let apiOrders = [];
        try {
          const res = await fetch('/api/orders');
          if (res.ok) {
            const data = await res.json();
            apiOrders = data.orders || [];
          }
        } catch (e) {
          console.warn('[OrdersHub] Backend API orders fetch notice:', e);
        }

        // 2. Fetch and Subscribe to Cloud Firestore orders for authenticated user
        try {
          const { auth } = await import('../lib/firebase');
          const { getUserOrdersFromFirestore, subscribeToUserOrders, saveOrderToFirestore } = await import('../lib/firestore-orders');
          const activeUid = auth?.currentUser?.uid || user?.firebaseUid || user?.id;

          if (activeUid) {
            const firestoreOrders = await getUserOrdersFromFirestore(activeUid);

            // Merge orders by orderId (Firestore orders take priority)
            const orderMap = new Map();
            firestoreOrders.forEach((o) => orderMap.set(o.orderId, o));
            apiOrders.forEach((o) => {
              if (!orderMap.has(o.orderId)) {
                orderMap.set(o.orderId, o);
                // Background sync any existing local backend order into Firestore
                if (auth?.currentUser) {
                  saveOrderToFirestore(o, auth.currentUser).catch(() => {});
                }
              }
            });

            const merged = Array.from(orderMap.values());
            merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setOrders(merged);
            setLoading(false);

            // Realtime listener for live status updates in Firestore
            unsubscribeFirestore = subscribeToUserOrders(activeUid, (updatedFirestoreOrders) => {
              setOrders((prev) => {
                const liveMap = new Map();
                updatedFirestoreOrders.forEach((o) => liveMap.set(o.orderId, o));
                prev.forEach((o) => {
                  if (!liveMap.has(o.orderId)) liveMap.set(o.orderId, o);
                });
                const liveList = Array.from(liveMap.values());
                liveList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                return liveList;
              });
            });
            return;
          }
        } catch (firestoreErr) {
          console.warn('[OrdersHub] Firestore sync notice:', firestoreErr);
        }

        // Fallback to API orders if Firestore client query was not applicable
        setOrders(apiOrders);
        setLoading(false);
      } else if (!authLoading && !user) {
        setOrders(SAMPLE_DEMO_ORDERS);
        setLoading(false);
      }
    }

    loadUserOrders();

    return () => {
      if (unsubscribeFirestore) unsubscribeFirestore();
    };
  }, [user, authLoading]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');

      let apiOrders = [];
      try {
        const res = await fetch('/api/orders');
        if (res.ok) {
          const data = await res.json();
          apiOrders = data.orders || [];
        }
      } catch (e) {}

      let firestoreOrders = [];
      try {
        const { auth } = await import('../lib/firebase');
        const { getUserOrdersFromFirestore } = await import('../lib/firestore-orders');
        const activeUid = auth?.currentUser?.uid || user?.firebaseUid || user?.id;
        if (activeUid) {
          firestoreOrders = await getUserOrdersFromFirestore(activeUid);
        }
      } catch (e) {}

      const orderMap = new Map();
      firestoreOrders.forEach((o) => orderMap.set(o.orderId, o));
      apiOrders.forEach((o) => {
        if (!orderMap.has(o.orderId)) orderMap.set(o.orderId, o);
      });

      const merged = Array.from(orderMap.values());
      merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(merged);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLookup = async (e) => {
    e.preventDefault();
    if (!guestLookupId.trim()) return;
    setGuestLookupLoading(true);
    setGuestLookupError('');

    try {
      const trimmedId = guestLookupId.trim();
      const res = await fetch(`/api/orders/${encodeURIComponent(trimmedId)}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error('No order found with this Reference ID. Please verify the number.');
        if (res.status === 401 || res.status === 403) {
          throw new Error('Please log in with the account that placed this order to view full proforma details.');
        }
        throw new Error('Unable to retrieve order details.');
      }
      const data = await res.json();
      if (data.order) {
        setOrders((prev) => {
          const exists = prev.some((o) => o.orderId === data.order.orderId);
          return exists ? prev : [data.order, ...prev];
        });
        setExpandedOrders((prev) => ({ ...prev, [data.order.orderId]: true }));
        setGuestLookupId('');
        if (showToast) showToast(`Found order ${data.order.orderId}`, 'success');
      }
    } catch (err) {
      setGuestLookupError(err.message);
    } finally {
      setGuestLookupLoading(false);
    }
  };

  const toggleExpand = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const handleCopyOrderId = (id) => {
    navigator.clipboard?.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(''), 2000);
    if (showToast) showToast('Order Reference copied to clipboard', 'info');
  };

  // Confirm Order Received / Delivered
  const handleMarkReceived = async (orderId) => {
    if (!window.confirm('Have you physically received and inspected this industrial machinery consignment?')) {
      return;
    }

    if (!user) {
      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === orderId
            ? { ...o, orderStatus: 'Delivered', receivedAt: new Date().toISOString() }
            : o
        )
      );
      if (showToast) showToast('Order confirmed as Received / Delivered! (Interactive Demo)', 'success');
      return;
    }

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'receive' })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to update order status.');
      }

      const data = await res.json();
      setOrders((prev) =>
        prev.map((o) => (o.orderId === orderId ? { ...o, ...data.order } : o))
      );
      if (showToast) showToast('Order confirmed as Received / Delivered!', 'success');
    } catch (err) {
      alert(err.message);
    }
  };

  // Submit Cancellation
  const handleConfirmCancel = async () => {
    if (!cancellingOrder) return;
    setCancelLoading(true);

    const fullReason = cancelNotes.trim()
      ? `${cancelReason} — Note: ${cancelNotes.trim()}`
      : cancelReason;

    if (!user) {
      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === cancellingOrder.orderId
            ? {
                ...o,
                orderStatus: 'Cancelled',
                cancelReason: fullReason,
                cancelledAt: new Date().toISOString()
              }
            : o
        )
      );
      if (showToast) showToast(`Order ${cancellingOrder.orderId} marked as Cancelled. (Interactive Demo)`, 'info');
      setCancellingOrder(null);
      setCancelNotes('');
      setCancelLoading(false);
      setActiveTab('cancelled');
      return;
    }

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(cancellingOrder.orderId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel', reason: fullReason })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to cancel order.');
      }

      const data = await res.json();
      setOrders((prev) =>
        prev.map((o) => (o.orderId === cancellingOrder.orderId ? { ...o, ...data.order } : o))
      );

      if (showToast) showToast(`Order ${cancellingOrder.orderId} cancelled successfully.`, 'info');
      setCancellingOrder(null);
      setCancelNotes('');
      setActiveTab('cancelled');
    } catch (err) {
      alert(err.message);
    } finally {
      setCancelLoading(false);
    }
  };

  // Filter categorization
  const isOrderReceived = (ord) => {
    const s = (ord.orderStatus || '').toLowerCase();
    return s === 'delivered' || s === 'received' || s === 'completed';
  };

  const isOrderCancelled = (ord) => {
    const s = (ord.orderStatus || '').toLowerCase();
    return s === 'cancelled' || s === 'canceled' || s === 'rejected';
  };

  const isOrderNotReceived = (ord) => {
    return !isOrderReceived(ord) && !isOrderCancelled(ord);
  };

  // Counters
  const counts = useMemo(() => {
    return {
      all: orders.length,
      notReceived: orders.filter(isOrderNotReceived).length,
      received: orders.filter(isOrderReceived).length,
      cancelled: orders.filter(isOrderCancelled).length
    };
  }, [orders]);

  // Filtered & Searched Orders
  const filteredOrders = useMemo(() => {
    let list = [...orders];

    if (activeTab === 'not-received') {
      list = list.filter(isOrderNotReceived);
    } else if (activeTab === 'received') {
      list = list.filter(isOrderReceived);
    } else if (activeTab === 'cancelled') {
      list = list.filter(isOrderCancelled);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((o) => {
        const idMatch = o.orderId.toLowerCase().includes(q);
        const companyMatch = o.companyName?.toLowerCase().includes(q);
        const itemMatch = o.items?.some((it) => it.name.toLowerCase().includes(q));
        const statusMatch = o.orderStatus?.toLowerCase().includes(q);
        return idMatch || companyMatch || itemMatch || statusMatch;
      });
    }

    return list;
  }, [orders, activeTab, searchQuery]);

  return (
    <div className="orders-hub-page">
      <div className="orders-hub-container">
        {/* Top Header */}
        <div className="hub-header">
          <div className="hub-title-group">
            <span className="hub-tag">Procurement & Consignment Management</span>
            <h1 className="hub-title">Commercial Equipment Orders</h1>
            <p className="hub-subtitle">
              Track industrial machinery dispatches, verify received consignments, manage order statuses, and download official proforma invoices.
            </p>
          </div>
          <div className="hub-header-actions">
            <Link href="/products" className="btn btn-outline-catalog">
              <span>Browse Catalog</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Guest prompt if not logged in */}
        {!currentUser && (
          <div className="guest-lookup-card">
            <div className="lookup-info">
              <h3>Track Order Consignment</h3>
              <p>Sign in to your BizBein customer account to access your purchase history, or look up an order directly by reference ID below.</p>
            </div>
            <form onSubmit={handleGuestLookup} className="lookup-form">
              <input
                type="text"
                placeholder="Enter Order Reference ID (e.g. ORD-BIZ-...)"
                value={guestLookupId}
                onChange={(e) => setGuestLookupId(e.target.value)}
                className="lookup-input"
              />
              <button type="submit" disabled={guestLookupLoading} className="btn btn-primary lookup-btn">
                {guestLookupLoading ? 'Looking up...' : 'Find Order'}
              </button>
              <Link href="/login?redirect=/orders" className="btn btn-login-link">
                Sign In
              </Link>
            </form>
            {guestLookupError && <div className="lookup-error">{guestLookupError}</div>}
          </div>
        )}

        {/* Summary Metric Cards */}
        <div className="metrics-grid">
          <button
            type="button"
            className={`metric-card ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <div className="metric-icon-box bg-navy">
              <Package size={20} color="#ffffff" />
            </div>
            <div className="metric-info">
              <span className="metric-label">All Orders</span>
              <strong className="metric-val">{counts.all}</strong>
            </div>
          </button>

          <button
            type="button"
            className={`metric-card ${activeTab === 'not-received' ? 'active' : ''}`}
            onClick={() => setActiveTab('not-received')}
          >
            <div className="metric-icon-box bg-amber">
              <Truck size={20} color="#ffffff" />
            </div>
            <div className="metric-info">
              <span className="metric-label">In Transit / Pending</span>
              <strong className="metric-val">{counts.notReceived}</strong>
            </div>
          </button>

          <button
            type="button"
            className={`metric-card ${activeTab === 'received' ? 'active' : ''}`}
            onClick={() => setActiveTab('received')}
          >
            <div className="metric-icon-box bg-green">
              <CheckCircle size={20} color="#ffffff" />
            </div>
            <div className="metric-info">
              <span className="metric-label">Orders Received</span>
              <strong className="metric-val">{counts.received}</strong>
            </div>
          </button>

          <button
            type="button"
            className={`metric-card ${activeTab === 'cancelled' ? 'active' : ''}`}
            onClick={() => setActiveTab('cancelled')}
          >
            <div className="metric-icon-box bg-red">
              <XCircle size={20} color="#ffffff" />
            </div>
            <div className="metric-info">
              <span className="metric-label">Cancelled Orders</span>
              <strong className="metric-val">{counts.cancelled}</strong>
            </div>
          </button>
        </div>

        {/* Tab Bar & Search Bar */}
        <div className="filter-toolbar">
          <div className="tabs-strip">
            <button
              type="button"
              className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Orders ({counts.all})
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'not-received' ? 'active' : ''}`}
              onClick={() => setActiveTab('not-received')}
            >
              <Truck size={14} />
              <span>Not Received ({counts.notReceived})</span>
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'received' ? 'active' : ''}`}
              onClick={() => setActiveTab('received')}
            >
              <CheckCircle size={14} />
              <span>Orders Received ({counts.received})</span>
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'cancelled' ? 'active' : ''}`}
              onClick={() => setActiveTab('cancelled')}
            >
              <XCircle size={14} />
              <span>Cancelled ({counts.cancelled})</span>
            </button>
          </div>

          <div className="search-wrap">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              placeholder="Filter by Order ID or item name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery('')} className="clear-search">
                ✕
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="hub-error-banner">
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Orders List */}
        {!isMounted || authLoading || (loading && user) ? (
          <div className="orders-loading-state">
            <div className="spinner"></div>
            <p>Loading your procurement orders & dispatch records...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="empty-orders-state">
            <ShoppingBag size={52} className="empty-icon text-gold" />
            <h3>No Orders Found</h3>
            <p>
              {activeTab === 'received'
                ? 'You have no orders marked as received yet.'
                : activeTab === 'not-received'
                ? 'You have no pending industrial equipment consignments in transit.'
                : activeTab === 'cancelled'
                ? 'No cancelled orders on record.'
                : 'No equipment procurement orders found matching your search.'}
            </p>
            <Link href="/products" className="btn btn-primary mt-3">
              Explore Industrial Machinery Catalog
            </Link>
          </div>
        ) : (
          <div className="orders-cards-stack">
            {filteredOrders.map((ord) => {
              const isReceived = isOrderReceived(ord);
              const isCancelled = isOrderCancelled(ord);
              const isPending = !isReceived && !isCancelled;
              const isExpanded = !!expandedOrders[ord.orderId];

              // Stepper stage
              const statusLower = (ord.orderStatus || '').toLowerCase();
              let stepIndex = 0; // 0 = Placed, 1 = Confirmed, 2 = Dispatched/In Transit, 3 = Received
              if (statusLower === 'confirmed') stepIndex = 1;
              if (statusLower === 'processing' || statusLower === 'packed') stepIndex = 1;
              if (statusLower === 'dispatched' || statusLower === 'in transit' || statusLower === 'in-transit') stepIndex = 2;
              if (isReceived) stepIndex = 3;

              return (
                <div
                  key={ord.orderId}
                  className={`order-card-box ${isCancelled ? 'card-cancelled' : ''} ${
                    isReceived ? 'card-received' : ''
                  }`}
                >
                  {/* Card Header */}
                  <div className="order-box-header">
                    <div className="id-and-date">
                      <div className="order-id-pill">
                        <span className="ref-lbl">Order Ref:</span>
                        <strong className="ref-id">{ord.orderId}</strong>
                        <button
                          type="button"
                          onClick={() => handleCopyOrderId(ord.orderId)}
                          className="copy-id-btn"
                          title="Copy Order ID"
                        >
                          {copiedId === ord.orderId ? <Check size={12} color="#15803D" /> : <Copy size={12} />}
                        </button>
                      </div>
                      <div className="order-date-text">
                        <Calendar size={13} className="text-muted" />
                        <span>
                          {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="status-badges">
                      {isReceived ? (
                        <span className="badge badge-delivered">
                          <CheckCircle size={13} />
                          <span>Order Received</span>
                        </span>
                      ) : isCancelled ? (
                        <span className="badge badge-cancelled">
                          <XCircle size={13} />
                          <span>Cancelled</span>
                        </span>
                      ) : (
                        <span className="badge badge-in-transit">
                          <Truck size={13} />
                          <span>{ord.orderStatus || 'Confirmed'} (Not Received)</span>
                        </span>
                      )}

                      <span
                        className={`badge badge-payment ${
                          ord.paymentStatus === 'Paid' ? 'pay-paid' : 'pay-pending'
                        }`}
                      >
                        {ord.paymentStatus || 'Pending'}
                      </span>
                    </div>
                  </div>

                  {/* Consignment Visual Stepper (Only for active / delivered) */}
                  {!isCancelled && (
                    <div className="consignment-tracker-stepper">
                      <div className="stepper-track">
                        <div
                          className="stepper-progress-fill"
                          style={{ width: `${(stepIndex / 3) * 100}%` }}
                        />
                        <div className={`step-point ${stepIndex >= 0 ? 'completed' : ''}`}>
                          <div className="step-dot">{stepIndex > 0 ? <Check size={10} /> : '1'}</div>
                          <span className="step-label">Order Placed</span>
                        </div>
                        <div className={`step-point ${stepIndex >= 1 ? 'completed' : ''}`}>
                          <div className="step-dot">{stepIndex > 1 ? <Check size={10} /> : '2'}</div>
                          <span className="step-label">QC & Confirmed</span>
                        </div>
                        <div className={`step-point ${stepIndex >= 2 ? 'completed' : ''}`}>
                          <div className="step-dot">{stepIndex > 2 ? <Check size={10} /> : '3'}</div>
                          <span className="step-label">In Transit</span>
                        </div>
                        <div className={`step-point ${stepIndex >= 3 ? 'completed' : ''}`}>
                          <div className="step-dot">{stepIndex === 3 ? <Check size={10} /> : '4'}</div>
                          <span className="step-label">Order Received</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Cancellation Alert Banner */}
                  {isCancelled && (
                    <div className="cancellation-alert-row">
                      <AlertTriangle size={16} className="text-red" />
                      <div>
                        <strong>Order Cancelled:</strong>{' '}
                        <span>{ord.cancelReason || 'Cancelled by purchaser request.'}</span>
                        {ord.cancelledAt && (
                          <span className="cancel-date-sub">
                            {' '}
                            (on{' '}
                            {new Date(ord.cancelledAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                            )
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Products List Preview */}
                  <div className="order-items-grid">
                    {ord.items?.map((it, idx) => (
                      <div key={idx} className="item-row">
                        <img
                          src={it.image}
                          alt={it.name}
                          className="item-thumb"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src =
                              'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80';
                          }}
                        />
                        <div className="item-details">
                          <h4 className="item-title">{it.name}</h4>
                          <div className="item-meta">
                            <span className="item-brand">{it.brand || 'BizBein'}</span>
                            <span className="item-qty">Qty: <strong>{it.qty}</strong></span>
                            <span className="item-unit-price">@ ₹{(it.price || 0).toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                        <div className="item-subtotal">
                          ₹{((it.price || 0) * (it.qty || 1)).toLocaleString('en-IN')}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Expandable Order Details (Shipping, Tax, Consignment) */}
                  {isExpanded && (
                    <div className="expanded-details-pane">
                      <div className="details-two-col">
                        <div className="details-col">
                          <h5 className="details-section-heading">
                            <MapPin size={14} />
                            <span>Factory Delivery Address</span>
                          </h5>
                          <div className="address-content">
                            <strong>{ord.shippingAddress?.fullName || ord.customerName}</strong>
                            {ord.companyName && (
                              <p className="company-line">
                                <Building size={12} /> {ord.companyName}
                              </p>
                            )}
                            {ord.gstin && <p className="gstin-line">GSTIN: {ord.gstin}</p>}
                            <p className="addr-line">{ord.shippingAddress?.address}</p>
                            <p className="city-line">
                              {ord.shippingAddress?.city}, {ord.shippingAddress?.state} -{' '}
                              <strong>{ord.shippingAddress?.pincode}</strong>
                            </p>
                            <p className="phone-line">
                              <Phone size={12} /> Phone:{' '}
                              {ord.shippingAddress?.phone || ord.customerPhone || 'On File'}
                            </p>
                          </div>
                        </div>

                        <div className="details-col">
                          <h5 className="details-section-heading">
                            <CreditCard size={14} />
                            <span>Commercial Invoice Breakdown</span>
                          </h5>
                          <div className="finance-breakdown">
                            <div className="f-row">
                              <span>Equipment Subtotal:</span>
                              <span>₹{(ord.subtotal || 0).toLocaleString('en-IN')}</span>
                            </div>
                            <div className="f-row">
                              <span>GST (18% Harmonized):</span>
                              <span>₹{(ord.gst || 0).toLocaleString('en-IN')}</span>
                            </div>
                            <div className="f-row">
                              <span>Factory Logistics / Freight:</span>
                              <span className="text-green">Free Factory Dispatch</span>
                            </div>
                            <div className="f-row f-total">
                              <strong>Grand Total (INR):</strong>
                              <strong className="grand-price">₹{(ord.total || 0).toLocaleString('en-IN')}</strong>
                            </div>
                            <div className="f-payment-note">
                              <span>Settlement: <strong>{ord.paymentMethod}</strong></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Card Footer: Summary & Interactive Actions */}
                  <div className="order-box-footer">
                    <div className="footer-left-info">
                      <div className="total-block">
                        <span className="total-lbl">Total Value:</span>
                        <strong className="total-val">₹{(ord.total || 0).toLocaleString('en-IN')}</strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleExpand(ord.orderId)}
                        className="toggle-details-btn"
                      >
                        <span>{isExpanded ? 'Hide Details' : 'View Full Details'}</span>
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </div>

                    <div className="footer-actions-group">
                      {/* Mark as Received button (For in-transit/pending) */}
                      {isPending && (
                        <button
                          type="button"
                          className="btn-action-received"
                          onClick={() => handleMarkReceived(ord.orderId)}
                          title="Confirm you have physically received this machinery shipment"
                        >
                          <CheckCircle size={15} />
                          <span>I Received Order</span>
                        </button>
                      )}

                      {/* Cancel Order button (For un-delivered orders) */}
                      {isPending && (
                        <button
                          type="button"
                          className="btn-action-cancel"
                          onClick={() => setCancellingOrder(ord)}
                          title="Cancel equipment order"
                        >
                          <XCircle size={15} />
                          <span>Cancel Order</span>
                        </button>
                      )}

                      {/* Proforma Invoice Link */}
                      <Link
                        href={`/orders/${ord.orderId}`}
                        className="btn-action-invoice"
                        title="View Official Proforma Invoice"
                      >
                        <FileText size={14} />
                        <span>Proforma Invoice</span>
                      </Link>

                      {/* WhatsApp Dispatch Desk Assistance */}
                      <a
                        href={`https://wa.me/919915856540?text=${encodeURIComponent(
                          `Hello BizBein Innovations, I am inquiring regarding my Order ID: ${ord.orderId}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-action-wa"
                        title="Contact WhatsApp Dispatch Helpdesk"
                      >
                        <MessageCircle size={14} />
                        <span>Dispatch Support</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cancellation Confirmation Modal */}
      {cancellingOrder && (
        <div className="modal-backdrop" onClick={() => setCancellingOrder(null)}>
          <div className="cancel-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top">
              <div className="icon-warn-box">
                <AlertTriangle size={24} color="#dc2626" />
              </div>
              <div>
                <h3>Cancel Order</h3>
                <p className="order-target-id">
                  Order Reference: <strong>{cancellingOrder.orderId}</strong>
                </p>
              </div>
            </div>

            <div className="modal-body-content">
              <p className="modal-warn-text">
                Are you sure you want to cancel this equipment procurement order? Once cancelled, factory dispatch and reservation for this equipment will be released.
              </p>

              <label className="field-lbl">Reason for Cancellation *</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="reason-select"
              >
                {CANCELLATION_REASONS.map((r, i) => (
                  <option key={i} value={r}>
                    {r}
                  </option>
                ))}
              </select>

              <label className="field-lbl mt-3">Additional Notes (Optional)</label>
              <textarea
                rows={3}
                placeholder="Provide any additional context for our factory billing team..."
                value={cancelNotes}
                onChange={(e) => setCancelNotes(e.target.value)}
                className="notes-textarea"
              />
            </div>

            <div className="modal-actions-row">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setCancellingOrder(null)}
                disabled={cancelLoading}
              >
                Keep Order
              </button>
              <button
                type="button"
                className="btn btn-danger-confirm"
                onClick={handleConfirmCancel}
                disabled={cancelLoading}
              >
                {cancelLoading ? 'Cancelling...' : 'Confirm Order Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .orders-hub-page {
          background-color: #f8fafc;
          min-height: 100vh;
          padding: 36px 16px 80px;
          font-family: inherit;
        }

        .orders-hub-container {
          max-width: 1140px;
          margin: 0 auto;
        }

        /* Header */
        .hub-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .hub-tag {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #1e3a8a;
          background: #dbeafe;
          padding: 3px 10px;
          border-radius: 9999px;
          display: inline-block;
          margin-bottom: 8px;
        }

        .hub-title {
          font-size: 26px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 6px;
        }

        .hub-subtitle {
          font-size: 13.5px;
          color: #64748b;
          max-width: 720px;
          margin: 0;
          line-height: 1.5;
        }

        .btn-outline-catalog {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #0f172a;
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.15s ease;
        }

        .btn-outline-catalog:hover {
          background: #f1f5f9;
          border-color: #94a3b8;
        }

        /* Guest lookup card */
        .guest-lookup-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px 24px;
          margin-bottom: 24px;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.03);
        }

        .guest-lookup-card h3 {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 4px;
        }

        .guest-lookup-card p {
          font-size: 13px;
          color: #64748b;
          margin: 0 0 14px;
        }

        .lookup-form {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .lookup-input {
          flex: 1;
          min-width: 260px;
          padding: 10px 14px;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font-size: 13px;
          outline: none;
        }

        .lookup-input:focus {
          border-color: #F8B50E;
          box-shadow: 0 0 0 3px rgba(248, 181, 14, 0.15);
        }

        .lookup-btn {
          background-color: #F8B50E;
          color: #0f172a;
          font-weight: 700;
          border: none;
          padding: 10px 18px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
        }

        .lookup-btn:hover {
          background-color: #E5A407;
        }

        .btn-login-link {
          background: #1e293b;
          color: #ffffff;
          padding: 10px 18px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
        }

        .lookup-error {
          margin-top: 10px;
          color: #dc2626;
          font-size: 12.5px;
        }

        /* Metric Cards */
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
          gap: 14px;
          margin-bottom: 24px;
        }

        .metric-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 14px;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
          box-shadow: 0 1px 4px rgba(15, 23, 42, 0.03);
        }

        .metric-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06);
          border-color: #cbd5e1;
        }

        .metric-card.active {
          border-color: #F8B50E;
          box-shadow: 0 0 0 2px #F8B50E;
        }

        .metric-icon-box {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .bg-navy { background-color: #1E253D; }
        .bg-amber { background-color: #d97706; }
        .bg-green { background-color: #15803d; }
        .bg-red { background-color: #dc2626; }

        .metric-info {
          display: flex;
          flex-direction: column;
        }

        .metric-label {
          font-size: 11.5px;
          color: #64748b;
          font-weight: 600;
          text-transform: uppercase;
        }

        .metric-val {
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
        }

        /* Toolbar */
        .filter-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .tabs-strip {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #475569;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .tab-btn:hover {
          background: #f1f5f9;
          color: #0f172a;
        }

        .tab-btn.active {
          background: #1E253D;
          border-color: #1E253D;
          color: #ffffff;
        }

        .search-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          color: #94a3b8;
          pointer-events: none;
        }

        .search-input {
          padding: 8px 30px 8px 34px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 13px;
          background: #ffffff;
          width: 240px;
          outline: none;
          transition: all 0.15s ease;
        }

        .search-input:focus {
          border-color: #F8B50E;
          width: 280px;
        }

        .clear-search {
          position: absolute;
          right: 8px;
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          font-size: 12px;
        }

        .hub-error-banner {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #b91c1c;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
        }

        /* Order Cards Stack */
        .orders-cards-stack {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .order-card-box {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(15, 23, 42, 0.04);
          overflow: hidden;
          transition: border-color 0.2s ease;
        }

        .order-card-box:hover {
          border-color: #cbd5e1;
        }

        .order-card-box.card-received {
          border-left: 4px solid #15803d;
        }

        .order-card-box.card-cancelled {
          border-left: 4px solid #dc2626;
          background: #fafafa;
        }

        /* Box Header */
        .order-box-header {
          background: #f8fafc;
          padding: 14px 20px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .id-and-date {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }

        .order-id-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
        }

        .ref-lbl {
          color: #64748b;
        }

        .ref-id {
          font-family: inherit;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: 0.02em;
        }

        .copy-id-btn {
          background: #e2e8f0;
          border: none;
          padding: 3px 6px;
          border-radius: 4px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          color: #475569;
          transition: all 0.15s ease;
        }

        .copy-id-btn:hover {
          background: #cbd5e1;
        }

        .order-date-text {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12.5px;
          color: #64748b;
        }

        .status-badges {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 9999px;
          font-size: 11.5px;
          font-weight: 700;
        }

        .badge-delivered {
          background: #dcfce7;
          color: #15803d;
          border: 1px solid #bbf7d0;
        }

        .badge-in-transit {
          background: #fef3c7;
          color: #b45309;
          border: 1px solid #fde68a;
        }

        .badge-cancelled {
          background: #fee2e2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }

        .badge-payment {
          font-size: 11px;
          border-radius: 4px;
          padding: 3px 8px;
        }

        .pay-paid {
          background: #e0f2fe;
          color: #0369a1;
        }

        .pay-pending {
          background: #f1f5f9;
          color: #475569;
        }

        /* Consignment Stepper */
        .consignment-tracker-stepper {
          padding: 16px 24px;
          background: #ffffff;
          border-bottom: 1px solid #f1f5f9;
        }

        .stepper-track {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          max-width: 600px;
          margin: 0 auto;
        }

        .stepper-track::before {
          content: '';
          position: absolute;
          top: 13px;
          left: 0;
          right: 0;
          height: 2px;
          background: #e2e8f0;
          z-index: 1;
        }

        .stepper-progress-fill {
          position: absolute;
          top: 13px;
          left: 0;
          height: 2px;
          background: #15803d;
          z-index: 2;
          transition: width 0.3s ease;
        }

        .step-point {
          position: relative;
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .step-dot {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #ffffff;
          border: 2px solid #cbd5e1;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
        }

        .step-point.completed .step-dot {
          background: #15803d;
          border-color: #15803d;
          color: #ffffff;
        }

        .step-label {
          font-size: 11px;
          font-weight: 600;
          color: #475569;
          white-space: nowrap;
        }

        /* Cancellation alert banner */
        .cancellation-alert-row {
          background: #fff1f2;
          border-bottom: 1px solid #ffe4e6;
          padding: 12px 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: #9f1239;
        }

        .cancel-date-sub {
          color: #64748b;
          font-size: 12px;
        }

        /* Products list */
        .order-items-grid {
          padding: 14px 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .item-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 6px 0;
        }

        .item-thumb {
          width: 48px;
          height: 48px;
          object-fit: cover;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
          flex-shrink: 0;
        }

        .item-details {
          flex: 1;
        }

        .item-title {
          font-size: 13.5px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 3px;
        }

        .item-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 12px;
          color: #64748b;
        }

        .item-brand {
          background: #f1f5f9;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 11px;
        }

        .item-subtotal {
          font-weight: 700;
          color: #0f172a;
          font-size: 13.5px;
        }

        /* Expanded Details Pane */
        .expanded-details-pane {
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
          padding: 18px 20px;
          animation: fadeIn 0.15s ease-out;
        }

        .details-two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .details-section-heading {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          text-transform: uppercase;
          color: #1e3a8a;
          font-weight: 700;
          letter-spacing: 0.04em;
          margin: 0 0 10px;
        }

        .address-content {
          font-size: 13px;
          color: #334155;
          line-height: 1.5;
        }

        .company-line, .gstin-line, .phone-line {
          margin: 3px 0;
          display: flex;
          align-items: center;
          gap: 5px;
          color: #64748b;
          font-size: 12px;
        }

        .finance-breakdown {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 12.5px;
        }

        .f-row {
          display: flex;
          justify-content: space-between;
          color: #475569;
        }

        .f-total {
          border-top: 1px solid #cbd5e1;
          padding-top: 6px;
          margin-top: 2px;
          color: #0f172a;
          font-size: 14px;
        }

        .grand-price {
          color: #0f172a;
          font-size: 16px;
        }

        .f-payment-note {
          font-size: 11.5px;
          color: #64748b;
          margin-top: 4px;
        }

        /* Footer */
        .order-box-footer {
          background: #ffffff;
          padding: 14px 20px;
          border-top: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
        }

        .footer-left-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .total-block {
          display: flex;
          align-items: baseline;
          gap: 6px;
        }

        .total-lbl {
          font-size: 12px;
          color: #64748b;
        }

        .total-val {
          font-size: 17px;
          font-weight: 800;
          color: #0f172a;
        }

        .toggle-details-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: none;
          border: none;
          color: #1d4ed8;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          padding: 4px 6px;
        }

        .toggle-details-btn:hover {
          text-decoration: underline;
        }

        .footer-actions-group {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .btn-action-received {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: #15803d;
          color: #ffffff;
          border: none;
          padding: 8px 14px;
          border-radius: 6px;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .btn-action-received:hover {
          background-color: #166534;
        }

        .btn-action-cancel {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #ffffff;
          border: 1px solid #fca5a5;
          color: #dc2626;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-action-cancel:hover {
          background: #fef2f2;
          border-color: #ef4444;
        }

        .btn-action-invoice {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          color: #0f172a;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.15s ease;
        }

        .btn-action-invoice:hover {
          background: #e2e8f0;
        }

        .btn-action-wa {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #25D366;
          color: #ffffff;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.15s ease;
        }

        .btn-action-wa:hover {
          background: #22c55e;
        }

        /* Empty state */
        .empty-orders-state {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 60px 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .empty-orders-state h3 {
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
          margin: 14px 0 6px;
        }

        .empty-orders-state p {
          font-size: 13.5px;
          color: #64748b;
          max-width: 480px;
          margin: 0;
        }

        .btn-primary {
          background-color: #F8B50E;
          color: #0f172a;
          font-weight: 700;
          padding: 10px 18px;
          border-radius: 6px;
          text-decoration: none;
          display: inline-block;
          font-size: 13px;
        }

        .btn-primary:hover {
          background-color: #E5A407;
        }

        /* Cancel Modal */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          z-index: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .cancel-modal-card {
          background: #ffffff;
          border-radius: 12px;
          max-width: 500px;
          width: 100%;
          padding: 24px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }

        .modal-top {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 14px;
        }

        .icon-warn-box {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: #fee2e2;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .modal-top h3 {
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 2px;
        }

        .order-target-id {
          font-size: 13px;
          color: #64748b;
          margin: 0;
        }

        .modal-warn-text {
          font-size: 13px;
          color: #475569;
          line-height: 1.5;
          margin: 0 0 16px;
        }

        .field-lbl {
          display: block;
          font-size: 12.5px;
          font-weight: 700;
          color: #334155;
          margin-bottom: 6px;
        }

        .reason-select, .notes-textarea {
          width: 100%;
          padding: 9px 12px;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font-size: 13px;
          outline: none;
          box-sizing: border-box;
          font-family: inherit;
        }

        .reason-select:focus, .notes-textarea:focus {
          border-color: #F8B50E;
          box-shadow: 0 0 0 3px rgba(248, 181, 14, 0.15);
        }

        .modal-actions-row {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }

        .btn-secondary {
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          color: #475569;
          padding: 9px 16px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-danger-confirm {
          background: #dc2626;
          border: 1px solid #b91c1c;
          color: #ffffff;
          padding: 9px 18px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }

        .btn-danger-confirm:hover {
          background: #b91c1c;
        }

        @media (max-width: 768px) {
          .details-two-col {
            grid-template-columns: 1fr;
          }
          .hub-header {
            flex-direction: column;
          }
          .metrics-grid {
            grid-template-columns: 1fr 1fr;
          }
          .search-input {
            width: 100%;
          }
          .search-input:focus {
            width: 100%;
          }
          .search-wrap {
            width: 100%;
          }
          .footer-actions-group {
            width: 100%;
            justify-content: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
