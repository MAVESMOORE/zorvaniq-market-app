import React, { useState } from 'react';
import {
  Store,
  PlusCircle,
  Package,
  TrendingUp,
  ShieldCheck,
  DollarSign,
  Upload,
  Check,
  Trash2,
  Crown,
  Sparkles,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import { Product, Order, SellerPlan } from '../types';
import { SELLER_PLANS } from '../data/mockData';
import { SellerAnalyticsDashboard } from './SellerAnalyticsDashboard';

interface SellerCenterViewProps {
  products: Product[];
  orders?: Order[];
  onAddProduct: (newProd: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewsCount'>) => void;
  onUpdateOrderStatus?: (orderId: string, newStatus: Order['status'], message: string) => void;
  activePlan?: SellerPlan;
  onUpgradePlan?: (plan: SellerPlan) => void;
  onDeleteProduct?: (id: string) => void;
  totalOrdersCount?: number;
  onOpenProductModal?: (product: Product) => void;
}

export const SellerCenterView: React.FC<SellerCenterViewProps> = ({
  products = [],
  orders = [],
  onAddProduct,
  onUpdateOrderStatus,
  activePlan = SELLER_PLANS[1],
  onUpgradePlan,
  onDeleteProduct,
  totalOrdersCount,
  onOpenProductModal
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders' | 'plans'>('analytics');

  // New product form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Product['category']>('Fashion');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('10');
  const [sellerCity, setSellerCity] = useState('Kumasi');
  const [sellerName, setSellerName] = useState('Kofi Mensah Fashion Hub');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=700&auto=format&fit=crop&q=80');
  const [description, setDescription] = useState('');
  const [allowNegotiation, setAllowNegotiation] = useState(true);
  const [isSponsored, setIsSponsored] = useState(false);

  // Financial calculations
  const sellerOrders = (orders || []).filter((o) => o.sellerName?.includes('Kofi') || o.sellerId === 'seller-kofi' || true);
  const totalSales = sellerOrders.reduce((sum, o) => sum + (o.subtotal || 0), 0);
  const totalCommissionsPaid = sellerOrders.reduce((sum, o) => sum + (o.platformFee || 0), 0);
  const netEarnings = totalSales - totalCommissionsPaid;

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) return;

    onAddProduct({
      title,
      sellerId: 'seller-kofi',
      sellerName: sellerName || 'My Zorvaniq Store',
      sellerCity,
      category,
      price: parseFloat(price),
      image: image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&auto=format&fit=crop&q=80',
      description: description || 'High quality Ghanaian product directly from merchant.',
      stock: parseInt(stock) || 1,
      allowNegotiation,
      isSponsored
    });

    setShowAddModal(false);
    setTitle('');
    setPrice('');
    setDescription('');
    setActiveTab('products');
  };

  return (
    <div className="space-y-5 pb-20">
      {/* Top Banner */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Seller Center Hub
              </h2>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {activePlan.name}
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Manage inventory, analyze sales conversion, track MoMo escrow, and grow your Ghanaian merchant brand.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Upload Product</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'analytics', label: 'Analytics Dashboard', icon: BarChart3, badge: 'Live Data' },
          { id: 'products', label: `My Products (${(products || []).length})`, icon: Package },
          { id: 'orders', label: `Customer Orders (${(orders || []).length})`, icon: ShieldCheck },
          { id: 'plans', label: 'Seller Plans & Subscriptions', icon: Crown }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-neutral-800 text-amber-400 border border-neutral-700 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 ml-0.5">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: COMPREHENSIVE SELLER ANALYTICS DASHBOARD */}
      {activeTab === 'analytics' && (
        <div className="space-y-5">
          <SellerAnalyticsDashboard
            products={products}
            orders={orders}
            onOpenProductModal={onOpenProductModal}
            onNavigateToProducts={() => setActiveTab('products')}
            onNavigateToOrders={() => setActiveTab('orders')}
          />

          {/* Business Model Walkthrough Example */}
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">
                How Zorvaniq Commercial Commission Operates
              </h3>
            </div>
            <p className="text-xs text-neutral-400 mb-3">
              Isaac, here is how you earn money from facilitating transactions without buying and storing inventory:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800">
                <span className="text-[11px] font-semibold text-neutral-400 block">Buyer (e.g. Accra)</span>
                <span className="text-base font-bold text-white font-mono mt-1 block">Pays GH₵100.00</span>
                <p className="text-[10px] text-neutral-500 mt-0.5">
                  Order placed and funds secured in Escrow.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800">
                <span className="text-[11px] font-semibold text-neutral-400 block">Seller (e.g. Kumasi)</span>
                <span className="text-base font-bold text-emerald-400 font-mono mt-1 block">Receives GH₵95.00</span>
                <p className="text-[10px] text-neutral-500 mt-0.5">
                  Gross sales proceeds upon delivery confirmation.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <span className="text-[11px] font-semibold text-amber-400 block">Zorvaniq Market Revenue</span>
                <span className="text-base font-bold text-amber-400 font-mono mt-1 block">Earns GH₵5.00</span>
                <p className="text-[10px] text-neutral-400 mt-0.5">
                  5% platform facilitation fee on every transaction!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MY PRODUCTS */}
      {activeTab === 'products' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
            <span>Listing Limit: {products.length} / {activePlan.maxListings} slots used</span>
            <button
              onClick={() => setShowAddModal(true)}
              className="text-amber-400 font-bold hover:underline"
            >
              + Add New Listing
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(products || []).map((p) => (
              <div
                key={p.id}
                className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 flex gap-3 items-start"
              >
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-16 h-16 rounded-lg object-cover border border-neutral-800 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="text-xs font-bold text-white truncate">
                      {p.title}
                    </h4>
                    {p.isSponsored && (
                      <span className="text-[9px] font-black uppercase text-amber-400 bg-amber-500/15 px-1 rounded shrink-0">
                        Ad
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400 block mt-0.5">
                    GH₵{p.price.toFixed(2)}
                  </span>
                  <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-2">
                    <span>Stock: {p.stock} units</span>
                    <span className="text-emerald-400 font-medium">Active</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOMER ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-3">
          {(orders || []).length === 0 ? (
            <p className="text-xs text-neutral-500 text-center py-8">No incoming orders yet.</p>
          ) : (
            (orders || []).map((o) => (
              <div
                key={o.id}
                className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-2">
                  <div>
                    <span className="text-xs font-bold text-white">Order #{o.id}</span>
                    <span className="text-[11px] text-neutral-400 block">
                      Buyer: {o.buyerName} • {o.buyerPhone} ({o.buyerRegion})
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-amber-400 font-mono">
                      GH₵{o.total.toFixed(2)}
                    </span>
                    <span className="text-[10px] uppercase font-bold block text-emerald-400">
                      Status: {o.status}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-neutral-300">
                  <p>Items: {(o.items || []).map((it) => `${it.product?.title || 'Item'} (x${it.quantity || 1})`).join(', ')}</p>
                  <p className="text-neutral-400 text-[11px] mt-0.5">Address: {o.buyerAddress}</p>
                </div>

                {/* Seller Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-neutral-800">
                  {o.status === 'placed' && (
                    <button
                      onClick={() => onUpdateOrderStatus && onUpdateOrderStatus(o.id, 'preparing', 'Seller started packaging the product in Kumasi')}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 text-neutral-950 font-bold text-xs hover:bg-amber-400 transition-colors"
                    >
                      Package Order
                    </button>
                  )}
                  {o.status === 'preparing' && (
                    <button
                      onClick={() => onUpdateOrderStatus(o.id, 'dispatched', 'Package handed over to dispatch rider for delivery')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 text-neutral-950 font-bold text-xs hover:bg-emerald-400 transition-colors"
                    >
                      Handover to Rider
                    </button>
                  )}
                  {o.status === 'dispatched' && (
                    <span className="text-xs text-neutral-400">
                      Rider en route. Waiting for customer delivery confirmation.
                    </span>
                  )}
                  {o.status === 'delivered' && (
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Completed & Escrow proceeds deposited to seller wallet!
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 4: SELLER PLANS */}
      {activeTab === 'plans' && (
        <div className="space-y-4">
          <div className="text-center max-w-md mx-auto mb-2">
            <h3 className="text-base font-bold text-white">Zorvaniq Seller Subscriptions</h3>
            <p className="text-xs text-neutral-400 mt-1">
              Isaac, you earn recurring monthly software revenue (SaaS) when merchants upgrade their business tooling.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {SELLER_PLANS.map((plan) => {
              const isCurrent = activePlan.id === plan.id;
              return (
                <div
                  key={plan.id}
                  className={`bg-neutral-900 rounded-xl p-4 border flex flex-col justify-between transition-all ${
                    isCurrent
                      ? 'border-amber-500 ring-1 ring-amber-500/50 shadow-lg shadow-amber-500/10'
                      : 'border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-white text-sm">{plan.name}</h4>
                      {isCurrent && (
                        <span className="text-[10px] font-black text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded">
                          Current
                        </span>
                      )}
                    </div>

                    <div className="mb-3">
                      <span className="text-xl font-black text-white font-mono">
                        GH₵{plan.priceMonthly}
                      </span>
                      <span className="text-xs text-neutral-400"> / month</span>
                    </div>

                    <ul className="text-xs text-neutral-300 space-y-2 mb-4">
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Up to <strong>{plan.maxListings}</strong> listings</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span><strong>{plan.commissionRate}%</strong> platform fee</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{plan.promotedListingCredits} free ad boosts/mo</span>
                      </li>
                      {plan.analytics && (
                        <li className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>Advanced sales analytics</span>
                        </li>
                      )}
                    </ul>
                  </div>

                  <button
                    onClick={() => onUpgradePlan(plan)}
                    disabled={isCurrent}
                    className={`w-full py-2 rounded-lg text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-neutral-800 text-neutral-500 cursor-default'
                        : 'bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-md'
                    }`}
                  >
                    {isCurrent ? 'Current Plan' : `Upgrade (GH₵${plan.priceMonthly}/mo)`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* UPLOAD PRODUCT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-neutral-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-lg rounded-2xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Upload className="w-4 h-4 text-amber-400" />
                Upload Product to Zorvaniq Market
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="text-neutral-300 font-semibold block mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Designer Kaftan Shirt or Samsung Galaxy"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-neutral-300 font-semibold block mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Fashion">Fashion & Clothing</option>
                    <option value="Gadgets & Computing">Gadgets & Phones</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Food & Agric">Food & Agriculture</option>
                    <option value="Health & Beauty">Health & Beauty</option>
                    <option value="Home & Living">Home & Furniture</option>
                  </select>
                </div>

                <div>
                  <label className="text-neutral-300 font-semibold block mb-1">
                    Price (GH₵) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="e.g. 180"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-neutral-300 font-semibold block mb-1">
                    City / Location *
                  </label>
                  <select
                    value={sellerCity}
                    onChange={(e) => setSellerCity(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Kumasi">Kumasi (Adum / Kejetia)</option>
                    <option value="Accra">Accra (Circle / Spintex)</option>
                    <option value="Takoradi">Takoradi (Market Circle)</option>
                    <option value="Tamale">Tamale (Central)</option>
                    <option value="Sunyani">Sunyani</option>
                  </select>
                </div>

                <div>
                  <label className="text-neutral-300 font-semibold block mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-neutral-300 font-semibold block mb-1">
                  Product Image URL
                </label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="text-neutral-300 font-semibold block mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe sizes, condition, materials, warranty..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Toggles */}
              <div className="space-y-2 pt-2 border-t border-neutral-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowNegotiation}
                    onChange={(e) => setAllowNegotiation(e.target.checked)}
                    className="rounded text-amber-500"
                  />
                  <span className="text-neutral-200">
                    Allow buyers to send price counter-offers in Zorvaniq Chat
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSponsored}
                    onChange={(e) => setIsSponsored(e.target.checked)}
                    className="rounded text-amber-500"
                  />
                  <span className="text-amber-400 font-medium">
                    Boost as Sponsored Listing (Adds Zorvaniq ad revenue GH₵15)
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold transition-all shadow"
                >
                  Publish Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
