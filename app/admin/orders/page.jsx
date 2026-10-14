'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '../../../context/StoreContext';
import {
  ShieldAlert,
  Search,
  Filter,
  RefreshCw,
  PackageCheck,
  CreditCard,
  Truck,
  CheckCircle,
  ExternalLink,
  Phone,
  Mail,
  Building,
  Save,
  AlertTriangle
} from 'lucide-react';

const ORDER_STATUSES = ['Confirmed', 'In Production', 'Dispatched', 'Delivered', 'Cancelled'];
const PAYMENT_STATUSES = ['Pending', 'Pending Verification', 'Paid', 'Refunded'];

export default function AdminOrdersPage() {
  const router = useRouter();
  const { user, authLoading, showToast } = useStore();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [savingId, setSavingId] = useState(null);

  // Editable row state
  const [edits, setEdits] = useState({});

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to load admin orders.');
      }
      const data = await res.json();
      setOrders(data.orders || []);

      // Initialize edit state
      const initialEdits = {};
      (data.orders || []).forEach((o) => {
        initialEdits[o.orderId] = {
          orderStatus: o.orderStatus,
          paymentStatus: o.paymentStatus,
          trackingNumber: o.trackingNumber || ''
        };
      });
      setEdits(initialEdits);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login?redirect=/admin/orders');
      } else if (user.role !== 'admin') {
        setError('Access Denied. You do not have administrator permissions.');
        setLoading(false);
      } else {
        fetchOrders();
      }
    }
  }, [user, authLoading, router]);

  const handleUpdate = async (orderId) => {
    const edit = edits[orderId];
    if (!edit) return;

    setSavingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(edit)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update order.');

      // Update in local list
      setOrders((prev) =>
        prev.map((o) => (o.orderId === orderId ? { ...o, ...edit } : o))
      );

      showToast(`Order ${orderId} updated successfully.`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSavingId(null);
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'All' || o.orderStatus === statusFilter;
    const query = search.toLowerCase().trim();
    const matchesSearch =
      !query ||
      o.orderId.toLowerCase().includes(query) ||
      o.customerName.toLowerCase().includes(query) ||
      o.customerEmail.toLowerCase().includes(query) ||
      o.customerPhone.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  // KPI Calculations
  const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);
  const pendingCount = orders.filter((o) => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled').length;

  if (authLoading) {
    return (
      <div className="admin-loading">
        <p>Verifying administrative credentials...</p>
      </div>
    );
  }

  if (error && (!user || user.role !== 'admin')) {
    return (
      <div className="admin-denied-container">
        <AlertTriangle size={48} className="text-red" />
        <h2>Administrative Privileges Required</h2>
        <p>{error}</p>
        <div className="denied-hint">
          <span>To test the admin panel, sign in with the default admin account:</span>
          <code>Email: admin@bizbein.com | Password: Admin@12345</code>
        </div>
        <Link href="/login?redirect=/admin/orders" className="btn btn-primary">
          Sign In as Administrator
        </Link>
        <style jsx>{`
          .admin-denied-container {
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
          .denied-hint {
            background: #f8fafc;
            border: 1px dashed #cbd5e1;
            padding: 12px;
            border-radius: 8px;
            font-size: 12.5px;
            color: #475569;
            display: flex;
            flex-direction: column;
            gap: 6px;
          }
          code {
            background: #e2e8f0;
            padding: 2px 6px;
            border-radius: 4px;
            color: #0f172a;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-page">
      <div className="admin-container">
        {/* Admin Header */}
        <div className="admin-header">
          <div>
            <div className="admin-badge">
              <ShieldAlert size={14} />
              <span>Operations Management Portal</span>
            </div>
            <h1 className="admin-title">Industrial Orders Dispatch Desk</h1>
            <p className="admin-subtitle">Live tracking, proforma auditing, and factory dispatch status management</p>
          </div>
          <button type="button" onClick={fetchOrders} className="btn-refresh">
            <RefreshCw size={15} />
            <span>Refresh Data</span>
          </button>
        </div>

        {/* KPI Cards */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <span className="kpi-label">Total Commercial Orders</span>
            <strong className="kpi-val">{orders.length}</strong>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Active Production Pipeline</span>
            <strong className="kpi-val text-amber">{pendingCount}</strong>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Total Commercial Value</span>
            <strong className="kpi-val text-gold">₹{totalRevenue.toLocaleString('en-IN')}</strong>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="admin-toolbar">
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search by Order ID, customer, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <Filter size={15} className="filter-icon" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="status-filter-select"
            >
              <option value="All">All Order Statuses</option>
              {ORDER_STATUSES.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="table-card">
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order Reference</th>
                  <th>Customer / Consignee</th>
                  <th>Products & Quantities</th>
                  <th>Amount</th>
                  <th>Payment Status</th>
                  <th>Order Status</th>
                  <th>Tracking / LR</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="empty-row">
                      {loading ? 'Fetching orders from database...' : 'No orders matching selected criteria.'}
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => {
                    const edit = edits[ord.orderId] || {};
                    const isSaving = savingId === ord.orderId;

                    return (
                      <tr key={ord.orderId}>
                        <td>
                          <div className="order-id-cell">
                            <strong className="order-ref">{ord.orderId}</strong>
                            <span className="order-date">
                              {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: '2-digit'
                              })}
                            </span>
                            <Link href={`/orders/${ord.orderId}`} target="_blank" className="link-proforma">
                              <span>Invoice</span>
                              <ExternalLink size={11} />
                            </Link>
                          </div>
                        </td>

                        <td>
                          <div className="customer-cell">
                            <strong>{ord.customerName}</strong>
                            <span className="customer-sub">{ord.customerPhone}</span>
                            <span className="customer-sub">{ord.customerEmail}</span>
                            {ord.companyName && (
                              <span className="customer-company">{ord.companyName}</span>
                            )}
                            <span className="customer-dest">{ord.shippingAddress?.city}, {ord.shippingAddress?.state}</span>
                          </div>
                        </td>

                        <td>
                          <div className="products-summary-cell">
                            {ord.items.map((it, idx) => (
                              <div key={idx} className="admin-item-chip">
                                <strong>{it.name}</strong> × {it.qty}
                              </div>
                            ))}
                          </div>
                        </td>

                        <td>
                          <div className="amount-cell">
                            <strong>₹{ord.total.toLocaleString('en-IN')}</strong>
                            <span className="amount-gst">Incl. 18% GST</span>
                          </div>
                        </td>

                        <td>
                          <select
                            value={edit.paymentStatus || ord.paymentStatus}
                            onChange={(e) =>
                              setEdits({
                                ...edits,
                                [ord.orderId]: {
                                  ...edit,
                                  paymentStatus: e.target.value
                                }
                              })
                            }
                            className="admin-select"
                          >
                            {PAYMENT_STATUSES.map((ps) => (
                              <option key={ps} value={ps}>{ps}</option>
                            ))}
                          </select>
                        </td>

                        <td>
                          <select
                            value={edit.orderStatus || ord.orderStatus}
                            onChange={(e) =>
                              setEdits({
                                ...edits,
                                [ord.orderId]: {
                                  ...edit,
                                  orderStatus: e.target.value
                                }
                              })
                            }
                            className={`admin-select select-status status-${(edit.orderStatus || ord.orderStatus).toLowerCase().replace(/\s+/g, '-')}`}
                          >
                            {ORDER_STATUSES.map((os) => (
                              <option key={os} value={os}>{os}</option>
                            ))}
                          </select>
                        </td>

                        <td>
                          <input
                            type="text"
                            placeholder="LR / AWB #"
                            value={edit.trackingNumber !== undefined ? edit.trackingNumber : (ord.trackingNumber || '')}
                            onChange={(e) =>
                              setEdits({
                                ...edits,
                                [ord.orderId]: {
                                  ...edit,
                                  trackingNumber: e.target.value
                                }
                              })
                            }
                            className="admin-input-tracking"
                          />
                        </td>

                        <td>
                          <button
                            type="button"
                            onClick={() => handleUpdate(ord.orderId)}
                            disabled={isSaving}
                            className="btn-save-row"
                            title="Save Status Updates"
                          >
                            <Save size={14} />
                            <span>{isSaving ? '...' : 'Save'}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-dashboard-page {
          background: #f1f5f9;
          min-height: 100vh;
          padding: 24px 16px 60px;
        }

        .admin-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 24px;
        }

        .admin-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #13192B;
          color: #F8B50E;
          font-size: 11px;
          font-weight: 800;
          padding: 3px 10px;
          border-radius: 9999px;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .admin-title {
          font-size: 22px;
          font-weight: 800;
          color: #13192B;
          margin: 0 0 4px;
        }

        .admin-subtitle {
          font-size: 13px;
          color: #64748b;
          margin: 0;
        }

        .btn-refresh {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          color: #334155;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-refresh:hover {
          background: #f8fafc;
        }

        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .kpi-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 18px 20px;
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.04);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .kpi-label {
          font-size: 12px;
          color: #64748b;
          font-weight: 600;
          text-transform: uppercase;
        }

        .kpi-val {
          font-size: 24px;
          font-weight: 800;
          color: #13192B;
        }

        .text-amber {
          color: #d97706;
        }

        .text-gold {
          color: #b45309;
        }

        .admin-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .search-box {
          position: relative;
          display: flex;
          align-items: center;
          flex: 1;
          max-width: 440px;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          color: #94a3b8;
          pointer-events: none;
        }

        .search-box input {
          width: 100%;
          padding: 10px 14px 10px 36px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 13px;
          outline: none;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 0 10px;
        }

        .filter-icon {
          color: #64748b;
        }

        .status-filter-select {
          border: none;
          background: transparent;
          padding: 10px 6px;
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
          outline: none;
          cursor: pointer;
        }

        .table-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(15, 23, 42, 0.04);
          overflow: hidden;
        }

        .table-responsive {
          overflow-x: auto;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12.5px;
          text-align: left;
        }

        .admin-table th {
          background: #f8fafc;
          padding: 12px 14px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          color: #475569;
          border-bottom: 2px solid #e2e8f0;
          white-space: nowrap;
        }

        .admin-table td {
          padding: 14px;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: top;
        }

        .admin-table tr:hover {
          background: #fafbfc;
        }

        .order-id-cell {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .order-ref {
          font-family: monospace;
          color: #13192B;
          font-size: 12px;
        }

        .order-date {
          font-size: 11px;
          color: #64748b;
        }

        .link-proforma {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          color: #d97706;
          font-size: 11px;
          font-weight: 600;
          text-decoration: none;
          margin-top: 2px;
        }

        .customer-cell {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .customer-sub {
          font-size: 11.5px;
          color: #64748b;
        }

        .customer-company {
          font-size: 11px;
          color: #13192B;
          font-weight: 600;
        }

        .customer-dest {
          font-size: 11px;
          color: #059669;
          font-weight: 500;
        }

        .products-summary-cell {
          display: flex;
          flex-direction: column;
          gap: 4px;
          max-width: 220px;
        }

        .admin-item-chip {
          font-size: 11.5px;
          color: #1e293b;
          line-height: 1.3;
        }

        .amount-cell {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .amount-cell strong {
          color: #13192B;
          font-size: 13.5px;
        }

        .amount-gst {
          font-size: 10.5px;
          color: #64748b;
        }

        .admin-select {
          padding: 6px 8px;
          font-size: 12px;
          font-family: inherit;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          background: #ffffff;
          outline: none;
          color: #1e293b;
          font-weight: 500;
        }

        .select-status.status-confirmed {
          background: #dcfce7;
          border-color: #86efac;
          color: #15803D;
          font-weight: 700;
        }

        .select-status.status-in-production {
          background: #fef3c7;
          border-color: #fde68a;
          color: #b45309;
          font-weight: 700;
        }

        .select-status.status-dispatched {
          background: #e0e7ff;
          border-color: #c7d2fe;
          color: #3730a3;
          font-weight: 700;
        }

        .select-status.status-delivered {
          background: #d1fae5;
          border-color: #a7f3d0;
          color: #065f46;
          font-weight: 700;
        }

        .select-status.status-cancelled {
          background: #fee2e2;
          border-color: #fca5a5;
          color: #991b1b;
          font-weight: 700;
        }

        .admin-input-tracking {
          padding: 6px 8px;
          font-size: 12px;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          width: 110px;
          outline: none;
        }

        .btn-save-row {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 6px 10px;
          background: #F8B50E;
          color: #0f172a;
          border: none;
          border-radius: 6px;
          font-size: 11.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-save-row:hover:not(:disabled) {
          background: #e5a407;
        }

        .empty-row {
          text-align: center;
          padding: 40px !important;
          color: #64748b;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
