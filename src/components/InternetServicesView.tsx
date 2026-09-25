import React, { useState } from 'react';
import { Wifi, Smartphone, Zap, Shield, ArrowUpRight, Check, Activity, RefreshCw, Sparkles, Server, Info } from 'lucide-react';
import { DataPackage } from '../types';

interface InternetServicesViewProps {
  packages: DataPackage[];
  onPurchasePackage: (pkg: DataPackage, phone: string, network: string) => void;
  walletBalance: number;
  dataSaverEnabled: boolean;
  setDataSaverEnabled: (val: boolean) => void;
  userPhone: string;
}

export const InternetServicesView: React.FC<InternetServicesViewProps> = ({
  packages,
  onPurchasePackage,
  walletBalance,
  dataSaverEnabled,
  setDataSaverEnabled,
  userPhone
}) => {
  const [selectedTelco, setSelectedTelco] = useState<string>('all');
  const [purchasingPkg, setPurchasingPkg] = useState<DataPackage | null>(null);
  const [inputPhone, setInputPhone] = useState(userPhone || '024 412 8901');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [simulatedUsageMB, setSimulatedUsageMB] = useState(420);

  const filteredPackages = selectedTelco === 'all'
    ? packages
    : packages.filter((p) => p.telco.toLowerCase().includes(selectedTelco.toLowerCase()));

  const handleConfirmPurchase = () => {
    if (!purchasingPkg) return;
    onPurchasePackage(purchasingPkg, inputPhone, purchasingPkg.telco);
    setSuccessNotice(`Successfully activated ${purchasingPkg.volume} on ${inputPhone}! ${purchasingPkg.telco} confirmation SMS dispatched.`);
    setPurchasingPkg(null);
    setTimeout(() => setSuccessNotice(null), 5000);
  };

  return (
    <div className="space-y-5 pb-20">
      {/* Vision & Partnership Explainer Card */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-850 to-neutral-900 border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-semibold border border-emerald-500/30 mb-2">
              <Wifi className="w-3.5 h-3.5" />
              Connectivity Ecosystem • Option A & B
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-['Space_Grotesk']">
              Zorvaniq Internet & Data Services
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mt-1">
              Empowering Ghanaians to access online commerce through telecom partnerships. Buy affordable data bundles for MTN, Telecel, and AirtelTigo, or activate the Zorvaniq Free-Browse App Pass.
            </p>
          </div>

          {/* Live Connectivity Meter */}
          <div className="bg-neutral-950/80 border border-neutral-800 p-3 rounded-xl shrink-0 text-left min-w-[200px]">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-neutral-400">Gateway Status:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                4G/5G Online
              </span>
            </div>
            <div className="text-sm font-mono font-bold text-white">
              Data Consumed: {simulatedUsageMB} MB
            </div>
            <div className="w-full bg-neutral-800 rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (simulatedUsageMB / 1500) * 100)}%` }}
              />
            </div>
            <span className="text-[10px] text-neutral-500 mt-1 block">
              1.5 GB Active Package
            </span>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {successNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Low-Data Saver Feature & Model Explainer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Data Saver Mode Toggle */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Zorvaniq Data Saver Mode</span>
            </div>
            <p className="text-[11px] text-neutral-400 max-w-xs">
              Compresses catalog images and caches product data offline to save up to 70% mobile data for users.
            </p>
          </div>
          <button
            onClick={() => setDataSaverEnabled(!dataSaverEnabled)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              dataSaverEnabled
                ? 'bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20'
                : 'bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-700'
            }`}
          >
            {dataSaverEnabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        {/* Developer Revenue Explainer for Data Bundles */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
              <Sparkles className="w-4 h-4" />
              <span>How You Earn From Internet</span>
            </div>
            <p className="text-[11px] text-neutral-400 max-w-xs">
              As an authorized telecom value-added reseller, Zorvaniq earns <strong>8% to 12% margin</strong> every time a user buys an MTN or Telecel bundle.
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xs font-mono font-bold text-emerald-400 block">+GH₵0.60 to GH₵9.00</span>
            <span className="text-[10px] text-neutral-500">per data purchase</span>
          </div>
        </div>
      </div>

      {/* Telco Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
        <span className="text-xs text-neutral-400 mr-1">Partner Network:</span>
        {[
          { id: 'all', label: 'All Telcos' },
          { id: 'mtn', label: 'MTN Ghana 🟡' },
          { id: 'telecel', label: 'Telecel Ghana 🔴' },
          { id: 'airtel', label: 'AirtelTigo 🔵' },
          { id: 'zero', label: 'Zorvaniq Free-Pass 🟢' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTelco(tab.id)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              selectedTelco === tab.id
                ? 'bg-amber-500 text-neutral-950 font-bold'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Data Packages Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {filteredPackages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-4 flex flex-col justify-between transition-all group hover:shadow-xl"
          >
            <div>
              {/* Telco Badge & Popular */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-neutral-300">
                  {pkg.telco}
                </span>
                {pkg.popular && (
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full">
                    Popular Choice
                  </span>
                )}
              </div>

              {/* Volume & Title */}
              <div className="my-2">
                <h3 className="text-2xl font-black text-white font-mono tracking-tight">
                  {pkg.volume}
                </h3>
                <p className="text-xs font-semibold text-neutral-400 mt-0.5">
                  {pkg.title} • <span className="text-amber-400">{pkg.validity}</span>
                </p>
              </div>

              {/* Features */}
              <ul className="text-xs text-neutral-300 space-y-1.5 my-3">
                {pkg.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-1.5 text-[11px]">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              {/* Developer Revenue Pill */}
              <div className="bg-neutral-950/80 p-2 rounded-xl border border-neutral-800 text-[10px] text-neutral-400 flex items-center justify-between mb-3">
                <span>Zorvaniq Commission Margin:</span>
                <span className="font-mono text-emerald-400 font-bold">
                  +GH₵{pkg.zorvaniqMargin.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Price & Action */}
            <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-neutral-500 block">Price</span>
                <span className="text-lg font-black text-white font-mono">
                  GH₵{pkg.price.toFixed(2)}
                </span>
              </div>

              <button
                onClick={() => setPurchasingPkg(pkg)}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shadow-md shadow-amber-500/10 flex items-center gap-1 transition-colors"
              >
                <span>Activate Now</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {purchasingPkg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-neutral-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-md rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Wifi className="w-4 h-4 text-amber-400" />
                Confirm Data Package Activation
              </h3>
              <button
                onClick={() => setPurchasingPkg(null)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-400">Network:</span>
                <span className="font-bold text-white">{purchasingPkg.telco}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Package:</span>
                <span className="font-bold text-white">{purchasingPkg.volume} ({purchasingPkg.validity})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Total Price:</span>
                <span className="font-bold text-amber-400 font-mono text-sm">GH₵{purchasingPkg.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[11px] pt-1 border-t border-neutral-800">
                <span className="text-neutral-500">Zorvaniq Platform Revenue:</span>
                <span className="text-emerald-400 font-mono font-bold">+GH₵{purchasingPkg.zorvaniqMargin.toFixed(2)}</span>
              </div>
            </div>

            <div>
              <label className="text-xs text-neutral-300 font-semibold block mb-1">
                Recipient Phone Number (MoMo / Telecel)
              </label>
              <input
                type="text"
                value={inputPhone}
                onChange={(e) => setInputPhone(e.target.value)}
                placeholder="e.g. 024 412 8901"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
              />
              <p className="text-[10px] text-neutral-500 mt-1">
                Data bundle will be dispatched to this SIM immediately via API.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
              <button
                onClick={() => setPurchasingPkg(null)}
                className="px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPurchase}
                className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition-colors shadow"
              >
                Pay & Activate (GH₵{purchasingPkg.price.toFixed(2)})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
