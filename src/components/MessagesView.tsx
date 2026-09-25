import React, { useState, useEffect } from 'react';
import { Send, MessageSquare, Check, CheckCheck, ShoppingBag, ArrowLeft, Tag, Clock, Phone, Sparkles, DollarSign } from 'lucide-react';
import { Conversation, Message, Product } from '../types';

interface MessagesViewProps {
  conversations?: Conversation[];
  activeConversationId?: string | null;
  setActiveConversationId?: (id: string | null) => void;
  onSelectConversation?: (id: string | null) => void;
  onSendMessage?: (convId: string, text: string, isOffer?: boolean, offerAmount?: number) => void;
  onAcceptOffer?: (convId: string, messageId: string, offerAmount: number) => void;
  onRespondToOffer?: (messageId: string, accept: boolean) => void;
  onSendOffer?: (convId: string, amount: number) => void;
  onCheckoutProduct?: (productId: string, negotiatedPrice?: number) => void;
  currentRole?: string;
}

export const MessagesView: React.FC<MessagesViewProps> = ({
  conversations = [],
  activeConversationId,
  setActiveConversationId,
  onSelectConversation,
  onSendMessage,
  onAcceptOffer,
  onRespondToOffer,
  onSendOffer,
  onCheckoutProduct
}) => {
  const [messageInput, setMessageInput] = useState('');
  const [showOfferInput, setShowOfferInput] = useState(false);
  const [offerValue, setOfferValue] = useState<number | ''>('');

  const safeConversations = Array.isArray(conversations) ? conversations : [];
  const activeConversation =
    safeConversations.find((c) => c.id === activeConversationId) || safeConversations[0] || null;

  const handleSelectConv = (id: string | null) => {
    if (onSelectConversation) onSelectConversation(id);
    if (setActiveConversationId) setActiveConversationId(id);
  };

  const quickReplies = [
    'Is this item still available?',
    'Can you deliver to Accra today?',
    'What is your final best price?',
    'Does it come with original receipt?'
  ];

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageInput.trim() || !activeConversation) return;

    onSendMessage(activeConversation.id, messageInput.trim());
    setMessageInput('');
  };

  const handleSendOffer = () => {
    if (!offerValue || !activeConversation) return;
    const amount = Number(offerValue);
    if (isNaN(amount) || amount <= 0) return;

    const offerText = `Offer Proposal: Can you consider GH₵${amount} for this item?`;
    onSendMessage(activeConversation.id, offerText, true, amount);
    setShowOfferInput(false);
    setOfferValue('');
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl h-[78vh] flex flex-col md:flex-row">
      {/* Sidebar: Conversation List (hidden on mobile if viewing active chat) */}
      <div
        className={`w-full md:w-80 border-r border-neutral-800 flex flex-col bg-neutral-950/60 ${
          activeConversationId ? 'hidden md:flex' : 'flex'
        }`}
      >
        <div className="p-3.5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold text-white text-sm">Zorvaniq Chat</h2>
          </div>
          <span className="text-[11px] text-neutral-500 font-mono">
            {safeConversations.length} Active
          </span>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-neutral-900">
          {safeConversations.map((conv) => {
            const isSelected = activeConversation?.id === conv.id;
            return (
              <div
                key={conv.id}
                onClick={() => handleSelectConv(conv.id)}
                className={`p-3 flex items-start gap-3 cursor-pointer transition-colors ${
                  isSelected ? 'bg-neutral-800/80' : 'hover:bg-neutral-900/60'
                }`}
              >
                <div className="relative">
                  <img
                    src={conv.sellerAvatar || conv.productImage}
                    alt={conv.sellerName}
                    className="w-11 h-11 rounded-full object-cover border border-neutral-700 shrink-0"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-neutral-900" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white truncate">
                      {conv.sellerName}
                    </h4>
                    <span className="text-[10px] text-neutral-500 whitespace-nowrap">
                      {conv.lastTimestamp}
                    </span>
                  </div>

                  <p className="text-[11px] text-amber-400/90 font-medium truncate mt-0.5">
                    {conv.productTitle}
                  </p>

                  <p className="text-xs text-neutral-400 truncate mt-0.5">
                    {conv.lastMessage}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Chat Area */}
      {activeConversation ? (
        <div
          className={`flex-1 flex flex-col bg-neutral-900 ${
            !activeConversationId ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Chat Header */}
          <div className="p-3 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/70">
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => handleSelectConv(null)}
                className="md:hidden p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <img
                src={activeConversation.sellerAvatar || activeConversation.productImage}
                alt={activeConversation.sellerName}
                className="w-9 h-9 rounded-full object-cover border border-neutral-700"
              />
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                  {activeConversation.sellerName}
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </h3>
                <span className="text-[10px] text-neutral-400">
                  Verified Merchant • Online
                </span>
              </div>
            </div>

            {/* Pinned Product Card Snapshot */}
            <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-2 py-1 rounded-xl">
              <img
                src={activeConversation.productImage}
                alt=""
                className="w-8 h-8 rounded-lg object-cover"
              />
              <div className="hidden sm:block text-left">
                <span className="text-[10px] text-neutral-400 block truncate max-w-[120px]">
                  {activeConversation.productTitle}
                </span>
                <span className="text-xs font-bold text-amber-400 font-mono">
                  GH₵{activeConversation.productPrice}
                </span>
              </div>
              <button
                onClick={() => onCheckoutProduct && onCheckoutProduct(activeConversation.productId, activeConversation.productPrice)}
                className="px-2 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 text-[11px] font-bold transition-colors shrink-0"
              >
                Checkout
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-neutral-950/20 to-transparent">
            {/* Encryption & Escrow notice */}
            <div className="text-center my-1">
              <span className="inline-flex items-center gap-1 text-[10px] text-neutral-500 bg-neutral-950/60 px-2.5 py-1 rounded-full border border-neutral-800">
                🔒 Safe Trade: Keep negotiations on Zorvaniq to guarantee Escrow Protection
              </span>
            </div>

            {(activeConversation.messages || []).map((msg) => {
              const isMe = msg.senderRole === 'buyer';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-md p-3 rounded-2xl text-xs sm:text-sm ${
                      isMe
                        ? 'bg-amber-500 text-neutral-950 font-medium rounded-br-none shadow'
                        : 'bg-neutral-800 text-neutral-100 rounded-bl-none border border-neutral-700/60 shadow'
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>

                    {/* Price Offer Card inside message if isOffer */}
                    {msg.isOffer && msg.offerAmount && (
                      <div className="mt-2.5 pt-2 border-t border-neutral-950/20 bg-neutral-950/10 p-2 rounded-lg space-y-1.5">
                        <div className="flex items-center justify-between font-bold text-xs">
                          <span className="flex items-center gap-1">
                            <Tag className="w-3.5 h-3.5" />
                            Counter Offer:
                          </span>
                          <span className="font-mono text-sm font-black">
                            GH₵{msg.offerAmount.toFixed(2)}
                          </span>
                        </div>

                        {msg.offerStatus === 'accepted' ? (
                          <div className="text-[11px] font-bold text-emerald-800 bg-emerald-300/80 px-2 py-1 rounded flex items-center justify-between">
                            <span>✓ Offer Accepted!</span>
                            <button
                              onClick={() => onCheckoutProduct && onCheckoutProduct(activeConversation.productId, msg.offerAmount)}
                              className="underline hover:text-emerald-950"
                            >
                              Buy at GH₵{msg.offerAmount}
                            </button>
                          </div>
                        ) : msg.offerStatus === 'declined' ? (
                          <div className="text-[11px] text-rose-900 bg-rose-200/80 px-2 py-1 rounded">
                            ✕ Offer declined by seller
                          </div>
                        ) : (
                          <div className="flex gap-1.5 pt-1">
                            <button
                              onClick={() => {
                                if (onAcceptOffer) onAcceptOffer(activeConversation.id, msg.id, msg.offerAmount!);
                                else if (onRespondToOffer) onRespondToOffer(msg.id, true);
                              }}
                              className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-colors"
                            >
                              Accept GH₵{msg.offerAmount}
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    <div
                      className={`text-[9px] mt-1 flex items-center justify-end gap-1 ${
                        isMe ? 'text-neutral-800' : 'text-neutral-400'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {isMe && <CheckCheck className="w-3 h-3 text-neutral-900" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Replies */}
          <div className="px-3 py-1.5 bg-neutral-950/50 border-t border-neutral-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none no-scrollbar">
            {quickReplies.map((qr, i) => (
              <button
                key={i}
                onClick={() => onSendMessage(activeConversation.id, qr)}
                className="px-2.5 py-1 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[11px] whitespace-nowrap transition-colors border border-neutral-700/60 shrink-0"
              >
                {qr}
              </button>
            ))}
          </div>

          {/* Negotiation Popover Bar */}
          {showOfferInput && (
            <div className="p-2.5 bg-neutral-950 border-t border-neutral-800 flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold shrink-0">
                <DollarSign className="w-4 h-4" />
                <span>Offer Price (GH₵):</span>
              </div>
              <input
                type="number"
                placeholder={`e.g. ${Math.round(activeConversation.productPrice * 0.9)}`}
                value={offerValue}
                onChange={(e) => setOfferValue(e.target.value ? Number(e.target.value) : '')}
                className="w-28 bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={handleSendOffer}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold transition-colors"
              >
                Send Offer
              </button>
              <button
                onClick={() => setShowOfferInput(false)}
                className="text-xs text-neutral-400 hover:text-white px-1"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Input Bar */}
          <form
            onSubmit={handleSend}
            className="p-2.5 bg-neutral-950/90 border-t border-neutral-800 flex items-center gap-2"
          >
            <button
              type="button"
              onClick={() => setShowOfferInput(!showOfferInput)}
              className="px-2.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-400 text-xs font-bold flex items-center gap-1 transition-colors border border-neutral-700 shrink-0"
              title="Negotiate / Send Price Offer"
            >
              <Tag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Make Offer</span>
            </button>

            <input
              type="text"
              placeholder="Type your message to seller..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/80 transition-colors"
            />

            <button
              type="submit"
              disabled={!messageInput.trim()}
              className="p-2 sm:px-3.5 sm:py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-neutral-950 text-xs font-bold flex items-center gap-1 transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-center p-6 text-neutral-500">
          <div>
            <MessageSquare className="w-10 h-10 mx-auto mb-2 text-neutral-600" />
            <p className="text-sm">Select a conversation to start negotiating</p>
          </div>
        </div>
      )}
    </div>
  );
};
