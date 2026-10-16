'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Heart, ArrowRight, Check, Eye, Zap } from 'lucide-react';
import { products } from '../data/products';
import { useStore } from '../context/StoreContext';

export default function FeaturedProducts({
  onAddToCart,
  onBuyNow,
  onOpenQuoteModal,
  selectedCategory,
  setSelectedCategory,
  searchQuery
}) {
  const store = useStore();
  const catalogList = store?.products || products;
  const [activeTab, setActiveTab] = useState('all');
  const [wishlist, setWishlist] = useState({});
  const [addedAnimation, setAddedAnimation] = useState({});

  const filterTabs = [
    { id: 'all', label: 'All Products' },
    { id: 'conveyor-systems', label: 'Conveyor Systems' },
    { id: 'material-handling', label: 'Material Handling' },
    { id: 'packaging-machinery', label: 'Packaging Machinery' },
    { id: 'sensors-automation', label: 'Automation' },
    { id: 'industrial-equipment', label: 'Industrial Equipment' }
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (setSelectedCategory) setSelectedCategory(tabId);
  };

  const toggleWishlist = (id) => {
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAdd = (product) => {
    if (onAddToCart) onAddToCart(product);
    setAddedAnimation((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedAnimation((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const handleBuyNow = (product) => {
    if (onBuyNow) {
      onBuyNow(product);
    } else if (store?.buyNow) {
      store.buyNow(product);
    }
  };

  // Filter products based on active tab and search query
  const effectiveFilter = selectedCategory !== 'all' ? selectedCategory : activeTab;

  const filteredProducts = catalogList.filter((item) => {
    const matchesCategory =
      effectiveFilter === 'all' ||
      item.categoryId === effectiveFilter ||
      (effectiveFilter === 'sensors-automation' && item.categoryId === 'sensors-automation');
    
    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.brand && item.brand.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <section className="featured-section" id="featured-products" aria-label="Featured Products">
      <div className="featured-container">
        {/* Header Bar */}
        <div className="featured-header-row">
          <div className="title-left">
            <h2 className="section-title">Featured Products</h2>
            <div className="yellow-underline"></div>
          </div>

          {/* Filter Pills */}
          <div className="filter-pills-bar">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`filter-pill ${effectiveFilter === tab.id ? 'active' : ''}`}
                onClick={() => handleTabClick(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* View All Link */}
          <Link
            href="/products"
            className="view-all-link"
          >
            <span>View All Products</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.slice(0, 12).map((product) => {
              const isWishlisted = !!wishlist[product.id];
              const isAdded = !!addedAnimation[product.id];

              return (
                <div key={product.id} className="product-card">
                  {/* Top Badge */}
                  {product.badge && (
                    <div className={`product-badge badge-${product.badgeType}`}>
                      {product.badge}
                    </div>
                  )}

                  {/* Product Image */}
                  <Link href={`/products/${product.categoryId}/${product.id}`} className="product-img-box">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-img"
                      loading="lazy"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="product-body">
                    <div className="product-meta-row">
                      <span className="product-brand-tag">{product.brand || 'BizBein'}</span>
                      <span className="product-category-name">{product.category}</span>
                    </div>

                    <h3 className="product-title">
                      <Link href={`/products/${product.categoryId}/${product.id}`} className="product-title-link">
                        {product.name}
                      </Link>
                    </h3>

                    <div className="product-price-row">
                      <span className="price-tag">{product.priceDisplay}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="product-actions-group">
                      <div className="product-primary-actions">
                        <button
                          type="button"
                          className={`add-to-cart-btn ${isAdded ? 'btn-success' : ''}`}
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
                          className="buy-now-btn"
                          onClick={() => handleBuyNow(product)}
                          title="Buy Now"
                        >
                          <Zap size={14} fill="#ffffff" />
                          <span>Buy Now</span>
                        </button>
                      </div>

                      <div className="product-secondary-actions">
                        <Link
                          href={`/products/${product.categoryId}/${product.id}`}
                          className="details-icon-btn"
                          title="View Details"
                          aria-label="View Details"
                        >
                          <Eye size={14} />
                          <span>Details</span>
                        </Link>

                        <button
                          type="button"
                          className={`wishlist-icon-btn ${isWishlisted ? 'wishlisted' : ''}`}
                          onClick={() => toggleWishlist(product.id)}
                          aria-label="Add to Wishlist"
                        >
                          <Heart
                            size={14}
                            fill={isWishlisted ? '#ef4444' : 'none'}
                            stroke={isWishlisted ? '#ef4444' : '#64748b'}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="empty-results-box">
              <p>No products found matching the selected filter.</p>
              <button
                type="button"
                className="btn-reset-filter"
                onClick={() => handleTabClick('all')}
              >
                Reset to All Products
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .featured-section {
          padding: 24px 0 54px;
          background-color: #f8fafc;
        }

        .featured-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Header Row */
        .featured-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 24px;
        }

        .title-left {
          display: flex;
          flex-direction: column;
        }

        .section-title {
          font-size: 24px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .yellow-underline {
          width: 48px;
          height: 3px;
          background-color: #F8B50E;
          border-radius: 2px;
          margin-top: 6px;
        }

        /* Filter Pills */
        .filter-pills-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .filter-pill {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: #475569;
          font-size: 13px;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: 9999px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s ease;
        }

        .filter-pill:hover {
          border-color: #F8B50E;
          color: #1e293b;
        }

        .filter-pill.active {
          background-color: #F8B50E;
          color: #0f172a;
          border-color: #F8B50E;
          box-shadow: 0 2px 8px rgba(248, 181, 14, 0.3);
        }

        .view-all-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #1e3a8a;
          font-size: 13.5px;
          font-weight: 600;
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s ease;
        }

        .view-all-link:hover {
          color: #F8B50E;
          transform: translateX(3px);
        }

        /* Products Grid */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 16px;
        }

        /* Product Card */
        .product-card {
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

        .product-card:hover {
          border-color: #F8B50E;
          transform: translateY(-4px);
          box-shadow: 0 10px 24px rgba(248, 181, 14, 0.16);
        }

        .product-badge {
          position: absolute;
          top: 10px;
          left: 10px;
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
          background-color: #F8B50E;
          color: #0f172a;
        }

        .badge-new {
          background-color: #84cc16;
          color: #ffffff;
        }

        .product-img-box {
          width: 100%;
          height: 160px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          background: #ffffff;
          overflow: hidden;
        }

        .product-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          transition: transform 0.3s ease;
        }

        .product-card:hover .product-img {
          transform: scale(1.06);
        }

        .product-body {
          padding: 12px 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          border-top: 1px solid #f1f5f9;
          flex: 1;
          justify-content: space-between;
        }

        .product-title {
          font-size: 13.5px;
          font-weight: 700;
          color: #1e293b;
          line-height: 1.3;
          margin: 0;
          min-height: 36px;
        }

        .product-category-name {
          font-size: 11.5px;
          color: #64748b;
          font-weight: 500;
        }

        .product-price-row {
          margin: 6px 0 10px;
        }

        .price-tag {
          font-size: 14.5px;
          font-weight: 800;
          color: #0f172a;
        }

        /* Action Buttons */
        .product-actions-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .product-primary-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
        }

        .add-to-cart-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          background-color: #F8B50E;
          color: #0f172a;
          border: 1px solid #F8B50E;
          padding: 8px 6px;
          border-radius: 6px;
          font-size: 11.5px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s ease;
          white-space: nowrap;
        }

        .add-to-cart-btn:hover {
          background-color: #E5A407;
          border-color: #E5A407;
          transform: translateY(-1px);
        }

        .add-to-cart-btn.btn-success {
          background-color: #16a34a;
          border-color: #16a34a;
          color: #ffffff;
        }

        .buy-now-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          background-color: #1E253D;
          color: #ffffff;
          border: 1px solid #1E253D;
          padding: 8px 6px;
          border-radius: 6px;
          font-size: 11.5px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s ease;
          white-space: nowrap;
        }

        .buy-now-btn:hover {
          background-color: #2B3353;
          border-color: #2B3353;
          transform: translateY(-1px);
        }

        .product-secondary-actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .details-icon-btn {
          flex: 1;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          color: #334155;
          border-radius: 6px;
          height: 30px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          font-size: 11.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          text-decoration: none;
        }

        .details-icon-btn:hover {
          background: #0f172a;
          color: #ffffff;
          border-color: #0f172a;
        }

        .wishlist-icon-btn {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          width: 32px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .wishlist-icon-btn:hover {
          border-color: #cbd5e1;
          background: #f8fafc;
        }

        .wishlist-icon-btn.wishlisted {
          border-color: #fecaca;
          background: #fef2f2;
        }

        .product-meta-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .product-brand-tag {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          background: #eff6ff;
          color: #1e40af;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .product-title-link {
          color: #1e293b;
          text-decoration: none;
          transition: color 0.15s ease;
        }

        .product-title-link:hover {
          color: #F8B50E;
        }

        .empty-results-box {
          grid-column: 1 / -1;
          text-align: center;
          padding: 40px 20px;
          background: #ffffff;
          border-radius: 12px;
          border: 1px dashed #cbd5e1;
        }

        .btn-reset-filter {
          margin-top: 12px;
          background: #F8B50E;
          border: none;
          color: #0f172a;
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 700;
          cursor: pointer;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1300px) {
          .products-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 860px) {
          .featured-header-row {
            flex-direction: column;
            align-items: flex-start;
          }
          .products-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          .product-img-box {
            height: 130px;
            padding: 8px;
          }
          .product-title {
            font-size: 12.5px;
            min-height: 32px;
          }
          .price-tag {
            font-size: 13px;
          }
          .add-to-cart-btn {
            padding: 7px 6px;
            font-size: 11.5px;
          }
        }

        @media (max-width: 480px) {
          .featured-container {
            padding: 0 12px;
          }
          .product-primary-actions {
            grid-template-columns: 1fr;
            gap: 5px;
          }
          .add-to-cart-btn,
          .buy-now-btn {
            width: 100%;
            padding: 7px 6px;
            font-size: 11.5px;
          }
        }
      `}</style>
    </section>
  );
}
