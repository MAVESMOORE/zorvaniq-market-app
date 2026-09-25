import React, { useState, useMemo } from 'react';
import { Search, MapPin, Tag, ShieldCheck, MessageCircle, ShoppingBag, Flame, Sparkles, Filter, ChevronRight, CheckCircle2, ArrowRight, Compass } from 'lucide-react';
import { Product, GhanaRegion } from '../types';

interface MarketplaceViewProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onStartChat: (product: Product) => void;
  onDirectBuy: (product: Product) => void;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onOpenMapsAgent?: (query?: string) => void;
}

const CATEGORIES = [
  'All',
  'Fashion',
  'Gadgets & Computing',
  'Electronics',
  'Food & Agric',
  'Health & Beauty',
  'Home & Living'
];

const GHANA_REGIONS: { label: string; value: string }[] = [
  { label: 'All of Ghana 🇬🇭', value: 'all' },
  { label: 'Greater Accra', value: 'Accra' },
  { label: 'Ashanti (Kumasi)', value: 'Kumasi' },
  { label: 'Western (Takoradi)', value: 'Takoradi' },
  { label: 'Northern (Tamale)', value: 'Tamale' },
  { label: 'Central (Cape Coast)', value: 'Cape Coast' },
  { label: 'Bono (Sunyani)', value: 'Sunyani' }
];

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  onStartChat,
  onDirectBuy,
  selectedRegion,
  setSelectedRegion,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onOpenMapsAgent
}) => {
  const [onlySponsored, setOnlySponsored] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'low-high' | 'high-low' | 'rating'>('featured');

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sellerCity.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;

      const matchesRegion =
        selectedRegion === 'all' ||
        item.sellerCity.toLowerCase().includes(selectedRegion.toLowerCase());

      const matchesSponsored = !onlySponsored || item.isSponsored;

      return matchesSearch && matchesCategory && matchesRegion && matchesSponsored;
    }).sort((a, b) => {
      if (sortBy === 'low-high') return a.price - b.price;
      if (sortBy === 'high-low') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      // featured: sponsored first
      if (a.isSponsored && !b.isSponsored) return -1;
      if (!a.isSponsored && b.isSponsored) return 1;
      return 0;
    });
  }, [products, searchQuery, selectedCategory, selectedRegion, onlySponsored, sortBy]);

  return (
    <div className="space-y-4 pb-20">
      {/* Dynamic Promo Banner / Announcement */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-850 to-neutral-900 border border-neutral-800 p-4 sm:p-5 shadow-xl">
        <div className="absolute -right-6 -bottom-6 w-36 h-36 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 text-xs font-semibold border border-amber-500/30 mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Ghana's Next-Gen Commerce
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight font-['Space_Grotesk']">
              Buy, Sell, Connect & Grow
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mt-0.5">
              Trade directly between Accra, Kumasi, and all 16 regions. Secure Escrow, verified sellers, and integrated telecom data services.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs bg-neutral-950/80 px-3 py-2 rounded-xl border border-neutral-800 shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-neutral-200 font-bold block leading-tight">Escrow Protected</span>
              <span className="text-[10px] text-neutral-500">Funds held until verified delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Location Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search shirts, phones, rice, or sellers in Kumasi & Accra..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/80 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Region Selector */}
        <div className="sm:col-span-4 relative">
          <MapPin className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-8 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500/80 transition-colors appearance-none cursor-pointer"
          >
            {GHANA_REGIONS.map((r) => (
              <option key={r.value} value={r.value} className="bg-neutral-900 text-white">
                {r.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500 text-xs">
            ▼
          </div>
        </div>
      </div>

      {/* Google Maps Agent Quick Access */}
      {onOpenMapsAgent && (
        <div
          onClick={() => onOpenMapsAgent()}
          className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-neutral-900 to-amber-500/5 border border-amber-500/20 hover:border-amber-500/40 cursor-pointer transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 group-hover:scale-105 transition-transform">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors flex items-center gap-1.5">
                Google Maps Agent & Dispatch Hub
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </span>
              <p className="text-[10px] text-neutral-400">
                Live places search, driving routes, distance calculations, and real-time courier tracking across Ghana.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-amber-400 font-semibold shrink-0">
            <span className="hidden sm:inline">Launch Map</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      )}

      {/* Categories Horizontal Scroll */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Secondary Filters: Sponsored only & Sort */}
      <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlySponsored}
              onChange={(e) => setOnlySponsored(e.target.checked)}
              className="rounded bg-neutral-900 border-neutral-700 text-amber-500 focus:ring-0 w-3.5 h-3.5"
            />
            <span className="flex items-center gap-1 text-neutral-300">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              Sponsored Only
            </span>
          </label>
        </div>

        <div className="flex items-center gap-1.5">
          <span>Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1 text-xs text-neutral-200 focus:outline-none"
          >
            <option value="featured">Featured / Best Match</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-neutral-900/50 rounded-2xl border border-neutral-800">
          <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center mx-auto text-neutral-500 mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No products found</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto mt-1">
            Try adjusting your search keywords, clearing filters, or switching regions.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedRegion('all');
              setOnlySponsored(false);
            }}
            className="mt-4 px-4 py-1.5 rounded-lg bg-amber-500 text-neutral-950 text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden hover:border-neutral-700 transition-all duration-200 flex flex-col justify-between hover:shadow-xl hover:shadow-black/40"
            >
              {/* Product Thumbnail with Tags */}
              <div
                className="relative aspect-square overflow-hidden bg-neutral-950 cursor-pointer"
                onClick={() => onSelectProduct(product)}
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                {/* Sponsored Badge */}
                {product.isSponsored && (
                  <div className="absolute top-2 left-2 bg-amber-500 text-neutral-950 font-black text-[9px] uppercase px-1.5 py-0.5 rounded tracking-wider shadow">
                    Sponsored
                  </div>
                )}
                {/* City Badge */}
                <div className="absolute bottom-2 left-2 bg-neutral-950/80 backdrop-blur-sm text-neutral-300 text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1 border border-neutral-800">
                  <MapPin className="w-2.5 h-2.5 text-amber-400" />
                  {product.sellerCity}
                </div>
              </div>

              {/* Info Body */}
              <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
                    <span className="truncate max-w-[110px]">{product.sellerName}</span>
                    <span className="text-amber-400 font-bold flex items-center gap-0.5">
                      ★ {product.rating}
                    </span>
                  </div>

                  <h3
                    onClick={() => onSelectProduct(product)}
                    className="text-xs sm:text-sm font-semibold text-white line-clamp-2 cursor-pointer hover:text-amber-400 transition-colors"
                  >
                    {product.title}
                  </h3>
                </div>

                <div>
                  {/* Pricing */}
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-base sm:text-lg font-black text-amber-400 font-mono">
                      GH₵{product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-[11px] text-neutral-500 line-through font-mono">
                        GH₵{product.originalPrice}
                      </span>
                    )}
                  </div>

                  {product.allowNegotiation && (
                    <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      Price negotiable with seller
                    </div>
                  )}

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-1.5 mt-3 pt-2 border-t border-neutral-800">
                    <button
                      onClick={() => onStartChat(product)}
                      className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium transition-colors"
                      title="Chat & Negotiate with Seller"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Chat</span>
                    </button>
                    <button
                      onClick={() => onAddToCart(product)}
                      className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold transition-colors"
                      title="Add to Cart"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Buy</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
