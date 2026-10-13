'use client';

import React, { useState } from 'react';
import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import PopularCategories from '../components/PopularCategories';
import PromoBanner from '../components/PromoBanner';
import FeaturedProducts from '../components/FeaturedProducts';
import Footer from '../components/Footer';
import MobileBottomNav from '../components/MobileBottomNav';
import WhatsAppButton from '../components/WhatsAppButton';
import RequestQuoteModal from '../components/RequestQuoteModal';
import QuickInquiryDrawer from '../components/QuickInquiryDrawer';
import ExpertCallModal from '../components/ExpertCallModal';
import TrackOrderModal from '../components/TrackOrderModal';
import LocationAndContactModal from '../components/LocationAndContactModal';
import { featuredProducts, companyDetails } from '../data/products';

export default function StorefrontPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState([
    {
      ...featuredProducts[0], // Pre-populate with Modular Belt Conveyor
      qty: 1
    }
  ]);

  // Modal States
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [activeQuoteProduct, setActiveQuoteProduct] = useState(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [expertModalOpen, setExpertModalOpen] = useState(false);
  const [trackModalOpen, setTrackModalOpen] = useState(false);

  // Cart operations
  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setCartDrawerOpen(true);
  };

  const handleUpdateQty = (id, newQty) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty: newQty } : item))
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleOpenQuoteModal = (product) => {
    setActiveQuoteProduct(product || featuredProducts[0]);
    setQuoteModalOpen(true);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  // Schema.org Structured Data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: companyDetails.name,
    legalName: companyDetails.legalName || 'BizBein Innovations Private Limited',
    department: companyDetails.division,
    url: 'https://www.bizbein.com/',
    telephone: companyDetails.phone1 || companyDetails.primaryPhone,
    faxNumber: companyDetails.phone2 || companyDetails.secondaryPhone,
    email: companyDetails.salesEmail,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Plot 5, NK Sharma Rd, Badal Colony',
      addressLocality: 'Zirakpur',
      addressRegion: 'Punjab',
      postalCode: '140603',
      addressCountry: 'IN'
    },
    hasMap: companyDetails.mapUrl || companyDetails.googleMapsUrl
  };

  return (
    <>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="storefront-page-wrap">
        {/* 1. Header with Top Bar, Search & Nav */}
        <Header
          cartCount={totalCartCount}
          onOpenCart={() => setCartDrawerOpen(true)}
          onOpenQuote={() => handleOpenQuoteModal(featuredProducts[0])}
          onOpenExpert={() => setExpertModalOpen(true)}
          onOpenTrack={() => setTrackModalOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          onSelectCategory={(catId) => setSelectedCategory(catId)}
        />

        <main id="main-content">
          {/* 2. Industrial Hero Banner */}
          <HeroBanner
            onExploreClick={() => setSelectedCategory('conveyor-systems')}
            onOpenQuote={() => handleOpenQuoteModal(featuredProducts[0])}
          />

          {/* 3. Popular Categories (8 Cards) */}
          <PopularCategories
            onSelectCategory={(catId) => setSelectedCategory(catId)}
          />

          {/* 4. Industrial Partner Promotional Banner */}
          <PromoBanner
            onOpenQuote={() => handleOpenQuoteModal(featuredProducts[0])}
          />

          {/* 5. Featured Products (6 Cards Grid) */}
          <FeaturedProducts
            onAddToCart={handleAddToCart}
            onOpenQuoteModal={handleOpenQuoteModal}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchQuery={searchQuery}
          />
        </main>

        {/* 6. Comprehensive Industrial Footer */}
        <Footer onOpenContact={() => setContactModalOpen(true)} />

        {/* 7. Floating WhatsApp Support Button */}
        <WhatsAppButton />

        {/* 8. Mobile Sticky Bottom Nav Bar */}
        <MobileBottomNav
          cartCount={totalCartCount}
          onOpenCart={() => setCartDrawerOpen(true)}
          onOpenContact={() => setContactModalOpen(true)}
        />

        {/* Modals & Interactive Drawers */}
        <RequestQuoteModal
          isOpen={quoteModalOpen}
          onClose={() => setQuoteModalOpen(false)}
          product={activeQuoteProduct}
        />

        <QuickInquiryDrawer
          isOpen={cartDrawerOpen}
          onClose={() => setCartDrawerOpen(false)}
          cartItems={cartItems}
          onUpdateQty={handleUpdateQty}
          onRemoveItem={handleRemoveItem}
          onOpenQuoteModal={handleOpenQuoteModal}
        />

        <ExpertCallModal
          isOpen={expertModalOpen}
          onClose={() => setExpertModalOpen(false)}
        />

        <TrackOrderModal
          isOpen={trackModalOpen}
          onClose={() => setTrackModalOpen(false)}
        />

        <LocationAndContactModal
          isOpen={contactModalOpen}
          onClose={() => setContactModalOpen(false)}
        />
      </div>

      <style jsx>{`
        .storefront-page-wrap {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background-color: #f8fafc;
        }

        #main-content {
          flex: 1;
        }
      `}</style>
    </>
  );
}
