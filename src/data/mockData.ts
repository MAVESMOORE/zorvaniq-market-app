import { Product, Conversation, DataPackage, SellerPlan, Order } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'Ashanti Gold Embroidered Kaftan & Designer Shirt',
    sellerId: 'seller-kofi',
    sellerName: 'Kofi Mensah Fashion Hub',
    sellerCity: 'Kumasi',
    category: 'Fashion',
    price: 180,
    originalPrice: 220,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=700&auto=format&fit=crop&q=80',
    description: 'Handcrafted luxury designer shirt tailored in Adum, Kumasi. Premium breathable linen with traditional gold thread embroidery. Perfect for corporate events, weddings, and Friday wear.',
    stock: 15,
    rating: 4.9,
    reviewsCount: 38,
    isSponsored: true,
    allowNegotiation: true,
    minNegotiationPrice: 150,
    createdAt: '2026-09-12'
  },
  {
    id: 'prod-2',
    title: 'Samsung Galaxy A55 5G (128GB/8GB RAM) Dual SIM',
    sellerId: 'seller-nana',
    sellerName: 'Nana Accra Gadget World',
    sellerCity: 'Accra (Circle)',
    category: 'Gadgets & Computing',
    price: 3450,
    originalPrice: 3700,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=700&auto=format&fit=crop&q=80',
    description: 'Brand new in sealed box, official 24-month Samsung Ghana warranty. Supports 5G on MTN and Telecel Ghana. Free screen protector & fast charger included.',
    stock: 8,
    rating: 4.8,
    reviewsCount: 64,
    isSponsored: false,
    allowNegotiation: true,
    minNegotiationPrice: 3300,
    createdAt: '2026-09-14'
  },
  {
    id: 'prod-3',
    title: 'Authentic Bonwire Handwoven Kente Stole & Cloth',
    sellerId: 'seller-kofi',
    sellerName: 'Kofi Mensah Fashion Hub',
    sellerCity: 'Kumasi',
    category: 'Fashion',
    price: 450,
    originalPrice: 520,
    image: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=700&auto=format&fit=crop&q=80',
    description: 'Woven by master weavers in Bonwire, Ashanti Region. Vibrant, heavyweight royal colors signifying leadership and prosperity.',
    stock: 6,
    rating: 5.0,
    reviewsCount: 19,
    isSponsored: true,
    allowNegotiation: true,
    minNegotiationPrice: 400,
    createdAt: '2026-09-10'
  },
  {
    id: 'prod-4',
    title: 'Pure Organic Northern Shea Butter (5kg Bulk Tub)',
    sellerId: 'seller-aminata',
    sellerName: 'Savannah Natural Produce',
    sellerCity: 'Tamale',
    category: 'Health & Beauty',
    price: 120,
    originalPrice: 140,
    image: 'https://images.unsplash.com/photo-1608248597359-2917e3f8ec47?w=700&auto=format&fit=crop&q=80',
    description: '100% unrefined yellow Grade A Shea butter from women cooperatives in Tamale, Northern Region. Ideal for skincare, haircare, and cosmetic formulation.',
    stock: 40,
    rating: 4.9,
    reviewsCount: 92,
    isSponsored: false,
    allowNegotiation: false,
    createdAt: '2026-09-08'
  },
  {
    id: 'prod-5',
    title: 'Sunyani Premium Jasmine Rice (25kg Bag)',
    sellerId: 'seller-agric',
    sellerName: 'Golden Belt Agro Stores',
    sellerCity: 'Sunyani',
    category: 'Food & Agric',
    price: 360,
    originalPrice: 390,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=700&auto=format&fit=crop&q=80',
    description: 'Locally farmed, aromatic long-grain rice stone-free and clean. Support Ghanaian farmers with guaranteed fresh harvest.',
    stock: 25,
    rating: 4.7,
    reviewsCount: 45,
    isSponsored: false,
    allowNegotiation: true,
    minNegotiationPrice: 340,
    createdAt: '2026-09-11'
  },
  {
    id: 'prod-6',
    title: 'Oraimo FreePods 4 Active Noise Cancelling Earbuds',
    sellerId: 'seller-nana',
    sellerName: 'Nana Accra Gadget World',
    sellerCity: 'Accra',
    category: 'Electronics',
    price: 295,
    originalPrice: 350,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=700&auto=format&fit=crop&q=80',
    description: '35.5-hour playtime with charging case, tuned heavy bass, IPX5 waterproof, transparency mode. 1-year Carlcare warranty.',
    stock: 30,
    rating: 4.8,
    reviewsCount: 110,
    isSponsored: true,
    allowNegotiation: true,
    minNegotiationPrice: 270,
    createdAt: '2026-09-15'
  },
  {
    id: 'prod-7',
    title: 'Handcrafted Modern Bamboo & Rattan Lounge Chair',
    sellerId: 'seller-craft',
    sellerName: 'Osu Artisan Woodworks',
    sellerCity: 'Accra (Osu)',
    category: 'Home & Living',
    price: 850,
    originalPrice: 950,
    image: 'https://images.unsplash.com/photo-1580481077195-c3a821a58875?w=700&auto=format&fit=crop&q=80',
    description: 'Artisanal furniture treated against termites and moisture. Ergonomic curved seat with washable linen cushion.',
    stock: 4,
    rating: 4.9,
    reviewsCount: 14,
    isSponsored: false,
    allowNegotiation: true,
    minNegotiationPrice: 780,
    createdAt: '2026-09-05'
  },
  {
    id: 'prod-8',
    title: 'Traditional Black Soap with Aloe Vera & Neem (Box of 6)',
    sellerId: 'seller-aminata',
    sellerName: 'Savannah Natural Produce',
    sellerCity: 'Tamale',
    category: 'Health & Beauty',
    price: 85,
    originalPrice: 100,
    image: 'https://images.unsplash.com/photo-1607006310452-f4726e6ef366?w=700&auto=format&fit=crop&q=80',
    description: 'Raw Alata Samina infused with cold-pressed cocoa pod ash, unrefined shea, and neem extracts. Clears blemishes and revitalizes tone.',
    stock: 50,
    rating: 5.0,
    reviewsCount: 78,
    isSponsored: false,
    allowNegotiation: false,
    createdAt: '2026-09-13'
  }
];

export const INITIAL_DATA_PACKAGES: DataPackage[] = [
  {
    id: 'data-mtn-1',
    telco: 'MTN Ghana',
    title: 'Daily Super Saver',
    volume: '1.5 GB',
    validity: '24 Hours',
    price: 6.00,
    zorvaniqMargin: 0.60, // 10% commission to Zorvaniq
    popular: true,
    color: 'from-amber-500 to-yellow-600',
    features: ['Instant MoMo Activation', 'Works on 4G/5G Network', 'Rolls over if renewed', 'Zorvaniq Partner Reseller']
  },
  {
    id: 'data-mtn-2',
    telco: 'MTN Ghana',
    title: 'Weekly Work & Market Pass',
    volume: '7.5 GB',
    validity: '7 Days',
    price: 28.00,
    zorvaniqMargin: 2.80,
    popular: false,
    color: 'from-amber-600 to-yellow-700',
    features: ['High-speed browsing', 'No throttling', 'Free Night browsing (11pm-6am)', 'SMS top-up confirmation']
  },
  {
    id: 'data-telecel-1',
    telco: 'Telecel Ghana',
    title: 'Red Unlimited Weekend Pass',
    volume: '10 GB',
    validity: '3 Days',
    price: 22.00,
    zorvaniqMargin: 2.20,
    popular: true,
    color: 'from-red-600 to-rose-700',
    features: ['Telecel Cash integrated', 'Ultra-fast Accra & Kumasi 4G+', 'Zero buffering', 'Instant eSIM / SIM delivery']
  },
  {
    id: 'data-telecel-2',
    telco: 'Telecel Ghana',
    title: 'Monthly Business Pro',
    volume: '30 GB',
    validity: '30 Days',
    price: 90.00,
    zorvaniqMargin: 9.00,
    popular: false,
    color: 'from-red-700 to-red-900',
    features: ['Generous monthly allocation', 'Ideal for e-commerce sellers', 'Priority customer bandwidth', 'Official Telecel API partner']
  },
  {
    id: 'data-at-1',
    telco: 'AirtelTigo',
    title: 'Big Time Data (No Expiry)',
    volume: '5 GB',
    validity: 'No Expiry',
    price: 20.00,
    zorvaniqMargin: 2.00,
    popular: false,
    color: 'from-blue-600 to-indigo-700',
    features: ['Never expires until exhausted', 'Nationwide coverage', 'Dual-network roaming', 'Direct AT Money balance']
  },
  {
    id: 'data-zorvaniq-zero',
    telco: 'Zorvaniq Zero-Data',
    title: 'Market Free-Browse Pass',
    volume: 'Unlimited App Access',
    validity: '30 Days',
    price: 12.00,
    zorvaniqMargin: 3.50,
    popular: true,
    color: 'from-emerald-600 to-teal-700',
    features: ['Zero-rated Zorvaniq Market usage', 'Browse products without consuming main data', 'Direct seller messaging included', 'Powered by Telco CDN caching']
  }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    buyerId: 'buyer-isaac',
    buyerName: 'Kwesi Asante (Accra)',
    sellerId: 'seller-kofi',
    sellerName: 'Kofi Mensah Fashion Hub (Kumasi)',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    productId: 'prod-1',
    productTitle: 'Ashanti Gold Embroidered Kaftan & Designer Shirt',
    productPrice: 180,
    productImage: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&auto=format&fit=crop&q=80',
    lastMessage: 'I have accepted your offer of GH₵165! You can proceed to checkout with MoMo.',
    lastTimestamp: '10:42 AM',
    unreadCount: 1,
    messages: [
      {
        id: 'm-1',
        senderId: 'buyer-isaac',
        senderName: 'Kwesi Asante',
        senderRole: 'buyer',
        text: 'Hello Bro, I saw this designer shirt in Kumasi. Is size XL available in the gold embroidery?',
        timestamp: '10:15 AM'
      },
      {
        id: 'm-2',
        senderId: 'seller-kofi',
        senderName: 'Kofi Mensah',
        senderRole: 'seller',
        text: 'Yes chief! Pure linen in stock right here in Adum, Kumasi. I can dispatch with VIP or VIP bus parcel to Accra today.',
        timestamp: '10:20 AM'
      },
      {
        id: 'm-3',
        senderId: 'buyer-isaac',
        senderName: 'Kwesi Asante',
        senderRole: 'buyer',
        text: 'Nice one. Listed price is GH₵180. Can you consider GH₵165 so I place order now?',
        timestamp: '10:30 AM',
        isOffer: true,
        offerAmount: 165,
        offerStatus: 'accepted'
      },
      {
        id: 'm-4',
        senderId: 'seller-kofi',
        senderName: 'Kofi Mensah',
        senderRole: 'seller',
        text: 'I have accepted your offer of GH₵165! You can proceed to checkout with MoMo.',
        timestamp: '10:42 AM'
      }
    ]
  },
  {
    id: 'conv-2',
    buyerId: 'buyer-isaac',
    buyerName: 'Kwesi Asante (Accra)',
    sellerId: 'seller-nana',
    sellerName: 'Nana Accra Gadget World',
    sellerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    productId: 'prod-2',
    productTitle: 'Samsung Galaxy A55 5G (128GB/8GB RAM)',
    productPrice: 3450,
    productImage: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&auto=format&fit=crop&q=80',
    lastMessage: 'Warranty receipt is stamped inside the box. Ready for delivery to your location.',
    lastTimestamp: 'Yesterday',
    unreadCount: 0,
    messages: [
      {
        id: 'm-201',
        senderId: 'buyer-isaac',
        senderName: 'Kwesi Asante',
        senderRole: 'buyer',
        text: 'Does this have valid Samsung Ghana warranty?',
        timestamp: 'Yesterday 3:15 PM'
      },
      {
        id: 'm-202',
        senderId: 'seller-nana',
        senderName: 'Nana Gadgets',
        senderRole: 'seller',
        text: 'Warranty receipt is stamped inside the box. Ready for delivery to your location.',
        timestamp: 'Yesterday 3:20 PM'
      }
    ]
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ZQ-89421',
    buyerName: 'Kwesi Asante',
    buyerPhone: '024 412 8901',
    buyerAddress: 'Hse 42, Spintex Road, near Kotoka Airport Junction',
    buyerRegion: 'Greater Accra',
    sellerId: 'seller-kofi',
    sellerName: 'Kofi Mensah Fashion Hub',
    items: [
      {
        product: INITIAL_PRODUCTS[0],
        quantity: 1,
        negotiatedPrice: 165
      }
    ],
    subtotal: 165,
    deliveryFee: 25,
    total: 190,
    platformFee: 8.25, // 5% of 165
    sellerNetProceeds: 156.75, // 95%
    paymentMethod: 'mtn_momo',
    paymentPhone: '024 412 8901',
    status: 'dispatched',
    placedAt: '2026-09-16 09:30 AM',
    deliveryAgent: {
      name: 'Emmanuel Osei (Zorvaniq Express Rider)',
      phone: '055 789 2314',
      vehicle: 'Yamaha Crux Motorbike (GE-4921-24)',
      etaMinutes: 28
    },
    trackingUpdates: [
      {
        status: 'placed',
        timestamp: '09:30 AM',
        message: 'Order created and MoMo payment authorized'
      },
      {
        status: 'escrow_locked',
        timestamp: '09:31 AM',
        message: 'GH₵190 locked in Zorvaniq Escrow Protection. Funds safe until buyer confirms.'
      },
      {
        status: 'preparing',
        timestamp: '10:05 AM',
        message: 'Seller Kofi Mensah in Kumasi packaged the shirt and tagged for intercity transit.'
      },
      {
        status: 'dispatched',
        timestamp: '01:15 PM',
        message: 'Dispatched to Accra Hub. Rider Emmanuel Osei is en route to Spintex Road.'
      }
    ]
  }
];

export const SELLER_PLANS: SellerPlan[] = [
  {
    id: 'free',
    name: 'Starter Vendor',
    priceMonthly: 0,
    maxListings: 5,
    commissionRate: 7.5,
    analytics: false,
    prioritySupport: false,
    promotedListingCredits: 0
  },
  {
    id: 'business',
    name: 'Business Pro',
    priceMonthly: 45,
    maxListings: 50,
    commissionRate: 5.0,
    analytics: true,
    prioritySupport: true,
    promotedListingCredits: 2
  },
  {
    id: 'premium',
    name: 'Market Leader',
    priceMonthly: 110,
    maxListings: 250,
    commissionRate: 3.5,
    analytics: true,
    prioritySupport: true,
    promotedListingCredits: 8
  },
  {
    id: 'enterprise',
    name: 'Enterprise Brand',
    priceMonthly: 280,
    maxListings: 9999,
    commissionRate: 2.5,
    analytics: true,
    prioritySupport: true,
    promotedListingCredits: 25
  }
];
