'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ChevronRight,
  ChevronDown,
  ChevronUp,
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
  AlertCircle,
  RefreshCw,
  Award,
  CreditCard,
  Maximize2,
  X,
  Plus,
  Zap
} from 'lucide-react';
import {
  getProductById,
  getCategoryById,
  getProductsByCategory,
  companyDetails
} from '../../../../data/products';
import { useStore } from '../../../../context/StoreContext';
import WhatsAppIcon from '../../../../components/WhatsAppIcon';
import { openWhatsApp, formatProductRfq, WHATSAPP_RAW_NUMBER } from '../../../../lib/whatsapp';
import { getEnrichedProductDetails } from '../../../../lib/productEnricher';

export default function ProductDetailPage() {
  const params = useParams();
  const categorySlug = params?.category || '';
  const productId = params?.id || '';

  const {
    addToCart,
    buyNow,
    openQuoteModal,
    openExpertModal,
    products: liveProducts,
    getProductById: getStoreProductById
  } = useStore();

  const [fetchedProduct, setFetchedProduct] = useState(null);
  const [fetching, setFetching] = useState(false);

  const product =
    (getStoreProductById && getStoreProductById(productId)) ||
    getProductById(productId) ||
    fetchedProduct;
  const category =
    getCategoryById(categorySlug) ||
    (product ? getCategoryById(product.categoryId) : null);

  useEffect(() => {
    if (!product && productId && !fetching) {
      setFetching(true);
      fetch(`/api/products/${productId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success && data.product) {
            setFetchedProduct(data.product);
          }
        })
        .catch(() => {})
        .finally(() => setFetching(false));
    }
  }, [product, productId, fetching]);

  // Enriched specifications & Amazon-style variant data
  const enriched = getEnrichedProductDetails(product);

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [showAllSpecs, setShowAllSpecs] = useState(false);
  const [bundleChecked, setBundleChecked] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (enriched) {
      setSelectedImage(enriched.gallery[0]?.url || product?.image);
      setSelectedVariant(enriched.variants[0] || null);
      setSelectedConfig(enriched.configurations[0] || null);

      const initBundle = {};
      enriched.bundleItems.forEach((item) => {
        initBundle[item.id] = true;
      });
      setBundleChecked(initBundle);
    }
  }, [product?.id]);

  // Calculated Pricing based on selected variant and configuration add-ons
  const basePrice = selectedVariant?.price || product?.price || 45000;
  const configDelta = selectedConfig?.priceDelta || 0;
  const unitPrice = basePrice + configDelta;
  const totalPrice = unitPrice * quantity;
  const mrpPrice = (selectedVariant?.mrp || Math.round(basePrice * 1.18)) + configDelta;
  const discountPct = mrpPrice > unitPrice ? Math.round(((mrpPrice - unitPrice) / mrpPrice) * 100) : 15;

  // Delivery date calculation (e.g. 3-4 days from today)
  const deliveryDateStr = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
  })();

  // Bundle Total calculation
  const bundleTotal = enriched?.bundleItems
    ? enriched.bundleItems
        .filter((item) => bundleChecked[item.id])
        .reduce((sum, item) => sum + (item.isPrimary ? unitPrice : item.price), 0)
    : unitPrice;

  // Related products in the same category
  const allCategoryProducts = (liveProducts || getProductsByCategory(product?.categoryId || ''))
    .filter((p) => product && p.categoryId === product.categoryId);

  const relatedProducts = product
    ? allCategoryProducts.filter((p) => p.id !== product.id).slice(0, 4)
    : [];

  const handleAddToCart = () => {
    if (!product) return;
    const cartProduct = {
      ...product,
      price: unitPrice,
      priceDisplay: `₹${unitPrice.toLocaleString('en-IN')}`,
      name: `${product.name} (${selectedVariant?.shortTitle || 'Standard'})`,
      selectedVariant: selectedVariant?.name,
      selectedConfig: selectedConfig?.name
    };
    addToCart(cartProduct, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2500);
  };

  const handleBuyNow = () => {
    if (!product) return;
    const cartProduct = {
      ...product,
      price: unitPrice,
      priceDisplay: `₹${unitPrice.toLocaleString('en-IN')}`,
      name: `${product.name} (${selectedVariant?.shortTitle || 'Standard'})`,
      selectedVariant: selectedVariant?.name,
      selectedConfig: selectedConfig?.name
    };
    if (buyNow) buyNow(cartProduct, quantity);
  };

  const handleWhatsAppInquiry = () => {
    if (!product) return;
    const msg = [
      `*BizBein Innovations — Machinery Inquiry*`,
      `----------------------------------------`,
      `⚙️ *Product:* ${product.name}`,
      selectedVariant ? `🏷️ *Model / Style:* ${selectedVariant.name}` : null,
      selectedConfig ? `🔧 *Configuration:* ${selectedConfig.name}` : null,
      `💰 *Unit Price:* ₹${unitPrice.toLocaleString('en-IN')}`,
      `📦 *Quantity:* ${quantity}`,
      `💵 *Estimated Total:* ₹${totalPrice.toLocaleString('en-IN')}`,
      `----------------------------------------`,
      `Hello BizBein Technical Sales, please confirm factory availability, dispatch lead time, and commercial quote from your Zirakpur works.`
    ]
      .filter(Boolean)
      .join('\n');

    openWhatsApp(msg);
  };

  const handleAddBundleToCart = () => {
    if (!enriched) return;
    enriched.bundleItems.forEach((item) => {
      if (bundleChecked[item.id]) {
        if (item.isPrimary) {
          addToCart(
            {
              ...product,
              price: unitPrice,
              name: `${product.name} (${selectedVariant?.shortTitle || 'Standard'})`
            },
            1
          );
        } else {
          addToCart(
            {
              id: item.id,
              name: item.name,
              price: item.price,
              image: item.image,
              model: 'Package Accessory',
              unit: 'Kit'
            },
            1
          );
        }
      }
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2500);
  };

  const handleInquireBundleWhatsApp = () => {
    if (!enriched) return;
    const selectedItems = enriched.bundleItems.filter((i) => bundleChecked[i.id]);
    const msg = [
      `*BizBein Innovations — Complete Automation Package Inquiry*`,
      `----------------------------------------`,
      `I am interested in procuring the following factory package:`,
      '',
      ...selectedItems.map(
        (i, idx) =>
          `${idx + 1}. *${i.name}* — ₹${(i.isPrimary ? unitPrice : i.price).toLocaleString('en-IN')}`
      ),
      '',
      `----------------------------------------`,
      `💰 *Package Total:* ₹${bundleTotal.toLocaleString('en-IN')}`,
      `Please provide turnkey quotation, freight delivery, and commissioning support terms.`
    ].join('\n');

    openWhatsApp(msg);
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!product) {
    return (
      <div className="product-not-found">
        <div className="container">
          <div className="not-found-card">
            <h2>Equipment Not Found</h2>
            <p>The requested machinery model could not be located or has been updated.</p>
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
            background: #f8b50e;
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

  const currentGalleryImage = selectedImage || product.image;

  return (
    <div className="amazon-product-page">
      {/* 1. Amazon-Style Top Breadcrumbs */}
      <div className="breadcrumb-strip">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/" className="crumb-link">
              Home
            </Link>
            <ChevronRight size={13} className="crumb-sep" />
            <Link href="/products" className="crumb-link">
              Equipment Catalog
            </Link>
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

      {/* 2. Main 3-Column Product Stage (Gallery | Product Details | Sticky Buy Box) */}
      <div className="container main-content-wrap">
        <div className="amazon-grid-layout">
          {/* ========================================================= */}
          {/* COLUMN 1: LEFT VERTICAL THUMBNAIL STRIP & MAIN IMAGE STAGE */}
          {/* ========================================================= */}
          <div className="col-gallery">
            <div className="gallery-layout-wrapper">
              {/* Main Image Stage */}
              <div className="main-image-stage">
                {product.badge && (
                  <div className={`stage-badge badge-${product.badgeType || 'bestseller'}`}>
                    {product.badge}
                  </div>
                )}

                {/* Extra Images: Vertical Strip directly on Main Image */}
                {enriched?.gallery && enriched.gallery.length > 1 && (
                  <div className="vertical-thumbnails-strip" aria-label="Product extra images">
                    {enriched.gallery.map((imgItem) => (
                      <button
                        key={imgItem.id}
                        type="button"
                        className={`thumb-btn ${currentGalleryImage === imgItem.url ? 'thumb-active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImage(imgItem.url);
                        }}
                        onMouseEnter={() => setSelectedImage(imgItem.url)}
                        title={imgItem.label}
                      >
                        <img src={imgItem.url} alt={imgItem.label} className="thumb-img" />
                      </button>
                    ))}
                  </div>
                )}

                <div className="stage-image-container" onClick={() => setIsLightboxOpen(true)}>
                  <img
                    src={currentGalleryImage}
                    alt={product.name}
                    className="stage-img"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="zoom-hint">
                    <Maximize2 size={14} />
                    <span>Click to see full view</span>
                  </div>
                </div>

                <div className="stage-footer-note">
                  <span className="qa-chip">✓ 100% Factory Tested & Calibrated</span>
                  <button type="button" className="share-btn" onClick={handleShare}>
                    <Share2 size={13} />
                    <span>{copied ? 'Link Copied!' : 'Share Equipment'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* COLUMN 2: MIDDLE PRODUCT SPECS & ABOUT THIS ITEM           */}
          {/* ========================================================= */}
          <div className="col-center-details">
            {/* Brand Store Link */}
            <div className="brand-header-link">
              <Link href="/products" className="store-link">
                Visit the BizBein Machinery Store
              </Link>
            </div>

            {/* Product Title */}
            <h1 className="amazon-product-title">{product.name}</h1>

            {/* Star Ratings & Review Counts */}
            <div className="ratings-review-strip">
              <div className="stars-cluster">
                <span className="star-score">{product.rating || 4.9}</span>
                <span className="stars-symbols">★★★★★</span>
              </div>
              <span className="rating-divider">|</span>
              <span className="reviews-count">{product.reviews || 42} verified factory ratings</span>
              <span className="rating-divider">|</span>
              <span className="category-pill">{category?.name || 'Industrial Packaging'}</span>
            </div>

            <div className="horizontal-rule" />

            {/* Price Box */}
            <div className="amazon-price-box">
              <div className="price-primary-row">
                <span className="discount-badge">-{discountPct}%</span>
                <span className="currency-symbol">₹</span>
                <span className="price-big">{unitPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="mrp-row">
                <span className="mrp-label">M.R.P.:</span>
                <span className="mrp-strikethrough">₹{mrpPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="taxes-note">
                Ex-Works Factory Zirakpur • GST extra as applicable • Free factory loading
              </div>
            </div>

            {/* ========================================================= */}
            {/* TRUST & SERVICE ICONS STRIP (AMAZON-STYLE)                */}
            {/* ========================================================= */}
            <div className="trust-carousel-strip">
              <div className="trust-item">
                <div className="trust-icon-box">
                  <RefreshCw size={22} className="trust-ico" />
                </div>
                <span className="trust-label">10 Days Trial / Testing</span>
              </div>

              <div className="trust-item">
                <div className="trust-icon-box">
                  <Truck size={22} className="trust-ico" />
                </div>
                <span className="trust-label">All-India Free Dispatch</span>
              </div>

              <div className="trust-item">
                <div className="trust-icon-box">
                  <ShieldCheck size={22} className="trust-ico" />
                </div>
                <span className="trust-label">1 Year Warranty Care</span>
              </div>

              <div className="trust-item">
                <div className="trust-icon-box">
                  <CreditCard size={22} className="trust-ico" />
                </div>
                <span className="trust-label">Verified Proforma Dispatch</span>
              </div>

              <div className="trust-item">
                <div className="trust-icon-box">
                  <Award size={22} className="trust-ico" />
                </div>
                <span className="trust-label">Top Brand ISO Certified</span>
              </div>
            </div>

            <div className="horizontal-rule" />

            {/* ========================================================= */}
            {/* STYLE / MODEL VARIANT SELECTOR                            */}
            {/* ========================================================= */}
            {enriched?.variants && enriched.variants.length > 0 && (
              <div className="variant-selector-section">
                <div className="selector-title-row">
                  <span className="selector-label">Style / Specification Variant:</span>
                  <strong className="selector-current">{selectedVariant?.name}</strong>
                </div>

                <div className="variant-cards-grid">
                  {enriched.variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      className={`variant-card ${selectedVariant?.id === v.id ? 'variant-card-active' : ''}`}
                      onClick={() => setSelectedVariant(v)}
                    >
                      <span className="v-card-title">{v.shortTitle || v.name}</span>
                      <strong className="v-card-price">₹{v.price.toLocaleString('en-IN')}</strong>
                      <span className="v-card-mrp">₹{v.mrp.toLocaleString('en-IN')}</span>
                      <span className="v-card-sub">{v.specsSummary}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* CONFIGURATION / AUTOMATION SELECTOR                       */}
            {/* ========================================================= */}
            {enriched?.configurations && enriched.configurations.length > 0 && (
              <div className="configuration-section">
                <div className="selector-title-row">
                  <span className="selector-label">Configuration & Automation Package:</span>
                  <strong className="selector-current">{selectedConfig?.name}</strong>
                </div>

                <div className="config-pills-row">
                  {enriched.configurations.map((cfg) => (
                    <button
                      key={cfg.id}
                      type="button"
                      className={`config-pill ${selectedConfig?.id === cfg.id ? 'config-pill-active' : ''}`}
                      onClick={() => setSelectedConfig(cfg)}
                    >
                      <span className="cfg-name">{cfg.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="horizontal-rule" />

            {/* ========================================================= */}
            {/* MOBILE ACTION BOX: SHOWN BEFORE KEY SPECIFICATIONS        */}
            {/* ========================================================= */}
            <div className="mobile-action-box-wrap">
              <div className="mobile-action-box-card">
                <div className="mob-action-price-row">
                  <div className="mob-price-group">
                    <span className="mob-currency">₹</span>
                    <strong className="mob-price-num">{unitPrice.toLocaleString('en-IN')}</strong>
                    <span className="mob-unit-label">/ {product.unit || 'Unit'}</span>
                  </div>
                  <div className="mob-stock-badge">✓ In Stock</div>
                </div>

                <div className="mob-delivery-note">
                  <span className="mob-free-tag">FREE delivery</span> by <strong>{deliveryDateStr}</strong> on direct dispatch
                </div>

                {/* Mobile Quantity Selector */}
                <div className="mob-qty-row">
                  <span className="mob-qty-label">Quantity:</span>
                  <div className="mob-qty-pill">
                    <button
                      type="button"
                      className="mob-qty-btn"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="mob-qty-num">{quantity}</span>
                    <button
                      type="button"
                      className="mob-qty-btn"
                      onClick={() => setQuantity((q) => q + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Mobile Main Action Buttons */}
                <div className="mob-buttons-stack">
                  <div className="mob-primary-btns-row">
                    <button
                      type="button"
                      className={`mob-btn-cart ${isAdded ? 'btn-action-success' : ''}`}
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart size={15} />
                      <span>{isAdded ? 'Added!' : `Add to Cart (${quantity})`}</span>
                    </button>

                    <button
                      type="button"
                      className="mob-btn-buynow"
                      onClick={handleBuyNow}
                    >
                      <Zap size={15} fill="#ffffff" />
                      <span>Buy Now</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    className="mob-btn-whatsapp"
                    onClick={handleWhatsAppInquiry}
                  >
                    <WhatsAppIcon size={16} color="#ffffff" />
                    <span>Send Inquiry to WhatsApp</span>
                  </button>

                  <div className="mob-aux-btns-row">
                    <button
                      type="button"
                      className="mob-btn-rfq"
                      onClick={() => openQuoteModal(product)}
                    >
                      <FileText size={14} />
                      <span>Official RFQ</span>
                    </button>

                    <button
                      type="button"
                      className="mob-btn-call"
                      onClick={openExpertModal}
                    >
                      <Phone size={14} />
                      <span>Call Tech</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* COLUMN 3: RIGHT STICKY BUY BOX / DIRECT ACTIONS           */}
          {/* ========================================================= */}
          <div className="col-buy-box">
            <div className="sticky-buy-box-card">
              <div className="buy-box-price-header">
                <span className="currency">₹</span>
                <span className="price-num">{unitPrice.toLocaleString('en-IN')}</span>
                <span className="unit-label">/ {product.unit || 'Unit'}</span>
              </div>

              <div className="delivery-timing-block">
                <span className="free-tag">FREE delivery</span> by{' '}
                <strong>{deliveryDateStr}</strong> on direct factory dispatch.
              </div>

              <div className="stock-status-pill in-stock">
                ✓ In Stock • Factory Ready
              </div>

              <div className="seller-meta-table">
                <div className="meta-line">
                  <span className="meta-left">Ships from:</span>
                  <span className="meta-right">BizBein Works (Zirakpur)</span>
                </div>
                <div className="meta-line">
                  <span className="meta-left">Sold by:</span>
                  <span className="meta-right">BizBein Innovations</span>
                </div>
                <div className="meta-line">
                  <span className="meta-left">Payment:</span>
                  <span className="meta-right">Secure Commercial Proforma</span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="quantity-select-box">
                <label className="qty-label-text">Quantity:</label>
                <div className="qty-pill-control">
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    -
                  </button>
                  <span className="qty-num">{quantity}</span>
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() => setQuantity((q) => q + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="buy-box-buttons">
                {/* 1. Add to Inquiry Cart */}
                <button
                  type="button"
                  className={`btn-action-primary ${isAdded ? 'btn-action-success' : ''}`}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart size={17} />
                  <span>{isAdded ? 'Added to Cart!' : `Add to Cart (${quantity})`}</span>
                </button>

                {/* 2. Direct Buy Now */}
                <button
                  type="button"
                  className="btn-action-buynow"
                  onClick={handleBuyNow}
                >
                  <Zap size={17} fill="#ffffff" />
                  <span>Buy Now</span>
                </button>

                {/* 3. Direct WhatsApp Inquiry Button (High-converting green) */}
                <button
                  type="button"
                  className="btn-action-whatsapp"
                  onClick={handleWhatsAppInquiry}
                >
                  <WhatsAppIcon size={18} color="#ffffff" />
                  <span>Send Inquiry to WhatsApp</span>
                </button>

                {/* 3. Request Official RFQ Proposal */}
                <button
                  type="button"
                  className="btn-action-rfq"
                  onClick={() => openQuoteModal(product)}
                >
                  <FileText size={16} />
                  <span>Request Official RFQ Quote</span>
                </button>

                {/* 4. Talk to Senior Machine Specialist */}
                <button
                  type="button"
                  className="btn-action-call"
                  onClick={openExpertModal}
                >
                  <Phone size={15} />
                  <span>Speak with Engineer</span>
                </button>
              </div>

              {/* Security & Transaction Assurance */}
              <div className="secure-transaction-note">
                <ShieldCheck size={14} className="shield-ico" />
                <span>Secure Industrial Transaction • GST Input Credit Guaranteed</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 2B: SPECIFICATIONS & ABOUT THIS ITEM (AUTO-ADJUST) */}
        {/* ========================================================= */}
        <div className="specs-and-features-section">
          {/* Key Machinery Specifications */}
          <div className="quick-specs-table-wrap">
            <h3 className="section-heading-sm">Key Machinery Specifications</h3>
            <div className="specs-table">
              <div className="spec-row-item">
                <span className="spec-key">Brand</span>
                <span className="spec-value">BizBein Innovations</span>
              </div>
              <div className="spec-row-item">
                <span className="spec-key">Machinery Model</span>
                <span className="spec-value">{product.model || product.name}</span>
              </div>
              <div className="spec-row-item">
                <span className="spec-key">Category</span>
                <span className="spec-value">{category?.name || product.category}</span>
              </div>
              <div className="spec-row-item">
                <span className="spec-key">Factory Warranty</span>
                <span className="spec-value">12 Months Comprehensive Coverage</span>
              </div>
              <div className="spec-row-item">
                <span className="spec-key">Origin / Works</span>
                <span className="spec-value">Zirakpur, SAS Nagar, Punjab</span>
              </div>

              {/* Additional Specs from product object */}
              {product.specs &&
                product.specs
                  .slice(0, showAllSpecs ? product.specs.length : 3)
                  .map((s, idx) => (
                    <div key={idx} className="spec-row-item">
                      <span className="spec-key">{s.label}</span>
                      <span className="spec-value">{s.value}</span>
                    </div>
                  ))}
            </div>

            {product.specs && product.specs.length > 3 && (
              <button
                type="button"
                className="toggle-specs-btn"
                onClick={() => setShowAllSpecs(!showAllSpecs)}
              >
                <span>{showAllSpecs ? 'See less specifications' : 'See more technical specifications'}</span>
                {showAllSpecs ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>
            )}
          </div>

          {/* About this item */}
          <div className="about-item-section">
            <h2 className="about-item-heading">About this item</h2>
            <ul className="about-item-list">
              {enriched?.aboutPoints.map((pt, idx) => (
                <li key={idx} className="about-bullet-point">
                  <strong className="point-title">{pt.title}:</strong>{' '}
                  <span className="point-content">{pt.content}</span>
                </li>
              ))}
              <li className="about-bullet-point">
                <strong className="point-title">Industrial Line Overview:</strong>{' '}
                <span className="point-content">
                  {product.description ||
                    `${product.name} is engineered for industrial heavy-throughput operations with minimum downtime, high thermal endurance, and seamless line synchronization.`}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 3: FREQUENTLY BOUGHT / INQUIRED TOGETHER BUNDLE   */}
        {/* ========================================================= */}
        {enriched?.bundleItems && enriched.bundleItems.length > 1 && (
          <div className="frequently-bought-section">
            <h2 className="fbt-heading">Frequently Inquired Together</h2>
            <div className="fbt-card">
              <div className="fbt-products-row">
                {enriched.bundleItems.map((item, idx) => (
                  <React.Fragment key={item.id}>
                    {idx > 0 && <span className="fbt-plus-symbol">+</span>}
                    <div className="fbt-item-thumb-box">
                      <img src={item.image} alt={item.name} className="fbt-thumb-img" />
                    </div>
                  </React.Fragment>
                ))}

                <div className="fbt-total-action-box">
                  <div className="fbt-price-display">
                    <span className="total-label">Total Package Price:</span>
                    <strong className="total-price-val">₹{bundleTotal.toLocaleString('en-IN')}</strong>
                  </div>

                  <div className="fbt-btn-stack">
                    <button
                      type="button"
                      className="btn-fbt-add"
                      onClick={handleAddBundleToCart}
                    >
                      Add Selected to Cart
                    </button>
                    <button
                      type="button"
                      className="btn-fbt-whatsapp"
                      onClick={handleInquireBundleWhatsApp}
                    >
                      <WhatsAppIcon size={16} color="#ffffff" />
                      <span>Inquire Package on WhatsApp</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="fbt-checkboxes-list">
                {enriched.bundleItems.map((item) => (
                  <label key={item.id} className="fbt-checkbox-row">
                    <input
                      type="checkbox"
                      checked={!!bundleChecked[item.id]}
                      onChange={(e) =>
                        setBundleChecked({ ...bundleChecked, [item.id]: e.target.checked })
                      }
                      className="fbt-checkbox"
                    />
                    <span className="fbt-item-title-wrap">
                      {item.isPrimary ? <strong>This item:</strong> : null} {item.name} —{' '}
                      <strong className="fbt-item-price">
                        ₹{(item.isPrimary ? unitPrice : item.price).toLocaleString('en-IN')}
                      </strong>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SECTION 4: FROM THE MANUFACTURER SHOWCASE                 */}
        {/* ========================================================= */}
        <div className="from-manufacturer-section">
          <div className="mfg-header">
            <span className="mfg-eyebrow">ENGINEERING WORKS & QUALITY ASSURANCE</span>
            <h2 className="mfg-title">From the Manufacturer: BizBein Innovations</h2>
            <p className="mfg-subtitle">
              Engineered for demanding industrial production environments with precision kinematics, heavy SS metallurgy, and continuous duty drive cycles.
            </p>
          </div>

          <div className="mfg-features-grid">
            <div className="mfg-feature-card">
              <div className="mfg-icon-wrap"><Wrench size={24} /></div>
              <h3>Precision Heavy-Gauge Build</h3>
              <p>Constructed from structural stainless steel SS 304 or high-tensile powder-coated carbon steel resisting chemical corrosion and line shocks.</p>
            </div>
            <div className="mfg-feature-card">
              <div className="mfg-icon-wrap"><Clock size={24} /></div>
              <h3>24/7 Continuous Duty S1</h3>
              <p>Industrial motors paired with hardened helical reduction gearboxes designed for uninterrupted 3-shift factory operation.</p>
            </div>
            <div className="mfg-feature-card">
              <div className="mfg-icon-wrap"><Truck size={24} /></div>
              <h3>Direct Pan-India Dispatch</h3>
              <p>Dispatched directly from our primary works in Zirakpur, Punjab with all-India transit insurance and factory installation guidance.</p>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 5: RELATED MACHINERY IN SAME CATEGORY             */}
        {/* ========================================================= */}
        {relatedProducts.length > 0 && (
          <div className="related-equipment-section">
            <div className="related-header">
              <div>
                <h2 className="related-title">Customers who viewed this also considered</h2>
                <p className="related-subtitle">Compatible machinery lines from BizBein catalog.</p>
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

      {/* ========================================================= */}
      {/* FULL VIEW LIGHTBOX MODAL                                  */}
      {/* ========================================================= */}
      {isLightboxOpen && (
        <div className="lightbox-backdrop" onClick={() => setIsLightboxOpen(false)}>
          <div className="lightbox-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="lightbox-close"
              onClick={() => setIsLightboxOpen(false)}
            >
              <X size={24} />
            </button>
            <img src={currentGalleryImage} alt={product.name} className="lightbox-img" />
            <div className="lightbox-caption">
              <strong>{product.name}</strong> • Factory Engineering Detail View
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MOBILE APP-STYLE FIXED BOTTOM ACTION BAR                  */}
      {/* ========================================================= */}
      <div className="mobile-fixed-bottom-bar" aria-label="Quick Purchase Actions">
        <div className="fixed-bar-price-col">
          <span className="fixed-bar-label">Total:</span>
          <strong className="fixed-bar-price">₹{(unitPrice * quantity).toLocaleString('en-IN')}</strong>
        </div>

        <div className="fixed-bar-btns-group">
          <button
            type="button"
            className={`fixed-bar-btn-cart ${isAdded ? 'btn-action-success' : ''}`}
            onClick={handleAddToCart}
            aria-label="Add to Cart"
          >
            <ShoppingCart size={14} />
            <span>{isAdded ? 'Added' : 'Add to Cart'}</span>
          </button>

          <button
            type="button"
            className="fixed-bar-btn-buynow"
            onClick={handleBuyNow}
            aria-label="Buy Now"
          >
            <Zap size={14} fill="#ffffff" />
            <span>Buy Now</span>
          </button>

          <button
            type="button"
            className="fixed-bar-btn-wa"
            onClick={handleWhatsAppInquiry}
            aria-label="Inquire on WhatsApp"
            title="Chat on WhatsApp"
          >
            <WhatsAppIcon size={16} color="#ffffff" />
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SCOPED COMPONENT STYLES (AMAZON REFERENCE SPECIFICATION)   */}
      {/* ========================================================= */}
      <style jsx>{`
        .amazon-product-page {
          background-color: #ffffff;
          color: #0f1111;
          padding-bottom: 80px;
          font-family: inherit;
        }

        .container {
          max-width: 1480px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* 1. Breadcrumbs */
        .breadcrumb-strip {
          background-color: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          padding: 12px 0;
          font-size: 13px;
        }

        .breadcrumbs {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
          color: #565959;
        }

        .crumb-link {
          color: #007185;
          text-decoration: none;
        }

        .crumb-link:hover {
          color: #c7511f;
          text-decoration: underline;
        }

        .crumb-sep {
          color: #94a3b8;
        }

        .crumb-active {
          color: #0f1111;
          font-weight: 600;
        }

        /* 2. Main 3-Column Grid */
        .main-content-wrap {
          padding-top: 24px;
        }

        .amazon-grid-layout {
          display: grid;
          grid-template-columns: 460px 1fr 340px;
          gap: 32px;
          align-items: start;
        }

        @media (max-width: 1280px) {
          .amazon-grid-layout {
            grid-template-columns: 400px 1fr 300px;
            gap: 24px;
          }
        }

        @media (max-width: 1024px) {
          .amazon-grid-layout {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .mobile-action-box-wrap {
            display: block !important;
          }
          .col-buy-box {
            display: none !important;
          }
          .specs-and-features-section {
            grid-template-columns: 1fr;
            gap: 20px;
            margin-top: 18px;
            padding-top: 0;
            border-top: none;
          }
          .quick-specs-table-wrap,
          .about-item-section {
            padding: 16px;
            border-radius: 10px;
          }
          .spec-row-item {
            grid-template-columns: 140px 1fr;
            padding: 7px 4px;
            font-size: 12.5px;
          }
        }

        @media (max-width: 768px) {
          .amazon-product-page {
            padding-bottom: 96px;
          }
          .mobile-fixed-bottom-bar {
            display: flex !important;
          }
          .gallery-layout-wrapper {
            position: static;
            width: 100%;
          }
          .vertical-thumbnails-strip {
            top: 10px;
            left: 10px;
            gap: 5px;
            padding: 3px;
            border-radius: 8px;
            max-height: calc(100% - 60px);
          }
          .thumb-btn {
            width: 36px;
            height: 36px;
            border-radius: 5px;
            padding: 1px;
          }
          .stage-image-container {
            min-height: 250px;
            max-height: 320px;
          }
          .stage-img {
            max-height: 300px;
          }
        }

        @media (max-width: 480px) {
          .mobile-fixed-bottom-bar {
            padding: 6px 10px calc(8px + env(safe-area-inset-bottom, 0px)) 10px;
            gap: 6px;
          }
          .fixed-bar-price-col {
            min-width: 58px;
          }
          .fixed-bar-price {
            font-size: 13.5px;
          }
          .fixed-bar-btn-cart,
          .fixed-bar-btn-buynow {
            height: 33px;
            font-size: 11px;
            padding: 0 4px;
            gap: 3px;
          }
          .fixed-bar-btn-wa {
            width: 33px;
            height: 33px;
          }
          .mob-primary-btns-row {
            gap: 6px;
          }
          .mob-btn-cart,
          .mob-btn-buynow {
            font-size: 11.5px;
            height: 35px;
          }
        }

        /* Column 1: Gallery */
        .gallery-layout-wrapper {
          display: block;
          width: 100%;
          position: sticky;
          top: 90px;
        }

        .main-image-stage {
          width: 100%;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow: hidden;
        }

        .stage-badge {
          position: absolute;
          top: 14px;
          right: 14px;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 4px;
          z-index: 12;
          text-transform: uppercase;
        }

        .vertical-thumbnails-strip {
          position: absolute;
          top: 14px;
          left: 14px;
          z-index: 15;
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 4px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(226, 232, 240, 0.85);
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
          max-height: calc(100% - 70px);
          overflow-y: auto;
          scrollbar-width: none;
        }

        .vertical-thumbnails-strip::-webkit-scrollbar {
          display: none;
        }

        .thumb-btn {
          width: 44px;
          height: 44px;
          border: 1.5px solid #e2e8f0;
          border-radius: 6px;
          padding: 2px;
          background: #ffffff;
          cursor: pointer;
          position: relative;
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
        }

        .thumb-btn:hover {
          border-color: #007185;
          transform: scale(1.04);
        }

        .thumb-btn.thumb-active {
          border-color: #1E253D;
          box-shadow: 0 0 0 2px rgba(30, 37, 61, 0.3);
          transform: scale(1.04);
        }

        .thumb-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .badge-bestseller {
          background: #f8b50e;
          color: #0f172a;
        }

        .badge-popular {
          background: #0284c7;
          color: #ffffff;
        }

        .badge-new {
          background: #16a34a;
          color: #ffffff;
        }

        .stage-image-container {
          width: 100%;
          min-height: 380px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          cursor: zoom-in;
        }

        .stage-img {
          max-width: 100%;
          max-height: 420px;
          object-fit: contain;
          transition: transform 0.25s ease;
        }

        .stage-image-container:hover .stage-img {
          transform: scale(1.03);
        }

        .zoom-hint {
          position: absolute;
          bottom: 6px;
          right: 6px;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid #cbd5e1;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 11px;
          color: #475569;
          font-weight: 600;
          pointer-events: none;
        }

        .stage-footer-note {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          margin-top: 14px;
          padding-top: 10px;
          border-top: 1px solid #f1f5f9;
        }

        .qa-chip {
          font-size: 11.5px;
          color: #16a34a;
          font-weight: 700;
        }

        .share-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: none;
          border: none;
          color: #007185;
          font-size: 12px;
          cursor: pointer;
          font-weight: 600;
        }

        .share-btn:hover {
          color: #c7511f;
          text-decoration: underline;
        }

        /* Column 2: Center Details */
        .brand-header-link {
          margin-bottom: 4px;
        }

        .store-link {
          color: #007185;
          font-size: 13.5px;
          font-weight: 600;
          text-decoration: none;
        }

        .store-link:hover {
          color: #c7511f;
          text-decoration: underline;
        }

        .amazon-product-title {
          font-size: 24px;
          line-height: 1.35;
          font-weight: 700;
          color: #0f1111;
          margin: 4px 0 8px;
        }

        .ratings-review-strip {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13.5px;
          margin-bottom: 14px;
          flex-wrap: wrap;
        }

        .stars-cluster {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .star-score {
          font-weight: 700;
          color: #0f1111;
        }

        .stars-symbols {
          color: #ffa41c;
          letter-spacing: 1px;
          font-size: 15px;
        }

        .rating-divider {
          color: #cbd5e1;
        }

        .reviews-count {
          color: #007185;
          cursor: pointer;
        }

        .category-pill {
          background: #f1f5f9;
          color: #475569;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 11.5px;
          font-weight: 600;
        }

        .horizontal-rule {
          height: 1px;
          background: #e7e7e7;
          margin: 16px 0;
        }

        /* Price Box */
        .amazon-price-box {
          margin: 12px 0;
        }

        .price-primary-row {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }

        .discount-badge {
          color: #cc0c39;
          font-size: 24px;
          font-weight: 400;
        }

        .currency-symbol {
          font-size: 16px;
          vertical-align: super;
          font-weight: 600;
        }

        .price-big {
          font-size: 32px;
          font-weight: 700;
          color: #0f1111;
          line-height: 1;
        }

        .mrp-row {
          font-size: 12.5px;
          color: #565959;
          margin-top: 4px;
        }

        .mrp-strikethrough {
          text-decoration: line-through;
          margin-left: 4px;
        }

        .taxes-note {
          font-size: 12px;
          color: #007185;
          margin-top: 4px;
        }

        /* Trust Carousel Strip (5 Icons) */
        .trust-carousel-strip {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
          margin: 16px 0;
        }

        @media (max-width: 600px) {
          .trust-carousel-strip {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .trust-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 6px;
        }

        .trust-icon-box {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #e77600;
        }

        .trust-label {
          font-size: 11px;
          color: #007185;
          line-height: 1.3;
          font-weight: 600;
        }

        /* Variant Selector Cards */
        .variant-selector-section,
        .configuration-section {
          margin: 16px 0;
        }

        .selector-title-row {
          font-size: 13.5px;
          margin-bottom: 8px;
        }

        .selector-label {
          color: #565959;
          margin-right: 6px;
        }

        .selector-current {
          color: #0f1111;
        }

        .variant-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 10px;
        }

        .variant-card {
          border: 1.5px solid #d5d9d9;
          border-radius: 8px;
          background: #ffffff;
          padding: 10px 12px;
          text-align: left;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 2px;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .variant-card:hover {
          border-color: #007185;
        }

        .variant-card.variant-card-active {
          border-color: #e77600;
          background: #fffbf5;
          box-shadow: 0 0 0 1px #e77600;
        }

        .v-card-title {
          font-size: 12px;
          font-weight: 700;
          color: #0f1111;
        }

        .v-card-price {
          font-size: 14px;
          color: #b12704;
        }

        .v-card-mrp {
          font-size: 11px;
          color: #565959;
          text-decoration: line-through;
        }

        .v-card-sub {
          font-size: 10.5px;
          color: #565959;
          line-height: 1.2;
          margin-top: 2px;
        }

        /* Configuration Pills */
        .config-pills-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .config-pill {
          border: 1.5px solid #d5d9d9;
          border-radius: 8px;
          background: #ffffff;
          padding: 8px 14px;
          cursor: pointer;
          font-size: 12.5px;
          font-weight: 600;
          color: #0f1111;
          transition: all 0.15s ease;
        }

        .config-pill:hover {
          border-color: #007185;
        }

        .config-pill.config-pill-active {
          border-color: #007185;
          background: #f0fdf4;
          color: #047857;
          box-shadow: 0 0 0 1px #007185;
        }

        /* Section 2B: Full-Width Specifications & About Features (Desktop auto-adjust) */
        .specs-and-features-section {
          margin-top: 36px;
          padding-top: 28px;
          border-top: 1px solid #e7e7e7;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          align-items: start;
        }

        .quick-specs-table-wrap {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 22px 24px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
        }

        .section-heading-sm {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 14px;
          color: #0f1111;
        }

        .specs-table {
          display: flex;
          flex-direction: column;
          border-top: 1px solid #e7e7e7;
        }

        .spec-row-item {
          display: grid;
          grid-template-columns: 190px 1fr;
          padding: 8px 10px;
          border-bottom: 1px solid #f1f5f9;
          font-size: 13px;
          border-radius: 4px;
        }

        .spec-row-item:nth-child(even) {
          background: #f8fafc;
        }

        .spec-key {
          font-weight: 700;
          color: #0f1111;
        }

        .spec-value {
          color: #334155;
        }

        .toggle-specs-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: none;
          border: none;
          color: #007185;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 12px;
          padding: 0;
        }

        .toggle-specs-btn:hover {
          color: #c7511f;
          text-decoration: underline;
        }

        /* About This Item */
        .about-item-section {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 22px 24px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
        }

        .about-item-heading {
          font-size: 16px;
          font-weight: 700;
          color: #0f1111;
          margin-bottom: 14px;
        }

        .about-item-list {
          list-style-type: disc;
          padding-left: 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .about-bullet-point {
          font-size: 13.5px;
          line-height: 1.5;
          color: #334155;
        }

        .point-title {
          color: #0f1111;
        }

        /* Column 3: Sticky Buy Box Card */
        .sticky-buy-box-card {
          border: 1px solid #d5d9d9;
          border-radius: 10px;
          padding: 20px;
          background: #ffffff;
          position: sticky;
          top: 90px;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.04);
        }

        .buy-box-price-header {
          display: flex;
          align-items: baseline;
          gap: 2px;
          margin-bottom: 8px;
        }

        .buy-box-price-header .currency {
          font-size: 15px;
          font-weight: 600;
          color: #b12704;
          vertical-align: super;
        }

        .buy-box-price-header .price-num {
          font-size: 26px;
          font-weight: 700;
          color: #b12704;
        }

        .buy-box-price-header .unit-label {
          font-size: 12px;
          color: #565959;
          margin-left: 4px;
        }

        .delivery-timing-block {
          font-size: 13px;
          color: #0f1111;
          margin-bottom: 12px;
          line-height: 1.4;
        }

        .delivery-timing-block .free-tag {
          color: #007185;
          font-weight: 700;
        }

        .stock-status-pill {
          font-size: 15px;
          font-weight: 700;
          color: #007600;
          margin-bottom: 14px;
        }

        .seller-meta-table {
          font-size: 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid #e7e7e7;
        }

        .meta-line {
          display: grid;
          grid-template-columns: 85px 1fr;
        }

        .meta-left {
          color: #565959;
        }

        .meta-right {
          color: #007185;
          font-weight: 600;
        }

        .quantity-select-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .qty-label-text {
          font-size: 13px;
          font-weight: 600;
          color: #0f1111;
        }

        .qty-pill-control {
          display: flex;
          align-items: center;
          border: 1px solid #d5d9d9;
          border-radius: 8px;
          background: #f8fafc;
        }

        .qty-btn {
          width: 32px;
          height: 32px;
          border: none;
          background: none;
          cursor: pointer;
          font-size: 16px;
          font-weight: 700;
          color: #0f1111;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .qty-btn:hover {
          background: #e2e8f0;
        }

        .qty-num {
          padding: 0 10px;
          font-weight: 700;
          font-size: 14px;
        }

        .buy-box-buttons {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .btn-action-primary {
          width: 100%;
          background: #ffd814;
          border: 1px solid #fcd200;
          color: #0f1111;
          padding: 12px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.15s ease, box-shadow 0.15s ease;
        }

        .btn-action-primary:hover {
          background: #f7ca00;
          border-color: #f2c200;
        }

        .btn-action-success {
          background: #16a34a !important;
          color: #ffffff !important;
          border-color: #16a34a !important;
        }

        .btn-action-buynow {
          width: 100%;
          background: #1E253D;
          border: 1px solid #1E253D;
          color: #ffffff;
          padding: 12px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.15s ease, box-shadow 0.15s ease, transform 0.1s ease;
          box-shadow: 0 2px 6px rgba(30, 37, 61, 0.2);
        }

        .btn-action-buynow:hover {
          background: #2B3353;
          border-color: #2B3353;
          box-shadow: 0 4px 12px rgba(30, 37, 61, 0.3);
          transform: translateY(-1px);
        }

        .btn-action-buynow:active {
          transform: translateY(0);
        }

        .btn-action-whatsapp {
          width: 100%;
          background: #16a34a;
          border: 1px solid #16a34a;
          color: #ffffff;
          padding: 12px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.15s ease;
        }

        .btn-action-whatsapp:hover {
          background: #15803d;
        }

        .btn-action-rfq {
          width: 100%;
          background: #ffa41c;
          border: 1px solid #ff8f00;
          color: #0f1111;
          padding: 11px;
          border-radius: 20px;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.15s ease;
        }

        .btn-action-rfq:hover {
          background: #fa8900;
        }

        .btn-action-call {
          width: 100%;
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          color: #1e293b;
          padding: 10px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .btn-action-call:hover {
          background: #e2e8f0;
        }

        .secure-transaction-note {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: #565959;
          margin-top: 14px;
          line-height: 1.3;
        }

        .shield-ico {
          color: #16a34a;
          flex-shrink: 0;
        }

        /* Mobile Action Box (Shown before Key Machinery Specifications) */
        .mobile-action-box-wrap {
          display: none;
          margin: 18px 0 24px;
        }

        .mobile-action-box-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 14px 16px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
        }

        .mob-action-price-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 6px;
        }

        .mob-price-group {
          display: flex;
          align-items: baseline;
          gap: 3px;
        }

        .mob-currency {
          font-size: 14px;
          font-weight: 700;
          color: #b12704;
        }

        .mob-price-num {
          font-size: 22px;
          font-weight: 800;
          color: #b12704;
          letter-spacing: -0.5px;
        }

        .mob-unit-label {
          font-size: 12px;
          color: #64748b;
          font-weight: 500;
        }

        .mob-stock-badge {
          font-size: 11.5px;
          font-weight: 700;
          color: #047857;
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          padding: 2px 8px;
          border-radius: 12px;
        }

        .mob-delivery-note {
          font-size: 12px;
          color: #334155;
          margin-bottom: 12px;
          line-height: 1.4;
        }

        .mob-free-tag {
          color: #007185;
          font-weight: 700;
        }

        .mob-qty-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
          padding-bottom: 10px;
          border-bottom: 1px dashed #e2e8f0;
        }

        .mob-qty-label {
          font-size: 12.5px;
          font-weight: 600;
          color: #1e293b;
        }

        .mob-qty-pill {
          display: flex;
          align-items: center;
          border: 1.5px solid #cbd5e1;
          border-radius: 8px;
          background: #ffffff;
        }

        .mob-qty-btn {
          width: 30px;
          height: 30px;
          border: none;
          background: transparent;
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s;
        }

        .mob-qty-btn:active {
          background: #f1f5f9;
        }

        .mob-qty-num {
          padding: 0 12px;
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
          min-width: 24px;
          text-align: center;
        }

        .mob-buttons-stack {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .mob-primary-btns-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .mob-btn-cart {
          height: 36px;
          padding: 0 8px;
          background: #ffd814;
          border: 1px solid #fcd200;
          border-radius: 8px;
          color: #0f1111;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          white-space: nowrap;
          transition: all 0.15s ease;
        }

        .mob-btn-cart:active {
          background: #f7ca00;
        }

        .mob-btn-buynow {
          height: 36px;
          padding: 0 8px;
          background: #1E253D;
          border: 1px solid #1E253D;
          border-radius: 8px;
          color: #ffffff;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          white-space: nowrap;
          transition: all 0.15s ease;
          box-shadow: 0 2px 4px rgba(30, 37, 61, 0.18);
        }

        .mob-btn-buynow:active {
          background: #2B3353;
        }

        .mob-btn-whatsapp {
          height: 34px;
          padding: 0 10px;
          background: #16a34a;
          border: 1px solid #16a34a;
          border-radius: 8px;
          color: #ffffff;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          width: 100%;
          transition: background 0.15s ease;
        }

        .mob-btn-whatsapp:active {
          background: #15803d;
        }

        .mob-aux-btns-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .mob-btn-rfq {
          height: 32px;
          padding: 0 6px;
          background: #fff7ed;
          border: 1px solid #fed7aa;
          border-radius: 8px;
          color: #c2410c;
          font-size: 11.5px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }

        .mob-btn-call {
          height: 32px;
          padding: 0 6px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          color: #334155;
          font-size: 11.5px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }

        /* Mobile Fixed Bottom Action Bar */
        .mobile-fixed-bottom-bar {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 999;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-top: 1px solid #e2e8f0;
          padding: 8px 12px calc(8px + env(safe-area-inset-bottom, 0px)) 12px;
          box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.08);
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .fixed-bar-price-col {
          display: flex;
          flex-direction: column;
          min-width: 68px;
          flex-shrink: 0;
        }

        .fixed-bar-label {
          font-size: 9.5px;
          text-transform: uppercase;
          color: #64748b;
          font-weight: 600;
          letter-spacing: 0.4px;
        }

        .fixed-bar-price {
          font-size: 14px;
          font-weight: 800;
          color: #b12704;
          line-height: 1.1;
        }

        .fixed-bar-btns-group {
          display: flex;
          align-items: center;
          gap: 6px;
          flex: 1;
          justify-content: flex-end;
          min-width: 0;
        }

        .fixed-bar-btn-cart {
          flex: 1;
          min-width: 0;
          height: 34px;
          padding: 0 6px;
          background: #ffd814;
          border: 1px solid #fcd200;
          border-radius: 7px;
          color: #0f1111;
          font-size: 11.5px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          white-space: nowrap;
          transition: background 0.15s ease;
        }

        .fixed-bar-btn-buynow {
          flex: 1;
          min-width: 0;
          height: 34px;
          padding: 0 6px;
          background: #1E253D;
          border: 1px solid #1E253D;
          border-radius: 7px;
          color: #ffffff;
          font-size: 11.5px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          white-space: nowrap;
          transition: background 0.15s ease;
          box-shadow: 0 2px 4px rgba(30, 37, 61, 0.2);
        }

        .fixed-bar-btn-wa {
          width: 34px;
          height: 34px;
          flex-shrink: 0;
          background: #16a34a;
          border: 1px solid #16a34a;
          border-radius: 7px;
          color: #ffffff;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s ease;
        }

        /* Section 3: Frequently Inquired Together */
        .frequently-bought-section {
          margin-top: 48px;
          padding-top: 28px;
          border-top: 1px solid #e7e7e7;
        }

        .fbt-heading {
          font-size: 20px;
          font-weight: 700;
          color: #0f1111;
          margin-bottom: 16px;
        }

        .fbt-card {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: #ffffff;
          padding: 24px;
        }

        .fbt-products-row {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 18px;
        }

        .fbt-item-thumb-box {
          width: 120px;
          height: 120px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
        }

        .fbt-thumb-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .fbt-plus-symbol {
          font-size: 24px;
          color: #94a3b8;
          font-weight: 600;
        }

        .fbt-total-action-box {
          margin-left: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        @media (max-width: 768px) {
          .fbt-total-action-box {
            margin-left: 0;
            width: 100%;
          }
        }

        .fbt-price-display {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }

        .total-label {
          font-size: 13px;
          color: #565959;
        }

        .total-price-val {
          font-size: 20px;
          color: #b12704;
          font-weight: 700;
        }

        .fbt-btn-stack {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .btn-fbt-add {
          background: #ffd814;
          border: 1px solid #fcd200;
          color: #0f1111;
          padding: 10px 18px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
        }

        .btn-fbt-add:hover {
          background: #f7ca00;
        }

        .btn-fbt-whatsapp {
          background: #16a34a;
          border: 1px solid #16a34a;
          color: #ffffff;
          padding: 10px 18px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .btn-fbt-whatsapp:hover {
          background: #15803d;
        }

        .fbt-checkboxes-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          border-top: 1px solid #f1f5f9;
          padding-top: 14px;
        }

        .fbt-checkbox-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #334155;
          cursor: pointer;
        }

        .fbt-item-price {
          color: #b12704;
        }

        /* Section 4: From the Manufacturer */
        .from-manufacturer-section {
          margin-top: 48px;
          background: linear-gradient(135deg, #0b1526 0%, #172554 100%);
          border-radius: 16px;
          padding: 40px 32px;
          color: #ffffff;
        }

        .mfg-header {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 36px;
        }

        .mfg-eyebrow {
          color: #f8b50e;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .mfg-title {
          font-size: 28px;
          font-weight: 800;
          margin: 8px 0;
        }

        .mfg-subtitle {
          font-size: 14.5px;
          color: #94a3b8;
          line-height: 1.5;
        }

        .mfg-features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        @media (max-width: 768px) {
          .mfg-features-grid {
            grid-template-columns: 1fr;
          }
        }

        .mfg-feature-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 24px;
        }

        .mfg-icon-wrap {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          background: rgba(248, 181, 14, 0.15);
          color: #f8b50e;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
        }

        .mfg-feature-card h3 {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 8px;
          color: #ffffff;
        }

        .mfg-feature-card p {
          font-size: 13px;
          color: #cbd5e1;
          line-height: 1.5;
          margin: 0;
        }

        /* Section 5: Related Machinery */
        .related-equipment-section {
          margin-top: 48px;
          padding-top: 28px;
          border-top: 1px solid #e7e7e7;
        }

        .related-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 20px;
        }

        .related-title {
          font-size: 20px;
          font-weight: 700;
          color: #0f1111;
          margin: 0;
        }

        .related-subtitle {
          font-size: 13px;
          color: #64748b;
          margin-top: 4px;
        }

        .view-cat-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #007185;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
        }

        .view-cat-link:hover {
          color: #c7511f;
          text-decoration: underline;
        }

        .related-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        @media (max-width: 1024px) {
          .related-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .related-grid {
            grid-template-columns: 1fr;
          }
        }

        .related-card {
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          background: #ffffff;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .related-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
        }

        .rel-img-wrap {
          height: 170px;
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px;
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
          flex: 1;
        }

        .rel-brand {
          font-size: 11px;
          color: #64748b;
          font-weight: 600;
          text-transform: uppercase;
        }

        .rel-name {
          font-size: 13.5px;
          font-weight: 700;
          margin: 4px 0 8px;
          color: #0f1111;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .rel-price {
          font-size: 14.5px;
          font-weight: 700;
          color: #b12704;
          margin-bottom: 12px;
        }

        .rel-btn-view {
          margin-top: auto;
          font-size: 12.5px;
          color: #007185;
          font-weight: 600;
          text-decoration: none;
        }

        .rel-btn-view:hover {
          color: #c7511f;
          text-decoration: underline;
        }

        /* Lightbox Modal */
        .lightbox-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .lightbox-modal {
          max-width: 900px;
          max-height: 90vh;
          background: #ffffff;
          border-radius: 12px;
          padding: 20px;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .lightbox-close {
          position: absolute;
          top: 12px;
          right: 12px;
          background: #f1f5f9;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .lightbox-img {
          max-width: 100%;
          max-height: 70vh;
          object-fit: contain;
        }

        .lightbox-caption {
          font-size: 13px;
          color: #475569;
          margin-top: 12px;
        }
      `}</style>
    </div>
  );
}
