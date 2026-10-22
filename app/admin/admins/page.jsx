'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '../../../context/StoreContext';
import {
  ShieldCheck,
  ShieldAlert,
  UserPlus,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Crown,
  UserCheck,
  UserX,
  X,
  Save,
  Lock,
  Mail,
  Phone,
  User as UserIcon,
  Boxes
} from 'lucide-react';

export default function AdminAccessControlPage() {
  const router = useRouter();
  const { user, authLoading, showToast } = useStore();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  // Row Action State
  const [updatingId, setUpdatingId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/admins');
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to load user access directory.');
      }
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login?redirect=/admin/admins');
      } else if (user.role !== 'superadmin') {
        setError('Access Denied. Only Super Administrator can view or manage administrative access.');
        setLoading(false);
      } else {
        fetchUsers();
      }
    }
  }, [user, authLoading, router]);

  const handleRoleChange = async (targetUser, newRole) => {
    if (targetUser.role === 'superadmin') return;
    const actionText = newRole === 'admin' ? 'grant administrative privileges to' : 'revoke administrative access from';
    const confirmMsg = `Are you sure you want to ${actionText} ${targetUser.name} (${targetUser.email})?`;
    if (!window.confirm(confirmMsg)) return;

    setUpdatingId(targetUser.id);
    try {
      const res = await fetch('/api/admin/admins', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: targetUser.id, role: newRole })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update user privileges.');

      setUsers((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, role: newRole } : u))
      );
      if (showToast) {
        showToast(data.message || `Privileges updated successfully.`, 'success');
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setModalError('');

    if (!newAdmin.name.trim() || !newAdmin.email.trim() || !newAdmin.password) {
      setModalError('Please fill in name, email, and password.');
      return;
    }

    if (newAdmin.password.length < 6) {
      setModalError('Password must be at least 6 characters.');
      return;
    }

    setModalSubmitting(true);
    try {
      const res = await fetch('/api/admin/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAdmin)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create administrator.');

      setUsers((prev) => [data.admin, ...prev]);
      setIsAddModalOpen(false);
      setNewAdmin({ name: '', email: '', phone: '', password: '' });
      if (showToast) {
        showToast(`Administrator account created successfully.`, 'success');
      }
    } catch (err) {
      setModalError(err.message);
    } finally {
      setModalSubmitting(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const term = search.toLowerCase();
    const matchesSearch =
      !term ||
      (u.name && u.name.toLowerCase().includes(term)) ||
      (u.email && u.email.toLowerCase().includes(term)) ||
      (u.phone && u.phone.includes(term));
    return matchesRole && matchesSearch;
  });

  const adminCount = users.filter((u) => u.role === 'admin').length;
  const customerCount = users.filter((u) => u.role === 'customer').length;

  if (authLoading) {
    return (
      <div className="admin-loading">
        <p>Verifying root administrative authority...</p>
      </div>
    );
  }

  if (error && (!user || user.role !== 'superadmin')) {
    return (
      <div className="admin-denied-container">
        <AlertTriangle size={48} className="text-red" />
        <h2>Super Administrator Privileges Required</h2>
        <p>{error}</p>
        <Link href="/login?redirect=/admin/admins" className="btn btn-primary">
          Sign In as Super Administrator
        </Link>
        <style jsx>{`
          .admin-denied-container {
            padding: 80px 20px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
            max-width: 520px;
            margin: 0 auto;
          }
          .text-red { color: #ef4444; }
          h2 { color: #13192B; margin: 0; }
          p { color: #64748b; margin: 0; font-size: 14px; line-height: 1.5; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-page">
      <div className="admin-container">
        {/* Header */}
        <div className="admin-header">
          <div>
            <div className="superadmin-badge">
              <Crown size={14} />
              <span>Root Access Authority</span>
            </div>
            <h1 className="admin-title">Administrator & Access Management</h1>
            <p className="admin-subtitle">
              Authorize operations administrators, create manager credentials, and control platform governance.
            </p>
          </div>
          <div className="header-actions">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="btn-create-admin"
            >
              <UserPlus size={16} />
              <span>Create New Admin</span>
            </button>
            <button type="button" onClick={fetchUsers} className="btn-refresh">
              <RefreshCw size={15} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="admin-nav-tabs">
          <Link href="/admin/orders" className="admin-tab">
            <span>Commercial Orders Desk</span>
          </Link>
          <Link href="/admin/products" className="admin-tab">
            <Boxes size={15} />
            <span>Machinery & Product Catalog</span>
          </Link>
          <Link href="/admin/admins" className="admin-tab active">
            <ShieldCheck size={15} />
            <span>Admin & Access Control</span>
          </Link>
        </div>

        {/* KPI Cards */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <span className="kpi-label">Active Administrators</span>
            <strong className="kpi-val text-blue">{adminCount}</strong>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Registered Client Accounts</span>
            <strong className="kpi-val text-slate">{customerCount}</strong>
          </div>
          <div className="kpi-card root-kpi">
            <span className="kpi-label">Platform Root Status</span>
            <div className="root-status-val">
              <Crown size={18} className="text-gold" />
              <span>Super Administrator</span>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="admin-toolbar">
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search user by name, email, or phone number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <Filter size={15} className="filter-icon" />
            <button
              type="button"
              className={`filter-btn ${roleFilter === 'all' ? 'active' : ''}`}
              onClick={() => setRoleFilter('all')}
            >
              All ({users.length})
            </button>
            <button
              type="button"
              className={`filter-btn ${roleFilter === 'admin' ? 'active' : ''}`}
              onClick={() => setRoleFilter('admin')}
            >
              Admins ({adminCount})
            </button>
            <button
              type="button"
              className={`filter-btn ${roleFilter === 'customer' ? 'active' : ''}`}
              onClick={() => setRoleFilter('customer')}
            >
              Clients ({customerCount})
            </button>
          </div>
        </div>

        {/* User Table */}
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User Identity</th>
                <th>Role & Clearance</th>
                <th>Contact Phone</th>
                <th>Registered On</th>
                <th style={{ textAlign: 'right' }}>Access Control</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="table-empty">
                    <RefreshCw size={22} className="spin-icon" />
                    <p>Loading user access records...</p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="table-empty">
                    <p>No user accounts found matching your query.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isCurrentSuper = u.role === 'superadmin';
                  const isAdmin = u.role === 'admin';

                  return (
                    <tr key={u.id} className={isCurrentSuper ? 'row-superadmin' : ''}>
                      <td>
                        <div className="user-name-cell">
                          <div className={`user-avatar ${isCurrentSuper ? 'avatar-super' : isAdmin ? 'avatar-admin' : ''}`}>
                            {isCurrentSuper ? <Crown size={16} /> : isAdmin ? <ShieldAlert size={16} /> : <UserIcon size={16} />}
                          </div>
                          <div>
                            <span className="user-full-name">{u.name}</span>
                            <span className="user-email-text">{u.email}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        {isCurrentSuper ? (
                          <span className="badge badge-super">
                            <Crown size={12} /> Root Super Admin
                          </span>
                        ) : isAdmin ? (
                          <span className="badge badge-admin">
                            <ShieldCheck size={12} /> Operations Admin
                          </span>
                        ) : (
                          <span className="badge badge-customer">Client Account</span>
                        )}
                      </td>
                      <td>
                        <span className="phone-text">{u.phone || '—'}</span>
                      </td>
                      <td>
                        <span className="date-text">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          }) : '—'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {isCurrentSuper ? (
                          <span className="root-locked-tag">
                            <Lock size={12} /> Protected Root
                          </span>
                        ) : isAdmin ? (
                          <button
                            type="button"
                            className="btn-revoke-role"
                            disabled={updatingId === u.id}
                            onClick={() => handleRoleChange(u, 'customer')}
                            title="Demote administrator back to customer role"
                          >
                            <UserX size={14} />
                            <span>Revoke Admin Access</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn-grant-role"
                            disabled={updatingId === u.id}
                            onClick={() => handleRoleChange(u, 'admin')}
                            title="Promote customer to Operations Administrator"
                          >
                            <UserCheck size={14} />
                            <span>Grant Admin Access</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Modal: Create Administrator */}
        {isAddModalOpen && (
          <div className="modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-title-wrap">
                  <UserPlus size={20} className="text-blue" />
                  <h3>Provision New Administrator</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="modal-close-btn"
                >
                  <X size={18} />
                </button>
              </div>

              {modalError && (
                <div className="modal-alert-error">
                  <AlertTriangle size={16} />
                  <span>{modalError}</span>
                </div>
              )}

              <form onSubmit={handleCreateAdmin} className="modal-form">
                <div className="form-group">
                  <label>Full Name / Designation *</label>
                  <div className="input-wrap">
                    <UserIcon size={16} className="input-icon" />
                    <input
                      type="text"
                      placeholder="e.g., Rajesh Sharma (Plant Lead)"
                      required
                      value={newAdmin.name}
                      onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Official Email Address *</label>
                  <div className="input-wrap">
                    <Mail size={16} className="input-icon" />
                    <input
                      type="email"
                      placeholder="admin.ops@company.com"
                      required
                      value={newAdmin.email}
                      onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Contact Phone (WhatsApp Support)</label>
                  <div className="input-wrap">
                    <Phone size={16} className="input-icon" />
                    <input
                      type="tel"
                      placeholder="+91 98765-43210"
                      value={newAdmin.phone}
                      onChange={(e) => setNewAdmin({ ...newAdmin, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Initial Account Password *</label>
                  <div className="input-wrap">
                    <Lock size={16} className="input-icon" />
                    <input
                      type="password"
                      placeholder="Min 6 characters"
                      required
                      minLength={6}
                      value={newAdmin.password}
                      onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                    />
                  </div>
                  <small className="form-hint">
                    Administrator will be granted access to orders and machinery management desks.
                  </small>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="btn-cancel"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={modalSubmitting}
                    className="btn-save-admin"
                  >
                    {modalSubmitting ? 'Creating Administrator...' : 'Create Administrator'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <style jsx>{`
          .admin-dashboard-page {
            background-color: #f8fafc;
            min-height: 100vh;
            padding: 32px 0 64px;
          }

          .admin-container {
            max-width: 1240px;
            margin: 0 auto;
            padding: 0 20px;
          }

          .admin-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 24px;
            flex-wrap: wrap;
            gap: 16px;
          }

          .superadmin-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: #fffbeb;
            color: #b45309;
            border: 1px solid #fde68a;
            padding: 4px 10px;
            border-radius: 9999px;
            font-size: 11.5px;
            font-weight: 700;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .admin-title {
            font-size: 26px;
            font-weight: 800;
            color: #0f172a;
            margin: 0 0 6px 0;
            letter-spacing: -0.5px;
          }

          .admin-subtitle {
            font-size: 14px;
            color: #64748b;
            margin: 0;
            max-width: 650px;
          }

          .header-actions {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .btn-create-admin {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #1e3a8a;
            color: #ffffff;
            border: none;
            padding: 10px 18px;
            border-radius: 8px;
            font-size: 13.5px;
            font-weight: 700;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(30, 58, 138, 0.25);
            transition: all 0.2s ease;
          }

          .btn-create-admin:hover {
            background: #1e40af;
            transform: translateY(-1px);
          }

          .btn-refresh {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: #ffffff;
            color: #334155;
            border: 1px solid #cbd5e1;
            padding: 9px 14px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.15s ease;
          }

          .btn-refresh:hover {
            background: #f1f5f9;
            border-color: #94a3b8;
          }

          /* Tabs */
          .admin-nav-tabs {
            display: flex;
            gap: 8px;
            margin-bottom: 24px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 8px;
            overflow-x: auto;
          }

          .admin-tab {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 16px;
            font-size: 13.5px;
            font-weight: 600;
            color: #64748b;
            text-decoration: none;
            border-radius: 6px;
            transition: all 0.15s ease;
            white-space: nowrap;
          }

          .admin-tab:hover {
            color: #0f172a;
            background: #e2e8f0;
          }

          .admin-tab.active {
            color: #0f172a;
            background: #ffffff;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
            border: 1px solid #cbd5e1;
            font-weight: 700;
          }

          /* KPI Grid */
          .kpi-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 16px;
            margin-bottom: 24px;
          }

          .kpi-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 18px 20px;
            box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
            display: flex;
            flex-direction: column;
            gap: 6px;
          }

          .kpi-label {
            font-size: 12px;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .kpi-val {
            font-size: 28px;
            font-weight: 800;
            line-height: 1;
          }

          .text-blue { color: #2563eb; }
          .text-slate { color: #334155; }
          .text-gold { color: #d97706; }

          .root-status-val {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 15px;
            font-weight: 800;
            color: #0f172a;
            margin-top: 4px;
          }

          /* Toolbar */
          .admin-toolbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
            gap: 12px;
            flex-wrap: wrap;
          }

          .search-box {
            position: relative;
            flex: 1;
            min-width: 280px;
            max-width: 460px;
          }

          .search-box :global(.search-icon) {
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: #94a3b8;
          }

          .search-box input {
            width: 100%;
            padding: 9px 12px 9px 36px;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            font-size: 13.5px;
            background: #ffffff;
            box-sizing: border-box;
            outline: none;
          }

          .search-box input:focus {
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
          }

          .filter-group {
            display: flex;
            align-items: center;
            gap: 6px;
            background: #ffffff;
            padding: 4px;
            border-radius: 8px;
            border: 1px solid #cbd5e1;
          }

          .filter-group :global(.filter-icon) {
            color: #94a3b8;
            margin: 0 6px 0 8px;
          }

          .filter-btn {
            border: none;
            background: transparent;
            padding: 6px 12px;
            font-size: 12.5px;
            font-weight: 600;
            color: #64748b;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.15s ease;
          }

          .filter-btn:hover {
            color: #0f172a;
            background: #f1f5f9;
          }

          .filter-btn.active {
            color: #1e3a8a;
            background: #eff6ff;
            font-weight: 700;
          }

          /* Table */
          .table-wrapper {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);
            overflow-x: auto;
          }

          .admin-table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
            font-size: 13px;
          }

          .admin-table th {
            background: #f8fafc;
            padding: 12px 18px;
            color: #475569;
            font-weight: 700;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 1px solid #e2e8f0;
          }

          .admin-table td {
            padding: 14px 18px;
            border-bottom: 1px solid #f1f5f9;
            vertical-align: middle;
          }

          .admin-table tr:last-child td {
            border-bottom: none;
          }

          .admin-table tr:hover {
            background-color: #fafbfc;
          }

          .row-superadmin {
            background-color: #fffefb;
          }

          .user-name-cell {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .user-avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: #f1f5f9;
            color: #64748b;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }

          .avatar-super {
            background: #fef3c7;
            color: #b45309;
          }

          .avatar-admin {
            background: #dbeafe;
            color: #1d4ed8;
          }

          .user-full-name {
            display: block;
            font-weight: 700;
            color: #0f172a;
            font-size: 14px;
          }

          .user-email-text {
            display: block;
            font-size: 12.5px;
            color: #64748b;
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

          .badge-super {
            background: #fef3c7;
            color: #92400e;
            border: 1px solid #fde68a;
          }

          .badge-admin {
            background: #e0f2fe;
            color: #0369a1;
            border: 1px solid #bae6fd;
          }

          .badge-customer {
            background: #f1f5f9;
            color: #475569;
          }

          .phone-text,
          .date-text {
            color: #475569;
            font-weight: 500;
          }

          .root-locked-tag {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            color: #94a3b8;
            font-size: 12px;
            font-weight: 600;
            background: #f8fafc;
            padding: 4px 10px;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
          }

          .btn-grant-role {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: #ffffff;
            color: #1e3a8a;
            border: 1px solid #bfdbfe;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.15s ease;
          }

          .btn-grant-role:hover {
            background: #eff6ff;
            border-color: #93c5fd;
          }

          .btn-revoke-role {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: #fff5f5;
            color: #dc2626;
            border: 1px solid #fecaca;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.15s ease;
          }

          .btn-revoke-role:hover {
            background: #fee2e2;
            border-color: #fca5a5;
          }

          .table-empty {
            padding: 48px 20px;
            text-align: center;
            color: #94a3b8;
          }

          .spin-icon {
            animation: spin 1s linear infinite;
            margin-bottom: 8px;
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          /* Modal */
          .modal-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(15, 23, 42, 0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: 20px;
          }

          .modal-dialog {
            background: #ffffff;
            border-radius: 12px;
            width: 100%;
            max-width: 480px;
            box-shadow: 0 20px 35px rgba(0, 0, 0, 0.25);
            overflow: hidden;
            animation: scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          }

          @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.96); }
            to { opacity: 1; transform: scale(1); }
          }

          .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 18px 22px;
            border-bottom: 1px solid #e2e8f0;
          }

          .modal-title-wrap {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .modal-title-wrap h3 {
            margin: 0;
            font-size: 17px;
            font-weight: 800;
            color: #0f172a;
          }

          .modal-close-btn {
            background: transparent;
            border: none;
            color: #94a3b8;
            cursor: pointer;
            padding: 4px;
            display: flex;
            border-radius: 4px;
          }

          .modal-close-btn:hover {
            color: #0f172a;
            background: #f1f5f9;
          }

          .modal-alert-error {
            background: #fef2f2;
            color: #b91c1c;
            border-left: 4px solid #ef4444;
            padding: 10px 16px;
            font-size: 13px;
            display: flex;
            align-items: center;
            gap: 8px;
            margin: 16px 22px 0;
            border-radius: 4px;
          }

          .modal-form {
            padding: 20px 22px;
            display: flex;
            flex-direction: column;
            gap: 16px;
          }

          .form-group {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }

          .form-group label {
            font-size: 12.5px;
            font-weight: 700;
            color: #334155;
          }

          .input-wrap {
            position: relative;
            display: flex;
            align-items: center;
          }

          .input-wrap :global(.input-icon) {
            position: absolute;
            left: 12px;
            color: #94a3b8;
          }

          .input-wrap input {
            width: 100%;
            padding: 10px 12px 10px 38px;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            font-size: 13.5px;
            box-sizing: border-box;
            outline: none;
          }

          .input-wrap input:focus {
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
          }

          .form-hint {
            font-size: 11.5px;
            color: #64748b;
            margin-top: 2px;
          }

          .modal-actions {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 10px;
            padding-top: 16px;
            border-top: 1px solid #f1f5f9;
          }

          .btn-cancel {
            background: #ffffff;
            color: #64748b;
            border: 1px solid #cbd5e1;
            padding: 9px 16px;
            border-radius: 8px;
            font-size: 13.5px;
            font-weight: 600;
            cursor: pointer;
          }

          .btn-cancel:hover {
            background: #f8fafc;
            color: #0f172a;
          }

          .btn-save-admin {
            background: #1e3a8a;
            color: #ffffff;
            border: none;
            padding: 9px 20px;
            border-radius: 8px;
            font-size: 13.5px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.15s ease;
          }

          .btn-save-admin:hover {
            background: #1e40af;
          }

          .btn-save-admin:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        `}</style>
      </div>
    </div>
  );
}
