'use client';

import React, { Suspense, useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  ArrowUpDown,
  ShoppingCart,
  Heart,
  Eye,
  Check,
  Search,
  Sparkles,
  PhoneCall,
  SlidersHorizontal,
  LayoutGrid
} from 'lucide-react';
import { products, categories } from '../../data/products';
import { useStore } from '../../context/StoreContext';

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'all';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchFilter, setSearchFilter] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('featured');
  const [wishlist, setWishlist] = useState({});
  const [addedAnimation, setAddedAnimation] = useState({});

  const categoryScrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = categoryScrollRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 8);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scrollCategories = (direction) => {
    const el = categoryScrollRef.current;
    if (!el) return;
    const scrollAmount = direction === 'left' ? -260 : 260;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    setTimeout(checkScroll, 320);
  };

  const handleCategorySelect = (catId, e) => {
    setActiveCategory(catId);
    if (e && e.currentTarget) {
      e.currentTarget.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  };

  const { addToCart, openQuoteModal } = useStore();

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

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory =
          activeCategory === 'all' ||
          p.categoryId.toLowerCase() === activeCategory.toLowerCase();

        const q = searchFilter.toLowerCase().trim();
        const matchesSearch =
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q));

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0; // featured/default
      });
  }, [activeCategory, searchFilter, sortBy]);

  return (
    <div className="products-all-page">
      {/* Breadcrumbs & Header Bar */}
      <div className="page-header-band">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/" className="crumb-link">Home</Link>
            <ChevronRight size={14} className="crumb-sep" />
            <span className="crumb-active">All Industrial Equipment</span>
          </nav>

          <div className="header-flex">
            <div>
              <h1 className="page-title">Industrial Equipment & Machinery Catalog</h1>
              <p className="page-subtitle">
                Explore our full line of conveying systems, packaging machinery, batch coders, and automation components.
              </p>
            </div>
            <div className="catalog-total-badge">
              <span className="badge-num">{products.length}</span>
              <span className="badge-text">Products in Catalog</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container main-layout">
        {/* Category Pills & Toolbar */}
        <div className="catalog-toolbar">
          <div className="category-scroll-wrapper">
            {canScrollLeft && (
              <button
                type="button"
                className="category-scroll-btn left"
                onClick={() => scrollCategories('left')}
                aria-label="Scroll categories left"
              >
                <ChevronLeft size={16} />
              </button>
            )}

            <div
              className="category-scroll-bar"
              ref={categoryScrollRef}
              onScroll={checkScroll}
            >
              <button
                type="button"
                className={`cat-pill ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={(e) => handleCategorySelect('all', e)}
              >
                <LayoutGrid size={15} className="cat-pill-icon" />
                <span>All Categories</span>
                {activeCategory === 'all' && <span className="active-dot" />}
              </button>
              {categories.map((c) => {
                const isActive = activeCategory === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    className={`cat-pill ${isActive ? 'active' : ''}`}
                    onClick={(e) => handleCategorySelect(c.id, e)}
                  >
                    <span>{c.name}</span>
                    {isActive && <span className="active-dot" />}
                  </button>
                );
              })}
            </div>

            {canScrollRight && (
              <button
                type="button"
                className="category-scroll-btn right"
                onClick={() => scrollCategories('right')}
                aria-label="Scroll categories right"
              >
                <ChevronRight size={16} />
              </button>
            )}
          </div>

          <div className="controls-row">
            <div className="search-filter-box">
              <Search size={16} className="search-box-icon" />
              <input
                type="text"
                placeholder="Filter by name, brand, or model..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                aria-label="Filter equipment by keyword"
              />
              {searchFilter && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => setSearchFilter('')}
                >
                  ✕
                </button>
              )}
            </div>

            <div className="sort-box">
              <ArrowUpDown size={15} className="sort-box-icon" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort product list"
              >
                <option value="featured">Sort: Featured</option>
                <option value="rating">Sort: Highest Rated</option>
                <option value="price-asc">Sort: Price (Low to High)</option>
                <option value="price-desc">Sort: Price (High to Low)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count Banner */}
        <div className="results-summary-row">
          <span className="results-count">
            Showing <strong>{filteredProducts.length}</strong> of {products.length} products
            {activeCategory !== 'all' && (
              <span className="filtered-tag">
                in <em>{categories.find((c) => c.id === activeCategory)?.name || activeCategory}</em>
              </span>
            )}
          </span>

          {activeCategory !== 'all' && (
            <Link
              href={`/products/${activeCategory}`}
              className="open-category-deep-link"
            >
              <span>View dedicated category page</span>
              <ChevronRight size={14} />
            </Link>
          )}
        </div>

        {/* Product Cards Grid */}
        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              const isWishlisted = !!wishlist[product.id];
              const isAdded = !!addedAnimation[product.id];

              return (
                <div key={product.id} className="product-card">
                  {/* Badge */}
                  {product.badge && (
                    <div className={`product-badge badge-${product.badgeType || 'bestseller'}`}>
                      {product.badge}
                    </div>
                  )}

                  {/* Image */}
                  <Link
                    href={`/products/${product.categoryId}/${product.id}`}
                    className="product-img-box"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-img"
                      loading="lazy"
                    />
                  </Link>

                  {/* Body */}
                  <div className="product-body">
                    <div className="product-meta">
                      <span className="brand-tag">{product.brand || 'BizBein'}</span>
                      <Link
                        href={`/products/${product.categoryId}`}
                        className="cat-link"
                      >
                        {product.category}
                      </Link>
                    </div>

                    <h2 className="product-title">
                      <Link
                        href={`/products/${product.categoryId}/${product.id}`}
                        className="title-link"
                      >
                        {product.name}
                      </Link>
                    </h2>

                    <div className="product-rating">
                      <span className="rating-star">★</span>
                      <span className="rating-val">{product.rating}</span>
                      <span className="reviews-count">({product.reviews} reviews)</span>
                    </div>

                    {/* Specs snippet */}
                    {product.specs && product.specs.length > 0 && (
                      <div className="specs-snippet">
                        <div className="spec-row">
                          <span className="spec-lbl">{product.specs[0].label}:</span>
                          <span className="spec-val">{product.specs[0].value}</span>
                        </div>
                        {product.specs[1] && (
                          <div className="spec-row">
                            <span className="spec-lbl">{product.specs[1].label}:</span>
                            <span className="spec-val">{product.specs[1].value}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="price-row">
                      <span className="price-tag">{product.priceDisplay}</span>
                      <span className="unit-label">{product.unit}</span>
                    </div>

                    {/* Actions */}
                    <div className="actions-row">
                      <button
                        type="button"
                        className={`btn-add-cart ${isAdded ? 'btn-success' : ''}`}
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

                      <Link
                        href={`/products/${product.categoryId}/${product.id}`}
                        className="btn-details"
                        title="View Full Specifications"
                      >
                        <Eye size={15} />
                        <span>Details</span>
                      </Link>

                      <button
                        type="button"
                        className={`btn-wishlist ${isWishlisted ? 'active' : ''}`}
                        onClick={() => toggleWishlist(product.id)}
                        aria-label="Wishlist"
                      >
                        <Heart
                          size={16}
                          fill={isWishlisted ? '#ef4444' : 'none'}
                          stroke={isWishlisted ? '#ef4444' : '#64748b'}
                        />
                      </button>
                    </div>

                    <button
                      type="button"
                      className="btn-quote-link"
                      onClick={() => openQuoteModal(product)}
                    >
                      Request Quotation Proposal →
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="empty-catalog-state">
              <p className="empty-title">No products found matching your search</p>
              <p className="empty-sub">Try searching for other terms or reset the filters.</p>
              <button
                type="button"
                className="reset-btn"
                onClick={() => {
                  setActiveCategory('all');
                  setSearchFilter('');
                }}
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .products-all-page {
          background-color: #f8fafc;
          padding-bottom: 60px;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Header Band */
        .page-header-band {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: #ffffff;
          padding: 30px 0 36px;
          border-bottom: 3px solid #F8B50E;
        }

        .breadcrumbs {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #94a3b8;
          margin-bottom: 14px;
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
          font-weight: 600;
        }

        .header-flex {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 24px;
        }

        .page-title {
          font-size: 28px;
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 6px;
          letter-spacing: -0.02em;
        }

        .page-subtitle {
          font-size: 14.5px;
          color: #cbd5e1;
          margin: 0;
          max-width: 780px;
          line-height: 1.5;
        }

        .catalog-total-badge {
          background: rgba(248, 181, 14, 0.12);
          border: 1px solid rgba(248, 181, 14, 0.35);
          border-radius: 10px;
          padding: 10px 18px;
          text-align: center;
          flex-shrink: 0;
        }

        .badge-num {
          display: block;
          font-size: 24px;
          font-weight: 900;
          color: #F8B50E;
          line-height: 1;
        }

        .badge-text {
          font-size: 11px;
          color: #e2e8f0;
          text-transform: uppercase;
          font-weight: 600;
          margin-top: 3px;
          display: block;
        }

        /* Toolbar */
        .catalog-toolbar {
          margin-top: 24px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 16px 20px;
          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.04);
        }

        .category-scroll-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          padding-bottom: 12px;
          border-bottom: 1px solid #f1f5f9;
        }

        .category-scroll-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          overflow-x: auto;
          scroll-behavior: smooth;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: 4px 4px;
          width: 100%;
        }

        .category-scroll-bar::-webkit-scrollbar {
          display: none;
        }

        .category-scroll-btn {
          position: absolute;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: #0f172a;
          box-shadow: 0 3px 10px rgba(15, 23, 42, 0.12);
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .category-scroll-btn.left {
          left: -12px;
        }

        .category-scroll-btn.right {
          right: -12px;
        }

        .category-scroll-btn:hover {
          background: #F8B50E;
          border-color: #F8B50E;
          color: #0f172a;
          transform: scale(1.1);
          box-shadow: 0 4px 14px rgba(248, 181, 14, 0.4);
        }

        .category-scroll-btn:active {
          transform: scale(0.94);
        }

        .cat-pill {
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          color: #334155;
          font-size: 13.5px;
          font-weight: 600;
          padding: 8px 18px;
          border-radius: 9999px;
          white-space: nowrap;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          user-select: none;
        }

        .cat-pill:hover {
          background: #ffffff;
          border-color: #cbd5e1;
          color: #0f172a;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
        }

        .cat-pill:active {
          transform: translateY(0) scale(0.97);
        }

        .cat-pill.active {
          background: #F8B50E;
          color: #0f172a;
          border-color: #d99b00;
          font-weight: 700;
          box-shadow: 0 4px 14px rgba(248, 181, 14, 0.38);
          transform: translateY(-1px);
        }

        .cat-pill.active:hover {
          background: #ebb000;
          border-color: #c78d00;
          box-shadow: 0 6px 18px rgba(248, 181, 14, 0.45);
        }

        .cat-pill-icon {
          color: inherit;
          flex-shrink: 0;
        }

        .active-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #0f172a;
          display: inline-block;
          animation: dotPulse 1.8s infinite;
        }

        @keyframes dotPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.4);
            opacity: 0.65;
          }
        }

        .controls-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-top: 14px;
          flex-wrap: wrap;
        }

        .search-filter-box {
          position: relative;
          display: flex;
          align-items: center;
          flex: 1;
          min-width: 260px;
          transition: all 0.2s ease;
        }

        .search-box-icon {
          position: absolute;
          left: 14px;
          color: #94a3b8;
          transition: color 0.2s ease;
          pointer-events: none;
        }

        .search-filter-box:focus-within .search-box-icon {
          color: #F8B50E;
        }

        .search-filter-box input {
          width: 100%;
          padding: 10px 40px 10px 40px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 13.5px;
          font-family: inherit;
          color: #0f172a;
          background: #f8fafc;
          transition: all 0.22s ease;
        }

        .search-filter-box input:hover {
          border-color: #cbd5e1;
          background: #ffffff;
        }

        .search-filter-box input:focus {
          outline: none;
          border-color: #F8B50E;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(248, 181, 14, 0.22);
        }

        .clear-search-btn {
          position: absolute;
          right: 12px;
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #e2e8f0;
          border: none;
          font-size: 11px;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .clear-search-btn:hover {
          background: #cbd5e1;
          color: #0f172a;
          transform: rotate(90deg) scale(1.1);
        }

        .sort-box {
          position: relative;
          display: flex;
          align-items: center;
        }

        .sort-box-icon {
          position: absolute;
          left: 12px;
          color: #64748b;
          pointer-events: none;
          transition: color 0.2s ease;
        }

        .sort-box:hover .sort-box-icon {
          color: #0f172a;
        }

        .sort-box select {
          padding: 10px 16px 10px 36px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 500;
          font-family: inherit;
          color: #0f172a;
          background: #ffffff;
          cursor: pointer;
          transition: all 0.22s ease;
        }

        .sort-box select:hover {
          border-color: #F8B50E;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .sort-box select:focus {
          outline: none;
          border-color: #F8B50E;
          box-shadow: 0 0 0 3px rgba(248, 181, 14, 0.2);
        }

        /* Results summary */
        .results-summary-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 20px 0 16px;
          font-size: 13.5px;
          color: #64748b;
        }

        .results-count strong {
          color: #0f172a;
        }

        .filtered-tag em {
          color: #1e3a8a;
          font-style: normal;
          font-weight: 600;
        }

        .open-category-deep-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #1e3a8a;
          font-weight: 600;
          text-decoration: none;
        }

        .open-category-deep-link:hover {
          color: #F8B50E;
        }

        /* Grid */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

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
          height: 190px;
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

        .product-card:hover .product-img {
          transform: scale(1.06);
        }

        .product-body {
          padding: 14px 16px 16px;
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
          font-size: 10.5px;
          font-weight: 700;
          text-transform: uppercase;
          background: #eff6ff;
          color: #1e40af;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .cat-link {
          font-size: 11.5px;
          color: #64748b;
          text-decoration: none;
          font-weight: 500;
        }

        .cat-link:hover {
          color: #F8B50E;
        }

        .product-title {
          font-size: 14.5px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.35;
          margin: 0 0 6px;
          min-height: 38px;
        }

        .title-link {
          color: inherit;
          text-decoration: none;
          transition: color 0.15s ease;
        }

        .title-link:hover {
          color: #1e3a8a;
        }

        .product-rating {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          margin-bottom: 10px;
        }

        .rating-star {
          color: #F8B50E;
        }

        .rating-val {
          font-weight: 700;
          color: #0f172a;
        }

        .reviews-count {
          color: #94a3b8;
        }

        .specs-snippet {
          background: #f8fafc;
          border-radius: 6px;
          padding: 8px 10px;
          margin-bottom: 12px;
          font-size: 11.5px;
        }

        .spec-row {
          display: flex;
          justify-content: space-between;
          gap: 6px;
          margin-bottom: 3px;
        }

        .spec-row:last-child {
          margin-bottom: 0;
        }

        .spec-lbl {
          color: #64748b;
        }

        .spec-val {
          font-weight: 600;
          color: #1e293b;
          text-align: right;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .price-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 12px;
          margin-top: auto;
        }

        .price-tag {
          font-size: 16px;
          font-weight: 800;
          color: #0f172a;
        }

        .unit-label {
          font-size: 11px;
          color: #64748b;
        }

        /* Actions */
        .actions-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;
        }

        .btn-add-cart {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background-color: #F8B50E;
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

        .btn-add-cart:hover {
          background-color: #E5A407;
          transform: translateY(-1px);
        }

        .btn-add-cart.btn-success {
          background-color: #16a34a;
          color: #ffffff;
        }

        .btn-details {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          color: #334155;
          padding: 8px 10px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.15s ease;
        }

        .btn-details:hover {
          background: #0f172a;
          color: #ffffff;
          border-color: #0f172a;
        }

        .btn-wishlist {
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

        .btn-wishlist:hover {
          background: #f8fafc;
        }

        .btn-wishlist.active {
          border-color: #fecaca;
          background: #fef2f2;
        }

        .btn-quote-link {
          background: none;
          border: none;
          color: #1e3a8a;
          font-size: 11.5px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          text-align: center;
          padding: 4px 0;
          transition: color 0.15s ease;
        }

        .btn-quote-link:hover {
          color: #F8B50E;
        }

        /* Empty State */
        .empty-catalog-state {
          grid-column: 1 / -1;
          background: #ffffff;
          border: 1px dashed #cbd5e1;
          border-radius: 12px;
          padding: 48px 24px;
          text-align: center;
        }

        .empty-title {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 6px;
        }

        .empty-sub {
          font-size: 13.5px;
          color: #64748b;
          margin: 0 0 16px;
        }

        .reset-btn {
          background: #F8B50E;
          border: none;
          color: #0f172a;
          font-weight: 700;
          font-size: 13px;
          padding: 8px 18px;
          border-radius: 6px;
          cursor: pointer;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .products-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 900px) {
          .products-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .products-grid {
            grid-template-columns: 1fr;
          }
          .page-title {
            font-size: 22px;
          }
          .catalog-total-badge {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

export default function AllProductsPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>Loading Machinery Catalog...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
