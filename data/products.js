// BizBein Innovations Pvt. Ltd. — Product & Equipment Catalog Data

export const categories = [
  { 
    id: 'conveyor-systems', 
    name: 'Conveyor Systems', 
    image: '/prod-modular-belt.jpg',
    tag: 'Belt & Roller Lines'
  },
  { 
    id: 'material-handling', 
    name: 'Material Handling', 
    image: '/cat-forklift.jpg',
    tag: 'Stackers & Lifters'
  },
  { 
    id: 'packaging-machinery', 
    name: 'Packaging Machinery', 
    image: '/cat-packaging.jpg',
    tag: 'Sealing & Wrapping'
  },
  { 
    id: 'coding-printing', 
    name: 'Coding & Printing', 
    image: '/prod-inkjet-printer.jpg',
    tag: 'CIJ & TIJ Systems'
  },
  { 
    id: 'air-curtains', 
    name: 'Air Curtains', 
    image: '/prod-air-curtain.jpg',
    tag: 'Industrial Barriers'
  },
  { 
    id: 'pvc-strip-curtains', 
    name: 'PVC Strip Curtains', 
    image: '/cat-pvc-curtains.jpg',
    tag: 'Clear & Ribbed'
  },
  { 
    id: 'sensors-automation', 
    name: 'Sensors & Automation', 
    image: '/cat-sensors.jpg',
    tag: 'Optics & Controls'
  },
  { 
    id: 'industrial-equipment', 
    name: 'Industrial Equipment', 
    image: '/prod-gear-motor.jpg',
    tag: 'Motors & Gearboxes'
  }
];

export const featuredProducts = [
  {
    id: 'prod-mod-belt',
    name: 'Modular Belt Conveyor',
    category: 'Conveyor Systems',
    categoryId: 'conveyor-systems',
    badge: 'Best Seller',
    badgeType: 'bestseller',
    price: 65000,
    priceDisplay: '₹65,000 onwards',
    image: '/prod-modular-belt.jpg',
    unit: 'Per Section',
    rating: 4.9,
    reviews: 42,
    specs: [
      { label: 'Belt Material', value: 'Food-grade POM / PP Plastic' },
      { label: 'Frame', value: 'SS 304 / Heavy Mild Steel' },
      { label: 'Speed Range', value: '5 - 30 m/min Adjustable' },
      { label: 'Load Capacity', value: 'Up to 350 kg/m' }
    ]
  },
  {
    id: 'prod-roller-conv',
    name: 'Roller Conveyor',
    category: 'Conveyor Systems',
    categoryId: 'conveyor-systems',
    badge: 'Popular',
    badgeType: 'popular',
    price: 38000,
    priceDisplay: '₹38,000 onwards',
    image: '/prod-roller-conveyor.jpg',
    unit: 'Per 3-Meter Section',
    rating: 4.8,
    reviews: 31,
    specs: [
      { label: 'Roller Dia', value: '50mm Precision Galvanized' },
      { label: 'Drive Type', value: 'Gravity / Chain Powered' },
      { label: 'Load Capacity', value: 'Up to 400 kg/m' },
      { label: 'Height Adj.', value: '650mm - 950mm' }
    ]
  },
  {
    id: 'prod-band-sealer',
    name: 'Vertical Band Sealer',
    category: 'Packaging Machinery',
    categoryId: 'packaging-machinery',
    badge: 'New',
    badgeType: 'new',
    price: 24400,
    priceDisplay: '₹24,400',
    image: '/prod-vertical-band-sealer.jpg',
    unit: 'Complete Set with Stand',
    rating: 4.9,
    reviews: 19,
    specs: [
      { label: 'Sealing Speed', value: '0 - 16 m/min' },
      { label: 'Pouch Height', value: '150 - 600 mm Adjustable' },
      { label: 'Sealing Width', value: '8 - 10 mm Hermetic' },
      { label: 'Power', value: '220V Single Phase 550W' }
    ]
  },
  {
    id: 'prod-inkjet-printer',
    name: 'Inkjet Printer',
    category: 'Coding & Printing',
    categoryId: 'coding-printing',
    badge: 'Popular',
    badgeType: 'popular',
    price: 7900,
    priceDisplay: '₹7,900',
    image: '/prod-inkjet-printer.jpg',
    unit: 'Handheld & Inline',
    rating: 4.7,
    reviews: 64,
    specs: [
      { label: 'Print Height', value: '2mm - 12.7mm (Single / Multi-line)' },
      { label: 'Cartridge', value: 'Solvent Fast-Dry Black' },
      { label: 'Display', value: '4.3 inch Color Touchscreen' },
      { label: 'Languages', value: 'English, Hindi & Barcodes' }
    ]
  },
  {
    id: 'prod-air-curtain',
    name: 'Air Curtain',
    category: 'Air Curtains',
    categoryId: 'air-curtains',
    badge: 'Best Seller',
    badgeType: 'bestseller',
    price: 18100,
    priceDisplay: '₹18,100',
    image: '/prod-air-curtain.jpg',
    unit: '3ft / 4ft / 5ft Unit',
    rating: 4.8,
    reviews: 58,
    specs: [
      { label: 'Air Velocity', value: '18 - 21 m/s High Velocity' },
      { label: 'Door Height', value: 'Up to 3.5 Meters' },
      { label: 'Body Finish', value: 'Powder-coated Stainless Steel' },
      { label: 'Control', value: 'Remote & Door Switch Sensor' }
    ]
  },
  {
    id: 'prod-gear-motor',
    name: 'Industrial Gear Motor',
    category: 'Industrial Equipment',
    categoryId: 'industrial-equipment',
    badge: 'Popular',
    badgeType: 'popular',
    price: 32500,
    priceDisplay: '₹32,500 onwards',
    image: '/prod-gear-motor.jpg',
    unit: 'Unit with Gearbox',
    rating: 4.9,
    reviews: 27,
    specs: [
      { label: 'Power Rating', value: '0.5 HP to 5 HP Available' },
      { label: 'Gearbox Type', value: 'Worm / Helical Reduction' },
      { label: 'Voltage', value: '415V 3-Phase / 230V 1-Phase' },
      { label: 'Duty Cycle', value: 'Continuous Heavy Duty S1' }
    ]
  }
];

export const products = featuredProducts;

export const companyDetails = {
  name: 'BizBein Innovations Pvt. Ltd.',
  legalName: 'BizBein Innovations Private Limited',
  division: 'BizBein Packaging: Conveying - Coding - Packaging',
  tagline: 'Conveying • Coding • Packaging Equipment & Industrial Solutions',
  phones: ['+91 99158-56540', '+91 93153-94908'],
  primaryPhone: '+91 99158-56540',
  secondaryPhone: '+91 93153-94908',
  phone1: '+91 99158-56540',
  phone2: '+91 93153-94908',
  whatsappPhone: '+91 99158-56540',
  whatsappRaw: '919915856540',
  salesEmail: 'sales@bizbein.com',
  infoEmail: 'info@bizbein.com',
  address: 'Plot 5, NK Sharma Rd, Badal Colony, Zirakpur, Punjab 140603',
  city: 'Zirakpur, Punjab',
  mapUrl: 'https://maps.app.goo.gl/o5exHzMpAHkD4rFY6',
  googleMapsUrl: 'https://maps.app.goo.gl/o5exHzMpAHkD4rFY6',
  socials: {
    instagram: 'https://www.instagram.com/bizbein',
    facebook: 'https://www.facebook.com/bizbein',
    linkedin: 'https://www.linkedin.com/company/bizbein-innovations',
    youtube: 'https://www.youtube.com/@bizbein',
    twitter: 'https://twitter.com/bizbein'
  }
};
