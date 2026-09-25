import React, { useState } from 'react';
import { X, MapPin, ShieldCheck, MessageSquare, ShoppingBag, Truck, Award, Check, Sparkles, AlertCircle } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onStartNegotiation: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onViewOnMap?: (locationQuery: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onStartNegotiation,
  onBuyNow,
  onViewOnMap
}) => {
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!product) return null;

  const platformFee = Number((product.price * 0.05).toFixed(2));
  const sellerProceeds = Number((product.price * 0.95).toFixed(2));

  const handleAdd = () => {
    onAddToCart(product);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-800 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 bg-neutral-950/50">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {product.category}
            </span>
            {product.isSponsored && (
              <span className="text-[10px] uppercase font-black text-neutral-950 bg-amber-400 px-1.5 py-0.5 rounded">
                Sponsored Listing
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Main Info Hero */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Image */}
            <div className="relative aspect-square rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-neutral-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-neutral-700 text-xs text-neutral-200 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{product.sellerCity}</span>
              </div>
            </div>

            {/* Details */}
            <div className="flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between gap-2 text-xs text-neutral-400 mb-1">
                  <div className="flex items-center gap-1.5 truncate">
                    <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">Sold by <strong className="text-white">{product.sellerName}</strong></span>
                  </div>
                  {onViewOnMap && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onViewOnMap(`${product.sellerName}, ${product.sellerCity}`);
                      }}
                      className="text-[10px] text-amber-400 hover:text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-semibold flex items-center gap-1 shrink-0 transition-colors"
                    >
                      <MapPin className="w-3 h-3" />
                      <span>Live Map</span>
                    </button>
                  )}
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
                  {product.title}
                </h2>

                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center text-amber-400 text-sm font-bold">
                    ★ {product.rating}
                  </div>
                  <span className="text-xs text-neutral-500">
                    ({product.reviewsCount} customer reviews)
                  </span>
                  <span className="text-neutral-600">•</span>
                  <span className="text-xs text-emerald-400 font-medium">
                    {product.stock} units in stock
                  </span>
                </div>

                {/* Price Display */}
                <div className="mt-4 p-3 bg-neutral-950/80 rounded-xl border border-neutral-800">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                      GH₵{product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-neutral-500 line-through font-mono">
                        GH₵{product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Price in Ghana Cedis. Pay via MTN MoMo, Telecel Cash, or Zorvaniq Wallet.
                  </p>
                </div>
              </div>

              {/* Zorvaniq Transparency Card */}
              <div className="p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs space-y-1">
                <div className="font-semibold text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Transparent Fee Breakdown (5% Zorvaniq Model)
                </div>
                <div className="flex justify-between text-[11px] text-neutral-400">
                  <span>Seller Gross Proceeds:</span>
                  <span className="text-neutral-200 font-mono">GH₵{sellerProceeds.toFixed(2)} (95%)</span>
                </div>
                <div className="flex justify-between text-[11px] text-neutral-400">
                  <span>Zorvaniq Platform & Escrow Fee:</span>
                  <span className="text-amber-400 font-mono">GH₵{platformFee.toFixed(2)} (5%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Product Description
            </h4>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed bg-neutral-950/50 p-3.5 rounded-xl border border-neutral-800">
              {product.description}
            </p>
          </div>

          {/* Escrow & Delivery Notice */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-neutral-950/60 border border-neutral-800">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-semibold">100% Escrow Protection</strong>
                <span className="text-[11px] text-neutral-400">
                  Payment is locked safely. The seller only receives funds once you receive and inspect your package.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-neutral-950/60 border border-neutral-800">
              <Truck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-semibold">Fast Intercity Delivery</strong>
                <span className="text-[11px] text-neutral-400">
                  Delivery available nationwide (Accra, Kumasi, Takoradi, Tamale, Sunyani, Cape Coast).
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 sm:p-4 bg-neutral-950/80 border-t border-neutral-800 flex flex-wrap sm:flex-nowrap items-center gap-2">
          {product.allowNegotiation && (
            <button
              onClick={() => onStartNegotiation(product)}
              className="flex-1 py-2.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-100 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-neutral-700"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Negotiate / Offer Price</span>
            </button>
          )}

          <button
            onClick={handleAdd}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              addedSuccess
                ? 'bg-emerald-500 text-neutral-950'
                : 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700'
            }`}
          >
            {addedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added to Cart!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span>Add to Cart</span>
              </>
            )}
          </button>

          <button
            onClick={() => onBuyNow(product)}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 text-xs font-black shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all"
          >
            <span>Buy Now (MoMo / Wallet)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
