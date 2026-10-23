'use client';

// BizBein Industrial Machinery Admin - 5-Slot E-Commerce Product Imagery Studio
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
  Lock,
  Upload,
  RotateCcw
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

const PRESET_CATALOG_IMAGES = [
  { label: 'Modular Belt Conveyor', url: '/prod-modular-belt.jpg' },
  { label: 'Roller Conveyor Line', url: '/prod-roller-conveyor.jpg' },
  { label: 'Industrial Air Curtain', url: '/prod-air-curtain.jpg' },
  { label: 'Continuous Inkjet Printer', url: '/prod-inkjet-printer.jpg' },
  { label: 'Vertical Band Sealer', url: '/prod-vertical-band-sealer.jpg' },
  { label: 'Industrial Gear Motor', url: '/prod-gear-motor.jpg' },
  { label: 'Packaging Machinery', url: '/bizbein-packaging.png' },
  { label: 'Automated Machinery', url: '/cat-packaging.jpg' },
  { label: 'Industrial Heavy Equipment', url: '/cat-industrial-equipment.jpg' },
  { label: 'Sensors & Laser Systems', url: '/cat-sensors.jpg' },
  { label: 'Forklift & Hydraulic Stacker', url: '/cat-forklift.jpg' },
  { label: 'PVC Strip Curtains', url: '/cat-pvc-curtains.jpg' },
  { label: 'Conveyor Drive System', url: '/cat-conveyor-modular.jpg' },
  { label: 'Belt Conveyor Unit', url: '/cat-conveyor.jpg' }
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
  const [activeSlot, setActiveSlot] = useState(0); // 0 = Main Product Image, 1..4 = Additional Images
  const [formData, setFormData] = useState({
    name: '',
    categoryId: 'conveyor-systems',
    brand: 'BizBein',
    price: '',
    priceDisplay: '',
    image: '/prod-modular-belt.jpg',
    additionalImages: ['', '', '', ''],
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
      if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
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
      image: getCategoryImage(defaultCat),
      additionalImages: ['', '', '', ''],
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
    setActiveSlot(0);
    setFormError('');
    setModalMode('add');
    setActiveProduct(null);
  };

  // Open Edit Modal
  const handleOpenEdit = (product) => {
    let extras = ['', '', '', ''];
    if (Array.isArray(product.additionalImages) && product.additionalImages.length > 0) {
      for (let i = 0; i < 4; i++) {
        extras[i] = product.additionalImages[i] || '';
      }
    } else if (Array.isArray(product.images) && product.images.length > 1) {
      for (let i = 0; i < 4; i++) {
        extras[i] = product.images[i + 1] || '';
      }
    }

    setFormData({
      name: product.name || '',
      categoryId: product.categoryId || 'conveyor-systems',
      brand: product.brand || 'BizBein',
      price: product.price !== undefined ? product.price.toString() : '',
      priceDisplay: product.priceDisplay || '',
      image: product.image || (Array.isArray(product.images) && product.images[0]) || getCategoryImage(product.categoryId),
      additionalImages: extras,
      unit: product.unit || 'Per Unit',
      badge: product.badge || '',
      rating: product.rating !== undefined ? product.rating.toString() : '4.9',
      reviews: product.reviews !== undefined ? product.reviews.toString() : '1',
      description: product.description || '',
      specs: Array.isArray(product.specs) ? [...product.specs] : []
    });
    setActiveSlot(0);
    setFormError('');
    setModalMode('edit');
    setActiveProduct(product);
  };

  const handleCategoryChange = (newCatId) => {
    setFormData((prev) => ({
      ...prev,
      categoryId: newCatId,
      image: modalMode === 'add' && !prev.image ? getCategoryImage(newCatId) : prev.image
    }));
  };

  const handleCloseModal = () => {
    setModalMode(null);
    setActiveProduct(null);
    setActiveSlot(0);
    setFormError('');
  };

  // Slot helpers for up to 5 images (Slot 0 = Main Image, Slots 1-4 = Additional Images)
  const getSlotImage = (slotIdx) => {
    if (slotIdx === 0) {
      return formData.image || getCategoryImage(formData.categoryId);
    }
    return (formData.additionalImages && formData.additionalImages[slotIdx - 1]) || '';
  };

  const setSlotImage = (slotIdx, newUrl) => {
    if (slotIdx === 0) {
      setFormData((prev) => ({ ...prev, image: newUrl }));
    } else {
      setFormData((prev) => {
        const nextExtras = [...(prev.additionalImages || ['', '', '', ''])];
        nextExtras[slotIdx - 1] = newUrl;
        return { ...prev, additionalImages: nextExtras };
      });
    }
  };

  const clearSlotImage = (slotIdx) => {
    if (slotIdx === 0) {
      setFormData((prev) => ({ ...prev, image: getCategoryImage(prev.categoryId) }));
    } else {
      setFormData((prev) => {
        const nextExtras = [...(prev.additionalImages || ['', '', '', ''])];
        nextExtras[slotIdx - 1] = '';
        return { ...prev, additionalImages: nextExtras };
      });
    }
  };

  // Client-side image compression to ensure fast uploads & prevent 413 Payload Too Large
  const compressImageFile = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.82) => {
    return new Promise((resolve) => {
      if (!file) {
        resolve(null);
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = () => resolve(event.target.result);
        img.src = event.target.result;
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  };

  const compressDataUrlIfNeeded = async (dataUrl) => {
    if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
      return dataUrl;
    }
    if (dataUrl.length < 250000) return dataUrl; // Already compressed (<250KB)

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        const maxWidth = 1200;
        const maxHeight = 1200;
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  };

  const handleImageFileUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    try {
      const dataUrl = await compressImageFile(file);
      if (dataUrl) {
        setSlotImage(activeSlot, dataUrl);
        setFormError('');
      } else {
        setFormError('Failed to process image file.');
      }
    } catch (_) {
      setFormError('Error processing image file.');
    }
    e.target.value = '';
  };

  const handleMultipleFilesUpload = async (e) => {
    const files = Array.from(e.target.files || []).slice(0, 5);
    if (files.length === 0) return;

    try {
      const readPromises = files.map((file) => compressImageFile(file));
      const results = await Promise.all(readPromises);
      const validResults = results.filter(Boolean);

      if (validResults.length === 0) {
        setFormError('Failed to read image files.');
        return;
      }

      setFormData((prev) => {
        const nextExtras = [...(prev.additionalImages || ['', '', '', ''])];
        const mainImage = validResults[0] || prev.image;
        for (let i = 1; i < validResults.length && i < 5; i++) {
          nextExtras[i - 1] = validResults[i];
        }
        return {
          ...prev,
          image: mainImage,
          additionalImages: nextExtras
        };
      });
      setFormError('');
      setActiveSlot(0);
    } catch (_) {
      setFormError('Error processing images.');
    }
    e.target.value = '';
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
      let rawMain = formData.image && formData.image.trim() ? formData.image.trim() : getCategoryImage(formData.categoryId);
      const mainImg = await compressDataUrlIfNeeded(rawMain);

      const rawAdditional = Array.isArray(formData.additionalImages)
        ? formData.additionalImages.map((s) => (typeof s === 'string' ? s.trim() : '')).filter(Boolean).slice(0, 4)
        : [];
      const validAdditional = await Promise.all(rawAdditional.map((img) => compressDataUrlIfNeeded(img)));
      const allImages = [mainImg, ...validAdditional].slice(0, 5);

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
        specs: formData.specs.filter((s) => s.label.trim() && s.value.trim()),
        image: mainImg,
        additionalImages: validAdditional,
        images: allImages
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

      let result;
      const resText = await res.text();
      try {
        result = JSON.parse(resText);
      } catch (_) {
        result = { error: res.status === 413 ? 'Image size is too large for the server. Compressing...' : resText };
      }

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
            <p className="admin-subtitle">Add new machinery, configure up to 5 gallery images (1 main + 4 thumbnails), and update commercial specifications</p>
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
          {user?.role === 'superadmin' && (
            <Link href="/admin/admins" className="admin-tab">
              <span>Admin & Access Control</span>
            </Link>
          )}
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
                          {((p.additionalImages && p.additionalImages.length > 0) || (p.images && p.images.length > 1)) && (
                            <span
                              className="gallery-count-badge"
                              title={`${1 + (p.additionalImages ? p.additionalImages.length : p.images.length - 1)} images in product gallery`}
                            >
                              {1 + (p.additionalImages ? p.additionalImages.length : p.images.length - 1)}
                            </span>
                          )}
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
                            title="Edit Product Details, Pricing & Imagery"
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

              {/* Product Imagery Management: Standard E-Commerce Product Gallery (Max 5 Images) */}
              <div className="form-group product-imagery-group">
                <div className="image-control-header">
                  <div className="gallery-header-left">
                    <label>Product Imagery Gallery (Max 5 Images) *</label>
                    <span className="gallery-counter-pill">
                      {[getSlotImage(0), ...formData.additionalImages].filter(Boolean).length} / 5 Active
                    </span>
                  </div>
                  <div className="gallery-header-right">
                    <label className="btn-batch-upload" title="Select up to 5 photos from your device at once">
                      <Upload size={13} />
                      <span>Upload All 5 Photos at Once</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleMultipleFilesUpload}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                </div>

                <div className="ecommerce-gallery-studio">
                  {/* Left Column: Vertical Thumbnails Strip (Standard E-Commerce Gallery) */}
                  <div className="gallery-thumbs-strip" aria-label="5-Slot Product Gallery Navigation">
                    <span className="strip-title">
                      Thumbnails ({[getSlotImage(0), ...formData.additionalImages].filter(Boolean).length}/5)
                    </span>
                    <div className="strip-slots-list">
                      {[0, 1, 2, 3, 4].map((slotIdx) => {
                        const isMain = slotIdx === 0;
                        const imgUrl = getSlotImage(slotIdx);
                        const isActive = activeSlot === slotIdx;
                        const hasImage = Boolean(imgUrl && String(imgUrl).trim());

                        return (
                          <button
                            key={slotIdx}
                            type="button"
                            className={`gallery-thumb-slot ${isActive ? 'active' : ''} ${hasImage ? 'has-img' : 'is-empty'} ${isMain ? 'is-main-slot' : ''}`}
                            onClick={() => setActiveSlot(slotIdx)}
                            title={isMain ? 'Main Primary Product Photo (Catalog Cover)' : `Additional Image #${slotIdx} (Thumbnail)`}
                          >
                            {hasImage ? (
                              <div className="slot-img-wrap">
                                <img
                                  src={imgUrl}
                                  alt={isMain ? 'Main Product Photo' : `Product Thumbnail ${slotIdx}`}
                                  onError={(e) => {
                                    e.currentTarget.src = '/prod-modular-belt.jpg';
                                  }}
                                />
                                <span className={`slot-tag ${isMain ? 'tag-main' : 'tag-sub'}`}>
                                  {isMain ? 'MAIN' : `#${slotIdx + 1}`}
                                </span>
                              </div>
                            ) : (
                              <div className="slot-empty-wrap">
                                <Plus size={14} className="slot-plus-icon" />
                                <span className="slot-empty-text">{isMain ? 'Main' : `+Img ${slotIdx + 1}`}</span>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    <p className="strip-hint">Click thumbnail to edit</p>
                  </div>

                  {/* Right Column: Active Slot Stage Preview & Controls */}
                  <div className="gallery-stage-column">
                    <div className="stage-preview-header">
                      <div className="stage-title-wrap">
                        <span className={`slot-badge ${activeSlot === 0 ? 'slot-badge-main' : 'slot-badge-sub'}`}>
                          {activeSlot === 0
                            ? '★ Primary Product Photo (Main Cover)'
                            : `📷 Additional Thumbnail #${activeSlot} (Slot ${activeSlot + 1} of 5)`}
                        </span>
                        <span className="slot-sub-info">
                          {activeSlot === 0
                            ? 'Primary photo shown in catalog cards and live product stage'
                            : 'Displayed as a small thumbnail beside the main photo in the gallery'}
                        </span>
                      </div>
                    </div>

                    <div className="stage-large-display">
                      <div className="stage-img-canvas">
                        {formData.badge && (
                          <div className={`stage-corner-badge badge-${formData.badgeType || 'bestseller'}`}>
                            {formData.badge}
                          </div>
                        )}
                        {getSlotImage(activeSlot) ? (
                          <img
                            src={getSlotImage(activeSlot)}
                            alt="Active product view"
                            className="stage-featured-img"
                            onError={(e) => {
                              e.currentTarget.src = '/prod-modular-belt.jpg';
                            }}
                          />
                        ) : (
                          <label className="stage-placeholder-box clickable-upload" title="Click to choose a photo for this slot">
                            <ImageIcon size={32} className="placeholder-icon" />
                            <strong>Empty Photo Slot #{activeSlot + 1}</strong>
                            <p>Click here or click "Upload Photo" below to select an image</p>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageFileUpload}
                              style={{ display: 'none' }}
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Slot URL & Upload Controls */}
                    <div className="stage-controls-card">
                      <div className="stage-input-row">
                        <input
                          type="text"
                          value={activeSlot === 0 ? formData.image : (formData.additionalImages[activeSlot - 1] || '')}
                          onChange={(e) => setSlotImage(activeSlot, e.target.value)}
                          placeholder={
                            activeSlot === 0
                              ? 'Main image URL (e.g. /prod-roller-conveyor.jpg or https://...)'
                              : `Additional Image #${activeSlot} URL or choose file...`
                          }
                          className="image-url-input"
                        />

                        <label className="btn-upload-file" title="Upload image from computer or phone">
                          <Upload size={14} />
                          <span>Upload Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageFileUpload}
                            style={{ display: 'none' }}
                          />
                        </label>

                        {activeSlot === 0 ? (
                          <button
                            type="button"
                            className="btn-reset-image"
                            onClick={() => clearSlotImage(0)}
                            title="Reset to category standard image"
                          >
                            <RotateCcw size={13} />
                            <span>Default</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn-remove-slot"
                            onClick={() => clearSlotImage(activeSlot)}
                            title="Clear this additional image slot"
                            disabled={!getSlotImage(activeSlot)}
                          >
                            <X size={14} />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>

                      {/* Machinery Equipment Preset Pickers */}
                      <div className="preset-images-section">
                        <span className="preset-title">Assign Equipment Preset to Slot {activeSlot + 1}:</span>
                        <div className="preset-pills-row">
                          {PRESET_CATALOG_IMAGES.map((preset) => {
                            const isSelected = getSlotImage(activeSlot) === preset.url;
                            return (
                              <button
                                key={preset.url}
                                type="button"
                                className={`preset-pill ${isSelected ? 'active' : ''}`}
                                onClick={() => setSlotImage(activeSlot, preset.url)}
                                title={preset.url}
                              >
                                {preset.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
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
          position: relative;
        }

        .gallery-count-badge {
          position: absolute;
          bottom: 2px;
          right: 2px;
          background: rgba(15, 23, 42, 0.88);
          color: #F8B50E;
          font-size: 9.5px;
          font-weight: 800;
          padding: 1px 4px;
          border-radius: 4px;
          line-height: 1.2;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
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

        .gallery-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .gallery-counter-pill {
          background: #eff6ff;
          color: #1d4ed8;
          border: 1px solid #bfdbfe;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 9999px;
        }

        .image-control-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
          flex-wrap: wrap;
          gap: 8px;
        }

        .gallery-header-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-batch-upload {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #fefce8;
          color: #854d0e;
          border: 1.5px solid #fde047;
          padding: 5px 11px;
          border-radius: 7px;
          font-size: 11.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-batch-upload:hover {
          background: #fef08a;
          border-color: #F8B50E;
          transform: translateY(-1px);
        }

        .editable-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #ecfdf5;
          color: #065f46;
          border: 1px solid #a7f3d0;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 6px;
        }

        /* 5-SLOT E-COMMERCE PRODUCT GALLERY STUDIO */
        .ecommerce-gallery-studio {
          display: flex;
          gap: 16px;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 14px;
          padding: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
        }

        /* Left Column: Vertical Thumbnails Strip (Matching Live Product Stage) */
        .gallery-thumbs-strip {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 84px;
          flex-shrink: 0;
        }

        .strip-title {
          font-size: 10px;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          text-align: center;
        }

        .strip-slots-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .gallery-thumb-slot {
          width: 80px;
          height: 80px;
          border-radius: 10px;
          overflow: hidden;
          background: #ffffff;
          border: 2px solid #cbd5e1;
          cursor: pointer;
          padding: 0;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.18s ease;
          outline: none;
        }

        .gallery-thumb-slot:hover {
          border-color: #94a3b8;
          transform: translateY(-1px);
        }

        .gallery-thumb-slot.active {
          border-color: #F8B50E !important;
          box-shadow: 0 0 0 3px rgba(248, 181, 14, 0.35);
          transform: translateY(-1px);
        }

        .gallery-thumb-slot.is-main-slot {
          border-width: 2px;
        }

        .slot-img-wrap {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .slot-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .slot-tag {
          position: absolute;
          top: 3px;
          left: 3px;
          font-size: 9px;
          font-weight: 800;
          padding: 1px 4px;
          border-radius: 4px;
          letter-spacing: 0.03em;
        }

        .tag-main {
          background: #0f172a;
          color: #F8B50E;
        }

        .tag-sub {
          background: rgba(15, 23, 42, 0.75);
          color: #ffffff;
        }

        .slot-empty-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          width: 100%;
          height: 100%;
          background: #ffffff;
          border: 1.5px dashed #cbd5e1;
          border-radius: 8px;
        }

        .slot-plus-icon {
          color: #94a3b8;
        }

        .slot-empty-text {
          font-size: 9.5px;
          font-weight: 700;
          color: #64748b;
        }

        .strip-hint {
          font-size: 10px;
          color: #94a3b8;
          text-align: center;
          margin: 2px 0 0;
          line-height: 1.2;
        }

        /* Right Column: Stage Preview & Controls */
        .gallery-stage-column {
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex: 1;
          min-width: 0;
        }

        .stage-preview-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .stage-title-wrap {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .slot-badge {
          font-size: 12px;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        .slot-badge-main {
          color: #b45309;
        }

        .slot-badge-sub {
          color: #0369a1;
        }

        .slot-sub-info {
          font-size: 11px;
          color: #64748b;
        }

        .stage-large-display {
          width: 100%;
          height: 220px;
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.02);
        }

        .stage-img-canvas {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 8px;
        }

        .stage-featured-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          border-radius: 6px;
        }

        .stage-corner-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #0284c7;
          color: #ffffff;
          font-size: 10px;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          z-index: 2;
        }

        .stage-placeholder-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: #64748b;
          padding: 20px;
          gap: 4px;
        }

        .stage-placeholder-box.clickable-upload {
          cursor: pointer;
          width: 100%;
          height: 100%;
          transition: background-color 0.15s ease;
        }

        .stage-placeholder-box.clickable-upload:hover {
          background-color: #f1f5f9;
        }

        .stage-placeholder-box.clickable-upload:hover strong {
          color: #b45309;
        }

        .stage-placeholder-box strong {
          font-size: 13px;
          color: #334155;
        }

        .stage-placeholder-box p {
          font-size: 11.5px;
          color: #94a3b8;
          margin: 0;
        }

        .placeholder-icon {
          color: #cbd5e1;
          margin-bottom: 4px;
        }

        .stage-controls-card {
          display: flex;
          flex-direction: column;
          gap: 10px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 12px 14px;
        }

        .stage-input-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .image-url-input {
          flex: 1;
          min-width: 220px;
          padding: 8px 12px !important;
          border-radius: 7px !important;
          font-size: 13px !important;
        }

        .btn-upload-file {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #1e293b;
          color: #ffffff;
          border: 1px solid #0f172a;
          padding: 8px 12px;
          border-radius: 7px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s ease;
        }

        .btn-upload-file:hover {
          background: #334155;
          transform: translateY(-1px);
        }

        .btn-reset-image {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #ffffff;
          border: 1.5px solid #cbd5e1;
          color: #475569;
          padding: 8px 10px;
          border-radius: 7px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s ease;
        }

        .btn-reset-image:hover {
          border-color: #F8B50E;
          color: #d97706;
          background: #fffbeb;
        }

        .btn-remove-slot {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #ffffff;
          border: 1.5px solid #fca5a5;
          color: #dc2626;
          padding: 8px 10px;
          border-radius: 7px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s ease;
        }

        .btn-remove-slot:hover:not(:disabled) {
          background: #fef2f2;
          border-color: #ef4444;
        }

        .btn-remove-slot:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          border-color: #e2e8f0;
          color: #94a3b8;
        }

        .preset-images-section {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .preset-title {
          font-size: 11px;
          font-weight: 700;
          color: #475569;
        }

        .preset-pills-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          max-height: 85px;
          overflow-y: auto;
          padding: 2px;
        }

        .preset-pill {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          color: #334155;
          padding: 4px 8px;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
        }

        .preset-pill:hover {
          background: #f1f5f9;
          border-color: #94a3b8;
        }

        .preset-pill.active {
          background: #fef3c7;
          border-color: #F8B50E;
          color: #92400e;
          font-weight: 700;
        }

        @media (max-width: 640px) {
          .ecommerce-gallery-studio {
            flex-direction: column;
          }
          .gallery-thumbs-strip {
            width: 100%;
          }
          .strip-slots-list {
            flex-direction: row;
            overflow-x: auto;
            padding-bottom: 4px;
          }
          .gallery-thumb-slot {
            width: 64px;
            height: 64px;
            flex-shrink: 0;
          }
          .stage-large-display {
            height: 180px;
          }
        }

        .field-hint {
          font-size: 11px;
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
