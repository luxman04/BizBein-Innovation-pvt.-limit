'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Phone,
  User,
  Search,
  Lightbulb,
  FileText,
  ShoppingCart,
  Headphones,
  Menu,
  X,
  ChevronDown,
  Layers,
  ArrowRight,
  LogOut,
  ShieldAlert,
  Package
} from 'lucide-react';
import { companyDetails, categories } from '../data/products';
import { useStore } from '../context/StoreContext';

export default function Header({
  cartCount,
  onOpenCart,
  onOpenQuote,
  onOpenExpert,
  onOpenTrack,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onSelectCategory
}) {
  const router = useRouter();
  const { user, logout } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId);
    if (onSelectCategory) onSelectCategory(catId);
    setCategoryDropdownOpen(false);
    setMobileMenuOpen(false);
    if (catId === 'all') {
      router.push('/products');
    } else {
      router.push(`/products/${catId}`);
    }
  };

  const handleSearchSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (searchQuery && searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/products');
    }
  };

  return (
    <header className="site-header" role="banner">
      {/* 1. TOP UTILITY BAR */}
      <div className="top-bar">
        <div className="top-bar-container">
          <div className="top-bar-left">
            <a href={`mailto:${companyDetails.salesEmail}`} className="top-link">
              <Mail size={13} className="top-icon" />
              <span>{companyDetails.salesEmail}</span>
            </a>
            <a href={`mailto:${companyDetails.infoEmail}`} className="top-link">
              <Mail size={13} className="top-icon" />
              <span>{companyDetails.infoEmail}</span>
            </a>
            <a href={`tel:${companyDetails.phone1.replace(/[^0-9+]/g, '')}`} className="top-link">
              <Phone size={13} className="top-icon" />
              <span>{companyDetails.phone1}</span>
            </a>
            <a href={`tel:${companyDetails.phone2.replace(/[^0-9+]/g, '')}`} className="top-link">
              <Phone size={13} className="top-icon" />
              <span>{companyDetails.phone2}</span>
            </a>
          </div>

          <div className="top-bar-right">
            <button type="button" onClick={onOpenTrack} className="top-btn-link">
              Track Order
            </button>
            <span className="top-divider">|</span>
            {user ? (
              <div className="user-auth-pill-group">
                <Link href="/account/orders" className="top-btn-link user-profile-link">
                  <User size={13} className="top-icon user-icon" />
                  <span>{user.name.split(' ')[0]}</span>
                </Link>
                {user.role === 'admin' && (
                  <>
                    <span className="top-divider">|</span>
                    <Link href="/admin/products" className="top-btn-link admin-badge-link" title="Manage Products & Images">
                      <ShieldAlert size={12} className="top-icon text-gold" />
                      <span>Manage Products</span>
                    </Link>
                    <span className="top-divider">|</span>
                    <Link href="/admin/orders" className="top-btn-link admin-badge-link" title="Commercial Orders Dispatch Desk">
                      <span>Orders Desk</span>
                    </Link>
                  </>
                )}
                <span className="top-divider">|</span>
                <button type="button" onClick={logout} className="top-btn-link logout-btn" title="Sign Out">
                  <LogOut size={12} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link href="/login" className="top-btn-link user-login-btn">
                <span>Login / Register</span>
                <User size={13} className="top-icon user-icon" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (Logo, Search, Actions) */}
      <div className="main-header">
        <div className="main-header-container">
          {/* Logo */}
          <div className="logo-wrapper">
            <Link href="/" className="logo-link" aria-label="BizBein Innovations Pvt. Ltd.">
              <img
                src="/bizbein-innovations-logo.png"
                alt="BIZ BEIN INNOVATIONS PVT. LTD."
                className="logo-img"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = document.getElementById('header-fallback-logo');
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div id="header-fallback-logo" className="fallback-logo-pill" style={{ display: 'none' }}>
                <span className="fallback-top">BIZ BEIN</span>
                <span className="fallback-sub">INNOVATIONS PVT. LTD.</span>
              </div>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="search-bar-module">
            <div className="search-input-wrap">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearchSubmit(e);
                }}
                placeholder="Search for products, categories, brands..."
                aria-label="Search for products, categories, brands"
              />
            </div>

            <div className="search-cat-dropdown">
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryClick(e.target.value)}
                aria-label="Select product category"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="cat-chevron" />
            </div>

            <button
              type="button"
              className="search-submit-btn"
              aria-label="Search"
              onClick={handleSearchSubmit}
            >
              <Search size={18} />
            </button>
          </div>

          {/* Right Action Items */}
          <div className="header-actions">
            <button
              type="button"
              className="action-link-btn"
              onClick={() => {
                const el = document.getElementById('machinery-catalog');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Lightbulb size={18} className="action-icon" />
              <span>Solutions</span>
            </button>

            <button
              type="button"
              className="action-link-btn"
              onClick={onOpenQuote}
            >
              <FileText size={18} className="action-icon" />
              <span>Request Quote</span>
            </button>

            <button
              type="button"
              className="cart-action-btn"
              onClick={onOpenCart}
              aria-label={`View Cart, ${cartCount} items`}
            >
              <div className="cart-icon-box">
                <ShoppingCart size={19} />
                <span className="cart-badge-circle">{cartCount}</span>
              </div>
              <span className="cart-text">Cart</span>
            </button>

            <button
              type="button"
              className="talk-expert-btn"
              onClick={onOpenExpert}
            >
              <Headphones size={17} />
              <span>Talk to an Expert</span>
            </button>
          </div>

          {/* Mobile Hamburger & Cart */}
          <div className="mobile-header-right">
            <button
              type="button"
              className="mobile-cart-btn"
              onClick={onOpenCart}
              aria-label="Cart"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && <span className="mobile-cart-badge">{cartCount}</span>}
            </button>

            <button
              type="button"
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar below logo on small screens */}
        <div className="mobile-search-row">
          <div className="mobile-search-box">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearchSubmit(e);
              }}
              placeholder="Search products, machinery, parts..."
            />
            <button
              type="button"
              className="mobile-search-submit"
              aria-label="Search"
              onClick={handleSearchSubmit}
            >
              <Search size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* 3. CATEGORY & NAVIGATION BAR (Clean White Bar) */}
      <nav
        className="nav-bar"
        aria-label="Primary Navigation"
        style={{
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          borderBottom: '2px solid #F8B50E'
        }}
      >
        <div className="nav-container">
          {/* Yellow "All Categories" Button with Dropdown */}
          <div className="all-categories-menu-wrap">
            <button
              type="button"
              className="all-categories-btn"
              onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              aria-expanded={categoryDropdownOpen}
            >
              <Menu size={16} />
              <span>All Categories</span>
            </button>

            {categoryDropdownOpen && (
              <div className="categories-dropdown-menu">
                <div className="cat-dropdown-header">Industrial Catalog</div>
                <button
                  type="button"
                  className={`cat-dropdown-item ${selectedCategory === 'all' ? 'active' : ''}`}
                  onClick={() => handleCategoryClick('all')}
                >
                  <span>All Products & Machinery</span>
                  <ArrowRight size={14} />
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={`cat-dropdown-item ${selectedCategory === c.id ? 'active' : ''}`}
                    onClick={() => handleCategoryClick(c.id)}
                  >
                    <span>{c.name}</span>
                    <ArrowRight size={14} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Links */}
          <ul className="nav-links-list">
            <li>
              <Link href="/" className="nav-link">Home</Link>
            </li>
            <li>
              <Link href="/products" className="nav-link">Shop</Link>
            </li>
            <li className="nav-dropdown-parent">
              <Link href="/products" className="nav-link">
                Products <ChevronDown size={13} className="inline-chevron" />
              </Link>
              <div className="nav-simple-dropdown">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/products/${cat.id}`}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                    }}
                    className="dropdown-link"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </li>
            <li className="nav-dropdown-parent">
              <Link href="/products" className="nav-link">
                Solutions <ChevronDown size={13} className="inline-chevron" />
              </Link>
              <div className="nav-simple-dropdown">
                <Link href="/products/material-handling" className="dropdown-link">Material Handling Lines</Link>
                <Link href="/products/coding-printing" className="dropdown-link">Continuous Inkjet Coding</Link>
                <Link href="/products/packaging-machinery" className="dropdown-link">Carton Sealing Automation</Link>
                <Link href="/products/air-curtains" className="dropdown-link">Cleanroom Air Curtains</Link>
              </div>
            </li>
            <li>
              <Link href="/#about-us" className="nav-link">About Us</Link>
            </li>
            <li>
              <Link href="/contact" className="nav-link">Contact</Link>
            </li>
            <li>
              <Link href="/#blog-updates" className="nav-link">Blog</Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div className="drawer-logo">
                <img
                  src="/bizbein-innovations-logo.png"
                  alt="BizBein Innovations"
                  className="drawer-logo-img"
                />
              </div>
              <button
                type="button"
                className="drawer-close-btn"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            <div className="drawer-scroll-body">
              {user?.role === 'admin' && (
                <div className="drawer-section" style={{ background: '#fef3c7', padding: '12px', borderRadius: '8px' }}>
                  <div className="drawer-heading" style={{ color: '#92400e', marginBottom: '8px' }}>Administrator Controls</div>
                  <div className="drawer-actions-grid">
                    <Link
                      href="/admin/products"
                      className="drawer-btn drawer-btn-yellow"
                      onClick={() => setMobileMenuOpen(false)}
                      style={{ textDecoration: 'none' }}
                    >
                      <ShieldAlert size={16} />
                      <span>Manage Products</span>
                    </Link>
                    <Link
                      href="/admin/orders"
                      className="drawer-btn drawer-btn-outline"
                      onClick={() => setMobileMenuOpen(false)}
                      style={{ textDecoration: 'none' }}
                    >
                      <span>Orders Dispatch Desk</span>
                    </Link>
                  </div>
                </div>
              )}

              <div className="drawer-section">
                <div className="drawer-heading">Direct Contact & Orders</div>
                <div className="drawer-contact-pills">
                  <a href={`tel:${companyDetails.phone1.replace(/[^0-9+]/g, '')}`} className="drawer-contact-row">
                    <Phone size={15} className="drawer-icon" />
                    <span>{companyDetails.phone1}</span>
                  </a>
                  <a href={`tel:${companyDetails.phone2.replace(/[^0-9+]/g, '')}`} className="drawer-contact-row">
                    <Phone size={15} className="drawer-icon" />
                    <span>{companyDetails.phone2}</span>
                  </a>
                  <a href={`mailto:${companyDetails.salesEmail}`} className="drawer-contact-row">
                    <Mail size={15} className="drawer-icon" />
                    <span>{companyDetails.salesEmail}</span>
                  </a>
                  <Link
                    href="/contact"
                    className="drawer-contact-row"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ textDecoration: 'none', color: '#1e40af', fontWeight: 700 }}
                  >
                    <span>Visit Interactive Contact & Works Page →</span>
                  </Link>
                </div>
              </div>

              <div className="drawer-section">
                <div className="drawer-heading">Browse Categories</div>
                <div className="drawer-cat-list">
                  <button
                    type="button"
                    className={`drawer-cat-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                    onClick={() => handleCategoryClick('all')}
                  >
                    <span>All Categories</span>
                    <ArrowRight size={14} />
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      className={`drawer-cat-btn ${selectedCategory === c.id ? 'active' : ''}`}
                      onClick={() => handleCategoryClick(c.id)}
                    >
                      <span>{c.name}</span>
                      <ArrowRight size={14} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="drawer-section">
                <div className="drawer-heading">Quick Actions</div>
                <div className="drawer-actions-grid">
                  <button
                    type="button"
                    className="drawer-btn drawer-btn-yellow"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenExpert();
                    }}
                  >
                    <Headphones size={16} />
                    <span>Talk to an Expert</span>
                  </button>
                  <button
                    type="button"
                    className="drawer-btn drawer-btn-outline"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenQuote();
                    }}
                  >
                    <FileText size={16} />
                    <span>Request Custom Quote</span>
                  </button>
                  <button
                    type="button"
                    className="drawer-btn drawer-btn-outline"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenTrack();
                    }}
                  >
                    <span>Track Order Status</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .site-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: #ffffff;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          font-family: inherit;
        }

        /* 1. TOP BAR */
        .top-bar {
          background-color: #0b1526;
          color: #e2e8f0;
          font-size: 11.5px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          line-height: 1.2;
        }

        .top-bar-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 6px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .top-bar-left {
          display: flex;
          align-items: center;
          gap: 18px;
          flex-wrap: wrap;
        }

        .top-link {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #cbd5e1;
          text-decoration: none;
          transition: color 0.15s ease;
        }

        .top-link:hover {
          color: #F8B50E;
        }

        .top-icon {
          color: #F8B50E;
        }

        .top-bar-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .top-btn-link {
          background: none;
          border: none;
          color: #cbd5e1;
          font-size: 11.5px;
          cursor: pointer;
          font-family: inherit;
          padding: 0;
          transition: color 0.15s ease;
        }

        .top-btn-link:hover {
          color: #F8B50E;
        }

        .user-login-btn {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .user-auth-pill-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .user-profile-link {
          display: flex;
          align-items: center;
          gap: 5px;
          font-weight: 600;
          color: #ffffff !important;
        }

        .admin-badge-link {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(248, 181, 14, 0.15);
          color: #F8B50E !important;
          padding: 2px 7px;
          border-radius: 4px;
          font-weight: 700;
          font-size: 10.5px;
          text-transform: uppercase;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #94a3b8 !important;
        }

        .logout-btn:hover {
          color: #ef4444 !important;
        }

        .user-icon {
          color: #F8B50E;
        }

        .top-divider {
          color: rgba(255, 255, 255, 0.2);
        }

        /* 2. MAIN HEADER */
        .main-header {
          background: #ffffff;
          padding: 10px 0;
          border-bottom: 1px solid #edf2f7;
        }

        .main-header-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        /* Logo */
        .logo-wrapper {
          flex-shrink: 0;
        }

        .logo-link {
          display: flex;
          align-items: center;
          text-decoration: none;
        }

        .logo-img {
          height: 52px;
          width: auto;
          object-fit: contain;
          display: block;
        }

        .fallback-logo-pill {
          display: flex;
          flex-direction: column;
          background: #1e293b;
          color: #ffffff;
          padding: 4px 12px;
          border-radius: 6px;
          font-weight: 800;
        }

        .fallback-top {
          font-size: 15px;
          letter-spacing: 0.05em;
        }

        .fallback-sub {
          font-size: 9px;
          background: #F8B50E;
          color: #1e293b;
          padding: 1px 4px;
          border-radius: 2px;
          text-align: center;
        }

        /* Search Module */
        .search-bar-module {
          flex: 1;
          min-width: 200px;
          max-width: 580px;
          display: flex;
          align-items: center;
          border: 1.5px solid #e2e8f0;
          border-radius: 8px;
          background: #ffffff;
          overflow: hidden;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .search-bar-module:focus-within {
          border-color: #F8B50E;
          box-shadow: 0 0 0 3px rgba(248, 181, 14, 0.15);
        }

        .search-input-wrap {
          flex: 1;
          min-width: 120px;
          padding: 0 14px;
        }

        .search-input-wrap input {
          width: 100%;
          border: none;
          outline: none;
          font-size: 14px;
          color: #1e293b;
          font-family: inherit;
          padding: 8px 0;
        }

        .search-input-wrap input::placeholder {
          color: #94a3b8;
        }

        .search-cat-dropdown {
          position: relative;
          border-left: 1px solid #e2e8f0;
          padding: 0 10px;
          display: flex;
          align-items: center;
          background: #f8fafc;
          flex-shrink: 0;
        }

        .search-cat-dropdown select {
          appearance: none;
          background: transparent;
          border: none;
          outline: none;
          font-size: 12.5px;
          font-weight: 500;
          color: #475569;
          padding: 8px 18px 8px 4px;
          cursor: pointer;
          font-family: inherit;
        }

        .cat-chevron {
          position: absolute;
          right: 4px;
          pointer-events: none;
          color: #64748b;
        }

        .search-submit-btn {
          background-color: #F8B50E;
          border: none;
          color: #0f172a;
          padding: 0 18px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }

        .search-submit-btn:hover {
          background-color: #E5A407;
        }

        /* Right Actions */
        .header-actions {
          display: flex;
          align-items: center;
          gap: 18px;
          flex-shrink: 0;
        }

        .action-link-btn {
          background: none;
          border: none;
          display: flex;
          align-items: center;
          gap: 6px;
          color: #334155;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          padding: 6px 8px;
          border-radius: 6px;
          transition: color 0.15s ease;
        }

        .action-link-btn:hover {
          color: #F8B50E;
        }

        .action-icon {
          color: #1e293b;
        }

        .cart-action-btn {
          background: none;
          border: none;
          display: flex;
          align-items: center;
          gap: 7px;
          color: #334155;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          padding: 6px 8px;
        }

        .cart-icon-box {
          position: relative;
          display: flex;
          align-items: center;
        }

        .cart-badge-circle {
          position: absolute;
          top: -7px;
          right: -8px;
          background-color: #F8B50E;
          color: #111827;
          font-size: 10px;
          font-weight: 800;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #ffffff;
        }

        .talk-expert-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: #F8B50E;
          color: #0f172a;
          border: none;
          font-size: 13px;
          font-weight: 700;
          padding: 9px 18px;
          border-radius: 9999px;
          cursor: pointer;
          font-family: inherit;
          box-shadow: 0 2px 6px rgba(248, 181, 14, 0.3);
          transition: all 0.2s ease;
        }

        .talk-expert-btn:hover {
          background-color: #E5A407;
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(248, 181, 14, 0.4);
        }

        .mobile-header-right {
          display: none;
        }

        .mobile-search-row {
          display: none;
        }

        /* 3. CATEGORY & NAV BAR */
        .nav-bar {
          background-color: #ffffff;
          border-top: 1px solid #e2e8f0;
          border-bottom: 2px solid #F8B50E;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.04);
        }

        .nav-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .all-categories-menu-wrap {
          position: relative;
        }

        .all-categories-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          background-color: #F8B50E;
          color: #0f172a;
          border: none;
          font-size: 13.5px;
          font-weight: 700;
          padding: 11px 22px;
          cursor: pointer;
          font-family: inherit;
          letter-spacing: 0.02em;
          transition: background-color 0.15s ease;
        }

        .all-categories-btn:hover {
          background-color: #E5A407;
        }

        .categories-dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          width: 260px;
          background: #ffffff;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          border-radius: 0 0 8px 8px;
          border: 1px solid #e2e8f0;
          z-index: 50;
          overflow: hidden;
          animation: slideDown 0.15s ease-out;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .cat-dropdown-header {
          background: #f1f5f9;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          color: #64748b;
          padding: 8px 14px;
          border-bottom: 1px solid #e2e8f0;
        }

        .cat-dropdown-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 10px 14px;
          background: transparent;
          border: none;
          border-bottom: 1px solid #f1f5f9;
          color: #1e293b;
          font-size: 13px;
          font-weight: 500;
          text-align: left;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s ease;
        }

        .cat-dropdown-item:hover,
        .cat-dropdown-item.active {
          background: #fff8eb;
          color: #d97706;
          padding-left: 18px;
        }

        .nav-links-list {
          display: flex;
          align-items: center;
          list-style: none;
          gap: 6px;
          margin: 0;
          padding: 0;
        }

        :global(.nav-link),
        .nav-link {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #1e293b !important;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none !important;
          padding: 8px 16px;
          border-radius: 6px;
          transition: all 0.15s ease;
        }

        :global(.nav-link:visited) {
          color: #1e293b !important;
        }

        :global(.nav-link:hover),
        .nav-link:hover {
          color: #d97706 !important;
          background-color: rgba(248, 181, 14, 0.12);
        }

        :global(.nav-link.active),
        .nav-link.active {
          color: #b45309 !important;
          background-color: rgba(248, 181, 14, 0.16);
        }

        .inline-chevron {
          color: #64748b;
          margin-top: 1px;
          transition: transform 0.2s ease, color 0.2s ease;
        }

        .nav-dropdown-parent {
          position: relative;
        }

        .nav-dropdown-parent:hover .inline-chevron {
          transform: rotate(180deg);
          color: #d97706;
        }

        .nav-dropdown-parent:hover > :global(.nav-link),
        .nav-dropdown-parent:hover > .nav-link {
          color: #d97706 !important;
          background-color: rgba(248, 181, 14, 0.12);
        }

        .nav-dropdown-parent:hover .nav-simple-dropdown {
          display: block;
        }

        .nav-simple-dropdown {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          min-width: 220px;
          background: #ffffff;
          border-radius: 0 0 8px 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          border: 1px solid #e2e8f0;
          z-index: 50;
          padding: 6px 0;
        }

        .dropdown-link {
          display: block;
          padding: 8px 16px;
          color: #334155;
          font-size: 13px;
          text-decoration: none;
          transition: background 0.15s;
        }

        .dropdown-link:hover {
          background: #fff8eb;
          color: #d97706;
        }

        /* Mobile Responsive */
        @media (max-width: 1180px) {
          .top-bar-left {
            gap: 12px;
          }
          .action-link-btn span {
            display: none;
          }
          .talk-expert-btn {
            padding: 8px 14px;
            font-size: 12.5px;
          }
          .nav-links-list {
            gap: 4px;
          }
          :global(.nav-link),
          .nav-link {
            padding: 8px 12px;
            font-size: 13.5px;
          }
        }

        @media (max-width: 920px) {
          .top-bar {
            display: none;
          }
          .search-bar-module {
            display: none;
          }
          .header-actions {
            display: none;
          }
          .nav-bar {
            display: none;
          }

          .main-header {
            padding: 8px 0;
          }

          .logo-img {
            height: 38px;
          }

          .mobile-header-right {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .mobile-cart-btn {
            position: relative;
            background: #f1f5f9;
            border: none;
            padding: 8px;
            border-radius: 8px;
            color: #1e293b;
            cursor: pointer;
            display: flex;
            align-items: center;
          }

          .mobile-cart-badge {
            position: absolute;
            top: -5px;
            right: -5px;
            background: #F8B50E;
            color: #0f172a;
            font-size: 10px;
            font-weight: 800;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .mobile-menu-toggle {
            background: #f1f5f9;
            border: none;
            padding: 8px;
            border-radius: 8px;
            color: #1e293b;
            cursor: pointer;
            display: flex;
            align-items: center;
          }

          .mobile-search-row {
            display: block;
            padding: 8px 14px 4px;
          }

          .mobile-search-box {
            display: flex;
            align-items: center;
            border: 1.5px solid #e2e8f0;
            border-radius: 8px;
            background: #f8fafc;
            padding: 4px 10px;
          }

          .mobile-search-box input {
            flex: 1;
            border: none;
            background: transparent;
            outline: none;
            font-size: 16px;
            color: #1e293b;
            padding: 6px 0;
          }

          .mobile-search-submit {
            background: #F8B50E;
            border: none;
            border-radius: 6px;
            color: #0f172a;
            padding: 6px 10px;
            cursor: pointer;
          }
        }

        /* Mobile Drawer */
        .mobile-drawer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(4px);
          z-index: 500;
          display: flex;
          animation: fadeIn 0.2s ease-out;
        }

        .mobile-drawer {
          width: 85%;
          max-width: 340px;
          background: #ffffff;
          height: 100%;
          height: 100dvh;
          display: flex;
          flex-direction: column;
          animation: slideLeft 0.25s ease-out;
          box-shadow: 5px 0 25px rgba(0, 0, 0, 0.3);
          padding-top: env(safe-area-inset-top, 0px);
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }

        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          background: #0e1a2e;
          border-bottom: 2px solid #F8B50E;
        }

        .drawer-logo-img {
          height: 34px;
          width: auto;
        }

        .drawer-close-btn {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: #ffffff;
          border-radius: 6px;
          padding: 6px;
          cursor: pointer;
        }

        .drawer-scroll-body {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .drawer-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .drawer-heading {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748b;
          margin-bottom: 4px;
        }

        .drawer-contact-pills {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .drawer-contact-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #1e293b;
          text-decoration: none;
          background: #f8fafc;
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
        }

        .drawer-icon {
          color: #F8B50E;
        }

        .drawer-cat-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .drawer-cat-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          background: #ffffff;
          font-size: 13px;
          font-weight: 500;
          color: #1e293b;
          cursor: pointer;
          font-family: inherit;
        }

        .drawer-cat-btn.active {
          background: #F8B50E;
          color: #0f172a;
          font-weight: 700;
          border-color: #F8B50E;
        }

        .drawer-actions-grid {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .drawer-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 11px;
          border-radius: 8px;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          border: none;
        }

        .drawer-btn-yellow {
          background: #F8B50E;
          color: #0f172a;
        }

        .drawer-btn-outline {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #1e293b;
        }
      `}</style>
    </header>
  );
}
