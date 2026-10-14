// BizBein Innovations Pvt. Ltd. — Product & Equipment Catalog Data

export const categories = [
  { 
    id: 'conveyor-systems', 
    name: 'Conveyor Systems', 
    image: '/prod-modular-belt.jpg',
    tag: 'Belt & Roller Lines',
    description: 'Custom engineered modular belt, powered roller, and slat chain conveyor solutions built for high-throughput factory automation.'
  },
  { 
    id: 'material-handling', 
    name: 'Material Handling', 
    image: '/cat-forklift.jpg',
    tag: 'Stackers & Lifters',
    description: 'Rugged hydraulic stackers, pallet trucks, and drum handling machinery engineered for safe and effortless warehouse logistics.'
  },
  { 
    id: 'packaging-machinery', 
    name: 'Packaging Machinery', 
    image: '/cat-packaging.jpg',
    tag: 'Sealing & Wrapping',
    description: 'Continuous band sealers, automated carton box tapers, and strapping systems delivering airtight, factory-grade sealing.'
  },
  { 
    id: 'coding-printing', 
    name: 'Coding & Printing', 
    image: '/prod-inkjet-printer.jpg',
    tag: 'CIJ & TIJ Systems',
    description: 'High-speed Continuous Inkjet (CIJ) and Thermal Inkjet (TIJ) batch coding systems for crisp date, batch, and barcode marking.'
  },
  { 
    id: 'air-curtains', 
    name: 'Air Curtains', 
    image: '/prod-air-curtain.jpg',
    tag: 'Industrial Barriers',
    description: 'High-velocity stainless steel and commercial air curtains preventing thermal loss, insect ingress, and dust contamination.'
  },
  { 
    id: 'pvc-strip-curtains', 
    name: 'PVC Strip Curtains', 
    image: '/cat-pvc-curtains.jpg',
    tag: 'Clear & Ribbed',
    description: 'Food-grade, polar low-temperature, and anti-static PVC strip curtains complete with stainless steel suspension hardware.'
  },
  { 
    id: 'sensors-automation', 
    name: 'Sensors & Automation', 
    image: '/cat-sensors.jpg',
    tag: 'Optics & Controls',
    description: 'High-precision photoelectric sensors, proximity detectors, and programmable logic automation for conveyor line intelligence.'
  },
  { 
    id: 'industrial-equipment', 
    name: 'Industrial Equipment', 
    image: '/prod-gear-motor.jpg',
    tag: 'Motors & Gearboxes',
    description: 'Heavy-duty helical and worm gear motors, speed variators, and industrial drives built for continuous S1 duty cycles.'
  }
];

export const products = [
  // 1. Conveyor Systems
  {
    id: 'prod-mod-belt',
    name: 'Modular Belt Conveyor',
    brand: 'BizBein',
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
    description: 'Heavy-duty modular plastic belt conveyor system engineered for food processing, packaging lines, and bottling plants. Constructed with SS 304 or powder-coated mild steel frames with adjustable side guides.',
    specs: [
      { label: 'Belt Material', value: 'Food-grade POM / PP Plastic' },
      { label: 'Frame', value: 'SS 304 / Heavy Mild Steel' },
      { label: 'Speed Range', value: '5 - 30 m/min Adjustable' },
      { label: 'Load Capacity', value: 'Up to 350 kg/m' },
      { label: 'Drive Motor', value: '0.75 kW - 2.2 kW Integrated Gearbox' }
    ]
  },
  {
    id: 'prod-roller-conv',
    name: 'Powered Roller Conveyor',
    brand: 'BizBein',
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
    description: 'Precision galvanized roller conveyor designed for carton transfer, accumulation zones, and warehouse shipping lines with heavy load capability and low-noise operation.',
    specs: [
      { label: 'Roller Dia', value: '50mm Precision Galvanized' },
      { label: 'Drive Type', value: 'Gravity / Chain Powered' },
      { label: 'Load Capacity', value: 'Up to 400 kg/m' },
      { label: 'Height Adj.', value: '650mm - 950mm' },
      { label: 'Roller Pitch', value: '75mm / 100mm / 150mm' }
    ]
  },
  {
    id: 'prod-slat-chain',
    name: 'Slat Chain Conveyor Line',
    brand: 'BizBein',
    category: 'Conveyor Systems',
    categoryId: 'conveyor-systems',
    badge: 'Customizable',
    badgeType: 'new',
    price: 72000,
    priceDisplay: '₹72,000 onwards',
    image: '/cat-conveyor-modular.jpg',
    unit: 'Per Section',
    rating: 4.9,
    reviews: 18,
    description: 'High-speed stainless steel slat chain conveyor ideal for bottles, cans, aerosol containers, and pharmaceutical vials requiring stable, spill-free linear transport.',
    specs: [
      { label: 'Chain Type', value: 'SS 304 / Delrin Plastic Slat' },
      { label: 'Width Options', value: '82.6 mm to 190.5 mm' },
      { label: 'Speed Range', value: 'Up to 45 m/min' },
      { label: 'Side Guides', value: 'Ultra-High-Molecular-Weight (UHMW) PE' }
    ]
  },

  // 2. Material Handling
  {
    id: 'prod-semi-stacker',
    name: 'Semi-Electric Hydraulic Stacker',
    brand: 'BizBein',
    category: 'Material Handling',
    categoryId: 'material-handling',
    badge: 'Heavy Duty',
    badgeType: 'bestseller',
    price: 58000,
    priceDisplay: '₹58,000 onwards',
    image: '/cat-forklift.jpg',
    unit: 'Unit (1.5 Ton / 3.0M)',
    rating: 4.9,
    reviews: 24,
    description: 'Engineered for warehouse pallet racking, truck offloading, and industrial die handling. Features motorized hydraulic lifting with manual push-pull steering for maximum maneuverability.',
    specs: [
      { label: 'Load Capacity', value: '1500 kg (1.5 Ton)' },
      { label: 'Lift Height', value: '1.6m - 3.5m Dual Mast' },
      { label: 'Operation', value: 'Electric Lift / Manual Push' },
      { label: 'Battery', value: '12V / 120Ah Industrial Traction' },
      { label: 'Fork Length', value: '1150 mm Adjustable Width' }
    ]
  },
  {
    id: 'prod-pallet-truck',
    name: 'Heavy Duty Hand Pallet Truck',
    brand: 'BizBein',
    category: 'Material Handling',
    categoryId: 'material-handling',
    badge: 'Popular',
    badgeType: 'popular',
    price: 18500,
    priceDisplay: '₹18,500',
    image: '/cat-forklift.jpg',
    unit: 'Unit (2.5 Ton Capacity)',
    rating: 4.8,
    reviews: 45,
    description: 'Industrial hand pallet truck with leak-proof integrated hydraulic pump, nylon/polyurethane steering rollers, and reinforced torsion-resistant steel chassis.',
    specs: [
      { label: 'Capacity', value: '2500 kg (2.5 Ton)' },
      { label: 'Fork Length', value: '1150 mm Standard' },
      { label: 'Fork Spread', value: '550 mm / 685 mm' },
      { label: 'Pump Type', value: 'Sealed Integrated Casting Pump' },
      { label: 'Wheel Material', value: 'Tandem Polyurethane (PU)' }
    ]
  },

  // 3. Packaging Machinery
  {
    id: 'prod-band-sealer',
    name: 'Vertical Continuous Band Sealer',
    brand: 'BizBein Packaging',
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
    description: 'High-speed vertical pouch sealer with conveyor bed, digital PID temperature controllers, and embossing date stamp. Perfect for grains, liquids, powders, and chemical bags.',
    specs: [
      { label: 'Sealing Speed', value: '0 - 16 m/min' },
      { label: 'Pouch Height', value: '150 - 600 mm Adjustable' },
      { label: 'Sealing Width', value: '8 - 10 mm Hermetic' },
      { label: 'Power', value: '220V Single Phase 550W' },
      { label: 'Coding Device', value: 'Solid Ink Roller Imprinter' }
    ]
  },
  {
    id: 'prod-carton-sealer',
    name: 'Automatic Carton Box Sealer',
    brand: 'BizBein Packaging',
    category: 'Packaging Machinery',
    categoryId: 'packaging-machinery',
    badge: 'Best Seller',
    badgeType: 'bestseller',
    price: 85000,
    priceDisplay: '₹85,000 onwards',
    image: '/cat-packaging.jpg',
    unit: 'Top & Bottom Taper Machine',
    rating: 4.9,
    reviews: 33,
    description: 'Uniform automatic carton taper that seals both top and bottom flaps simultaneously using standard BoPP adhesive tape, saving hours of manual packaging labor.',
    specs: [
      { label: 'Box Size Max', value: '500(W) x 500(H) mm' },
      { label: 'Sealing Speed', value: '18 - 22 Boxes/min' },
      { label: 'Tape Width', value: '2" / 3" BoPP Tape' },
      { label: 'Belt Drive', value: 'Side / Top & Bottom Drive' },
      { label: 'Table Height', value: '600 - 800 mm Adjustable' }
    ]
  },

  // 4. Coding & Printing
  {
    id: 'prod-inkjet-printer',
    name: 'Handheld TIJ Batch Coding Printer',
    brand: 'BizBein Coding',
    category: 'Coding & Printing',
    categoryId: 'coding-printing',
    badge: 'Popular',
    badgeType: 'popular',
    price: 7900,
    priceDisplay: '₹7,900',
    image: '/prod-inkjet-printer.jpg',
    unit: 'Complete Handheld Kit',
    rating: 4.7,
    reviews: 64,
    description: 'Portable thermal inkjet printer with high-definition touch display. Prints MRP, expiry date, batch codes, QR codes, and logos on plastic, foil, glass, metal, and cardboard.',
    specs: [
      { label: 'Print Height', value: '2mm - 12.7mm (Single / Multi-line)' },
      { label: 'Cartridge', value: 'Solvent Fast-Dry Black 42ml' },
      { label: 'Display', value: '4.3 inch Color Touchscreen' },
      { label: 'Languages', value: 'English, Hindi, Barcodes & QR' },
      { label: 'Battery Life', value: 'Up to 10 Hours Continuous' }
    ]
  },
  {
    id: 'prod-cij-printer',
    name: 'Industrial Continuous Inkjet (CIJ) Coder',
    brand: 'BizBein Coding',
    category: 'Coding & Printing',
    categoryId: 'coding-printing',
    badge: 'High Speed',
    badgeType: 'bestseller',
    price: 145000,
    priceDisplay: '₹1,45,000 onwards',
    image: '/cat-coding.jpg',
    unit: 'CIJ System with Conduit & Head',
    rating: 4.9,
    reviews: 41,
    description: 'Fully automatic online continuous inkjet coder built for nonstop high-speed bottling, FMCG, and wire extrusion lines with automatic printhead wash and viscosity control.',
    specs: [
      { label: 'Print Lines', value: '1 to 5 Lines High Speed' },
      { label: 'Max Speed', value: 'Up to 280 m/min' },
      { label: 'Cabinet', value: 'IP55 Stainless Steel 304' },
      { label: 'Ink Types', value: 'Ketone / Solvent / Food Grade' },
      { label: 'Connectivity', value: 'USB, RS232, Ethernet & Photocell' }
    ]
  },

  // 5. Air Curtains
  {
    id: 'prod-air-curtain',
    name: 'Industrial High-Velocity Air Curtain',
    brand: 'BizBein',
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
    description: 'High-velocity industrial air barrier that seals conditioned cool or warm air inside cleanrooms, warehouses, and cold stores while repelling flying insects and dust.',
    specs: [
      { label: 'Air Velocity', value: '18 - 21 m/s High Velocity' },
      { label: 'Door Height', value: 'Up to 3.5 Meters' },
      { label: 'Body Finish', value: 'Powder-coated Stainless Steel' },
      { label: 'Control', value: 'Wireless Remote & Limit Switch Sensor' },
      { label: 'Blower Type', value: 'Centrifugal Cross-Flow Impellers' }
    ]
  },
  {
    id: 'prod-commercial-curtain',
    name: 'Commercial Stainless Steel Air Curtain',
    brand: 'BizBein',
    category: 'Air Curtains',
    categoryId: 'air-curtains',
    badge: 'Low Noise',
    badgeType: 'popular',
    price: 14500,
    priceDisplay: '₹14,500',
    image: '/cat-air-curtain.jpg',
    unit: '3ft Unit Complete',
    rating: 4.8,
    reviews: 26,
    description: 'Sleek brushed stainless steel air curtain for retail entrances, commercial office towers, and pharmaceutical entrances with ultra-quiet dual-speed motor.',
    specs: [
      { label: 'Noise Level', value: '< 54 dB Low Noise' },
      { label: 'Casing', value: 'Full SS 304 Rustproof Body' },
      { label: 'Air Velocity', value: '14 - 17 m/s' },
      { label: 'Mounting', value: 'Wall / Ceiling Suspension Brackets' }
    ]
  },

  // 6. PVC Strip Curtains
  {
    id: 'prod-pvc-polar',
    name: 'Polar Grade PVC Strip Curtain',
    brand: 'BizBein',
    category: 'PVC Strip Curtains',
    categoryId: 'pvc-strip-curtains',
    badge: 'Cold Storage',
    badgeType: 'bestseller',
    price: 6800,
    priceDisplay: '₹6,800 onwards',
    image: '/cat-pvc-curtains.jpg',
    unit: 'Per Door Kit with SS Channel',
    rating: 4.9,
    reviews: 36,
    description: 'Non-cracking low-temperature PVC strips designed for deep freeze facilities, walk-in coolers, and refrigerated trucks to lock in chill down to -40°C.',
    specs: [
      { label: 'Temperature Range', value: '-40°C to +15°C' },
      { label: 'Strip Thickness', value: '2.0 mm / 3.0 mm' },
      { label: 'Strip Width', value: '200 mm / 300 mm' },
      { label: 'Hanger Type', value: 'Stainless Steel 304 Hook-On Track' },
      { label: 'Overlap', value: '50% / 100% Thermal Seal' }
    ]
  },
  {
    id: 'prod-pvc-anti-insect',
    name: 'Anti-Insect Amber PVC Strip Curtain',
    brand: 'BizBein',
    category: 'PVC Strip Curtains',
    categoryId: 'pvc-strip-curtains',
    badge: 'Food Grade',
    badgeType: 'new',
    price: 7400,
    priceDisplay: '₹7,400 onwards',
    image: '/cat-pvc-curtains.jpg',
    unit: 'Per Door Kit',
    rating: 4.8,
    reviews: 29,
    description: 'Amber yellow tinted PVC strip curtain that emits a specialized light spectrum deterring flying pests, mosquitoes, and insects from entering food packaging zones.',
    specs: [
      { label: 'Color', value: 'Translucent Yellow / Amber' },
      { label: 'Certification', value: 'Food Grade / HACCP Compliant' },
      { label: 'Strip Style', value: 'Double Ribbed Scratch-Resistant' },
      { label: 'Track Material', value: 'Grade 304 Stainless Steel' }
    ]
  },

  // 7. Sensors & Automation
  {
    id: 'prod-photoelectric-sensor',
    name: 'Photoelectric Through-Beam Sensor',
    brand: 'BizBein Automation',
    category: 'Sensors & Automation',
    categoryId: 'sensors-automation',
    badge: 'High Precision',
    badgeType: 'popular',
    price: 3400,
    priceDisplay: '₹3,400',
    image: '/cat-sensors.jpg',
    unit: 'Transmitter + Receiver Pair',
    rating: 4.8,
    reviews: 22,
    description: 'High-speed industrial optical sensor pair for accurate package counting, conveyor bottle tracking, and automatic machine stop safety loops.',
    specs: [
      { label: 'Sensing Distance', value: 'Up to 10 Meters' },
      { label: 'Output Type', value: 'NPN / PNP NO+NC Selectable' },
      { label: 'Response Time', value: '< 1 ms High Speed' },
      { label: 'Enclosure', value: 'IP67 Waterproof & Oil-resistant' },
      { label: 'Operating Voltage', value: '10 - 30V DC' }
    ]
  },
  {
    id: 'prod-proximity-sensor',
    name: 'Inductive Proximity Sensor M18',
    brand: 'BizBein Automation',
    category: 'Sensors & Automation',
    categoryId: 'sensors-automation',
    badge: 'Industrial Grade',
    badgeType: 'new',
    price: 1850,
    priceDisplay: '₹1,850',
    image: '/cat-sensors.jpg',
    unit: 'Per Sensor with 2m Cable',
    rating: 4.7,
    reviews: 18,
    description: 'Rugged non-contact metal detection proximity switch built for conveyor rotation monitoring, machine indexing, and pneumatic cylinder stroke limits.',
    specs: [
      { label: 'Barrel Size', value: 'M18 Nickel-plated Brass' },
      { label: 'Sensing Distance', value: '5 mm / 8 mm Shielded' },
      { label: 'Switching Frequency', value: 'Up to 1000 Hz' },
      { label: 'Protection', value: 'Short Circuit & Reverse Polarity' }
    ]
  },

  // 8. Industrial Equipment
  {
    id: 'prod-gear-motor',
    name: 'Industrial Helical Gear Motor',
    brand: 'BizBein',
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
    description: 'Heavy-duty industrial electric motor with precision reduction helical gearbox. Provides high torque at low speeds for conveyors, mixers, and industrial machinery.',
    specs: [
      { label: 'Power Rating', value: '0.5 HP to 5 HP Available' },
      { label: 'Gearbox Type', value: 'Helical / Worm Reduction' },
      { label: 'Voltage', value: '415V 3-Phase / 230V 1-Phase' },
      { label: 'Duty Cycle', value: 'Continuous Heavy Duty S1' },
      { label: 'Mounting', value: 'Foot / Flange Mounted' }
    ]
  },
  {
    id: 'prod-vfd-drive',
    name: 'Variable Frequency Drive (VFD)',
    brand: 'BizBein Automation',
    category: 'Industrial Equipment',
    categoryId: 'industrial-equipment',
    badge: 'Smart Drive',
    badgeType: 'bestseller',
    price: 16800,
    priceDisplay: '₹16,800 onwards',
    image: '/cat-industrial-equipment.jpg',
    unit: 'Unit (1 HP - 7.5 HP)',
    rating: 4.9,
    reviews: 35,
    description: 'Digital AC inverter drive allowing precision speed regulation, soft starting, and energy efficiency for conveyor belt motors and packaging machinery.',
    specs: [
      { label: 'Power Range', value: '0.75 kW to 5.5 kW' },
      { label: 'Input Supply', value: '220V 1-Ph / 415V 3-Ph' },
      { label: 'Control Method', value: 'V/F and Sensorless Vector Control' },
      { label: 'Communication', value: 'RS485 Modbus Built-in' }
    ]
  }
];

// Top 6 products for homepage featured showcase
export const featuredProducts = products.filter((p) => 
  ['prod-mod-belt', 'prod-roller-conv', 'prod-band-sealer', 'prod-inkjet-printer', 'prod-air-curtain', 'prod-gear-motor'].includes(p.id)
);

// Dynamic Query Functions
export function getAllCategories() {
  return categories;
}

export function getCategoryById(idOrSlug) {
  if (!idOrSlug) return null;
  const normalized = idOrSlug.toLowerCase().trim();
  return categories.find((c) => c.id.toLowerCase() === normalized) || null;
}

export function getProductsByCategory(categoryId) {
  if (!categoryId || categoryId === 'all') return products;
  const normalized = categoryId.toLowerCase().trim();
  return products.filter((p) => p.categoryId.toLowerCase() === normalized);
}

export function getProductById(id) {
  if (!id) return null;
  return products.find((p) => p.id.toLowerCase() === id.toLowerCase().trim()) || null;
}

export function getAllProducts() {
  return products;
}

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
