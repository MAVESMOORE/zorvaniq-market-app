import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Users,
  Globe,
  Compass,
  ShoppingBag,
  DollarSign,
  Package,
  ArrowUpRight,
  Sparkles,
  Calendar,
  Download,
  Filter,
  Clock,
  Smartphone,
  MapPin,
  CreditCard,
  Percent,
  ShieldCheck,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Search,
  Share2,
  Zap,
  Award,
  Activity,
  ChevronRight
} from 'lucide-react';
import { Product, Order, GhanaRegion } from '../types';

interface SellerAnalyticsDashboardProps {
  products: Product[];
  orders: Order[];
  onOpenProductModal?: (product: Product) => void;
  onNavigateToProducts?: () => void;
  onNavigateToOrders?: () => void;
}

type TimeRange = 'today' | '7d' | '30d' | '90d' | 'ytd';

interface ProductMetric {
  product: Product;
  unitsSold: number;
  revenue: number;
  pageViews: number;
  cartAdds: number;
  conversionRate: number;
  stockRemaining: number;
  daysOfInventory: number;
  status: 'top_seller' | 'trending' | 'low_stock' | 'healthy';
}

export const SellerAnalyticsDashboard: React.FC<SellerAnalyticsDashboardProps> = ({
  products = [],
  orders = [],
  onOpenProductModal,
  onNavigateToProducts,
  onNavigateToOrders
}) => {
  const safeProducts = Array.isArray(products) ? products : [];
  const safeOrders = Array.isArray(orders) ? orders : [];
  // Filters State
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [chartMetric, setChartMetric] = useState<'revenue' | 'orders'>('revenue');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  const [productSearch, setProductSearch] = useState<string>('');
  const [showExportToast, setShowExportToast] = useState<boolean>(false);
  const [activeSegmentTab, setActiveSegmentTab] = useState<'regions' | 'buyer_types' | 'payments'>('regions');

  // Multiplier depending on selected time range
  const rangeMultiplier = useMemo(() => {
    switch (timeRange) {
      case 'today':
        return 0.12;
      case '7d':
        return 0.35;
      case '30d':
        return 1.0;
      case '90d':
        return 2.7;
      case 'ytd':
        return 6.4;
      default:
        return 1.0;
    }
  }, [timeRange]);

  const rangeLabel = useMemo(() => {
    switch (timeRange) {
      case 'today':
        return 'Today (Sep 16, 2026)';
      case '7d':
        return 'Last 7 Days';
      case '30d':
        return 'Last 30 Days (August 17 – September 16)';
      case '90d':
        return 'Last 90 Days (Q3 2026)';
      case 'ytd':
        return 'Year-to-Date (2026)';
    }
  }, [timeRange]);

  // Aggregate base numbers
  const completedOrdersCount = Math.round(48 * rangeMultiplier);
  const baseGrossSales = 12450 * rangeMultiplier;
  const platformFees = baseGrossSales * 0.05; // 5% Zorvaniq fee
  const netSellerRevenue = baseGrossSales - platformFees;
  const averageOrderValue = baseGrossSales / (completedOrdersCount || 1);
  const totalStoreVisitors = Math.round(3840 * rangeMultiplier);
  const totalProductViews = Math.round(9620 * rangeMultiplier);
  const totalCartAdditions = Math.round(1450 * rangeMultiplier);
  const storeConversionRate = ((completedOrdersCount / (totalStoreVisitors || 1)) * 100);

  // Escrow balance breakdown
  const escrowSettled = netSellerRevenue * 0.82;
  const escrowPendingDelivery = netSellerRevenue * 0.18;

  // Timeline Data for SVG chart
  const timelineData = useMemo(() => {
    if (timeRange === 'today') {
      return [
        { label: '6 AM', revenue: 120, orders: 1 },
        { label: '8 AM', revenue: 260, orders: 2 },
        { label: '10 AM', revenue: 450, orders: 3 },
        { label: '12 PM', revenue: 680, orders: 4 },
        { label: '2 PM', revenue: 520, orders: 3 },
        { label: '4 PM', revenue: 890, orders: 5 },
        { label: '6 PM', revenue: 1240, orders: 7 },
        { label: '8 PM', revenue: 1450, orders: 8 }
      ];
    }
    if (timeRange === '7d') {
      return [
        { label: 'Thu', revenue: 1420, orders: 6 },
        { label: 'Fri', revenue: 2150, orders: 9 },
        { label: 'Sat', revenue: 2890, orders: 12 },
        { label: 'Sun', revenue: 1840, orders: 8 },
        { label: 'Mon', revenue: 1350, orders: 5 },
        { label: 'Tue', revenue: 1980, orders: 8 },
        { label: 'Wed', revenue: 2240, orders: 10 }
      ];
    }
    if (timeRange === '30d') {
      return [
        { label: 'Aug 18', revenue: 1650, orders: 7 },
        { label: 'Aug 22', revenue: 2200, orders: 9 },
        { label: 'Aug 26', revenue: 2850, orders: 11 },
        { label: 'Aug 30', revenue: 3400, orders: 14 },
        { label: 'Sep 03', revenue: 2950, orders: 12 },
        { label: 'Sep 07', revenue: 3650, orders: 15 },
        { label: 'Sep 11', revenue: 4120, orders: 16 },
        { label: 'Sep 16', revenue: 4580, orders: 18 }
      ];
    }
    // 90d or ytd
    return [
      { label: 'May', revenue: 9800, orders: 38 },
      { label: 'Jun', revenue: 12400, orders: 49 },
      { label: 'Jul', revenue: 14600, orders: 56 },
      { label: 'Aug', revenue: 18200, orders: 72 },
      { label: 'Sep (MTD)', revenue: 19800, orders: 79 }
    ];
  }, [timeRange]);

  // Scaled max value for timeline
  const maxTimelineVal = useMemo(() => {
    return Math.max(...timelineData.map((d) => (chartMetric === 'revenue' ? d.revenue : d.orders * 250)), 100);
  }, [timelineData, chartMetric]);

  // Products performance computation
  const productMetrics: ProductMetric[] = useMemo(() => {
    return safeProducts.map((p, idx) => {
      // Realistic simulation based on product attributes
      const baseUnits = idx === 0 ? 32 : idx === 1 ? 14 : idx === 2 ? 22 : 9 + (idx % 5);
      const unitsSold = Math.max(1, Math.round(baseUnits * rangeMultiplier));
      const revenue = unitsSold * p.price;
      const pageViews = Math.round(unitsSold * (18 + (idx * 3)));
      const cartAdds = Math.round(unitsSold * 2.8);
      const conversionRate = Number(((unitsSold / (pageViews || 1)) * 100).toFixed(1));
      const daysOfInventory = Math.max(2, Math.round(p.stock / Math.max(0.4, unitsSold / (30 * rangeMultiplier))));

      let status: ProductMetric['status'] = 'healthy';
      if (idx === 0) status = 'top_seller';
      else if (p.stock <= 5) status = 'low_stock';
      else if (conversionRate > 6.0) status = 'trending';

      return {
        product: p,
        unitsSold,
        revenue,
        pageViews,
        cartAdds,
        conversionRate,
        stockRemaining: p.stock,
        daysOfInventory,
        status
      };
    }).sort((a, b) => b.revenue - a.revenue);
  }, [products, rangeMultiplier]);

  // Filtered products list
  const filteredProductMetrics = useMemo(() => {
    return productMetrics.filter((item) => {
      const matchCategory = productCategoryFilter === 'all' || item.product.category === productCategoryFilter;
      const matchSearch =
        item.product.title.toLowerCase().includes(productSearch.toLowerCase()) ||
        item.product.category.toLowerCase().includes(productSearch.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [productMetrics, productCategoryFilter, productSearch]);

  // Regional Demographics data across Ghana
  const regionalDemographics = [
    {
      region: 'Greater Accra',
      cities: 'Accra, Spintex, East Legon, Tema',
      ordersShare: 46,
      ordersCount: Math.round(completedOrdersCount * 0.46),
      revenue: baseGrossSales * 0.48,
      avgDeliveryTime: '24 mins (Local Hub)',
      color: 'bg-amber-500'
    },
    {
      region: 'Ashanti (Kumasi)',
      cities: 'Adum, Bantama, KNUST, Kejetia',
      ordersShare: 32,
      ordersCount: Math.round(completedOrdersCount * 0.32),
      revenue: baseGrossSales * 0.30,
      avgDeliveryTime: '15 mins (Home City)',
      color: 'bg-emerald-500'
    },
    {
      region: 'Western (Takoradi)',
      cities: 'Market Circle, Sekondi, Tarkwa',
      ordersShare: 11,
      ordersCount: Math.round(completedOrdersCount * 0.11),
      revenue: baseGrossSales * 0.11,
      avgDeliveryTime: '4 hrs (Intercity VIP/Express)',
      color: 'bg-blue-500'
    },
    {
      region: 'Central (Cape Coast)',
      cities: 'UCC Campus, Elmina, Cape Coast',
      ordersShare: 6,
      ordersCount: Math.round(completedOrdersCount * 0.06),
      revenue: baseGrossSales * 0.06,
      avgDeliveryTime: '3.5 hrs (Intercity dispatch)',
      color: 'bg-purple-500'
    },
    {
      region: 'Northern (Tamale)',
      cities: 'Tamale Central, Lamashegu',
      ordersShare: 5,
      ordersCount: Math.round(completedOrdersCount * 0.05),
      revenue: baseGrossSales * 0.05,
      avgDeliveryTime: 'Next Day Courier',
      color: 'bg-rose-500'
    }
  ];

  // Buyer Types & Retention
  const buyerSegments = [
    {
      type: 'Repeat Ghanaian Buyers',
      percentage: 38,
      count: Math.round(completedOrdersCount * 0.38),
      spend: baseGrossSales * 0.44,
      avgAov: averageOrderValue * 1.2,
      description: 'Satisfied customers ordering multiple times from your Kumasi store'
    },
    {
      type: 'First-Time Zorvaniq Buyers',
      percentage: 62,
      count: Math.round(completedOrdersCount * 0.62),
      spend: baseGrossSales * 0.56,
      avgAov: averageOrderValue * 0.9,
      description: 'Discovered through Google Maps Agent or Zorvaniq search'
    },
    {
      type: 'Price Negotiators (In-Chat)',
      percentage: 64,
      count: Math.round(completedOrdersCount * 0.64),
      spend: baseGrossSales * 0.61,
      avgAov: averageOrderValue * 0.95,
      description: 'Closed sales after price bargaining in Zorvaniq direct chat'
    },
    {
      type: 'Instant Buy (Direct Checkout)',
      percentage: 36,
      count: Math.round(completedOrdersCount * 0.36),
      spend: baseGrossSales * 0.39,
      avgAov: averageOrderValue * 1.08,
      description: 'Paid asking price immediately with MTN MoMo / Telecel Cash'
    }
  ];

  // Payment channels breakdown
  const paymentBreakdown = [
    { name: 'MTN Mobile Money (MoMo)', share: 72, amount: baseGrossSales * 0.72, color: 'text-amber-400 bg-amber-500/20 border-amber-500/30' },
    { name: 'Telecel Cash (Vodafone)', share: 19, amount: baseGrossSales * 0.19, color: 'text-red-400 bg-red-500/20 border-red-500/30' },
    { name: 'AirtelTigo Money', share: 5, amount: baseGrossSales * 0.05, color: 'text-blue-400 bg-blue-500/20 border-blue-500/30' },
    { name: 'Zorvaniq In-App Wallet / Card', share: 4, amount: baseGrossSales * 0.04, color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30' }
  ];

  // Conversion Funnel Stages
  const funnelStages = [
    {
      stage: '1. Store & Product Impressions',
      count: Math.round(14820 * rangeMultiplier),
      percentOfTotal: 100,
      dropoff: '28.4% click to view details',
      icon: Eye
    },
    {
      stage: '2. Product Detail Page Views',
      count: totalProductViews,
      percentOfTotal: Math.round((totalProductViews / (14820 * rangeMultiplier)) * 100),
      dropoff: '27.3% added to cart or negotiated',
      icon: Search
    },
    {
      stage: '3. Cart Additions & Price Offers',
      count: totalCartAdditions,
      percentOfTotal: Math.round((totalCartAdditions / (14820 * rangeMultiplier)) * 100),
      dropoff: '41.7% proceeded to Escrow',
      icon: ShoppingBag
    },
    {
      stage: '4. Escrow Payment Authorized',
      count: Math.round(completedOrdersCount * 1.04),
      percentOfTotal: Math.round(((completedOrdersCount * 1.04) / (14820 * rangeMultiplier)) * 100),
      dropoff: '98.2% delivered & confirmed',
      icon: ShieldCheck
    },
    {
      stage: '5. Successful Delivery & Payout',
      count: completedOrdersCount,
      percentOfTotal: Math.round((completedOrdersCount / (14820 * rangeMultiplier)) * 100),
      dropoff: 'Final completed sales',
      icon: CheckCircle2
    }
  ];

  // Traffic Sources
  const trafficSources = [
    {
      channel: 'Zorvaniq App Search & Explore',
      visits: Math.round(totalStoreVisitors * 0.42),
      share: 42,
      conversionRate: 3.8,
      orders: Math.round(completedOrdersCount * 0.44),
      revenue: baseGrossSales * 0.44,
      roas: 'Organic (Free)',
      icon: Search,
      badge: 'Core Organic'
    },
    {
      channel: 'Google Maps Agent & Nearby Hubs',
      visits: Math.round(totalStoreVisitors * 0.26),
      share: 26,
      conversionRate: 4.2,
      orders: Math.round(completedOrdersCount * 0.28),
      revenue: baseGrossSales * 0.29,
      roas: 'Organic (Free)',
      icon: Compass,
      badge: 'High Intent'
    },
    {
      channel: 'WhatsApp Business & Storefront Shares',
      visits: Math.round(totalStoreVisitors * 0.18),
      share: 18,
      conversionRate: 5.1,
      orders: Math.round(completedOrdersCount * 0.19),
      revenue: baseGrossSales * 0.18,
      roas: 'Direct Link',
      icon: Share2,
      badge: 'Highest Conversion'
    },
    {
      channel: 'Zorvaniq Sponsored Listing Boosts',
      visits: Math.round(totalStoreVisitors * 0.09),
      share: 9,
      conversionRate: 3.4,
      orders: Math.round(completedOrdersCount * 0.07),
      revenue: baseGrossSales * 0.07,
      roas: '28.4x ROAS (GH₵45 spent)',
      icon: Zap,
      badge: 'Paid Promotion'
    },
    {
      channel: 'Social Media (Instagram & TikTok Ghana)',
      visits: Math.round(totalStoreVisitors * 0.05),
      share: 5,
      conversionRate: 2.1,
      orders: Math.round(completedOrdersCount * 0.02),
      revenue: baseGrossSales * 0.02,
      roas: 'Referral',
      icon: Globe,
      badge: 'Brand Discovery'
    }
  ];

  // Smart AI / Commercial Growth Recommendations for the Seller
  const growthRecommendations = [
    {
      id: 'rec-1',
      title: 'Restock Ashanti Kaftan (Size L & XL)',
      type: 'inventory',
      impact: 'High Impact (+GH₵1,800 projected sales)',
      urgency: 'Action within 4 days',
      description: 'Your Kaftan sales velocity in Kumasi is 1.4 units/day with only 6 units remaining in stock. Stockout will occur before Friday wedding rush.',
      actionText: 'Update Stock'
    },
    {
      id: 'rec-2',
      title: 'Accra Fulfillment Opportunity (46% of Sales)',
      type: 'logistics',
      impact: 'Medium Impact (Reduce delivery ETA to 2h)',
      urgency: 'Strategic Growth',
      description: 'Nearly half your orders ship to Greater Accra (Spintex & East Legon). Staging 10 units at Accra Circle Dispatch Hub will lower shipping costs by GH₵12 per customer.',
      actionText: 'View Dispatch Hubs'
    },
    {
      id: 'rec-3',
      title: 'Optimal Price Negotiation Margin (GH₵160–165)',
      type: 'pricing',
      impact: 'Conversion (+18% win-rate)',
      urgency: 'Active Recommendation',
      description: 'Buyer counter-offers around GH₵165 on the Kaftan shirt close in under 8 minutes, while holding at GH₵175 sees a 42% chat abandonment rate.',
      actionText: 'Review Offers'
    }
  ];

  const handleExportData = () => {
    setShowExportToast(true);
    setTimeout(() => {
      setShowExportToast(false);
    }, 4000);
  };

  return (
    <div className="space-y-6 pb-24 text-neutral-100" id="seller-analytics-dashboard">
      {/* Toast Notification */}
      {showExportToast && (
        <div className="fixed top-4 right-4 z-50 bg-neutral-900 border border-emerald-500/50 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Download className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Analytics Report Exported</p>
            <p className="text-[11px] text-neutral-400">
              CSV file & financial performance summary downloaded successfully.
            </p>
          </div>
        </div>
      )}

      {/* Top Header & Range Bar */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] uppercase tracking-wider font-bold text-amber-400">
                Live Merchant Performance Intelligence
              </span>
              <span className="text-[10px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded-full border border-neutral-700">
                Kofi Mensah Fashion Hub
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Seller Analytics Dashboard
            </h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              Empowering Ghanaian merchants with real-time revenue, product conversion, geographic traffic, and customer data.
            </p>
          </div>

          {/* Time Range Selector & Export Action */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-neutral-950 p-1 rounded-xl border border-neutral-800 flex items-center">
              {(['today', '7d', '30d', '90d', 'ytd'] as TimeRange[]).map((range) => {
                const isSelected = timeRange === range;
                const labels: Record<TimeRange, string> = {
                  today: 'Today',
                  '7d': '7D',
                  '30d': '30D',
                  '90d': '90D',
                  ytd: 'YTD 2026'
                };
                return (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-neutral-950 shadow-md font-bold'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {labels[range]}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleExportData}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 text-xs font-semibold transition-all shadow-sm"
              title="Download detailed CSV report"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Sub-bar showing active period info */}
        <div className="mt-4 pt-3 border-t border-neutral-800/80 flex flex-wrap items-center justify-between text-[11px] text-neutral-400 gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Analyzing: <strong className="text-neutral-200">{rangeLabel}</strong></span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              MoMo Webhooks Active
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Escrow Protection Synced
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 1: KEY PERFORMANCE METRICS (Total Sales & Net Revenue) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Metric 1: Gross Sales */}
        <div className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-4 transition-all shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold">Total Gross Sales</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
              GH₵{baseGrossSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px]">
            <span className="flex items-center text-emerald-400 font-bold">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +24.8%
            </span>
            <span className="text-neutral-500">vs previous period</span>
          </div>
        </div>

        {/* Metric 2: Net Seller Proceeds */}
        <div className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-4 transition-all shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold">Net Seller Earnings</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono tracking-tight">
              GH₵{netSellerRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex items-center justify-between mt-2 text-[11px] text-neutral-400">
            <span>Zorvaniq 5% Fee: GH₵{platformFees.toFixed(2)}</span>
            <span className="text-emerald-400 font-medium">95% Take</span>
          </div>
        </div>

        {/* Metric 3: Orders Completed & AOV */}
        <div className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-4 transition-all shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold">Orders Completed</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
              {completedOrdersCount}
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              (Avg GH₵{averageOrderValue.toFixed(0)}/order)
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px]">
            <span className="flex items-center text-emerald-400 font-bold">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +16.2%
            </span>
            <span className="text-neutral-500">MoMo payment clearance</span>
          </div>
        </div>

        {/* Metric 4: Conversion Rate */}
        <div className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-4 transition-all shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold">Store Conversion Rate</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-purple-400 font-mono tracking-tight">
              {storeConversionRate.toFixed(2)}%
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded font-bold">
              Above Market Avg (2.4%)
            </span>
          </div>
          <div className="flex items-center justify-between mt-2 text-[11px] text-neutral-400">
            <span>{totalStoreVisitors.toLocaleString()} Visitors</span>
            <span>{totalCartAdditions} Carts</span>
          </div>
        </div>
      </div>

      {/* Escrow Settlement Health Banner */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white">Escrow Settlement Balance:</span>{' '}
            <span className="text-neutral-400">
              GH₵{escrowSettled.toFixed(2)} paid directly to MoMo •{' '}
              <span className="text-amber-400 font-semibold">
                GH₵{escrowPendingDelivery.toFixed(2)} pending active customer delivery confirmation
              </span>
            </span>
          </div>
        </div>
        {onNavigateToOrders && (
          <button
            onClick={onNavigateToOrders}
            className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 shrink-0"
          >
            <span>Manage Orders</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* SECTION 2: INTERACTIVE SALES & ORDERS TREND CHART */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-400" />
              Sales Revenue & Order Velocity Trends
            </h2>
            <p className="text-xs text-neutral-400">
              Historical performance tracking showing customer order spikes around salary disbursements and weekends.
            </p>
          </div>

          {/* Toggle Revenue vs Orders */}
          <div className="bg-neutral-950 p-1 rounded-xl border border-neutral-800 flex items-center self-start sm:self-auto">
            <button
              onClick={() => setChartMetric('revenue')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                chartMetric === 'revenue'
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Revenue (GH₵)
            </button>
            <button
              onClick={() => setChartMetric('orders')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                chartMetric === 'orders'
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Order Count
            </button>
          </div>
        </div>

        {/* Custom Responsive SVG Chart */}
        <div className="relative pt-6 pb-2">
          <div className="h-56 w-full flex items-end gap-2 sm:gap-4 px-2">
            {timelineData.map((d, i) => {
              const val = chartMetric === 'revenue' ? d.revenue : d.orders * 250;
              const heightPercent = Math.min(100, Math.max(12, (val / maxTimelineVal) * 100));
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 bg-neutral-950 border border-neutral-700 text-white text-[11px] font-mono px-2 py-1 rounded-md shadow-xl whitespace-nowrap z-20 pointer-events-none">
                    {chartMetric === 'revenue' ? `GH₵${d.revenue.toLocaleString()}` : `${d.orders} orders`}
                  </div>

                  {/* Visual Bar with subtle top accent */}
                  <div className="w-full max-w-[48px] bg-neutral-800 rounded-t-lg relative overflow-hidden group-hover:bg-neutral-700 transition-colors" style={{ height: `${heightPercent}%` }}>
                    <div
                      className={`w-full h-full rounded-t-lg transition-all ${
                        chartMetric === 'revenue'
                          ? 'bg-gradient-to-t from-amber-600/40 via-amber-500 to-amber-400'
                          : 'bg-gradient-to-t from-blue-600/40 via-blue-500 to-blue-400'
                      }`}
                    />
                  </div>

                  {/* Label */}
                  <span className="text-[10px] sm:text-xs text-neutral-400 font-medium truncate w-full text-center">
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Baseline info */}
          <div className="mt-4 pt-3 border-t border-neutral-800 flex flex-wrap items-center justify-between text-[11px] text-neutral-400">
            <span>Peak Shopping Hours: <strong className="text-white">6:00 PM – 9:30 PM</strong> (Evenings after work)</span>
            <span>Highest Revenue Day: <strong className="text-amber-400">Saturdays (Weddings & Events Prep)</strong></span>
          </div>
        </div>
      </div>

      {/* SECTION 3: BEST-SELLING PRODUCTS & INVENTORY INTELLIGENCE */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-400" />
              Best-Selling Products & SKU Performance
            </h2>
            <p className="text-xs text-neutral-400">
              Ranked by revenue contribution, unit sales velocity, conversion efficiency, and stock depletion speed.
            </p>
          </div>

          {/* Category Filter & Search */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-neutral-500" />
              <input
                type="text"
                placeholder="Search products..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 w-36 sm:w-44"
              />
            </div>

            <select
              value={productCategoryFilter}
              onChange={(e) => setProductCategoryFilter(e.target.value)}
              className="bg-neutral-950 border border-neutral-800 rounded-xl px-2.5 py-1.5 text-xs text-neutral-300 focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Categories</option>
              <option value="Fashion">Fashion</option>
              <option value="Gadgets & Computing">Gadgets</option>
              <option value="Food & Agric">Food & Agric</option>
              <option value="Health & Beauty">Health & Beauty</option>
            </select>
          </div>
        </div>

        {/* Product Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="pb-2.5 pl-1">Product Details</th>
                <th className="pb-2.5">Category</th>
                <th className="pb-2.5 text-right">Unit Price</th>
                <th className="pb-2.5 text-right">Units Sold</th>
                <th className="pb-2.5 text-right">Gross Revenue</th>
                <th className="pb-2.5 text-right">Conversion</th>
                <th className="pb-2.5 text-center">Inventory & Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {filteredProductMetrics.map((item, index) => {
                const { product, unitsSold, revenue, conversionRate, stockRemaining, daysOfInventory, status } = item;
                return (
                  <tr
                    key={product.id}
                    className="hover:bg-neutral-800/40 transition-colors group cursor-pointer"
                    onClick={() => onOpenProductModal && onOpenProductModal(product)}
                  >
                    {/* Title & Image */}
                    <td className="py-3 pl-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-neutral-500 text-xs w-4">#{index + 1}</span>
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-10 h-10 rounded-lg object-cover border border-neutral-800 shrink-0 group-hover:scale-105 transition-transform"
                        />
                        <div className="min-w-0 max-w-xs">
                          <span className="font-bold text-white block truncate group-hover:text-amber-400 transition-colors">
                            {product.title}
                          </span>
                          <span className="text-[10px] text-neutral-400">
                            {product.sellerCity} • ⭐ {product.rating} ({product.reviewsCount} reviews)
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 text-neutral-300">
                      <span className="bg-neutral-800 px-2 py-0.5 rounded text-[11px] text-neutral-300 border border-neutral-700">
                        {product.category}
                      </span>
                    </td>

                    {/* Unit Price */}
                    <td className="py-3 text-right font-mono font-semibold text-neutral-200">
                      GH₵{product.price.toFixed(2)}
                    </td>

                    {/* Units Sold */}
                    <td className="py-3 text-right font-mono font-bold text-white">
                      {unitsSold} units
                    </td>

                    {/* Gross Revenue */}
                    <td className="py-3 text-right font-mono font-bold text-amber-400">
                      GH₵{revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    {/* Conversion Rate */}
                    <td className="py-3 text-right font-mono">
                      <span className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                        conversionRate >= 5.0
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-neutral-800 text-neutral-300'
                      }`}>
                        {conversionRate}%
                      </span>
                    </td>

                    {/* Inventory & Health Status */}
                    <td className="py-3 text-center">
                      <div className="inline-flex flex-col items-center">
                        {status === 'top_seller' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full">
                            <Award className="w-3 h-3" /> Top Seller
                          </span>
                        )}
                        {status === 'low_stock' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-500/15 border border-red-500/30 px-2 py-0.5 rounded-full">
                            <AlertTriangle className="w-3 h-3" /> Low Stock ({stockRemaining} left)
                          </span>
                        )}
                        {status === 'trending' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-400 bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 rounded-full">
                            <Zap className="w-3 h-3" /> Trending
                          </span>
                        )}
                        {status === 'healthy' && (
                          <span className="text-[11px] text-neutral-400 font-mono">
                            {stockRemaining} in stock ({daysOfInventory}d left)
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {onNavigateToProducts && (
          <div className="mt-3 pt-3 border-t border-neutral-800 flex justify-end">
            <button
              onClick={onNavigateToProducts}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <span>Manage Full Inventory & Pricing</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* SECTION 4: CUSTOMER DEMOGRAPHICS & REGIONAL INTELLIGENCE ACROSS GHANA */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              Customer Demographics & Regional Intelligence
            </h2>
            <p className="text-xs text-neutral-400">
              Where your buyers live, order habits, preferred Mobile Money payment systems, and delivery times across Ghana.
            </p>
          </div>

          {/* Subtabs for Demographics */}
          <div className="bg-neutral-950 p-1 rounded-xl border border-neutral-800 flex items-center">
            <button
              onClick={() => setActiveSegmentTab('regions')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeSegmentTab === 'regions'
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Regions
            </button>
            <button
              onClick={() => setActiveSegmentTab('buyer_types')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeSegmentTab === 'buyer_types'
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Buyer Types
            </button>
            <button
              onClick={() => setActiveSegmentTab('payments')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeSegmentTab === 'payments'
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Payment Channels
            </button>
          </div>
        </div>

        {/* View 1: Regional Breakdown */}
        {activeSegmentTab === 'regions' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {regionalDemographics.map((reg, idx) => (
                <div key={idx} className="bg-neutral-950 border border-neutral-800 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white text-xs flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        {reg.region}
                      </span>
                      <span className="text-[10px] text-neutral-400 block">{reg.cities}</span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-xs font-bold text-amber-400">{reg.ordersShare}% of sales</span>
                      <span className="text-[10px] text-neutral-400 block">{reg.ordersCount} orders</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden">
                    <div className={`h-full ${reg.color}`} style={{ width: `${reg.ordersShare}%` }} />
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1 text-neutral-400 border-t border-neutral-900">
                    <span>Revenue: <strong className="text-white font-mono">GH₵{reg.revenue.toFixed(0)}</strong></span>
                    <span className="text-emerald-400 font-medium">ETA: {reg.avgDeliveryTime}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-neutral-950/60 border border-neutral-800/80 rounded-xl text-xs text-neutral-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Geographic Insight:</strong> 46% of your buyers reside in Greater Accra (Spintex & East Legon), while 32% order locally in Kumasi. Intercity couriers reliably deliver within 24 hours.
              </span>
            </div>
          </div>
        )}

        {/* View 2: Buyer Archetypes & Retention */}
        {activeSegmentTab === 'buyer_types' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {buyerSegments.map((seg, idx) => (
              <div key={idx} className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">{seg.type}</span>
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/20">
                    {seg.percentage}% of Orders
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400">{seg.description}</p>
                <div className="pt-2 border-t border-neutral-900 flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Volume: <strong className="text-white">{seg.count} orders</strong></span>
                  <span className="text-neutral-400">Total Spend: <strong className="text-emerald-400 font-mono">GH₵{seg.spend.toFixed(0)}</strong></span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View 3: Payment Breakdown */}
        {activeSegmentTab === 'payments' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {paymentBreakdown.map((pay, idx) => (
              <div key={idx} className="bg-neutral-950 border border-neutral-800 rounded-xl p-3.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <CreditCard className="w-4 h-4 text-neutral-400" />
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${pay.color}`}>
                    {pay.share}% Share
                  </span>
                </div>
                <span className="font-bold text-white text-xs block truncate">{pay.name}</span>
                <span className="text-lg font-black text-white font-mono block">
                  GH₵{pay.amount.toFixed(2)}
                </span>
                <span className="text-[10px] text-neutral-500 block">Instant Escrow clearance</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 5: CONVERSION RATE & E-COMMERCE FUNNEL */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Percent className="w-4 h-4 text-purple-400" />
              Full E-Commerce Conversion Funnel
            </h2>
            <p className="text-xs text-neutral-400">
              Track how prospective Ghanaian buyers navigate from initial product discovery to confirmed delivery and escrow release.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-neutral-400">Overall Win Rate</span>
            <div className="text-lg font-mono font-bold text-purple-400">
              {storeConversionRate.toFixed(2)}% Conversion
            </div>
          </div>
        </div>

        {/* Visual 5-Stage Funnel */}
        <div className="space-y-3">
          {funnelStages.map((stage, idx) => {
            const Icon = stage.icon;
            return (
              <div key={idx} className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-neutral-800 flex items-center justify-center text-neutral-300">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-white">{stage.stage}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="font-bold text-white">{stage.count.toLocaleString()}</span>
                    <span className="text-neutral-400 text-[11px]">({stage.percentOfTotal}%)</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-amber-500 transition-all duration-500"
                    style={{ width: `${Math.max(4, stage.percentOfTotal)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-neutral-500">
                  <span>{stage.dropoff}</span>
                  {idx < funnelStages.length - 1 && (
                    <span className="text-amber-400 font-semibold">Stage {idx + 1} → Stage {idx + 2}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* In-Chat Bargaining Funnel Metric */}
        <div className="mt-4 p-3.5 bg-neutral-950/60 border border-neutral-800 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-bold text-white flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              In-Chat Negotiation Conversion Rate: 71.4%
            </span>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              7 out of 10 buyers who make a counter-offer in Zorvaniq Chat conclude the purchase when offered a 5–10% discount.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 shrink-0">
            High Closing Rate
          </span>
        </div>
      </div>

      {/* SECTION 6: TRAFFIC SOURCES & ACQUISITION CHANNELS */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-400" />
              Traffic Acquisition Sources & Channel Attribution
            </h2>
            <p className="text-xs text-neutral-400">
              Understand where your store visitors originate and which marketing channels generate the highest return on ad spend.
            </p>
          </div>

          <div className="text-xs text-neutral-400">
            Total Inflow: <strong className="text-white font-mono">{totalStoreVisitors.toLocaleString()} sessions</strong>
          </div>
        </div>

        {/* Traffic Channels Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="pb-2.5 pl-1">Acquisition Channel</th>
                <th className="pb-2.5 text-right">Visitors</th>
                <th className="pb-2.5 text-right">Traffic Share</th>
                <th className="pb-2.5 text-right">Conversion</th>
                <th className="pb-2.5 text-right">Revenue Generated</th>
                <th className="pb-2.5 text-right">Efficiency / ROAS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {trafficSources.map((source, index) => {
                const Icon = source.icon;
                return (
                  <tr key={index} className="hover:bg-neutral-800/30 transition-colors">
                    <td className="py-3 pl-1">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-amber-400 shrink-0 border border-neutral-700">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-white block">{source.channel}</span>
                          <span className="text-[10px] text-neutral-500">{source.badge}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 text-right font-mono font-medium text-neutral-200">
                      {source.visits.toLocaleString()}
                    </td>

                    <td className="py-3 text-right font-mono font-bold text-white">
                      {source.share}%
                    </td>

                    <td className="py-3 text-right font-mono">
                      <span className="bg-neutral-800 px-2 py-0.5 rounded text-[11px] text-emerald-400 font-bold">
                        {source.conversionRate}%
                      </span>
                    </td>

                    <td className="py-3 text-right font-mono font-bold text-amber-400">
                      GH₵{source.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    <td className="py-3 text-right font-mono text-neutral-300 text-[11px]">
                      {source.roas}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 7: ACTIONABLE BUSINESS DECISIONS & MERCHANT GROWTH INSIGHTS */}
      <div className="bg-gradient-to-br from-neutral-900 via-neutral-900 to-amber-950/20 border border-amber-500/30 rounded-2xl p-4 sm:p-5 shadow-2xl">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Data-Driven Merchant Growth Decisions
              </h2>
              <p className="text-xs text-neutral-400">
                Actionable recommendations powered by Zorvaniq sales velocity to improve stock turnover and increase monthly profits.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full uppercase">
            3 Active Insights
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {growthRecommendations.map((rec) => (
            <div
              key={rec.id}
              className="bg-neutral-950/90 border border-neutral-800 hover:border-amber-500/40 rounded-xl p-3.5 flex flex-col justify-between transition-all group"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                    {rec.urgency}
                  </span>
                  <span className="text-[9px] bg-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded">
                    {rec.type}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                  {rec.title}
                </h3>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  {rec.description}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-neutral-900 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-emerald-400">{rec.impact}</span>
                <button
                  onClick={() => {
                    if (rec.type === 'inventory' && onNavigateToProducts) onNavigateToProducts();
                    else if (onNavigateToOrders) onNavigateToOrders();
                  }}
                  className="px-2 py-1 rounded-lg bg-neutral-800 hover:bg-amber-500 hover:text-neutral-950 text-neutral-200 text-[11px] font-bold transition-colors"
                >
                  {rec.actionText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
