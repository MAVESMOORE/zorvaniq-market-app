import React from 'react';
import { ShoppingBag, MessageSquare, Wallet, Smartphone, Monitor, ShieldCheck, UserCheck, Sparkles, Building2 } from 'lucide-react';
import { UserRole } from '../types';

interface HeaderProps {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileDeviceFrame: boolean;
  setIsMobileDeviceFrame: (val: boolean) => void;
  cartCount: number;
  openCart: () => void;
  walletBalance: number;
  unreadMessagesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  setCurrentRole,
  activeTab,
  setActiveTab,
  isMobileDeviceFrame,
  setIsMobileDeviceFrame,
  cartCount,
  openCart,
  walletBalance,
  unreadMessagesCount
}) => {
  return (
    <header className="sticky top-0 z-30 bg-neutral-900/95 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('marketplace')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-neutral-950 font-black text-xl tracking-tighter">
            Z
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-white font-['Space_Grotesk']">
                ZORVANIQ
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Market
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 hidden sm:block">
              Buy. Sell. Connect. Grow. <span className="text-neutral-500">• Ghana</span>
            </p>
          </div>
        </div>

        {/* Center: Device Frame Toggle (Android vs Web) & Role switcher */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Android / Web Toggle */}
          <div className="bg-neutral-950/80 p-0.5 rounded-lg border border-neutral-800 flex items-center">
            <button
              onClick={() => setIsMobileDeviceFrame(true)}
              title="Android Phone Mockup View"
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all ${
                isMobileDeviceFrame
                  ? 'bg-amber-500 text-neutral-950 shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Android</span>
            </button>
            <button
              onClick={() => setIsMobileDeviceFrame(false)}
              title="Web Responsive View"
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all ${
                !isMobileDeviceFrame
                  ? 'bg-amber-500 text-neutral-950 shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Web (Chrome)</span>
            </button>
          </div>

          {/* Role Switcher Pill */}
          <div className="bg-neutral-950/80 p-0.5 rounded-lg border border-neutral-800 flex items-center">
            <button
              onClick={() => {
                setCurrentRole('buyer');
                if (activeTab === 'seller-center' || activeTab === 'founder') {
                  setActiveTab('marketplace');
                }
              }}
              className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
                currentRole === 'buyer'
                  ? 'bg-neutral-800 text-amber-400 border border-amber-500/30 font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Buyer
            </button>
            <button
              onClick={() => {
                setCurrentRole('seller');
                setActiveTab('seller-center');
              }}
              className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
                currentRole === 'seller'
                  ? 'bg-neutral-800 text-emerald-400 border border-emerald-500/30 font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Seller
            </button>
            <button
              onClick={() => {
                setCurrentRole('founder');
                setActiveTab('founder');
              }}
              title="Isaac's Zorvaniq Founder & Revenue Console"
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all ${
                currentRole === 'founder'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-bold shadow'
                  : 'text-neutral-400 hover:text-amber-400'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Founder</span>
            </button>
          </div>
        </div>

        {/* Right: Wallet pill & Cart Button */}
        <div className="flex items-center gap-2">
          {/* Quick Wallet balance */}
          <button
            onClick={() => setActiveTab('wallet')}
            className="flex items-center gap-1.5 bg-neutral-950/80 hover:bg-neutral-800 border border-neutral-800 px-2.5 py-1.5 rounded-lg transition-colors group"
          >
            <Wallet className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <span className="text-[10px] text-neutral-400 block leading-none">Wallet</span>
              <span className="text-xs font-bold text-white font-mono leading-tight">
                GH₵{walletBalance.toFixed(2)}
              </span>
            </div>
          </button>

          {/* Cart Icon */}
          <button
            onClick={openCart}
            className="relative p-2 bg-neutral-950/80 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-neutral-300 hover:text-white transition-colors"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-neutral-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
