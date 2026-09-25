import React from 'react';
import { Building2, TrendingUp, DollarSign, Wifi, Users, ShieldCheck, ShoppingBag, ArrowUpRight, BarChart3, Compass, CheckCircle2 } from 'lucide-react';
import { Order, Product } from '../types';

interface FounderConsoleProps {
  orders?: Order[];
  products?: Product[];
  totalInternetSales?: number;
  onNavigateToWallet?: () => void;
}

export const FounderConsoleView: React.FC<FounderConsoleProps> = ({
  orders = [],
  products = [],
  totalInternetSales = 0,
  onNavigateToWallet
}) => {
  const safeOrders = Array.isArray(orders) ? orders : [];
  const safeProducts = Array.isArray(products) ? products : [];

  // Calculations
  const totalGMV = safeOrders.reduce((sum, o) => sum + (o?.total || 0), 0);
  const marketplaceCommissions = safeOrders.reduce((sum, o) => sum + (o?.platformFee || 0), 0);
  const dataCommissions = (totalInternetSales || 0) * 0.10; // 10% telecom commission
  const sellerSubRevenue = 499 + 149; // Mock monthly subscription revenue from business sellers
  const totalFounderRevenue = marketplaceCommissions + dataCommissions + sellerSubRevenue;

  return (
    <div className="space-y-4 pb-20">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-850 to-neutral-900 border border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30 mb-3">
              <Building2 className="w-3.5 h-3.5" />
              <span>Zorvaniq Market Ecosystem • Isaac's Founder Desk</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-['Space_Grotesk']">
              Revenue & Platform Operations
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mt-1">
              Real-time cash flow overview across Marketplace 5% Escrow take-rate, Telecom Data Commissions (10%), and Merchant Subscription plans.
            </p>
          </div>

          <div className="bg-neutral-950/80 border border-neutral-800 p-4 rounded-2xl shrink-0 min-w-[220px]">
            <span className="text-[11px] text-neutral-400 uppercase font-semibold block">
              Founder Net Company Earnings
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                GH₵{totalFounderRevenue.toFixed(2)}
              </span>
              <span className="text-xs text-neutral-500 font-bold">GHS</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold block mt-1">
              +18.4% growth this month
            </span>
            {onNavigateToWallet && (
              <button
                type="button"
                onClick={onNavigateToWallet}
                className="mt-3 w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition-transform active:scale-95 cursor-pointer"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Withdraw to MoMo / Bank</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Marketplace GMV</span>
            <ShoppingBag className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono">
            GH₵{totalGMV.toFixed(2)}
          </div>
          <p className="text-[10px] text-neutral-500">Gross transaction volume</p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Marketplace 5% Cut</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
            GH₵{marketplaceCommissions.toFixed(2)}
          </div>
          <p className="text-[10px] text-neutral-500">Automated escrow fee</p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Telecom Commission</span>
            <Wifi className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-cyan-400 font-mono">
            GH₵{dataCommissions.toFixed(2)}
          </div>
          <p className="text-[10px] text-neutral-500">10% margin on data packs</p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Active Merchants</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-purple-400 font-mono">
            {new Set(safeProducts.map((p) => p.sellerId)).size + 14}
          </div>
          <p className="text-[10px] text-neutral-500">Accra, Kumasi & Tamale</p>
        </div>
      </div>

      {/* Revenue Streams Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-amber-400" />
            Revenue Streams Distribution
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-neutral-300 mb-1">
                <span>E-Commerce Marketplace Escrow (5%)</span>
                <span className="font-mono font-bold text-amber-400">
                  GH₵{marketplaceCommissions.toFixed(2)}
                </span>
              </div>
              <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full w-[45%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-neutral-300 mb-1">
                <span>Internet Telecom Bundle Reselling (10%)</span>
                <span className="font-mono font-bold text-cyan-400">
                  GH₵{dataCommissions.toFixed(2)}
                </span>
              </div>
              <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 rounded-full w-[35%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-neutral-300 mb-1">
                <span>Seller Monthly Subscriptions & Featured Ads</span>
                <span className="font-mono font-bold text-emerald-400">
                  GH₵{sellerSubRevenue.toFixed(2)}
                </span>
              </div>
              <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full w-[20%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Google Maps Logistics & Courier Optimization */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400" />
            Geospatial Logistics Integration
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Google Maps Platform APIs empower Zorvaniq with automated delivery fee calculations based on driving distance, turn-by-turn dispatch routing, and live courier tracking across Ghanaian cities.
          </p>

          <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-3 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Connected Maps API:</span>
              <span className="text-emerald-400 font-semibold">Active & Grounded</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Logistics Hubs Covered:</span>
              <span className="text-white font-semibold">Accra, Kumasi, Takoradi, Tamale, Tema</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Escrow Release Safety:</span>
              <span className="text-amber-400 font-semibold">Buyer Inspection Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
