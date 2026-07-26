import type { Product, Coupon, Review, FAQItem, CMSData } from '../types';
import { purifierImg, explodedImg, hepaImg, powerImg, aqiImg, carbonImg } from '../assets/productAssets';

export const initialProducts: Product[] = [
  {
    id: 'prod-001',
    sku: 'PAV-MOD-ONE',
    name: 'Pavitra Air Module One',
    tagline: 'Your first step to clean, smart and sustainable air. Comes with all core modules. Upgrade anytime.',
    price: 3500,
    originalPrice: 4999,
    discountPercentage: 30,
    coverImage: purifierImg,
    images: [
      purifierImg,
      explodedImg,
      hepaImg
    ],
    category: 'purifier',
    stock: 42,
    isFeatured: true,
    isPublished: true,
    rating: 4.8,
    reviewsCount: 2140,
    description: 'Pavitra Air Module One is the world\'s first plant-based, modular air purifier. Built entirely from bio-degradable PLA and high-precision H13 HEPA components, it allows you to swap filters, sensors, and power drivers in seconds without throwing away the chassis.',
    specs: [
      { label: 'Coverage Area', value: 'Up to 350 sq. ft.' },
      { label: 'Filtration System', value: '3-Stage H13 HEPA + Active Carbon' },
      { label: 'Display', value: 'Real-time Laser AQI OLED Screen' },
      { label: 'Power Input', value: 'USB-C (5V / 2A Silent BLDC Driver)' },
      { label: 'Material', value: '100% Plant-Based Biodegradable PLA' },
      { label: 'Warranty', value: '1 Year Comprehensive Warranty' }
    ],
    features: [
      'Covers up to 350 sq. ft. room size',
      '3-Stage Filtration System (Pre-filter + H13 HEPA + Carbon)',
      'Real-time OLED AQI Display with Laser PM2.5 Sensor',
      'Ultra-quiet 24dB Night Mode operation',
      'USB-C Universal Power Input (Run via Powerbank or Adapter)',
      '1 Year Hassle-Free Replacement Warranty'
    ],
    coverageArea: '350 sq. ft.',
    filtrationType: 'H13 HEPA',
    dimensions: '180mm x 180mm x 320mm',
    weight: '1.45 kg',
    warranty: '1 Year Full Replacement',
    includedItems: [
      'Top Cover (Installed)',
      'HEPA H13 Filter (Installed)',
      'Power Module (Installed)',
      'AQI Meter (Installed)',
      'Main Base Shell',
      'Braided USB-C Cable (1.5m)',
      'User Quick Start Guide'
    ],
    documents: [
      { name: 'Product Manual PDF', url: '#' },
      { name: 'PLA Sustainability Certificate', url: '#' }
    ]
  },
  {
    id: 'prod-002',
    sku: 'PAV-FLT-H13',
    name: 'H13 Medical Grade HEPA Filter Module',
    tagline: 'Captures 99.97% of airborne particles as small as 0.3 microns including pollen, PM2.5, dust and smoke.',
    price: 1100,
    originalPrice: 1499,
    discountPercentage: 27,
    coverImage: hepaImg,
    images: [
      hepaImg
    ],
    category: 'filter',
    stock: 150,
    isFeatured: true,
    isPublished: true,
    rating: 4.9,
    reviewsCount: 890,
    description: 'High-efficiency replacement HEPA filter canister module with integrated carbon pre-filter layer. Easy twist-and-swap replacement in under 5 seconds.',
    specs: [
      { label: 'Filter Rating', value: 'True H13 Medical Grade' },
      { label: 'Lifespan', value: '6 to 8 Months (Continuous Use)' },
      { label: 'Particle Capture', value: '99.97% down to 0.3µm' }
    ],
    features: [
      'Fits Pavitra Air Module One & Module Pro',
      'Includes activated charcoal odor layer',
      '100% recyclable cardboard endcaps'
    ],
    coverageArea: '350 sq. ft.',
    filtrationType: 'H13 HEPA',
    dimensions: '150mm x 150mm x 140mm',
    weight: '320 g',
    warranty: '6 Months Replacement',
    includedItems: ['H13 HEPA Cylinder Filter Module']
  },
  {
    id: 'prod-003',
    sku: 'PAV-FAN-BLDC',
    name: 'BLDC Fan Core Module',
    tagline: 'Silent brushless DC motor fan core with magnetic levitation bearings.',
    price: 500,
    originalPrice: 799,
    discountPercentage: 37,
    coverImage: powerImg,
    images: [
      powerImg
    ],
    category: 'power_module',
    stock: 85,
    isFeatured: false,
    isPublished: true,
    rating: 4.7,
    reviewsCount: 320,
    description: 'Silent BLDC fan core module designed for whisper-quiet 24dB operation.',
    specs: [
      { label: 'Motor Type', value: 'Brushless DC (BLDC)' },
      { label: 'Noise Level', value: '24dB - 48dB' },
      { label: 'Power Draw', value: '5W' }
    ],
    features: [
      'Whisper quiet 24dB operation',
      'Magnetic levitation bearings',
      '100% replaceable fan blades'
    ],
    coverageArea: 'N/A',
    filtrationType: 'N/A',
    dimensions: '140mm x 140mm x 50mm',
    weight: '220 g',
    warranty: '2 Years Warranty',
    includedItems: ['BLDC Fan Core Module']
  },
  {
    id: 'prod-004',
    sku: 'PAV-PWR-USBC',
    name: 'USB-C Smart Power Supply Module',
    tagline: 'USB-C power management driver module with 5V/2A input support.',
    price: 600,
    originalPrice: 899,
    discountPercentage: 33,
    coverImage: powerImg,
    images: [
      powerImg
    ],
    category: 'power_module',
    stock: 90,
    isFeatured: false,
    isPublished: true,
    rating: 4.8,
    reviewsCount: 280,
    description: 'Plug-and-play USB-C power module. Runs directly via wall adapter, laptop, or portable powerbank.',
    specs: [
      { label: 'Power Input', value: 'USB-C (5V / 2A)' },
      { label: 'Protection', value: 'Over-voltage & Short Circuit' }
    ],
    features: [
      'Universal USB-C compatibility',
      'Thermal overload protection'
    ],
    coverageArea: 'N/A',
    filtrationType: 'N/A',
    dimensions: '120mm x 120mm x 40mm',
    weight: '160 g',
    warranty: '2 Years Warranty',
    includedItems: ['USB-C Power Supply Module']
  },
  {
    id: 'prod-005',
    sku: 'PAV-AQI-OLED',
    name: 'Smart OLED AQI Sensor Module',
    tagline: 'Precision laser PM2.5 air quality monitor with crisp OLED numerical display.',
    price: 500,
    originalPrice: 799,
    discountPercentage: 37,
    coverImage: aqiImg,
    images: [
      aqiImg
    ],
    category: 'aqi_sensor',
    stock: 60,
    isFeatured: true,
    isPublished: true,
    rating: 4.9,
    reviewsCount: 410,
    description: 'Plug-and-play OLED AQI module. Constantly samples air quality using dual-beam optical laser sensors and displays real-time PM2.5 readings.',
    specs: [
      { label: 'Sensor Type', value: 'Laser Scattering PM2.5' },
      { label: 'Display', value: '0.96" OLED High Contrast' },
      { label: 'Response Time', value: '< 1 Second' }
    ],
    features: [
      'Real-time PM2.5 & Air Quality Index output',
      'Color-coded safety backlight indicator',
      'Magnetic click-in connector'
    ],
    coverageArea: 'N/A',
    filtrationType: 'N/A',
    dimensions: '80mm x 60mm x 35mm',
    weight: '90 g',
    warranty: '1 Year Warranty',
    includedItems: ['Smart OLED AQI Sensor Module']
  },
  {
    id: 'prod-006',
    sku: 'PAV-ACC-CRB',
    name: 'Activated Carbon Honeycomb Filter',
    tagline: 'Specialized coconut-shell carbon canister for VOCs, pet odor, and cooking smoke.',
    price: 600,
    originalPrice: 899,
    discountPercentage: 33,
    coverImage: carbonImg,
    images: [
      carbonImg
    ],
    category: 'accessory',
    stock: 75,
    isFeatured: false,
    isPublished: true,
    rating: 4.8,
    reviewsCount: 310,
    description: 'High-density activated carbon filter canister designed to eliminate odors and volatile organic compounds.',
    specs: [
      { label: 'Filter Type', value: 'Coconut Shell Carbon' },
      { label: 'Target', value: 'VOCs, Smoke, Odors' }
    ],
    features: [
      'Absorbs heavy kitchen odors and smoke',
      'Eco-friendly recyclable shell'
    ],
    coverageArea: '350 sq. ft.',
    filtrationType: 'Activated Carbon',
    dimensions: '150mm x 150mm x 80mm',
    weight: '250 g',
    warranty: '6 Months Replacement',
    includedItems: ['Activated Carbon Honeycomb Module']
  }
];

export const initialCoupons: Coupon[] = [
  {
    id: 'coup-001',
    code: 'CLEAN20',
    type: 'percentage',
    value: 20,
    minPurchase: 1000,
    expiryDate: '2027-12-31',
    usageLimit: 1000,
    timesUsed: 142,
    isActive: true
  },
  {
    id: 'coup-002',
    code: 'WELCOME500',
    type: 'fixed',
    value: 500,
    minPurchase: 2000,
    expiryDate: '2027-12-31',
    usageLimit: 500,
    timesUsed: 89,
    isActive: true
  },
  {
    id: 'coup-003',
    code: 'FREESHIP',
    type: 'fixed',
    value: 150,
    minPurchase: 499,
    expiryDate: '2027-12-31',
    usageLimit: 5000,
    timesUsed: 610,
    isActive: true
  }
];

export const initialReviews: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-001',
    authorName: 'Rohit M.',
    avatarUrl: '',
    location: 'Bengaluru',
    rating: 5,
    title: 'Super easy to swap modules & eco-friendly!',
    comment: 'Super easy to use and replace modules. Love the eco-friendly material. Total value for money!',
    verifiedPurchase: true,
    createdAt: '2026-06-15'
  },
  {
    id: 'rev-2',
    productId: 'prod-001',
    authorName: 'Ananya T.',
    avatarUrl: '',
    location: 'Mumbai',
    rating: 5,
    title: 'Good for the planet and wallet',
    comment: 'Finally, an air purifier that doesn\'t burn a hole in my pocket and is good for the planet.',
    verifiedPurchase: true,
    createdAt: '2026-06-20'
  },
  {
    id: 'rev-3',
    productId: 'prod-001',
    authorName: 'Karan S.',
    avatarUrl: '',
    location: 'Delhi',
    rating: 5,
    title: 'Accurate AQI meter & sleek design',
    comment: 'The AQI meter is accurate and the design fits perfectly in my workspace.',
    verifiedPurchase: true,
    createdAt: '2026-07-02'
  }
];

export const initialFAQs: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Modules & Specs',
    question: 'How do I replace modules on Pavitra Air Module One?',
    answer: 'It takes zero tools and less than 5 seconds! Simply twist the top cover lid anti-clockwise, lift out the module you wish to swap (e.g. HEPA filter or AQI sensor), drop in the new module, and close.'
  },
  {
    id: 'faq-2',
    category: 'Sustainability',
    question: 'What is Plant-Based Biodegradable PLA?',
    answer: 'PLA (Polylactic Acid) is a bio-plastic derived from renewable organic starches such as corn and sugarcane. Unlike traditional toxic petroleum plastics that sit in landfills for 500+ years, our chassis naturally biodegrades under industrial composting conditions.'
  },
  {
    id: 'faq-3',
    category: 'General',
    question: 'Can I run Pavitra Air Module One with a powerbank?',
    answer: 'Yes! Pavitra Module One features a high-efficiency USB-C port (5V/2A). You can plug it into any standard smartphone wall charger, laptop USB port, or portable powerbank.'
  },
  {
    id: 'faq-4',
    category: 'Shipping & Order',
    question: 'What is the standard delivery timeline across India?',
    answer: 'We provide Free Express Pan-India shipping. Metro cities receive delivery in 2-3 business days, while all other locations take 4-5 business days.'
  },
  {
    id: 'faq-5',
    category: 'Warranty',
    question: 'What does the 1-Year Comprehensive Warranty cover?',
    answer: 'Our warranty covers all internal electronic components, BLDC motor driver, and AQI OLED screen. If any component fails, we ship a replacement module straight to your doorstep free of charge!'
  }
];

export const initialCMS: CMSData = {
  heroTitleLine1: 'CLEAN AIR.',
  heroTitleLine2: 'CLEVER DESIGN.',
  heroTitleHighlight: 'ZERO WASTE.',
  heroSubtitle: 'Affordable. Upgradeable. Planet-friendly. Air purifiers that adapt to your life and the planet\'s future.',
  heroBannerTag: 'MODULAR AIR PURIFIERS',
  announcementText: '⚡ FREE PAN-INDIA SHIPPING ON ORDERS OVER ₹1,999 | USE CODE "CLEAN20" FOR 20% OFF',
  announcementLink: '/products',
  announcementActive: true,
  carbonSavedKg: 14850,
  plasticReducedKg: 8920,
  purifiersSold: 3450,
  recyclabilityRate: 100,
  contactEmail: 'snehakrishnamurthy25@gmail.com',
  contactPhone: '+91 9036767664',
  contactAddress: 'Cubbonpet, Bengaluru Rural, Karnataka - 560002',
  aboutUsText: 'Pavitra Innovations was founded in 2026 with a single mission: to eliminate electronic and plastic waste in personal home appliances. Our modular design philosophy ensures that you only replace what wears out, saving you money and preserving planet Earth.',
  privacyPolicy: 'We value your privacy. Your personal information and addresses are securely stored and never shared with third parties.',
  shippingPolicy: 'We ship all orders via priority express couriers across India. Free shipping applies to all orders over ₹1,999.',
  refundPolicy: 'We offer a 7-day no-questions-asked easy return policy. Returned products are refurbished or recycled cleanly.',
  termsAndConditions: 'By using Pavitra Innovations website and services, you agree to our standard terms of service.'
};
