import React, { useState } from 'react';
import { X, Trash2, ShieldCheck, ArrowRight, ShoppingBag, Truck, Check } from 'lucide-react';
import { Product, GhanaRegion, Order } from '../types';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, qty: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: (orderData: {
    buyerName: string;
    buyerPhone: string;
    buyerAddress: string;
    buyerRegion: GhanaRegion;
    paymentMethod: 'mtn_momo' | 'telecel_cash' | 'airteltigo_cash' | 'wallet';
  }) => void;
  walletBalance: number;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  walletBalance
}) => {
  const [buyerName, setBuyerName] = useState('Kwame Mensah');
  const [buyerPhone, setBuyerPhone] = useState('024 412 8901');
  const [buyerAddress, setBuyerAddress] = useState('Plot 14, East Legon, Accra');
  const [buyerRegion, setBuyerRegion] = useState<GhanaRegion>('Greater Accra');
  const [paymentMethod, setPaymentMethod] = useState<'mtn_momo' | 'telecel_cash' | 'airteltigo_cash' | 'wallet'>('mtn_momo');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (!isOpen) return null;

  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];

  const subtotal = safeCartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 1),
    0
  );
  const deliveryFee = safeCartItems.length > 0 ? 25.0 : 0; // standard inter-district fee
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setIsCheckingOut(true);
    setTimeout(() => {
      onCheckout({
        buyerName,
        buyerPhone,
        buyerAddress,
        buyerRegion,
        paymentMethod
      });
      setIsCheckingOut(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-neutral-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-neutral-900 border-l border-neutral-800 h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">Zorvaniq Cart</h3>
            <span className="text-xs text-neutral-400">({cartItems.length} items)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {safeCartItems.length === 0 ? (
            <div className="text-center py-16 text-neutral-500 text-xs">
              Your cart is empty. Add verified Ghanaian items from the Marketplace!
            </div>
          ) : (
            safeCartItems.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center gap-3 p-3 bg-neutral-950/70 border border-neutral-800 rounded-xl"
              >
                <img
                  src={item.product.image}
                  alt={item.product.title}
                  className="w-14 h-14 object-cover rounded-lg border border-neutral-800 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{item.product.title}</h4>
                  <p className="text-[10px] text-neutral-400">{item.product.sellerCity}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-bold text-amber-400 font-mono">
                      GH₵{(item.product.price * item.quantity).toFixed(2)}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                        className="w-6 h-6 rounded bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center text-xs"
                      >
                        -
                      </button>
                      <span className="text-xs font-mono">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="w-6 h-6 rounded bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center text-xs"
                      >
                        +
                      </button>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="p-1 text-neutral-500 hover:text-red-400 transition-colors ml-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Checkout Form & Escrow Guarantee */}
        {cartItems.length > 0 && (
          <form onSubmit={handlePlaceOrder} className="p-4 border-t border-neutral-800 bg-neutral-950/90 space-y-3">
            {/* Delivery address & phone */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-neutral-400 block mb-0.5">Your Name:</label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] text-neutral-400 block mb-0.5">Mobile Phone:</label>
                <input
                  type="text"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-neutral-400 block mb-0.5">Delivery Address:</label>
              <input
                type="text"
                value={buyerAddress}
                onChange={(e) => setBuyerAddress(e.target.value)}
                placeholder="Street address or landmark"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                required
              />
            </div>

            {/* Payment method selector */}
            <div>
              <label className="text-[10px] text-neutral-400 block mb-1">Payment Method:</label>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('mtn_momo')}
                  className={`p-2 rounded-lg border text-left font-semibold transition-all ${
                    paymentMethod === 'mtn_momo'
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      : 'bg-neutral-900 text-neutral-400 border-neutral-800'
                  }`}
                >
                  MTN MoMo
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('telecel_cash')}
                  className={`p-2 rounded-lg border text-left font-semibold transition-all ${
                    paymentMethod === 'telecel_cash'
                      ? 'bg-red-500/20 text-red-400 border-red-500/40'
                      : 'bg-neutral-900 text-neutral-400 border-neutral-800'
                  }`}
                >
                  Telecel Cash
                </button>
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-1 pt-1 border-t border-neutral-800/80 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Subtotal:</span>
                <span className="font-mono text-white">GH₵{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Delivery Logistics Fee:</span>
                <span className="font-mono text-white">GH₵{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-black pt-1">
                <span className="text-white">Total Locked in Escrow:</span>
                <span className="font-mono text-amber-400">GH₵{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 bg-neutral-900 p-2 rounded-lg border border-neutral-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Funds held in Zorvaniq Escrow until you inspect your items.</span>
            </div>

            <button
              type="submit"
              disabled={isCheckingOut}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20"
            >
              <span>{isCheckingOut ? 'Securing Escrow...' : `Pay GH₵${total.toFixed(2)} & Lock in Escrow`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
