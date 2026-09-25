import React, { useState } from 'react';
import { Package, Truck, Clock, CheckCircle2, ShieldCheck, MapPin, ChevronRight, AlertCircle, Phone, ArrowUpRight } from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface OrdersViewProps {
  orders?: Order[];
  onTrackOnMap: (order: Order) => void;
  onConfirmDelivery: (orderId: string) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders = [],
  onTrackOnMap,
  onConfirmDelivery
}) => {
  const safeOrders = Array.isArray(orders) ? orders : [];
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(safeOrders[0]?.id || null);

  const filteredOrders = safeOrders.filter((o) => {
    if (filterStatus === 'all') return true;
    return o.status === filterStatus;
  });

  const activeOrder = safeOrders.find((o) => o.id === selectedOrderId) || safeOrders[0] || null;

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'placed':
        return <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Placed</span>;
      case 'escrow_locked':
        return <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Escrow Locked</span>;
      case 'preparing':
        return <span className="bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Preparing</span>;
      case 'dispatched':
        return <span className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase animate-pulse">In Transit 🚚</span>;
      case 'delivered':
        return <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Delivered</span>;
      case 'cancelled':
        return <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Cancelled</span>;
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-850 to-neutral-900 border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 text-xs font-semibold border border-amber-500/30 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            100% Zorvaniq Buyer Escrow Protection
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-['Space_Grotesk']">
            Your Orders & Dispatch Tracking
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mt-0.5">
            Funds remain locked in Zorvaniq Escrow until you inspect your items from the courier. Real-time Google Maps route tracking available for all shipments.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
          {['all', 'dispatched', 'escrow_locked', 'delivered'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                filterStatus === st
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {st === 'all' ? 'All Orders' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left List */}
        <div className="lg:col-span-5 space-y-2">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 bg-neutral-900 border border-neutral-800 rounded-2xl text-neutral-500 text-xs">
              No orders found matching this filter.
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                onClick={() => setSelectedOrderId(order.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  selectedOrderId === order.id
                    ? 'bg-neutral-900 border-amber-500 shadow-lg'
                    : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="font-mono font-bold text-white text-xs">
                      #{order.id}
                    </span>
                    <span className="text-[10px] text-neutral-500 block">
                      {order.placedAt}
                    </span>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={order.items?.[0]?.product?.image || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=700&auto=format&fit=crop&q=80'}
                    alt={order.items?.[0]?.product?.title || 'Product'}
                    className="w-12 h-12 rounded-lg object-cover border border-neutral-800 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">
                      {order.items?.[0]?.product?.title || 'Order Item'}
                    </h4>
                    <p className="text-[11px] text-neutral-400 truncate">
                      Seller: {order.sellerName}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[11px] font-mono font-bold text-amber-400">
                        GH₵{order.total.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-neutral-500">
                        {order.buyerRegion}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Detail Panel */}
        {activeOrder && (
          <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
            <div className="flex items-start justify-between border-b border-neutral-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-white text-sm">
                    Order #{activeOrder.id}
                  </span>
                  {getStatusBadge(activeOrder.status)}
                </div>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Placed on {activeOrder.placedAt} via {activeOrder.paymentMethod.replace('_', ' ').toUpperCase()}
                </p>
              </div>

              {/* Action: Track on Live Google Map */}
              <button
                onClick={() => onTrackOnMap(activeOrder)}
                className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-transform active:scale-95 shrink-0"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Track Route on Live Map</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            {/* Courier Dispatch Card */}
            {activeOrder.deliveryAgent && (
              <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase font-semibold block">
                      Assigned Zorvaniq Courier
                    </span>
                    <span className="text-xs font-bold text-white">
                      {activeOrder.deliveryAgent.name} • {activeOrder.deliveryAgent.vehicle}
                    </span>
                    <span className="text-[10px] text-emerald-400 block mt-0.5">
                      ETA: ~{activeOrder.deliveryAgent.etaMinutes} mins away
                    </span>
                  </div>
                </div>

                <a
                  href={`tel:${activeOrder.deliveryAgent.phone}`}
                  className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-amber-400 hover:bg-neutral-850 text-xs flex items-center gap-1 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Call Rider</span>
                </a>
              </div>
            )}

            {/* Destination Address */}
            <div className="bg-neutral-950/60 p-3 rounded-xl border border-neutral-800/80 space-y-1 text-xs">
              <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider block">
                Delivery Destination
              </span>
              <p className="text-white font-medium">{activeOrder.buyerAddress}</p>
              <p className="text-neutral-400 text-[11px]">
                {activeOrder.buyerRegion} • Recipient: {activeOrder.buyerName} ({activeOrder.buyerPhone})
              </p>
            </div>

            {/* Price breakdown & Escrow details */}
            <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-3.5 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Items Subtotal:</span>
                <span className="font-mono text-white">GH₵{activeOrder.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Delivery Logistics Fee:</span>
                <span className="font-mono text-white">GH₵{activeOrder.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Zorvaniq Platform Commission (5%):</span>
                <span className="font-mono text-neutral-400">GH₵{activeOrder.platformFee.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-neutral-800 flex justify-between text-sm font-bold">
                <span className="text-white">Total Escrow Paid:</span>
                <span className="font-mono text-amber-400">GH₵{activeOrder.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Confirm Release Button if in transit */}
            {activeOrder.status !== 'delivered' && (
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => onConfirmDelivery(activeOrder.id)}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-emerald-500/20"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Receipt & Release Escrow to Seller</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
