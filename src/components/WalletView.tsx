import React, { useState } from 'react';
import { Wallet, ArrowDownLeft, ArrowUpRight, ShieldCheck, Smartphone, Check, History, RefreshCw, Sparkles, Building2 } from 'lucide-react';
import { WalletTransaction, UserRole } from '../types';

interface WalletViewProps {
  balance: number;
  escrowLockedBalance: number;
  transactions: WalletTransaction[];
  onDeposit: (amount: number, provider: string, phone: string) => void;
  onWithdraw: (amount: number, provider: string, phone: string) => void;
  currentRole: UserRole;
}

export const WalletView: React.FC<WalletViewProps> = ({
  balance,
  escrowLockedBalance,
  transactions,
  onDeposit,
  onWithdraw,
  currentRole
}) => {
  const [modalMode, setModalMode] = useState<'deposit' | 'withdraw' | null>(null);
  const [amountInput, setAmountInput] = useState('');
  const [provider, setProvider] = useState<'MTN MoMo' | 'Telecel Cash' | 'AirtelTigo'>('MTN MoMo');
  const [phone, setPhone] = useState('024 412 8901');
  const [notice, setNotice] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amountInput);
    if (isNaN(val) || val <= 0) return;

    if (modalMode === 'deposit') {
      onDeposit(val, provider, phone);
      setNotice(`Deposited GH₵${val.toFixed(2)} via ${provider} prompt sent to ${phone}.`);
    } else if (modalMode === 'withdraw') {
      if (val > balance) {
        alert('Insufficient wallet balance.');
        return;
      }
      onWithdraw(val, provider, phone);
      setNotice(`Payout of GH₵${val.toFixed(2)} sent to ${provider} wallet ${phone}.`);
    }

    setModalMode(null);
    setAmountInput('');
    setTimeout(() => setNotice(null), 4000);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-850 border border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 text-xs font-semibold border border-amber-500/30">
              <Wallet className="w-3.5 h-3.5" />
              <span>Zorvaniq Digital MoMo & Escrow Vault</span>
            </div>
            <p className="text-xs text-neutral-400">Available Liquid Balance</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                GH₵{balance.toFixed(2)}
              </span>
              <span className="text-xs text-neutral-500 font-semibold">GHS</span>
            </div>

            {/* Escrow Locked indicator */}
            <div className="flex items-center gap-2 pt-1 text-xs text-neutral-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Protected Escrow In-Transit: <strong className="text-emerald-400 font-mono">GH₵{escrowLockedBalance.toFixed(2)}</strong>
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setModalMode('deposit')}
              className="flex-1 md:flex-none px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-transform active:scale-95"
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>Load via MoMo</span>
            </button>
            <button
              onClick={() => setModalMode('withdraw')}
              className="flex-1 md:flex-none px-5 py-3 rounded-2xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <ArrowUpRight className="w-4 h-4 text-amber-400" />
              <span>Withdraw to MoMo</span>
            </button>
          </div>
        </div>
      </div>

      {notice && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Transaction History */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <History className="w-4 h-4 text-amber-400" />
            Recent Wallet & Escrow Ledger
          </h3>
          <span className="text-[10px] text-neutral-400 font-mono">
            {transactions.length} Records
          </span>
        </div>

        <div className="divide-y divide-neutral-800/60">
          {transactions.map((tx) => {
            const isCredit = tx.type === 'deposit' || tx.type === 'sale_proceeds';
            return (
              <div key={tx.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isCredit
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-neutral-800 text-amber-400'
                    }`}
                  >
                    {isCredit ? (
                      <ArrowDownLeft className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-white block">{tx.title}</span>
                    <span className="text-[10px] text-neutral-400">
                      {tx.provider || 'Zorvaniq'} • Ref: {tx.reference} • {tx.date}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`font-mono font-bold block ${
                      isCredit ? 'text-emerald-400' : 'text-neutral-200'
                    }`}
                  >
                    {isCredit ? '+' : '-'}GH₵{tx.amount.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    Bal: GH₵{tx.balanceAfter.toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deposit/Withdraw Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">
              {modalMode === 'deposit' ? 'Top-up Wallet via Mobile Money' : 'Withdraw Funds to Mobile Money'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                  Telecom Provider:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['MTN MoMo', 'Telecel Cash', 'AirtelTigo'] as const).map((prov) => (
                    <button
                      key={prov}
                      type="button"
                      onClick={() => setProvider(prov)}
                      className={`p-2 rounded-xl text-xs font-semibold border transition-all ${
                        provider === prov
                          ? 'bg-amber-500 text-neutral-950 border-amber-400 font-bold'
                          : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                      }`}
                    >
                      {prov}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                  MoMo Registered Phone Number:
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 024 412 8901"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                  Amount in Ghana Cedis (GH₵):
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="flex-1 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold shadow-lg shadow-amber-500/20"
                >
                  Confirm {modalMode === 'deposit' ? 'Deposit' : 'Withdrawal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
