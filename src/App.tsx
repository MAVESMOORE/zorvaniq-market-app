import React, { useState } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { MarketplaceView } from './components/MarketplaceView';
import { MapsAgentView } from './components/MapsAgentView';
import { OrdersView } from './components/OrdersView';
import { SellerCenterView } from './components/SellerCenterView';
import { MessagesView } from './components/MessagesView';
import { InternetServicesView } from './components/InternetServicesView';
import { WalletView } from './components/WalletView';
import { FounderConsoleView } from './components/FounderConsoleView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_CONVERSATIONS,
  INITIAL_DATA_PACKAGES
} from './data/mockData';
import {
  Product,
  Order,
  Conversation,
  UserRole,
  WalletTransaction,
  DataPackage,
  GhanaRegion
} from './types';

export default function App() {
  // Navigation & Role State
  const [activeTab, setActiveTab] = useState<string>('marketplace');
  const [currentRole, setCurrentRole] = useState<UserRole>('buyer');
  const [isMobileDeviceFrame, setIsMobileDeviceFrame] = useState<boolean>(false);

  // Core Data State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    INITIAL_CONVERSATIONS[0]?.id || null
  );

  // Marketplace Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('all');

  // Cart & Modals
  const [cartItems, setCartItems] = useState<{ product: Product; quantity: number }[]>([
    { product: INITIAL_PRODUCTS[1], quantity: 1 }
  ]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Live Map Tracking Linkage
  const [activeOrderToTrack, setActiveOrderToTrack] = useState<Order | null>(null);
  const [mapsPrefilledQuery, setMapsPrefilledQuery] = useState<string | null>(null);

  // Financials & Wallet
  const [walletBalance, setWalletBalance] = useState<number>(450.00);
  const [escrowLockedBalance, setEscrowLockedBalance] = useState<number>(190.00);
  const [totalInternetSales, setTotalInternetSales] = useState<number>(380.00);
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([
    {
      id: 'tx-1',
      type: 'deposit',
      title: 'MoMo Topup via MTN',
      amount: 500.0,
      balanceAfter: 500.0,
      date: '2026-09-16 08:30 AM',
      status: 'completed',
      provider: 'MTN MoMo',
      reference: 'MOM-892147'
    },
    {
      id: 'tx-2',
      type: 'purchase',
      title: 'Escrow Lock: Order #ZQ-89421',
      amount: 190.0,
      balanceAfter: 310.0,
      date: '2026-09-16 09:31 AM',
      status: 'completed',
      provider: 'Zorvaniq Escrow',
      reference: 'ESC-441029'
    },
    {
      id: 'tx-3',
      type: 'deposit',
      title: 'Topup via Telecel Cash',
      amount: 140.0,
      balanceAfter: 450.0,
      date: '2026-09-16 11:20 AM',
      status: 'completed',
      provider: 'Telecel Cash',
      reference: 'TEL-673190'
    }
  ]);

  // Derived Counts
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const unreadMessagesCount = conversations.reduce(
    (sum, conv) => sum + conv.unreadCount,
    0
  );
  const activeOrdersCount = orders.filter(
    (o) => o.status !== 'delivered' && o.status !== 'cancelled'
  ).length;

  // Handlers: Cart
  const handleAddToCart = (product: Product, customPrice?: number) => {
    const itemProduct = customPrice ? { ...product, price: customPrice } : product;
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1, product: itemProduct }
            : item
        );
      }
      return [...prev, { product: itemProduct, quantity: 1 }];
    });
  };

  const handleUpdateCartQuantity = (productId: string, qty: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Handlers: Checkout & Orders
  const handleCheckout = (orderData: {
    buyerName: string;
    buyerPhone: string;
    buyerAddress: string;
    buyerRegion: GhanaRegion;
    paymentMethod: 'mtn_momo' | 'telecel_cash' | 'airteltigo_cash' | 'wallet';
  }) => {
    if (cartItems.length === 0) return;

    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const deliveryFee = 25.0;
    const total = subtotal + deliveryFee;
    const platformFee = Number((subtotal * 0.05).toFixed(2)); // 5% marketplace commission
    const sellerNetProceeds = Number((subtotal - platformFee).toFixed(2));

    const newOrder: Order = {
      id: `ZQ-${Math.floor(10000 + Math.random() * 90000)}`,
      buyerName: orderData.buyerName,
      buyerPhone: orderData.buyerPhone,
      buyerAddress: orderData.buyerAddress,
      buyerRegion: orderData.buyerRegion,
      sellerId: cartItems[0].product.sellerId,
      sellerName: cartItems[0].product.sellerName,
      items: cartItems.map((item) => ({
        product: item.product,
        quantity: item.quantity
      })),
      subtotal,
      deliveryFee,
      total,
      platformFee,
      sellerNetProceeds,
      paymentMethod: orderData.paymentMethod,
      paymentPhone: orderData.buyerPhone,
      status: 'escrow_locked',
      placedAt: 'Just now',
      deliveryAgent: {
        name: 'Emmanuel Osei (Zorvaniq Express)',
        phone: '055 789 2314',
        vehicle: 'Yamaha Crux Motorbike',
        etaMinutes: 25
      },
      trackingUpdates: [
        {
          status: 'placed',
          timestamp: 'Just now',
          message: 'Order placed and payment authorized.'
        },
        {
          status: 'escrow_locked',
          timestamp: 'Just now',
          message: `GH₵${total.toFixed(2)} locked in Zorvaniq Escrow. Protected until receipt.`
        }
      ]
    };

    setOrders((prev) => [newOrder, ...prev]);
    setEscrowLockedBalance((prev) => prev + total);

    // Record transaction
    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      type: 'purchase',
      title: `Escrow Lock: Order #${newOrder.id}`,
      amount: total,
      balanceAfter: walletBalance,
      date: 'Just now',
      status: 'completed',
      provider:
        orderData.paymentMethod === 'mtn_momo'
          ? 'MTN MoMo'
          : orderData.paymentMethod === 'telecel_cash'
          ? 'Telecel Cash'
          : 'Zorvaniq Escrow',
      reference: `ORD-${newOrder.id}`
    };
    setWalletTransactions((prev) => [newTx, ...prev]);

    setCartItems([]);
    setActiveTab('orders');
  };

  // Handlers: Confirm Delivery (Release Escrow)
  const handleConfirmDelivery = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: 'delivered',
            trackingUpdates: [
              ...o.trackingUpdates,
              {
                status: 'delivered',
                timestamp: 'Just now',
                message:
                  'Buyer inspected package and confirmed receipt. GH₵' +
                  o.sellerNetProceeds.toFixed(2) +
                  ' escrow funds released to seller.'
              }
            ]
          };
        }
        return o;
      })
    );

    const order = orders.find((o) => o.id === orderId);
    if (order) {
      setEscrowLockedBalance((prev) => Math.max(0, prev - order.total));
    }
  };

  // Handlers: Negotiation & Messages
  const handleStartNegotiation = (product: Product) => {
    setSelectedProduct(null);
    let conv = conversations.find((c) => c.productId === product.id);

    if (!conv) {
      const newConvId = `conv-${Date.now()}`;
      conv = {
        id: newConvId,
        buyerId: 'buyer-current',
        buyerName: 'Kwesi Asante',
        sellerId: product.sellerId,
        sellerName: product.sellerName,
        productId: product.id,
        productTitle: product.title,
        productPrice: product.price,
        productImage: product.image,
        lastMessage: `Hello, I'm interested in ${product.title} from ${product.sellerCity}. Can we negotiate?`,
        lastTimestamp: 'Just now',
        unreadCount: 0,
        messages: [
          {
            id: `m-${Date.now()}`,
            senderId: 'buyer-current',
            senderName: 'Kwesi Asante',
            senderRole: 'buyer',
            text: `Hello, I am interested in ${product.title}. Can we discuss a price offer?`,
            timestamp: 'Just now'
          }
        ]
      };
      setConversations((prev) => [conv!, ...prev]);
    }

    setActiveConversationId(conv.id);
    setActiveTab('messages');
  };

  const handleSendMessage = (text: string) => {
    if (!activeConversationId) return;

    const newMessage = {
      id: `m-${Date.now()}`,
      senderId: currentRole === 'seller' ? 'seller-current' : 'buyer-current',
      senderName: currentRole === 'seller' ? 'Merchant' : 'Kwesi Asante',
      senderRole: currentRole === 'seller' ? ('seller' as const) : ('buyer' as const),
      text,
      timestamp: 'Just now'
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConversationId) {
          return {
            ...c,
            lastMessage: text,
            lastTimestamp: 'Just now',
            messages: [...c.messages, newMessage]
          };
        }
        return c;
      })
    );

    // If buyer sent a message, simulate seller response after 1 second
    if (currentRole === 'buyer') {
      setTimeout(() => {
        const autoReply = {
          id: `m-reply-${Date.now()}`,
          senderId: 'seller-reply',
          senderName: 'Seller Response',
          senderRole: 'seller' as const,
          text: 'Thank you for reaching out! The item is in stock at our warehouse. We can dispatch via Zorvaniq Express with instant Google Maps tracking as soon as you order.',
          timestamp: 'Just now'
        };

        setConversations((prev) =>
          prev.map((c) => {
            if (c.id === activeConversationId) {
              return {
                ...c,
                lastMessage: autoReply.text,
                lastTimestamp: 'Just now',
                messages: [...c.messages, autoReply]
              };
            }
            return c;
          })
        );
      }, 900);
    }
  };

  const handleSendOffer = (offerAmount: number) => {
    if (!activeConversationId) return;

    const offerMessage = {
      id: `m-offer-${Date.now()}`,
      senderId: 'buyer-current',
      senderName: 'Kwesi Asante',
      senderRole: 'buyer' as const,
      text: `I made a direct price offer of GH₵${offerAmount.toFixed(2)} for this item.`,
      timestamp: 'Just now',
      isOffer: true,
      offerAmount,
      offerStatus: 'pending' as const
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConversationId) {
          return {
            ...c,
            lastMessage: `Offer: GH₵${offerAmount.toFixed(2)}`,
            lastTimestamp: 'Just now',
            messages: [...c.messages, offerMessage]
          };
        }
        return c;
      })
    );
  };

  const handleRespondToOffer = (messageId: string, accept: boolean) => {
    if (!activeConversationId) return;

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConversationId) {
          return {
            ...c,
            messages: c.messages.map((m) => {
              if (m.id === messageId) {
                return {
                  ...m,
                  offerStatus: accept ? ('accepted' as const) : ('rejected' as const)
                };
              }
              return m;
            })
          };
        }
        return c;
      })
    );
  };

  // Handlers: Seller Center
  const handleAddProduct = (newProd: Omit<Product, 'id' | 'createdAt'>) => {
    const product: Product = {
      ...newProd,
      id: `prod-${Date.now()}`,
      createdAt: 'Just now'
    };
    setProducts((prev) => [product, ...prev]);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status'], message: string) => {
    setOrders((prev) =>
      (prev || []).map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            status: newStatus,
            trackingUpdates: [
              ...(order.trackingUpdates || []),
              {
                status: newStatus,
                timestamp: 'Just now',
                message
              }
            ]
          };
        }
        return order;
      })
    );
  };

  // Handlers: Internet Services
  const handlePurchaseData = (pkg: DataPackage, phone: string) => {
    setTotalInternetSales((prev) => prev + pkg.price);
    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      type: 'data_bundle',
      title: `${pkg.telco} ${pkg.volume} Data Pack`,
      amount: pkg.price,
      balanceAfter: Math.max(0, walletBalance - pkg.price),
      date: 'Just now',
      status: 'completed',
      provider: pkg.telco.includes('MTN') ? 'MTN MoMo' : 'Telecel Cash',
      reference: `DAT-${Math.floor(100000 + Math.random() * 900000)}`
    };
    setWalletTransactions((prev) => [newTx, ...prev]);
  };

  // Handlers: Wallet
  const handleWalletDeposit = (amount: number, provider: string, phone: string) => {
    setWalletBalance((prev) => prev + amount);
    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      type: 'deposit',
      title: `MoMo Deposit via ${provider}`,
      amount,
      balanceAfter: walletBalance + amount,
      date: 'Just now',
      status: 'completed',
      provider: provider as any,
      reference: `DEP-${Math.floor(100000 + Math.random() * 900000)}`
    };
    setWalletTransactions((prev) => [newTx, ...prev]);
  };

  const handleWalletWithdraw = (amount: number, provider: string, phone: string) => {
    setWalletBalance((prev) => Math.max(0, prev - amount));
    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      type: 'withdrawal',
      title: `Payout to ${provider} (${phone})`,
      amount,
      balanceAfter: Math.max(0, walletBalance - amount),
      date: 'Just now',
      status: 'completed',
      provider: provider as any,
      reference: `WTH-${Math.floor(100000 + Math.random() * 900000)}`
    };
    setWalletTransactions((prev) => [newTx, ...prev]);
  };

  // Handlers: Maps Agent
  const handleTrackOnMap = (order: Order) => {
    setActiveOrderToTrack(order);
    setActiveTab('maps-agent');
  };

  const handleViewLocationOnMap = (locationQuery: string) => {
    setMapsPrefilledQuery(`Find wholesale markets and shops near ${locationQuery}`);
    setActiveTab('maps-agent');
  };

  // Render Inner Content by Active Tab
  const renderContent = () => {
    switch (activeTab) {
      case 'marketplace':
        return (
          <MarketplaceView
            products={products}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onAddToCart={handleAddToCart}
            onStartChat={handleStartNegotiation}
            onDirectBuy={(p) => {
              handleAddToCart(p);
              setIsCartOpen(true);
            }}
            selectedRegion={selectedRegion}
            setSelectedRegion={setSelectedRegion}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onOpenMapsAgent={(q) => {
              if (q) setMapsPrefilledQuery(q);
              setActiveTab('maps-agent');
            }}
          />
        );

      case 'maps-agent':
        return (
          <MapsAgentView
            orders={orders}
            activeOrderToTrack={activeOrderToTrack}
            onClearActiveOrderTrack={() => setActiveOrderToTrack(null)}
            prefilledQuery={mapsPrefilledQuery}
          />
        );

      case 'orders':
        return (
          <OrdersView
            orders={orders}
            onTrackOnMap={handleTrackOnMap}
            onConfirmDelivery={handleConfirmDelivery}
          />
        );

      case 'seller-center':
        return (
          <SellerCenterView
            products={products}
            orders={orders}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            totalOrdersCount={orders.length}
            onOpenProductModal={(p) => setSelectedProduct(p)}
          />
        );

      case 'messages':
        return (
          <MessagesView
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelectConversation={setActiveConversationId}
            setActiveConversationId={setActiveConversationId}
            onSendMessage={handleSendMessage}
            onSendOffer={handleSendOffer}
            onRespondToOffer={handleRespondToOffer}
            onAcceptOffer={(convId, msgId) => handleRespondToOffer(msgId, true)}
            onCheckoutProduct={(productId, negotiatedPrice) => {
              const prod = (products || []).find((p) => p.id === productId);
              if (prod) {
                handleAddToCart(prod, negotiatedPrice);
                setIsCartOpen(true);
              }
            }}
            currentRole={currentRole}
          />
        );

      case 'internet':
        return (
          <InternetServicesView
            dataPackages={INITIAL_DATA_PACKAGES}
            onPurchasePackage={handlePurchaseData}
            walletBalance={walletBalance}
          />
        );

      case 'wallet':
        return (
          <WalletView
            balance={walletBalance}
            escrowLockedBalance={escrowLockedBalance}
            transactions={walletTransactions}
            onDeposit={handleWalletDeposit}
            onWithdraw={handleWalletWithdraw}
            currentRole={currentRole}
          />
        );

      case 'founder':
        return (
          <FounderConsoleView
            orders={orders}
            products={products}
            totalInternetSales={totalInternetSales}
            onNavigateToWallet={() => setActiveTab('wallet')}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-500 selection:text-neutral-950">
      {/* Header */}
      <Header
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileDeviceFrame={isMobileDeviceFrame}
        setIsMobileDeviceFrame={setIsMobileDeviceFrame}
        cartCount={cartCount}
        openCart={() => setIsCartOpen(true)}
        walletBalance={walletBalance}
        unreadMessagesCount={unreadMessagesCount}
      />

      {/* Main App Body */}
      {isMobileDeviceFrame ? (
        // Android Phone Frame Container
        <main className="flex-1 flex items-center justify-center p-2 sm:p-6 bg-neutral-900/50">
          <div className="w-full max-w-[420px] h-[840px] bg-neutral-950 rounded-[44px] border-[10px] border-neutral-800 shadow-2xl overflow-hidden flex flex-col relative ring-1 ring-white/10">
            {/* Phone Top Notch / Speaker */}
            <div className="h-6 bg-neutral-950 flex items-center justify-between px-7 pt-1 select-none text-[10px] text-neutral-400 font-mono z-40">
              <span>9:41</span>
              <div className="w-20 h-4 bg-neutral-900 rounded-full flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-neutral-700 mr-1" />
                <span className="w-3 h-1.5 rounded-full bg-neutral-800" />
              </div>
              <span>MTN 5G</span>
            </div>

            {/* Phone Screen Scrollable Area */}
            <div className="flex-1 overflow-y-auto px-3 pt-3 pb-16 no-scrollbar">
              {renderContent()}
            </div>

            {/* Bottom Nav inside Phone Frame */}
            <div className="absolute bottom-0 left-0 right-0 z-30">
              <BottomNav
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                unreadMessagesCount={unreadMessagesCount}
                activeOrdersCount={activeOrdersCount}
                currentRole={currentRole}
              />
            </div>
          </div>
        </main>
      ) : (
        // Desktop / Responsive Layout
        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4">
          {renderContent()}
        </main>
      )}

      {/* Persistent Bottom Nav in Web view */}
      {!isMobileDeviceFrame && (
        <BottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          unreadMessagesCount={unreadMessagesCount}
          activeOrdersCount={activeOrdersCount}
          currentRole={currentRole}
        />
      )}

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onStartNegotiation={handleStartNegotiation}
        onBuyNow={(p) => {
          setSelectedProduct(null);
          handleAddToCart(p);
          setIsCartOpen(true);
        }}
        onViewOnMap={handleViewLocationOnMap}
      />

      {/* Cart & Escrow Checkout Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={handleCheckout}
        walletBalance={walletBalance}
      />
    </div>
  );
}
