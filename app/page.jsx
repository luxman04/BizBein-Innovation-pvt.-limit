'use client';

import React, { useState } from 'react';
import HeroBanner from '../components/HeroBanner';
import PopularCategories from '../components/PopularCategories';
import PromoBanner from '../components/PromoBanner';
import FeaturedProducts from '../components/FeaturedProducts';
import { featuredProducts, companyDetails } from '../data/products';
import { useStore } from '../context/StoreContext';

export default function StorefrontHomePage() {
  const { addToCart, openQuoteModal, searchQuery } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('all');

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="homepage-content">
        {/* 1. Industrial Hero Banner */}
        <HeroBanner
          onExploreClick={() => setSelectedCategory('conveyor-systems')}
          onOpenQuote={() => openQuoteModal(featuredProducts[0])}
        />

        {/* 2. Popular Categories (8 Cards with Category Navigation) */}
        <PopularCategories
          onSelectCategory={(catId) => setSelectedCategory(catId)}
        />

        {/* 3. Industrial Partner Promotional Banner */}
        <PromoBanner
          onOpenQuote={() => openQuoteModal(featuredProducts[0])}
        />

        {/* 4. Featured Products Showcase */}
        <FeaturedProducts
          onAddToCart={addToCart}
          onOpenQuoteModal={openQuoteModal}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchQuery={searchQuery}
        />
      </div>

      <style jsx>{`
        .homepage-content {
          display: flex;
          flex-direction: column;
          width: 100%;
        }
      `}</style>
    </>
  );
}
