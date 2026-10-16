'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ChevronRight,
  ArrowRight,
  ShoppingCart,
  Heart,
  Eye,
  Check,
  Zap,
  Phone,
  FileText,
  ShieldCheck,
  Truck,
  Wrench,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import {
  categories,
  getCategoryById,
  getProductsByCategory,
  companyDetails
} from '../../../data/products';
import { useStore } from '../../../context/StoreContext';

export default function CategoryProductsPage() {
  const params = useParams();
  const categorySlug = params?.category || '';

  const { addToCart, buyNow, openQuoteModal, openExpertModal, products: liveProducts } = useStore();
  const category = getCategoryById(categorySlug);

  const categoryProducts = useMemo(() => {
    const list = liveProducts || getProductsByCategory(categorySlug);
    return list.filter((p) => p.categoryId && p.categoryId.toLowerCase() === categorySlug.toLowerCase());
  }, [liveProducts, categorySlug]);
  const [wishlist, setWishlist] = useState({});
  const [addedAnimation, setAddedAnimation] = useState({});
  const [sortBy, setSortBy] = useState('featured');

  const toggleWishlist = (id) => {
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAdd = (product) => {
    addToCart(product);
    setAddedAnimation((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedAnimation((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const handleBuyNow = (product) => {
    if (buyNow) buyNow(product);
  };

  const sortedProducts = useMemo(() => {
    return [...categoryProducts].sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [categoryProducts, sortBy]);

  // If category does not exist
  if (!category) {
    return (
      <div className="not-found-container">
        <div className="container">
          <div className="not-found-card">
            <h2>Category Not Found</h2>
            <p>We could not find the category "{categorySlug}". Please explore our available machinery categories below.</p>
            <div className="categories-pill-grid">
              {categories.map((c) => (
                <Link key={c.id} href={`/products/${c.id}`} className="cat-pill-link">
                  <span>{c.name}</span>
                  <ArrowRight size={13} />
                </Link>
              ))}
            </div>
            <Link href="/products" className="btn-back-all">
              <ArrowLeft size={16} />
              <span>Back to All Equipment</span>
            </Link>
          </div>
        </div>
        <style jsx>{`
          .not-found-container {
            padding: 80px 0;
            background-color: #f8fafc;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 0 20px;
          }
          .not-found-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 40px;
            text-align: center;
          }
          h2 {
            font-size: 24px;
            color: #0f172a;
            margin-bottom: 12px;
          }
          p {
            color: #64748b;
            margin-bottom: 24px;
          }
          .categories-pill-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            justify-content: center;
            margin-bottom: 30px;
          }
          .cat-pill-link {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: #f1f5f9;
            color: #1e3a8a;
            padding: 8px 14px;
            border-radius: 9999px;
            font-size: 13px;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.15s ease;
          }
          .cat-pill-link:hover {
            background: #F8B50E;
            color: #0f172a;
          }
          .btn-back-all {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #0f172a;
            color: #ffffff;
            padding: 10px 20px;
            border-radius: 8px;
            font-weight: 600;
            text-decoration: none;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="category-detail-page">
      {/* 1. Category Hero Banner */}
      <section className="category-hero" aria-label={category.name}>
        <div className="container">
          {/* Breadcrumb */}
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/" className="crumb-link">Home</Link>
            <ChevronRight size={13} className="crumb-sep" />
            <Link href="/products" className="crumb-link">Products</Link>
            <ChevronRight size={13} className="crumb-sep" />
            <span className="crumb-active">{category.name}</span>
          </nav>

          <div className="hero-content-grid">
            <div className="hero-text">
              <span className="category-eyebrow">BIZBEIN INDUSTRIAL DIVISION</span>
              <h1 className="category-title">{category.name}</h1>
              <p className="category-desc">
                {category.description ||
                  `Explore our precision-engineered ${category.name.toLowerCase()} catalog. Built for industrial reliability, continuous duty cycles, and customized to your factory floor requirements.`}
              </p>

              {/* Trust Badges */}
              <div className="hero-trust-row">
                <div className="trust-pill">
                  <ShieldCheck size={15} className="trust-icon" />
                  <span>1-Year Heavy Duty Warranty</span>
                </div>
                <div className="trust-pill">
                  <Wrench size={15} className="trust-icon" />
                  <span>Factory Commissioning & Spares</span>
                </div>
                <div className="trust-pill">
                  <Truck size={15} className="trust-icon" />
                  <span>All-India Transport & Dispatch</span>
                </div>
              </div>
            </div>

            <div className="hero-image-wrap">
              <img
                src={category.image}
                alt={category.name}
                className="hero-cat-img"
              />
              <div className="hero-img-badge">
                <span className="badge-cat-tag">{category.tag || 'Certified Machinery'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Body with Category Switcher & Products */}
      <div className="container main-content-wrap">
        {/* Category Navigation Bar (All 8 Categories) */}
        <div className="category-switcher-bar" aria-label="Other machinery categories">
          <span className="switcher-label">Other Categories:</span>
          <div className="switcher-pills">
            <Link
              href="/products"
              className="switcher-pill"
            >
              All Products
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/products/${c.id}`}
                className={`switcher-pill ${c.id === category.id ? 'active' : ''}`}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Toolbar & Sort */}
        <div className="category-toolbar">
          <div className="toolbar-left">
            <h2 className="section-heading">
              Available Models ({sortedProducts.length})
            </h2>
            <span className="toolbar-sub">
              Direct factory pricing & custom fabrication options available.
            </span>
          </div>

          <div className="toolbar-right">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-dropdown"
              aria-label="Sort category products"
            >
              <option value="featured">Sort: Featured</option>
              <option value="rating">Sort: Highest Rated</option>
              <option value="price-asc">Sort: Price (Low to High)</option>
              <option value="price-desc">Sort: Price (High to Low)</option>
            </select>
          </div>
        </div>

        {/* Product Cards Grid — STRICTLY SHOWS ONLY THIS CATEGORY'S PRODUCTS */}
        <div className="category-products-grid">
          {sortedProducts.map((product) => {
            const isWishlisted = !!wishlist[product.id];
            const isAdded = !!addedAnimation[product.id];

            return (
              <div key={product.id} className="category-product-card">
                {/* Badge */}
                {product.badge && (
                  <div className={`product-badge badge-${product.badgeType || 'bestseller'}`}>
                    {product.badge}
                  </div>
                )}

                {/* Image */}
                <Link
                  href={`/products/${category.id}/${product.id}`}
                  className="product-img-box"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-img"
                    loading="lazy"
                  />
                </Link>

                {/* Details */}
                <div className="product-body">
                  <div className="product-meta">
                    <span className="brand-tag">{product.brand || 'BizBein'}</span>
                    <span className="cat-badge">{product.category}</span>
                  </div>

                  <h3 className="product-title">
                    <Link
                      href={`/products/${category.id}/${product.id}`}
                      className="product-link"
                    >
                      {product.name}
                    </Link>
                  </h3>

                  <div className="rating-row">
                    <span className="star">★</span>
                    <span className="rating-text">{product.rating}</span>
                    <span className="review-count">({product.reviews} reviews)</span>
                  </div>

                  {/* Technical Specifications Highlights */}
                  {product.specs && (
                    <div className="specs-table">
                      {product.specs.slice(0, 3).map((spec, i) => (
                        <div key={i} className="spec-item">
                          <span className="spec-label">{spec.label}</span>
                          <span className="spec-value">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pricing */}
                  <div className="price-container">
                    <div>
                      <div className="price-main">{product.priceDisplay}</div>
                      <div className="price-unit">{product.unit}</div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="card-actions-wrapper">
                    <div className="card-actions-primary">
                      <button
                        type="button"
                        className={`btn-add-to-cart ${isAdded ? 'btn-success' : ''}`}
                        onClick={() => handleAdd(product)}
                        title="Add to Cart"
                      >
                        {isAdded ? (
                          <>
                            <Check size={14} />
                            <span>Added!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart size={14} />
                            <span>Add to Cart</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        className="btn-buy-now"
                        onClick={() => handleBuyNow(product)}
                        title="Buy Now"
                      >
                        <Zap size={14} fill="#ffffff" />
                        <span>Buy Now</span>
                      </button>
                    </div>

                    <div className="card-actions-secondary">
                      <Link
                        href={`/products/${category.id}/${product.id}`}
                        className="btn-view-details"
                        title="View Full Specifications"
                      >
                        <Eye size={14} />
                        <span>Details</span>
                      </Link>

                      <button
                        type="button"
                        className={`btn-wishlist ${isWishlisted ? 'active' : ''}`}
                        onClick={() => toggleWishlist(product.id)}
                        aria-label="Wishlist"
                      >
                        <Heart
                          size={14}
                          fill={isWishlisted ? '#ef4444' : 'none'}
                          stroke={isWishlisted ? '#ef4444' : '#64748b'}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Commercial proposal trigger */}
                  <button
                    type="button"
                    className="btn-request-proposal"
                    onClick={() => openQuoteModal(product)}
                  >
                    Request Commercial Proposal →
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3. Engineering & Consultation Advisory Section */}
        <section className="category-advisory-banner">
          <div className="advisory-content">
            <h3 className="advisory-title">
              Need Custom Sizing or Line Integration for {category.name}?
            </h3>
            <p className="advisory-text">
              Our engineering team designs custom belt dimensions, roller widths, drive motor specifications, and turnkey integration into your current production setup.
            </p>
            <div className="advisory-actions">
              <button
                type="button"
                className="btn-advisory-quote"
                onClick={() => openQuoteModal(categoryProducts[0] || null)}
              >
                <FileText size={16} />
                <span>Request Custom Sizing Quote</span>
              </button>
              <button
                type="button"
                className="btn-advisory-call"
                onClick={openExpertModal}
              >
                <Phone size={16} />
                <span>Call Factory Engineer: {companyDetails.primaryPhone}</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .category-detail-page {
          background-color: #f8fafc;
          padding-bottom: 60px;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Hero Banner */
        .category-hero {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: #ffffff;
          padding: 26px 0 38px;
          border-bottom: 3px solid #F8B50E;
        }

        .breadcrumbs {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #94a3b8;
          margin-bottom: 20px;
        }

        .crumb-link {
          color: #cbd5e1;
          text-decoration: none;
          transition: color 0.15s ease;
        }

        .crumb-link:hover {
          color: #F8B50E;
        }

        .crumb-sep {
          color: #64748b;
        }

        .crumb-active {
          color: #F8B50E;
          font-weight: 700;
        }

        .hero-content-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 36px;
          align-items: center;
        }

        .category-eyebrow {
          display: inline-block;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #F8B50E;
          font-weight: 800;
          margin-bottom: 8px;
        }

        .category-title {
          font-size: 34px;
          font-weight: 900;
          color: #ffffff;
          margin: 0 0 12px;
          letter-spacing: -0.02em;
          line-height: 1.15;
        }

        .category-desc {
          font-size: 15px;
          color: #cbd5e1;
          line-height: 1.55;
          margin: 0 0 22px;
        }

        .hero-trust-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .trust-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 6px 12px;
          border-radius: 9999px;
          font-size: 12px;
          color: #f1f5f9;
        }

        .trust-icon {
          color: #F8B50E;
        }

        .hero-image-wrap {
          position: relative;
          background: #ffffff;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.35);
          height: 230px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .hero-cat-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .hero-img-badge {
          position: absolute;
          bottom: 12px;
          right: 12px;
          background: #F8B50E;
          color: #0f172a;
          font-size: 11px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 6px;
          text-transform: uppercase;
        }

        /* Switcher Bar */
        .category-switcher-bar {
          margin-top: 24px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          gap: 12px;
          overflow-x: auto;
        }

        .switcher-label {
          font-size: 12.5px;
          font-weight: 700;
          color: #64748b;
          white-space: nowrap;
        }

        .switcher-pills {
          display: flex;
          align-items: center;
          gap: 8px;
          overflow-x: auto;
        }

        .switcher-pill {
          background: #f1f5f9;
          color: #334155;
          font-size: 12.5px;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: 9999px;
          white-space: nowrap;
          text-decoration: none;
          transition: all 0.15s ease;
        }

        .switcher-pill:hover {
          background: #e2e8f0;
          color: #0f172a;
        }

        .switcher-pill.active {
          background: #F8B50E;
          color: #0f172a;
          font-weight: 700;
        }

        /* Toolbar */
        .category-toolbar {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin: 24px 0 16px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .section-heading {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 2px;
        }

        .toolbar-sub {
          font-size: 12.5px;
          color: #64748b;
        }

        .sort-dropdown {
          padding: 8px 12px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 13px;
          font-family: inherit;
          color: #0f172a;
          background: #ffffff;
          cursor: pointer;
        }

        /* Products Grid */
        .category-products-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
        }

        .category-product-card {
          position: relative;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .category-product-card:hover {
          border-color: #F8B50E;
          transform: translateY(-4px);
          box-shadow: 0 10px 24px rgba(248, 181, 14, 0.16);
        }

        .product-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          z-index: 5;
          font-size: 10.5px;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 4px;
          letter-spacing: 0.02em;
        }

        .badge-bestseller {
          background-color: #F8B50E;
          color: #0f172a;
        }

        .badge-popular {
          background-color: #3b82f6;
          color: #ffffff;
        }

        .badge-new {
          background-color: #10b981;
          color: #ffffff;
        }

        .product-img-box {
          position: relative;
          width: 100%;
          height: 220px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          background: #ffffff;
          overflow: hidden;
          text-decoration: none;
        }

        .product-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          transition: transform 0.3s ease;
        }

        .category-product-card:hover .product-img {
          transform: scale(1.06);
        }

        .product-body {
          padding: 16px;
          display: flex;
          flex-direction: column;
          border-top: 1px solid #f1f5f9;
          flex: 1;
        }

        .product-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }

        .brand-tag {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          background: #eff6ff;
          color: #1e40af;
          padding: 2px 7px;
          border-radius: 4px;
        }

        .cat-badge {
          font-size: 12px;
          color: #64748b;
          font-weight: 500;
        }

        .product-title {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.35;
          margin: 0 0 6px;
        }

        .product-link {
          color: inherit;
          text-decoration: none;
          transition: color 0.15s ease;
        }

        .product-link:hover {
          color: #1e3a8a;
        }

        .rating-row {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          margin-bottom: 12px;
        }

        .star {
          color: #F8B50E;
        }

        .rating-text {
          font-weight: 700;
          color: #0f172a;
        }

        .review-count {
          color: #94a3b8;
        }

        /* Specifications Table */
        .specs-table {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 10px 12px;
          margin-bottom: 14px;
        }

        .spec-item {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          margin-bottom: 4px;
          gap: 8px;
        }

        .spec-item:last-child {
          margin-bottom: 0;
        }

        .spec-label {
          color: #64748b;
        }

        .spec-value {
          font-weight: 600;
          color: #1e293b;
          text-align: right;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .price-container {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 14px;
          margin-top: auto;
        }

        .price-main {
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
        }

        .price-unit {
          font-size: 11.5px;
          color: #64748b;
        }

        /* Actions */
        .card-actions-wrapper {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 8px;
        }

        .card-actions-primary {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
        }

        .btn-add-to-cart {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          background-color: #F8B50E;
          color: #0f172a;
          border: 1px solid #F8B50E;
          padding: 8px 6px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s ease;
          white-space: nowrap;
        }

        .btn-add-to-cart:hover {
          background-color: #E5A407;
          border-color: #E5A407;
          transform: translateY(-1px);
        }

        .btn-add-to-cart.btn-success {
          background-color: #16a34a;
          border-color: #16a34a;
          color: #ffffff;
        }

        .btn-buy-now {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          background-color: #1E253D;
          color: #ffffff;
          border: 1px solid #1E253D;
          padding: 8px 6px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s ease;
          white-space: nowrap;
        }

        .btn-buy-now:hover {
          background-color: #2B3353;
          border-color: #2B3353;
          transform: translateY(-1px);
        }

        .card-actions-secondary {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .btn-view-details {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          color: #334155;
          padding: 7px 10px;
          border-radius: 6px;
          font-size: 11.5px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.15s ease;
        }

        .btn-view-details:hover {
          background: #0f172a;
          color: #ffffff;
          border-color: #0f172a;
        }

        .btn-wishlist {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          width: 32px;
          height: 31px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-wishlist:hover {
          background: #f8fafc;
        }

        .btn-wishlist.active {
          border-color: #fecaca;
          background: #fef2f2;
        }

        .btn-request-proposal {
          background: none;
          border: none;
          color: #1e3a8a;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          text-align: center;
          padding: 6px 0 2px;
          transition: color 0.15s ease;
        }

        .btn-request-proposal:hover {
          color: #F8B50E;
        }

        /* Advisory Banner */
        .category-advisory-banner {
          margin-top: 40px;
          background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
          border-radius: 14px;
          padding: 28px 32px;
          color: #ffffff;
        }

        .advisory-title {
          font-size: 20px;
          font-weight: 800;
          margin: 0 0 8px;
        }

        .advisory-text {
          font-size: 14px;
          color: #cbd5e1;
          margin: 0 0 20px;
          max-width: 820px;
          line-height: 1.5;
        }

        .advisory-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .btn-advisory-quote {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #F8B50E;
          color: #0f172a;
          border: none;
          font-size: 13px;
          font-weight: 700;
          padding: 10px 18px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-advisory-quote:hover {
          background: #E5A407;
          transform: translateY(-1px);
        }

        .btn-advisory-call {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.25);
          font-size: 13px;
          font-weight: 600;
          padding: 10px 18px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-advisory-call:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        /* Responsive Breakpoints */
        @media (max-width: 1100px) {
          .category-products-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .hero-content-grid {
            grid-template-columns: 1fr;
          }
          .hero-image-wrap {
            height: 180px;
          }
        }

        @media (max-width: 680px) {
          .category-products-grid {
            grid-template-columns: 1fr;
          }
          .category-title {
            font-size: 26px;
          }
          .advisory-actions {
            flex-direction: column;
            align-items: stretch;
          }
        }

        @media (max-width: 480px) {
          .category-title {
            font-size: 22px;
          }
          .category-hero {
            padding: 20px 0;
          }
          .card-actions-primary {
            grid-template-columns: 1fr;
            gap: 6px;
          }
          .btn-add-to-cart,
          .btn-buy-now {
            width: 100%;
            min-height: 38px;
            font-size: 13px;
          }
          .btn-view-details {
            flex: 1;
            justify-content: center;
            min-height: 36px;
            font-size: 13px;
          }
          .btn-wishlist {
            min-height: 36px;
            min-width: 40px;
          }
        }
      `}</style>
    </div>
  );
}
