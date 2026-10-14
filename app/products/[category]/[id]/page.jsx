'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ChevronRight,
  ArrowLeft,
  ShoppingCart,
  Heart,
  Check,
  Phone,
  FileText,
  ShieldCheck,
  Truck,
  Wrench,
  Clock,
  Sparkles,
  Share2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  getProductById,
  getCategoryById,
  getProductsByCategory,
  companyDetails
} from '../../../../data/products';
import { useStore } from '../../../../context/StoreContext';
import WhatsAppIcon from '../../../../components/WhatsAppIcon';

export default function ProductDetailPage() {
  const params = useParams();
  const categorySlug = params?.category || '';
  const productId = params?.id || '';

  const product = getProductById(productId);
  const category = getCategoryById(categorySlug) || (product ? getCategoryById(product.categoryId) : null);

  const { addToCart, openQuoteModal, openExpertModal } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // Related products in the same category
  const relatedProducts = product
    ? getProductsByCategory(product.categoryId)
        .filter((p) => p.id !== product.id)
        .slice(0, 3)
    : [];

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleWhatsAppInquiry = () => {
    if (!product) return;
    const msg = encodeURIComponent(
      `Hello BizBein Innovations! I am interested in *${product.name}* (${product.brand}, Price: ${product.priceDisplay}). Please provide commercial availability and dispatch quotation.`
    );
    window.open(`https://wa.me/${companyDetails.whatsappRaw}?text=${msg}`, '_blank');
  };

  if (!product) {
    return (
      <div className="product-not-found">
        <div className="container">
          <div className="not-found-card">
            <h2>Equipment Not Found</h2>
            <p>The requested machinery model could not be found or has been updated.</p>
            <Link href="/products" className="btn-back">
              <ArrowLeft size={16} />
              <span>Browse All Machinery</span>
            </Link>
          </div>
        </div>
        <style jsx>{`
          .product-not-found {
            padding: 80px 0;
            background: #f8fafc;
            min-height: 60vh;
          }
          .container {
            max-width: 600px;
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
          .btn-back {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #F8B50E;
            color: #0f172a;
            padding: 10px 20px;
            border-radius: 8px;
            font-weight: 700;
            text-decoration: none;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      {/* 1. Breadcrumbs */}
      <div className="breadcrumb-strip">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/" className="crumb-link">Home</Link>
            <ChevronRight size={13} className="crumb-sep" />
            <Link href="/products" className="crumb-link">Products</Link>
            {category && (
              <>
                <ChevronRight size={13} className="crumb-sep" />
                <Link href={`/products/${category.id}`} className="crumb-link">
                  {category.name}
                </Link>
              </>
            )}
            <ChevronRight size={13} className="crumb-sep" />
            <span className="crumb-active">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* 2. Main Product Showcase */}
      <div className="container main-content-wrap">
        <div className="product-showcase-grid">
          {/* Left Column: Image Viewer */}
          <div className="showcase-left">
            <div className="image-stage">
              {product.badge && (
                <div className={`product-badge badge-${product.badgeType || 'bestseller'}`}>
                  {product.badge}
                </div>
              )}
              <img
                src={product.image}
                alt={product.name}
                className="main-product-image"
              />
              <div className="image-qa-seal">
                <CheckCircle2 size={14} className="qa-icon" />
                <span>100% Factory QA Tested</span>
              </div>
            </div>

            {/* Quick Guarantees Under Image */}
            <div className="guarantees-grid">
              <div className="guarantee-card">
                <ShieldCheck size={20} className="guar-icon" />
                <div>
                  <div className="guar-title">1-Year Warranty</div>
                  <div className="guar-sub">Standard comprehensive coverage</div>
                </div>
              </div>

              <div className="guarantee-card">
                <Truck size={20} className="guar-icon" />
                <div>
                  <div className="guar-title">Pan-India Dispatch</div>
                  <div className="guar-sub">Ex-Works Zirakpur, Punjab</div>
                </div>
              </div>

              <div className="guarantee-card">
                <Wrench size={20} className="guar-icon" />
                <div>
                  <div className="guar-title">On-Site Commissioning</div>
                  <div className="guar-sub">Trained factory engineers</div>
                </div>
              </div>

              <div className="guarantee-card">
                <Clock size={20} className="guar-icon" />
                <div>
                  <div className="guar-title">Spares Readily Available</div>
                  <div className="guar-sub">24/48 hr dispatch on stock parts</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Information, Pricing, Actions */}
          <div className="showcase-right">
            {/* Meta Row: Brand, Category, Rating */}
            <div className="top-meta-row">
              <span className="brand-pill">{product.brand || 'BizBein'}</span>
              {category && (
                <Link href={`/products/${category.id}`} className="cat-pill-link">
                  {category.name}
                </Link>
              )}
            </div>

            <h1 className="product-title">{product.name}</h1>

            <div className="rating-row">
              <div className="stars">
                {'★'.repeat(Math.round(product.rating || 5))}
              </div>
              <span className="rating-score">{product.rating}</span>
              <span className="rating-count">({product.reviews} customer reviews)</span>
              <span className="verified-badge">✓ Verified Industrial Equipment</span>
            </div>

            {/* Price Box */}
            <div className="price-box">
              <div className="price-headline">
                <span className="price-val">{product.priceDisplay}</span>
                <span className="price-unit">/ {product.unit}</span>
              </div>
              <div className="price-tax-note">
                Ex-Works Zirakpur • GST extra as applicable • Bulk quantity discounts available
              </div>
            </div>

            {/* Product Overview Description */}
            <div className="overview-block">
              <h3 className="section-label">Equipment Overview</h3>
              <p className="overview-text">
                {product.description ||
                  `The ${product.name} is engineered to industrial standards by ${product.brand}. Designed for rugged high-throughput performance, low operational downtime, and seamless line integration.`}
              </p>
            </div>

            {/* Key Technical Specs Quick Table */}
            {product.specs && product.specs.length > 0 && (
              <div className="key-specs-card">
                <h3 className="section-label">Key Technical Specifications</h3>
                <div className="specs-list">
                  {product.specs.map((spec, index) => (
                    <div key={index} className="spec-row">
                      <span className="spec-name">{spec.label}</span>
                      <span className="spec-dots"></span>
                      <span className="spec-val">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Action Buttons */}
            <div className="purchase-controls">
              <div className="qty-picker">
                <span className="qty-label">Quantity:</span>
                <div className="qty-counter">
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="qty-value">{quantity}</span>
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="cta-button-row">
                <button
                  type="button"
                  className={`btn-add-cart ${isAdded ? 'btn-success' : ''}`}
                  onClick={handleAddToCart}
                >
                  {isAdded ? (
                    <>
                      <Check size={18} />
                      <span>Added to Inquiry Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={18} />
                      <span>Add to Cart ({quantity})</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="btn-request-quote"
                  onClick={() => openQuoteModal(product)}
                >
                  <FileText size={18} />
                  <span>Request Official Quotation</span>
                </button>
              </div>

              {/* Direct WhatsApp Contact Button */}
              <div className="direct-contact-row">
                <button
                  type="button"
                  className="btn-whatsapp-direct"
                  onClick={handleWhatsAppInquiry}
                >
                  <WhatsAppIcon size={18} color="#ffffff" />
                  <span>Chat on WhatsApp with Machine Specialist</span>
                </button>

                <button
                  type="button"
                  className="btn-call-direct"
                  onClick={openExpertModal}
                >
                  <Phone size={16} />
                  <span>Call: {companyDetails.primaryPhone}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Related Products in Same Category */}
        {relatedProducts.length > 0 && (
          <div className="related-equipment-section">
            <div className="related-header">
              <div>
                <h2 className="related-title">Related Machinery in {category?.name || 'this category'}</h2>
                <p className="related-subtitle">Compatible conveyor lines, sealing units, and accessories.</p>
              </div>
              {category && (
                <Link href={`/products/${category.id}`} className="view-cat-link">
                  <span>View All {category.name}</span>
                  <ChevronRight size={14} />
                </Link>
              )}
            </div>

            <div className="related-grid">
              {relatedProducts.map((rel) => (
                <div key={rel.id} className="related-card">
                  <Link href={`/products/${rel.categoryId}/${rel.id}`} className="rel-img-wrap">
                    <img src={rel.image} alt={rel.name} className="rel-img" loading="lazy" />
                  </Link>
                  <div className="rel-body">
                    <span className="rel-brand">{rel.brand || 'BizBein'}</span>
                    <h3 className="rel-name">
                      <Link href={`/products/${rel.categoryId}/${rel.id}`}>{rel.name}</Link>
                    </h3>
                    <div className="rel-price">{rel.priceDisplay}</div>
                    <Link
                      href={`/products/${rel.categoryId}/${rel.id}`}
                      className="rel-btn-view"
                    >
                      View Specifications →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .product-detail-page {
          background-color: #f8fafc;
          padding-bottom: 70px;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Breadcrumb Strip */
        .breadcrumb-strip {
          background-color: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          padding: 14px 0;
        }

        .breadcrumbs {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #64748b;
          flex-wrap: wrap;
        }

        .crumb-link {
          color: #1e3a8a;
          text-decoration: none;
          transition: color 0.15s ease;
        }

        .crumb-link:hover {
          color: #F8B50E;
        }

        .crumb-sep {
          color: #94a3b8;
        }

        .crumb-active {
          color: #0f172a;
          font-weight: 600;
        }

        /* Main Content */
        .main-content-wrap {
          margin-top: 28px;
        }

        .product-showcase-grid {
          display: grid;
          grid-template-columns: 1fr 1.25fr;
          gap: 36px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        /* Left Column */
        .showcase-left {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .image-stage {
          position: relative;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          height: 380px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          overflow: hidden;
        }

        .main-product-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          transition: transform 0.3s ease;
        }

        .image-stage:hover .main-product-image {
          transform: scale(1.05);
        }

        .product-badge {
          position: absolute;
          top: 14px;
          left: 14px;
          z-index: 5;
          font-size: 11px;
          font-weight: 800;
          padding: 4px 10px;
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

        .image-qa-seal {
          position: absolute;
          bottom: 12px;
          left: 12px;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #166534;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 4px;
        }

        .qa-icon {
          color: #16a34a;
        }

        .guarantees-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .guarantee-card {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 12px;
        }

        .guar-icon {
          color: #1e3a8a;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .guar-title {
          font-size: 12px;
          font-weight: 700;
          color: #0f172a;
        }

        .guar-sub {
          font-size: 11px;
          color: #64748b;
          margin-top: 2px;
        }

        /* Right Column */
        .showcase-right {
          display: flex;
          flex-direction: column;
        }

        .top-meta-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }

        .brand-pill {
          background: #eff6ff;
          color: #1e40af;
          font-size: 11.5px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 3px 8px;
          border-radius: 4px;
        }

        .cat-pill-link {
          font-size: 12.5px;
          color: #64748b;
          text-decoration: none;
          font-weight: 600;
        }

        .cat-pill-link:hover {
          color: #F8B50E;
        }

        .product-title {
          font-size: 28px;
          font-weight: 900;
          color: #0f172a;
          line-height: 1.25;
          margin: 0 0 10px;
          letter-spacing: -0.01em;
        }

        .rating-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          margin-bottom: 18px;
          flex-wrap: wrap;
        }

        .stars {
          color: #F8B50E;
          letter-spacing: 2px;
        }

        .rating-score {
          font-weight: 800;
          color: #0f172a;
        }

        .rating-count {
          color: #64748b;
        }

        .verified-badge {
          background: #ecfdf5;
          color: #047857;
          font-size: 11.5px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 4px;
        }

        /* Price Box */
        .price-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-left: 4px solid #F8B50E;
          border-radius: 8px;
          padding: 16px 20px;
          margin-bottom: 20px;
        }

        .price-headline {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }

        .price-val {
          font-size: 26px;
          font-weight: 900;
          color: #0f172a;
        }

        .price-unit {
          font-size: 14px;
          color: #64748b;
          font-weight: 600;
        }

        .price-tax-note {
          font-size: 12px;
          color: #64748b;
          margin-top: 4px;
        }

        /* Overview */
        .overview-block {
          margin-bottom: 20px;
        }

        .section-label {
          font-size: 13px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #0f172a;
          margin: 0 0 8px;
        }

        .overview-text {
          font-size: 14px;
          line-height: 1.6;
          color: #334155;
          margin: 0;
        }

        /* Key Specs */
        .key-specs-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
        }

        .specs-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .spec-row {
          display: flex;
          align-items: baseline;
          font-size: 13px;
          gap: 8px;
        }

        .spec-name {
          color: #64748b;
          font-weight: 500;
          white-space: nowrap;
        }

        .spec-dots {
          flex: 1;
          border-bottom: 1px dotted #cbd5e1;
        }

        .spec-val {
          font-weight: 700;
          color: #0f172a;
          white-space: nowrap;
        }

        /* Controls */
        .purchase-controls {
          display: flex;
          flex-direction: column;
          gap: 14px;
          border-top: 1px solid #f1f5f9;
          padding-top: 20px;
        }

        .qty-picker {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .qty-label {
          font-size: 13.5px;
          font-weight: 700;
          color: #0f172a;
        }

        .qty-counter {
          display: inline-flex;
          align-items: center;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          overflow: hidden;
        }

        .qty-btn {
          background: #f8fafc;
          border: none;
          width: 34px;
          height: 34px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          color: #0f172a;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .qty-btn:hover {
          background: #e2e8f0;
        }

        .qty-value {
          width: 40px;
          text-align: center;
          font-size: 14px;
          font-weight: 800;
          color: #0f172a;
        }

        .cta-button-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .btn-add-cart {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background-color: #F8B50E;
          color: #0f172a;
          border: none;
          padding: 12px 18px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s ease;
        }

        .btn-add-cart:hover {
          background-color: #E5A407;
          transform: translateY(-1px);
        }

        .btn-add-cart.btn-success {
          background-color: #16a34a;
          color: #ffffff;
        }

        .btn-request-quote {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #0f172a;
          color: #ffffff;
          border: none;
          padding: 12px 18px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s ease;
        }

        .btn-request-quote:hover {
          background: #1e293b;
          transform: translateY(-1px);
        }

        .direct-contact-row {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 10px;
          margin-top: 4px;
        }

        .btn-whatsapp-direct {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background-color: #25D366;
          color: #ffffff;
          border: none;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s ease;
        }

        .btn-whatsapp-direct:hover {
          background-color: #1EBE5D;
        }

        .btn-call-direct {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          color: #0f172a;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s ease;
        }

        .btn-call-direct:hover {
          background: #e2e8f0;
        }

        /* Related Section */
        .related-equipment-section {
          margin-top: 50px;
        }

        .related-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .related-title {
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 4px;
        }

        .related-subtitle {
          font-size: 13.5px;
          color: #64748b;
          margin: 0;
        }

        .view-cat-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #1e3a8a;
          font-weight: 700;
          font-size: 13.5px;
          text-decoration: none;
        }

        .view-cat-link:hover {
          color: #F8B50E;
        }

        .related-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .related-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
          transition: all 0.2s ease;
        }

        .related-card:hover {
          border-color: #F8B50E;
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
        }

        .rel-img-wrap {
          height: 160px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px;
          background: #ffffff;
        }

        .rel-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .rel-body {
          padding: 14px;
          display: flex;
          flex-direction: column;
          border-top: 1px solid #f1f5f9;
          flex: 1;
        }

        .rel-brand {
          font-size: 10.5px;
          font-weight: 700;
          color: #1e40af;
          text-transform: uppercase;
        }

        .rel-name {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          margin: 4px 0 6px;
        }

        .rel-name a {
          color: inherit;
          text-decoration: none;
        }

        .rel-price {
          font-size: 15px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 10px;
        }

        .rel-btn-view {
          font-size: 12px;
          font-weight: 700;
          color: #1e3a8a;
          text-decoration: none;
          margin-top: auto;
        }

        .rel-btn-view:hover {
          color: #F8B50E;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .product-showcase-grid {
            grid-template-columns: 1fr;
            padding: 24px;
          }
          .image-stage {
            height: 300px;
          }
        }

        @media (max-width: 640px) {
          .cta-button-row {
            grid-template-columns: 1fr;
          }
          .direct-contact-row {
            grid-template-columns: 1fr;
          }
          .guarantees-grid {
            grid-template-columns: 1fr;
          }
          .related-grid {
            grid-template-columns: 1fr;
          }
          .product-title {
            font-size: 22px;
          }
        }
      `}</style>
    </div>
  );
}
