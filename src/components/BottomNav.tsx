import React from 'react';
import { ShoppingBag, Store, MessageSquare, Wallet, Wifi, Package, BarChart3, Compass } from 'lucide-react';
import { UserRole } from '../types';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadMessagesCount: number;
  activeOrdersCount: number;
  currentRole: UserRole;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  unreadMessagesCount,
  activeOrdersCount,
  currentRole,
}) => {
  const navItems = [
    {
      id: 'marketplace',
      label: 'Market',
      icon: ShoppingBag,
      badge: null,
    },
    {
      id: 'maps-agent',
      label: 'Maps Agent',
      icon: Compass,
      badge: 'Live',
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: Package,
      badge: activeOrdersCount > 0 ? activeOrdersCount : null,
    },
    {
      id: 'seller-center',
      label: 'Seller Hub',
      icon: Store,
      badge: currentRole === 'seller' ? 'Active' : null,
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageSquare,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : null,
    },
    {
      id: 'internet',
      label: 'Internet',
      icon: Wifi,
      badge: '4G/5G',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    },
    {
      id: 'wallet',
      label: 'Wallet',
      icon: Wallet,
      badge: null,
    },
    {
      id: 'founder',
      label: 'Revenue',
      icon: BarChart3,
      badge: 'Admin',
      badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    }
  ];

  return (
    <nav className="sticky bottom-0 z-30 bg-neutral-900/95 backdrop-blur-lg border-t border-neutral-800 safe-bottom">
      <div className="max-w-md md:max-w-4xl mx-auto px-1 sm:px-4 py-1.5 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-200 min-w-[50px] ${
                isActive
                  ? 'text-amber-400 font-bold scale-105'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {item.badge !== null && (
                  <span
                    className={`absolute -top-1.5 -right-2.5 text-[9px] font-bold px-1 py-0.2 rounded-full border ${
                      item.badgeColor
                        ? item.badgeColor
                        : 'bg-amber-500 text-neutral-950 border-amber-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight leading-none whitespace-nowrap">
                {item.label}
              </span>
              {isActive && (
                <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-0.5 shadow-sm shadow-amber-400/50" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
