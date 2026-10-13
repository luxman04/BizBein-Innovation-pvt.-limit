'use client';

import React, { useState } from 'react';
import { ShoppingCart, Heart, ArrowRight, Check } from 'lucide-react';
import { featuredProducts } from '../data/products';

export default function FeaturedProducts({
  onAddToCart,
  onOpenQuoteModal,
  selectedCategory,
  setSelectedCategory,
  searchQuery
}) {
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

  // Filter products based on active tab and search query
  const effectiveFilter = selectedCategory !== 'all' ? selectedCategory : activeTab;

  const filteredProducts = featuredProducts.filter((item) => {
    const matchesCategory =
      effectiveFilter === 'all' ||
      item.categoryId === effectiveFilter ||
      (effectiveFilter === 'sensors-automation' && item.categoryId === 'sensors-automation');
    
    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

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
          <button
            type="button"
            className="view-all-link"
            onClick={() => handleTabClick('all')}
          >
            <span>View All Products</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* 6 Product Cards Grid */}
        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
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
                  <div className="product-img-box">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-img"
                      loading="lazy"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="product-body">
                    <h3 className="product-title">{product.name}</h3>
                    <div className="product-category-name">{product.category}</div>

                    <div className="product-price-row">
                      <span className="price-tag">{product.priceDisplay}</span>
                    </div>

                    {/* Action Row */}
                    <div className="product-actions-row">
                      <button
                        type="button"
                        className={`add-to-cart-btn ${isAdded ? 'btn-success' : ''}`}
                        onClick={() => handleAdd(product)}
                      >
                        {isAdded ? (
                          <>
                            <Check size={16} />
                            <span>Added!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart size={15} />
                            <span>Add to Cart</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        className={`wishlist-icon-btn ${isWishlisted ? 'wishlisted' : ''}`}
                        onClick={() => toggleWishlist(product.id)}
                        aria-label="Add to Wishlist"
                      >
                        <Heart
                          size={18}
                          fill={isWishlisted ? '#ef4444' : 'none'}
                          stroke={isWishlisted ? '#ef4444' : '#64748b'}
                        />
                      </button>
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
          background-color: #f5a623;
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
          border-color: #f5a623;
          color: #1e293b;
        }

        .filter-pill.active {
          background-color: #f5a623;
          color: #0f172a;
          border-color: #f5a623;
          box-shadow: 0 2px 8px rgba(245, 166, 35, 0.3);
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
          color: #f5a623;
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
          border-color: #f5a623;
          transform: translateY(-4px);
          box-shadow: 0 10px 24px rgba(245, 166, 35, 0.16);
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
          background-color: #f5a623;
          color: #0f172a;
        }

        .badge-popular {
          background-color: #f5a623;
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

        /* Action Row */
        .product-actions-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .add-to-cart-btn {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background-color: #f5a623;
          color: #0f172a;
          border: none;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s ease;
        }

        .add-to-cart-btn:hover {
          background-color: #e59a18;
          transform: translateY(-1px);
        }

        .add-to-cart-btn.btn-success {
          background-color: #16a34a;
          color: #ffffff;
        }

        .wishlist-icon-btn {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          width: 34px;
          height: 34px;
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
          background: #f5a623;
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
      `}</style>
    </section>
  );
}
