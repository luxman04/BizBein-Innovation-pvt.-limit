'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '../../../context/StoreContext';
import { categories } from '../../../data/products';
import {
  ShieldAlert,
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  ExternalLink,
  RefreshCw,
  Image as ImageIcon,
  CheckCircle,
  AlertTriangle,
  X,
  Boxes,
  Layers,
  Sparkles,
  Save,
  Tag,
  Lock
} from 'lucide-react';

const AVAILABLE_BADGES = [
  { label: 'None', value: '' },
  { label: 'Best Seller', value: 'Best Seller' },
  { label: 'Popular', value: 'Popular' },
  { label: 'Customizable', value: 'Customizable' },
  { label: 'New', value: 'New' },
  { label: 'Heavy Duty', value: 'Heavy Duty' },
  { label: 'High Speed', value: 'High Speed' },
  { label: 'Low Noise', value: 'Low Noise' },
  { label: 'Cold Storage', value: 'Cold Storage' }
];

export default function AdminProductsPage() {
  const router = useRouter();
  const { user, authLoading, showToast, refreshProducts } = useStore();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal State
  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit' | null
  const [activeProduct, setActiveProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Helper to get category standard image (locked)
  const getCategoryImage = (catId) => {
    const cat = categories.find((c) => c.id === catId);
    return cat && cat.image ? cat.image : '/prod-modular-belt.jpg';
  };

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    categoryId: 'conveyor-systems',
    brand: 'BizBein',
    price: '',
    priceDisplay: '',
    image: '/prod-modular-belt.jpg',
    unit: 'Per Section',
    badge: '',
    rating: '4.9',
    reviews: '1',
    description: '',
    specs: []
  });

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/products');
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to load catalog products.');
      }
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'admin') {
        setError('You must be signed in as an administrator to access the product management desk.');
        setLoading(false);
      } else {
        fetchProducts();
      }
    }
  }, [user, authLoading]);

  // Open Add Modal
  const handleOpenAdd = () => {
    const defaultCat = 'conveyor-systems';
    setFormData({
      name: '',
      categoryId: defaultCat,
      brand: 'BizBein',
      price: '',
      priceDisplay: '',
      image: getCategoryImage(defaultCat), // locked to category image
      unit: 'Per Section',
      badge: '',
      rating: '4.9',
      reviews: '1',
      description: '',
      specs: [
        { label: 'Frame Material', value: 'SS 304 / Heavy Gauge Steel' },
        { label: 'Warranty', value: '1 Year Industrial Warranty' }
      ]
    });
    setFormError('');
    setModalMode('add');
    setActiveProduct(null);
  };

  // Open Edit Modal
  const handleOpenEdit = (product) => {
    setFormData({
      name: product.name || '',
      categoryId: product.categoryId || 'conveyor-systems',
      brand: product.brand || 'BizBein',
      price: product.price !== undefined ? product.price.toString() : '',
      priceDisplay: product.priceDisplay || '',
      image: product.image || getCategoryImage(product.categoryId), // locked, non-editable
      unit: product.unit || 'Per Unit',
      badge: product.badge || '',
      rating: product.rating !== undefined ? product.rating.toString() : '4.9',
      reviews: product.reviews !== undefined ? product.reviews.toString() : '1',
      description: product.description || '',
      specs: Array.isArray(product.specs) ? [...product.specs] : []
    });
    setFormError('');
    setModalMode('edit');
    setActiveProduct(product);
  };

  const handleCategoryChange = (newCatId) => {
    setFormData((prev) => ({
      ...prev,
      categoryId: newCatId,
      // In add mode, auto-update image to reflect category; in edit mode, keep product's fixed image
      image: modalMode === 'add' ? getCategoryImage(newCatId) : prev.image
    }));
  };

  const handleCloseModal = () => {
    setModalMode(null);
    setActiveProduct(null);
    setFormError('');
  };

  // Spec row helpers
  const handleAddSpec = () => {
    setFormData((prev) => ({
      ...prev,
      specs: [...prev.specs, { label: '', value: '' }]
    }));
  };

  const handleRemoveSpec = (idx) => {
    setFormData((prev) => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== idx)
    }));
  };

  const handleSpecChange = (idx, field, val) => {
    setFormData((prev) => {
      const updated = [...prev.specs];
      updated[idx] = { ...updated[idx], [field]: val };
      return { ...prev, specs: updated };
    });
  };

  // Save / Update Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim()) {
      setFormError('Product title/name is required.');
      return;
    }

    const numPrice = parseFloat(formData.price);
    if (isNaN(numPrice) || numPrice < 0) {
      setFormError('Please enter a valid non-negative product price.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        categoryId: formData.categoryId,
        brand: formData.brand.trim() || 'BizBein',
        price: numPrice,
        priceDisplay: formData.priceDisplay.trim() || `₹${numPrice.toLocaleString('en-IN')} onwards`,
        unit: formData.unit.trim() || 'Per Unit',
        badge: formData.badge,
        rating: parseFloat(formData.rating) || 4.9,
        reviews: parseInt(formData.reviews, 10) || 1,
        description: formData.description.trim(),
        specs: formData.specs.filter((s) => s.label.trim() && s.value.trim())
      };

      let res;
      if (modalMode === 'add') {
        res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`/api/products/${activeProduct.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to save product.');
      }

      showToast(modalMode === 'add' ? `Product "${payload.name}" created successfully!` : `Product "${payload.name}" updated!`);
      handleCloseModal();
      fetchProducts();
      if (refreshProducts) refreshProducts();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Product
  const handleDelete = async (product) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${product.name}" from the catalog? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete product.');
      }
      showToast(`Product "${product.name}" was removed.`);
      fetchProducts();
      if (refreshProducts) refreshProducts();
    } catch (err) {
      showToast(err.message || 'Failed to remove product.', 'error');
    }
  };

  // Filtered list
  const filteredProducts = products.filter((p) => {
    const matchesCategory = categoryFilter === 'all' || p.categoryId === categoryFilter;
    const term = search.toLowerCase().trim();
    const matchesSearch =
      !term ||
      (p.name && p.name.toLowerCase().includes(term)) ||
      (p.brand && p.brand.toLowerCase().includes(term)) ||
      (p.id && p.id.toLowerCase().includes(term)) ||
      (p.category && p.category.toLowerCase().includes(term));
    return matchesCategory && matchesSearch;
  });

  if (authLoading || (loading && products.length === 0)) {
    return (
      <div className="admin-loading-container">
        <RefreshCw size={36} className="spin text-gold" />
        <p>Loading catalog administration desk...</p>
      </div>
    );
  }

  if (error && (!user || user.role !== 'admin')) {
    return (
      <div className="admin-denied-container">
        <AlertTriangle size={48} className="text-red" />
        <h2>Administrative Privileges Required</h2>
        <p>{error}</p>
        <Link href="/login?redirect=/admin/products" className="btn btn-primary">
          Sign In as Administrator
        </Link>
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
            <h1 className="admin-title">Catalog Machinery & Products Desk</h1>
            <p className="admin-subtitle">Add new machinery, rewrite product titles, and update commercial specifications (Images locked)</p>
          </div>

          <div className="header-actions">
            <button type="button" onClick={fetchProducts} className="btn-secondary">
              <RefreshCw size={15} />
              <span>Refresh</span>
            </button>
            <button type="button" onClick={handleOpenAdd} className="btn-primary-add">
              <Plus size={16} />
              <span>Add New Product</span>
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="admin-nav-tabs">
          <Link href="/admin/orders" className="admin-tab">
            <span>Commercial Orders Desk</span>
          </Link>
          <Link href="/admin/products" className="admin-tab active">
            <Boxes size={15} />
            <span>Machinery & Product Catalog ({products.length})</span>
          </Link>
        </div>

        {/* KPI Summary Cards */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <span className="kpi-label">Active Catalog Products</span>
            <strong className="kpi-val text-gold">{products.length}</strong>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Machinery Categories</span>
            <strong className="kpi-val text-blue">{categories.length}</strong>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Bestseller & Featured</span>
            <strong className="kpi-val text-amber">
              {products.filter((p) => p.badge && p.badge.length > 0).length}
            </strong>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="admin-toolbar">
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search by title, brand, model, SKU, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button type="button" onClick={() => setSearch('')} className="clear-btn">✕</button>
            )}
          </div>

          <div className="filter-group">
            <Filter size={15} className="filter-icon" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter by category"
            >
              <option value="all">All Categories ({products.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="products-table-card">
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Image</th>
                  <th>Product Details</th>
                  <th>Category</th>
                  <th>Price & Unit</th>
                  <th>Badge</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-row">
                      No products matched your search or category filter.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => (
                    <tr key={p.id}>
                      {/* Image Thumbnail */}
                      <td>
                        <div className="product-thumb-wrap">
                          <img
                            src={p.image || '/prod-modular-belt.jpg'}
                            alt={p.name}
                            className="product-thumb"
                            onError={(e) => {
                              e.currentTarget.src = '/prod-modular-belt.jpg';
                            }}
                          />
                        </div>
                      </td>

                      {/* Product Name & Brand */}
                      <td>
                        <div className="product-info-cell">
                          <strong className="product-table-title">{p.name}</strong>
                          <span className="product-table-brand">Brand: {p.brand || 'BizBein'} • ID: <code>{p.id}</code></span>
                          {p.description && (
                            <p className="product-table-desc">{p.description.slice(0, 90)}...</p>
                          )}
                        </div>
                      </td>

                      {/* Category */}
                      <td>
                        <span className="category-chip">{p.category}</span>
                      </td>

                      {/* Price & Unit */}
                      <td>
                        <div className="price-cell">
                          <strong className="price-val">₹{p.price.toLocaleString('en-IN')}</strong>
                          <span className="unit-val">{p.unit || 'Per Unit'}</span>
                        </div>
                      </td>

                      {/* Badge */}
                      <td>
                        {p.badge ? (
                          <span className={`badge-pill badge-${p.badgeType || 'bestseller'}`}>
                            {p.badge}
                          </span>
                        ) : (
                          <span className="no-badge">—</span>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td>
                        <div className="table-actions">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(p)}
                            className="btn-action edit"
                            title="Rewrite Title, Pricing & Specifications (Image Locked)"
                          >
                            <Edit3 size={15} />
                            <span>Edit</span>
                          </button>

                          <Link
                            href={`/products/${p.categoryId}/${p.id}`}
                            target="_blank"
                            className="btn-action view"
                            title="View live product page"
                          >
                            <ExternalLink size={14} />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDelete(p)}
                            className="btn-action delete"
                            title="Remove product"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {modalMode && (
        <div className="modal-backdrop" onClick={handleCloseModal}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-text">
                <span className="modal-tag">{modalMode === 'add' ? 'NEW EQUIPMENT' : 'CATALOG REVISION'}</span>
                <h2>{modalMode === 'add' ? 'Add Industrial Machinery' : `Edit: ${activeProduct?.name}`}</h2>
              </div>
              <button type="button" onClick={handleCloseModal} className="close-btn" aria-label="Close">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              {formError && (
                <div className="form-error-banner">
                  <AlertTriangle size={16} />
                  <span>{formError}</span>
                </div>
              )}

              {/* Title & Brand */}
              <div className="form-row">
                <div className="form-group flex-2">
                  <label>Product Title / Equipment Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Modular Belt Conveyor Line"
                  />
                </div>

                <div className="form-group flex-1">
                  <label>Brand / Manufacturer</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="BizBein"
                  />
                </div>
              </div>

              {/* Category & Badge */}
              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Machinery Category *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group flex-1">
                  <label>Marketing Badge / Tag</label>
                  <select
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  >
                    {AVAILABLE_BADGES.map((b) => (
                      <option key={b.value} value={b.value}>
                        {b.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Locked Product Imagery (Admin cannot change image) */}
              <div className="form-group">
                <div className="locked-image-label-row">
                  <label>Product Imagery</label>
                  <span className="locked-badge">
                    <Lock size={12} />
                    <span>Locked (Admin cannot change image)</span>
                  </span>
                </div>
                <div className="locked-image-display">
                  <div className="locked-image-preview">
                    <img
                      src={formData.image || getCategoryImage(formData.categoryId)}
                      alt="Catalog equipment preview"
                      onError={(e) => {
                        e.currentTarget.src = '/prod-modular-belt.jpg';
                      }}
                    />
                  </div>
                  <div className="locked-image-details">
                    <span className="locked-image-status">
                      {modalMode === 'add'
                        ? 'Assigned automatically from Machinery Category'
                        : 'Fixed catalog equipment imagery'}
                    </span>
                    <p className="locked-image-note">
                      To preserve factory catalog specifications, product images cannot be modified or uploaded by the administrator.
                    </p>
                    <code className="locked-image-asset">
                      Asset: {formData.image || getCategoryImage(formData.categoryId)}
                    </code>
                  </div>
                </div>
              </div>

              {/* Price & Unit */}
              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Commercial Price (₹ Numeric) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="100"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. 65000"
                  />
                </div>

                <div className="form-group flex-1">
                  <label>Unit / Pricing Basis</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="e.g. Per Section, Complete Unit, Per Meter"
                  />
                </div>

                <div className="form-group flex-1">
                  <label>Custom Display Price (Optional)</label>
                  <input
                    type="text"
                    value={formData.priceDisplay}
                    onChange={(e) => setFormData({ ...formData, priceDisplay: e.target.value })}
                    placeholder="e.g. ₹65,000 onwards"
                  />
                </div>
              </div>

              {/* Quality & Trust Metrics (Rating & Reviews) */}
              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Customer Rating (1.0 - 5.0)</label>
                  <input
                    type="number"
                    min="1.0"
                    max="5.0"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    placeholder="4.9"
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Verified Reviews Count</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={formData.reviews}
                    onChange={(e) => setFormData({ ...formData, reviews: e.target.value })}
                    placeholder="1"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label>Commercial & Engineering Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe technical capabilities, materials, throughput, and industry applications..."
                />
              </div>

              {/* Technical Specifications Key-Value Editor */}
              <div className="form-group">
                <div className="specs-header">
                  <label>Engineering Specifications</label>
                  <button type="button" onClick={handleAddSpec} className="btn-add-spec">
                    <Plus size={13} />
                    <span>Add Specification</span>
                  </button>
                </div>

                <div className="specs-editor-list">
                  {formData.specs.length === 0 ? (
                    <p className="no-specs-hint">No specifications added yet. Click "+ Add Specification" to specify belt material, motor rating, speed, etc.</p>
                  ) : (
                    formData.specs.map((spec, idx) => (
                      <div key={idx} className="spec-row">
                        <input
                          type="text"
                          value={spec.label}
                          onChange={(e) => handleSpecChange(idx, 'label', e.target.value)}
                          placeholder="Spec Name (e.g. Belt Material)"
                          className="spec-label-input"
                        />
                        <input
                          type="text"
                          value={spec.value}
                          onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                          placeholder="Value (e.g. Food-grade POM Plastic)"
                          className="spec-val-input"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSpec(idx)}
                          className="spec-remove-btn"
                          title="Remove specification"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={handleCloseModal} className="btn-modal-cancel">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="btn-modal-save">
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={15} className="spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save size={15} />
                      <span>{modalMode === 'add' ? 'Create Product' : 'Save Changes'}</span>
                    </>
                  )}
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
          padding: 36px 0 60px;
        }

        .admin-container {
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .admin-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .admin-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #eff6ff;
          color: #1e40af;
          font-size: 12px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 9999px;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .admin-title {
          font-size: 26px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 4px;
        }

        .admin-subtitle {
          font-size: 14px;
          color: #64748b;
          margin: 0;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #334155;
          font-size: 13.5px;
          font-weight: 600;
          padding: 9px 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-secondary:hover {
          background: #f1f5f9;
          border-color: #94a3b8;
        }

        .btn-primary-add {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #F8B50E;
          border: 1px solid #e09f00;
          color: #0f172a;
          font-size: 13.5px;
          font-weight: 700;
          padding: 9px 18px;
          border-radius: 8px;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(248, 181, 14, 0.3);
          transition: all 0.2s ease;
        }

        .btn-primary-add:hover {
          background: #ebb000;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(248, 181, 14, 0.4);
        }

        /* Nav Tabs */
        .admin-nav-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 24px;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 1px;
        }

        .admin-tab {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          font-size: 13.5px;
          font-weight: 600;
          color: #64748b;
          text-decoration: none;
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
        }

        .admin-tab:hover {
          color: #0f172a;
        }

        .admin-tab.active {
          color: #0f172a;
          border-bottom-color: #F8B50E;
          font-weight: 700;
        }

        /* KPI Grid */
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .kpi-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 18px 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }

        .kpi-label {
          font-size: 12.5px;
          color: #64748b;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.04em;
          display: block;
          margin-bottom: 6px;
        }

        .kpi-val {
          font-size: 26px;
          font-weight: 800;
          color: #0f172a;
          display: block;
        }

        .text-gold {
          color: #b45309;
        }

        .text-blue {
          color: #1d4ed8;
        }

        .text-amber {
          color: #d97706;
        }

        /* Toolbar */
        .admin-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .search-box {
          position: relative;
          display: flex;
          align-items: center;
          flex: 1;
          min-width: 0;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          color: #94a3b8;
          pointer-events: none;
        }

        .search-box input {
          width: 100%;
          padding: 10px 36px 10px 36px;
          border: 1.5px solid #cbd5e1;
          border-radius: 8px;
          font-size: 13.5px;
          background: #ffffff;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .search-box input:focus {
          border-color: #F8B50E;
          box-shadow: 0 0 0 3px rgba(248, 181, 14, 0.2);
        }

        .clear-btn {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
        }

        .filter-group {
          position: relative;
          display: flex;
          align-items: center;
        }

        .filter-icon {
          position: absolute;
          left: 12px;
          color: #64748b;
          pointer-events: none;
        }

        .filter-group select {
          padding: 10px 16px 10px 36px;
          border: 1.5px solid #cbd5e1;
          border-radius: 8px;
          font-size: 13.5px;
          font-weight: 500;
          background: #ffffff;
          cursor: pointer;
          outline: none;
        }

        .filter-group select:focus {
          border-color: #F8B50E;
        }

        /* Products Table */
        .products-table-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
        }

        .table-responsive {
          overflow-x: auto;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 13.5px;
        }

        .admin-table th {
          background: #f8fafc;
          color: #475569;
          font-weight: 700;
          padding: 14px 18px;
          border-bottom: 1px solid #e2e8f0;
          font-size: 12.5px;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .admin-table td {
          padding: 14px 18px;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
        }

        .admin-table tr:hover td {
          background-color: #fbfcfe;
        }

        .empty-row {
          text-align: center;
          padding: 40px;
          color: #64748b;
        }

        .product-thumb-wrap {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .product-thumb {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .product-info-cell {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .product-table-title {
          color: #0f172a;
          font-size: 14.5px;
          font-weight: 700;
        }

        .product-table-brand {
          font-size: 11.5px;
          color: #64748b;
        }

        .product-table-brand code {
          background: #f1f5f9;
          padding: 1px 4px;
          border-radius: 3px;
          font-size: 11px;
        }

        .product-table-desc {
          margin: 3px 0 0;
          font-size: 12px;
          color: #64748b;
          line-height: 1.4;
        }

        .category-chip {
          display: inline-block;
          background: #f1f5f9;
          color: #334155;
          font-size: 12px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 6px;
        }

        .price-cell {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .price-val {
          color: #0f172a;
          font-size: 14.5px;
          font-weight: 700;
        }

        .unit-val {
          font-size: 11px;
          color: #94a3b8;
        }

        .badge-pill {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .badge-bestseller, .badge-popular {
          background: #fef3c7;
          color: #92400e;
        }

        .badge-new {
          background: #dcfce7;
          color: #166534;
        }

        .no-badge {
          color: #cbd5e1;
        }

        .table-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
        }

        .btn-action {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid #cbd5e1;
          background: #ffffff;
          color: #334155;
          text-decoration: none;
          transition: all 0.15s ease;
        }

        .btn-action.edit:hover {
          border-color: #F8B50E;
          background: #fefce8;
          color: #854d0e;
        }

        .btn-action.view:hover {
          border-color: #93c5fd;
          background: #eff6ff;
          color: #1d4ed8;
        }

        .btn-action.delete:hover {
          border-color: #fca5a5;
          background: #fef2f2;
          color: #b91c1c;
        }

        /* MODAL STYLES */
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .modal-dialog {
          background: #ffffff;
          border-radius: 16px;
          width: 100%;
          max-width: 720px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          display: flex;
          flex-direction: column;
        }

        .modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid #e2e8f0;
        }

        .modal-tag {
          font-size: 11px;
          font-weight: 800;
          color: #d97706;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: block;
          margin-bottom: 4px;
        }

        .modal-header h2 {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }

        .close-btn {
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 4px;
        }

        .close-btn:hover {
          color: #0f172a;
        }

        .modal-form {
          padding: 20px 24px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-error-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #b91c1c;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 13px;
        }

        .form-row {
          display: flex;
          gap: 14px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .flex-1 {
          flex: 1;
        }

        .flex-2 {
          flex: 2;
        }

        .form-group label {
          font-size: 12.5px;
          font-weight: 700;
          color: #334155;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 9px 12px;
          border: 1.5px solid #cbd5e1;
          border-radius: 8px;
          font-size: 13.5px;
          color: #0f172a;
          background: #ffffff;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          border-color: #F8B50E;
          box-shadow: 0 0 0 3px rgba(248, 181, 14, 0.2);
        }

        .locked-image-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 4px;
        }

        .locked-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #fef2f2;
          color: #991b1b;
          border: 1px solid #fecaca;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 6px;
          letter-spacing: 0.02em;
        }

        .locked-image-display {
          display: flex;
          align-items: center;
          gap: 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 12px 14px;
        }

        .locked-image-preview {
          width: 80px;
          height: 64px;
          border-radius: 8px;
          overflow: hidden;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .locked-image-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .locked-image-details {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .locked-image-status {
          font-size: 13px;
          font-weight: 700;
          color: #1e293b;
        }

        .locked-image-note {
          font-size: 11.5px;
          color: #64748b;
          margin: 0;
          line-height: 1.35;
        }

        .locked-image-asset {
          font-size: 11px;
          font-family: monospace;
          color: #475569;
          background: #e2e8f0;
          padding: 2px 6px;
          border-radius: 4px;
          width: fit-content;
          margin-top: 2px;
        }
          color: #64748b;
        }

        .field-hint code {
          background: #f1f5f9;
          padding: 1px 4px;
          border-radius: 3px;
        }

        /* Specs Editor */
        .specs-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
        }

        .btn-add-spec {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          color: #1e3a8a;
          font-size: 11.5px;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 6px;
          cursor: pointer;
        }

        .btn-add-spec:hover {
          background: #e2e8f0;
        }

        .specs-editor-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .spec-row {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .spec-label-input {
          flex: 1;
        }

        .spec-val-input {
          flex: 2;
        }

        .spec-remove-btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          background: #f1f5f9;
          border: none;
          color: #64748b;
          cursor: pointer;
        }

        .spec-remove-btn:hover {
          background: #fee2e2;
          color: #dc2626;
        }

        .no-specs-hint {
          font-size: 12px;
          color: #94a3b8;
          font-style: italic;
          margin: 4px 0;
        }

        .modal-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          padding-top: 14px;
          border-top: 1px solid #f1f5f9;
          margin-top: 8px;
        }

        .btn-modal-cancel {
          padding: 9px 18px;
          border: 1px solid #cbd5e1;
          background: #ffffff;
          color: #475569;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
        }

        .btn-modal-cancel:hover {
          background: #f1f5f9;
        }

        .btn-modal-save {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 20px;
          background: #F8B50E;
          border: 1px solid #e09f00;
          color: #0f172a;
          font-weight: 700;
          border-radius: 8px;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(248, 181, 14, 0.3);
        }

        .btn-modal-save:hover:not(:disabled) {
          background: #ebb000;
        }

        .btn-modal-save:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Denied / Loading */
        .admin-loading-container,
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

        .text-red { color: #ef4444; }

        @media (max-width: 768px) {
          .admin-header {
            flex-direction: column;
            align-items: stretch;
          }
          .header-actions {
            flex-direction: column;
            align-items: stretch;
          }
          .btn-primary-add, .btn-secondary {
            justify-content: center;
          }
          .form-row {
            flex-direction: column;
          }
          .admin-toolbar {
            flex-direction: column;
            align-items: stretch;
          }
          .search-box {
            width: 100%;
          }
          .filter-group {
            width: 100%;
          }
          .filter-group select {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .admin-container {
            padding: 16px 12px;
          }
          .kpi-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
}
