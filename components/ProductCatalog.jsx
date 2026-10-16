'use client';

import React, { useState } from 'react';
import {
  Star,
  CheckCircle,
  Phone,
  FileSpreadsheet,
  Plus,
  Check,
  Filter,
  ArrowUpDown,
  AlertCircle,
  Zap
} from 'lucide-react';
import { products, categories, companyDetails } from '../data/products';
import { useStore } from '../context/StoreContext';

export default function ProductCatalog({
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  onOpenQuoteModal,
  onAddToCart,
  onBuyNow,
  cartItems = []
}) {
  const store = useStore();
  const catalogList = store?.products || products;
  const [sortBy, setSortBy] = useState('featured');

  const handleBuyNow = (product) => {
    if (onBuyNow) {
      onBuyNow(product);
    } else if (store?.buyNow) {
      store.buyNow(product);
    }
  };

  // Filter products by category and search query
  const filteredProducts = catalogList.filter((p) => {
    const matchesCategory =
      selectedCategory === 'all' || p.category === selectedCategory || p.categoryId === selectedCategory;

    const matchesSearch =
      searchQuery.trim() === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.model && p.model.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (Array.isArray(p.specs) && p.specs.some(
        (s) =>
          (s.label && s.label.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (s.value && s.value.toLowerCase().includes(searchQuery.toLowerCase()))
      ));

    return matchesCategory && matchesSearch;
  });

  return (
    <section id="machinery-catalog" className="catalog-section" aria-label="Equipment Catalog">
      <div className="container">
        {/* Catalog Section Header */}
        <div className="catalog-header">
          <div className="header-meta">
            <span className="section-eyebrow">FACTORY INVENTORY & DIRECT DISPATCH</span>
            <h2 className="section-title">
              Industrial Packaging, Coding & Conveying Equipment
            </h2>
            <p className="section-desc">
              All machinery is manufactured and QA-tested under BizBein industrial standards. 
              Request an instant commercial proposal or order factory-calibrated consumables.
            </p>
          </div>

          <div className="catalog-controls">
            <div className="control-filter-tabs">
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`tab-btn ${selectedCategory === c.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(c.id)}
                >
                  {c.name}
                </button>
              ))}
            </div>

            <div className="sort-wrapper">
              <ArrowUpDown size={14} className="sort-icon" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort machinery catalog"
              >
                <option value="featured">Featured Machinery</option>
                <option value="rating">Highest Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count & Active Filters Indicator */}
        <div className="catalog-summary-bar">
          <span className="summary-count">
            Showing <strong>{filteredProducts.length}</strong> equipment units available for dispatch
          </span>

          {searchQuery && (
            <span className="active-filter-badge">
              Filter: "{searchQuery}"
            </span>
          )}
        </div>

        {/* Product Equipment Grid */}
        {filteredProducts.length > 0 ? (
          <div className="product-grid">
            {filteredProducts.map((product) => {
              const isInCart = cartItems.some((item) => item.id === product.id);

              return (
                <article key={product.id} className="product-card" tabIndex={0}>
                  {/* Card Header & Badges */}
                  <div className="card-top">
                    <span
                      className={`badge ${
                        product.tag === 'Ready to Dispatch'
                          ? 'badge-dispatch'
                          : product.tag === 'Best Seller'
                          ? 'badge-bestseller'
                          : 'badge-factory'
                      }`}
                    >
                      {product.tag}
                    </span>

                    <span className="model-code">{product.model}</span>
                  </div>

                  {/* Machine Thumbnail */}
                  <div className="card-media">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-img"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <div className="media-overlay">
                      <span className="media-zoom">100% QA Tested</span>
                    </div>
                  </div>

                  {/* Rating & Review Counter */}
                  <div className="product-rating">
                    <div className="stars-wrap">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={13}
                          fill={i < Math.floor(product.rating) ? '#F8B50E' : '#CBD5E1'}
                          color={i < Math.floor(product.rating) ? '#F8B50E' : '#CBD5E1'}
                        />
                      ))}
                    </div>
                    <span className="rating-score">{product.rating}</span>
                    <span className="rating-count">({product.reviews} reviews)</span>
                  </div>

                  {/* Equipment Title */}
                  <h3 className="product-title" title={product.name}>
                    {product.name}
                  </h3>

                  {/* Technical Specifications Matrix */}
                  <div className="specs-container">
                    <span className="specs-heading">Technical Specifications</span>
                    <ul className="spec-list">
                      {product.specs.map((spec, idx) => (
                        <li key={idx} className="spec-item">
                          <span className="spec-label">{spec.label}:</span>
                          <span className="spec-val">{spec.value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Commercial Pricing Block */}
                  <div className="price-block">
                    <div className="price-row">
                      <span className="price-amount">{product.price}</span>
                      <span className="price-unit">/ {product.unit}</span>
                    </div>
                    <span className="price-gst-note">
                      *Ex-factory pricing (GST & transportation calculated at invoice)
                    </span>
                  </div>

                  {/* Action CTAs */}
                  <div className="card-actions">
                    <button
                      type="button"
                      className="btn btn-primary action-btn-quote"
                      onClick={() => onOpenQuoteModal(product)}
                      aria-label={`Request instant quote for ${product.name}`}
                    >
                      <FileSpreadsheet size={16} />
                      <span>Request Quote</span>
                    </button>

                    <button
                      type="button"
                      className={`btn ${isInCart ? 'btn-secondary' : 'btn-outline'} action-btn-cart`}
                      onClick={() => onAddToCart(product)}
                      aria-label={
                        isInCart
                          ? `Inquiry added for ${product.name}`
                          : `Add ${product.name} to inquiry list`
                      }
                    >
                      {isInCart ? (
                        <>
                          <Check size={16} className="text-gold" />
                          <span>In List</span>
                        </>
                      ) : (
                        <>
                          <Plus size={16} />
                          <span>Add</span>
                        </>
                      )}
                    </button>
                  </div>

                  <button
                    type="button"
                    className="btn action-btn-buynow"
                    onClick={() => handleBuyNow(product)}
                  >
                    <Zap size={15} fill="#ffffff" />
                    <span>Buy Now</span>
                  </button>

                  {/* Direct Tech Assistance Hotline */}
                  <div className="card-footer-helpline">
                    <span>Questions on this machine?</span>
                    <a
                      href={`tel:${companyDetails.primaryPhone.replace(/[^0-9+]/g, '')}`}
                      className="helpline-link"
                    >
                      <Phone size={12} />
                      <span>Call Tech Desk: {companyDetails.primaryPhone}</span>
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* Empty State Handling */
          <div className="empty-state-card" role="status">
            <AlertCircle size={44} className="empty-icon text-gold" />
            <h3 className="empty-title">No industrial equipment matches your criteria</h3>
            <p className="empty-desc">
              We couldn't find matches for "{searchQuery}". Try broadening your category 
              or contact BizBein engineering desk for custom conveyor fabrication and OEM coding printers.
            </p>
            <div className="empty-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setSelectedCategory('all');
                }}
              >
                View All Machinery
              </button>
              <a
                href={`tel:${companyDetails.primaryPhone.replace(/[^0-9+]/g, '')}`}
                className="btn btn-secondary"
              >
                <Phone size={16} />
                <span>Call BizBein Desk: {companyDetails.primaryPhone}</span>
              </a>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .catalog-section {
          padding: 60px 0;
          background-color: #f8fafc;
        }

        .catalog-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 24px;
          margin-bottom: 24px;
        }

        .header-meta {
          max-width: 680px;
        }

        .section-eyebrow {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--bizbein-gold-600);
          text-transform: uppercase;
          display: block;
          margin-bottom: 6px;
        }

        .section-title {
          font-size: 28px;
          font-weight: 800;
          color: var(--bizbein-navy-900);
          letter-spacing: -0.01em;
          margin-bottom: 8px;
        }

        .section-desc {
          font-size: 14px;
          color: var(--color-text-secondary);
          line-height: 1.5;
        }

        .catalog-controls {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }

        .control-filter-tabs {
          display: flex;
          align-items: center;
          background-color: #ffffff;
          padding: 4px;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border-subtle);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .tab-btn {
          background: transparent;
          border: none;
          padding: 8px 14px;
          font-family: inherit;
          font-size: 13px;
          font-weight: 500;
          color: var(--color-text-secondary);
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .tab-btn:hover {
          color: var(--bizbein-navy-900);
        }

        .tab-btn.active {
          background-color: var(--bizbein-navy-700);
          color: #ffffff;
          font-weight: 600;
        }

        .sort-wrapper {
          display: flex;
          align-items: center;
          background: #ffffff;
          border: 1px solid var(--color-border-default);
          border-radius: var(--radius-md);
          padding: 0 10px;
        }

        .sort-icon {
          color: var(--color-text-tertiary);
          margin-right: 6px;
        }

        .sort-wrapper select {
          border: none;
          background: transparent;
          font-family: inherit;
          font-size: 13px;
          font-weight: 500;
          color: var(--bizbein-navy-900);
          padding: 8px 4px;
          outline: none;
          cursor: pointer;
        }

        /* Summary Bar */
        .catalog-summary-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          padding: 10px 16px;
          background: #ffffff;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border-subtle);
          font-size: 13px;
          color: var(--color-text-secondary);
        }

        .summary-count strong {
          color: var(--bizbein-navy-900);
        }

        .active-filter-badge {
          background-color: var(--bizbein-gold-100);
          color: #92400e;
          font-size: 12px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 4px;
        }

        /* Product Grid */
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }

        /* Product Card */
        .product-card {
          background: #ffffff;
          border: 1px solid var(--color-border-subtle);
          border-radius: var(--radius-xl);
          padding: 20px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 2px 8px rgba(26, 32, 53, 0.05);
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
          position: relative;
        }

        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px -4px rgba(43, 51, 83, 0.15);
          border-color: var(--bizbein-gold-500);
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .model-code {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 600;
          color: var(--color-text-secondary);
          background-color: var(--color-surface-subtle);
          padding: 2px 6px;
          border-radius: 3px;
        }

        .card-media {
          position: relative;
          width: 100%;
          height: 180px;
          background-color: var(--color-surface-subtle);
          border-radius: var(--radius-md);
          overflow: hidden;
          margin-bottom: 14px;
        }

        .product-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .product-card:hover .product-img {
          transform: scale(1.04);
        }

        .media-overlay {
          position: absolute;
          bottom: 8px;
          right: 8px;
          background: rgba(19, 25, 43, 0.75);
          backdrop-filter: blur(4px);
          color: #ffffff;
          font-size: 10px;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 4px;
        }

        .product-rating {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;
        }

        .stars-wrap {
          display: flex;
          gap: 2px;
        }

        .rating-score {
          font-size: 12px;
          font-weight: 700;
          color: var(--bizbein-navy-900);
        }

        .rating-count {
          font-size: 12px;
          color: var(--color-text-tertiary);
        }

        .product-title {
          font-size: 16px;
          font-weight: 700;
          color: var(--bizbein-navy-900);
          line-height: 1.35;
          margin-bottom: 12px;
          min-height: 44px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .specs-container {
          background: var(--color-surface-alt);
          border: 1px solid var(--color-border-subtle);
          border-radius: var(--radius-md);
          padding: 10px 12px;
          margin-bottom: 16px;
        }

        .specs-heading {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--bizbein-navy-700);
          letter-spacing: 0.04em;
          display: block;
          margin-bottom: 4px;
        }

        .price-block {
          margin-bottom: 16px;
          padding-top: 10px;
          border-top: 1px solid var(--color-border-subtle);
        }

        .price-row {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .price-amount {
          font-size: 22px;
          font-weight: 800;
          color: var(--bizbein-navy-900);
        }

        .price-unit {
          font-size: 12px;
          color: var(--color-text-secondary);
        }

        .price-gst-note {
          display: block;
          font-size: 11px;
          color: var(--color-text-tertiary);
          margin-top: 2px;
        }

        .card-actions {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 10px;
          margin-bottom: 12px;
        }

        .action-btn-quote {
          width: 100%;
        }

        .action-btn-cart {
          padding: 12px 14px;
        }

        .action-btn-buynow {
          width: 100%;
          background-color: #1E253D !important;
          color: #ffffff !important;
          border: 1px solid #1E253D !important;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px 14px;
          border-radius: var(--radius-md);
          margin-bottom: 12px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .action-btn-buynow:hover {
          background-color: #2B3353 !important;
          border-color: #2B3353 !important;
          transform: translateY(-1px);
        }

        .card-footer-helpline {
          display: flex;
          flex-direction: column;
          gap: 2px;
          font-size: 11px;
          color: var(--color-text-tertiary);
          text-align: center;
          padding-top: 8px;
          border-top: 1px dashed var(--color-border-subtle);
        }

        .helpline-link {
          color: var(--bizbein-navy-700);
          font-weight: 600;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }

        .helpline-link:hover {
          color: var(--bizbein-gold-600);
          text-decoration: underline;
        }

        /* Empty State */
        .empty-state-card {
          background: #ffffff;
          border: 2px dashed var(--color-border-default);
          border-radius: var(--radius-xl);
          padding: 60px 24px;
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .empty-icon {
          color: var(--bizbein-gold-500);
        }

        .empty-title {
          font-size: 20px;
          font-weight: 700;
          color: var(--bizbein-navy-900);
        }

        .empty-desc {
          font-size: 14px;
          color: var(--color-text-secondary);
          line-height: 1.5;
        }

        .empty-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
          margin-top: 8px;
        }

        @media (max-width: 768px) {
          .catalog-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .catalog-controls {
            width: 100%;
            justify-content: space-between;
          }
          .control-filter-tabs {
            overflow-x: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
            width: 100%;
          }
          .control-filter-tabs::-webkit-scrollbar {
            display: none;
          }
          .tab-btn {
            white-space: nowrap;
          }
          .product-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 560px) {
          .catalog-section {
            padding: 30px 0;
          }
          .catalog-controls {
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
          }
          .sort-wrapper {
            width: 100%;
          }
          .sort-wrapper select {
            width: 100%;
          }
          .section-title {
            font-size: 22px;
          }
        }
      `}</style>
    </section>
  );
}
