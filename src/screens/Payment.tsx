import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { currencyPacks } from '../data/currencyPacks';
import { useGameStore } from '../store/gameStore';
import HoldButton from '../components/HoldButton';
import Modal from '../components/Modal';
import PageShell from '../components/PageShell';

export default function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const addGems = useGameStore((s) => s.addGems);
  const addEnergy = useGameStore((s) => s.addEnergy);
  const recordSpend = useGameStore((s) => s.recordSpend);

  const pack = currencyPacks.find((p) => p.id === state?.packId);

  const [showThankYou, setShowThankYou] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  if (!pack) {
    return (
      <PageShell mode="centered">
        <div className="flex flex-col items-center gap-4">
          <p className="text-gray-500">No pack selected.</p>
          <button className="px-4 py-2 border border-white/10 rounded-lg text-gray-400" onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </PageShell>
    );
  }

  const tax = 0.09;
  const total = pack.usdPrice + tax;
  const currencyIcon = pack.currency === 'gems' ? '💎' : '⚡';
  const currencyLabel = pack.currency === 'gems' ? 'Gems' : 'Energy';

  const handlePay = () => {
    if (pack.currency === 'gems') addGems(pack.amount);
    else addEnergy(pack.amount);
    recordSpend(total);
    setShowThankYou(true);
  };

  return (
    <PageShell mode="flow" title="Checkout" noPanel>
      <div className="flex flex-col gap-6">

        {/* Order summary */}
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Order Summary</p>
          <div className="bg-gray-900 rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{currencyIcon}</span>
              <div className="flex-1">
                <p className="font-semibold text-white">{pack.name}</p>
                <p className="text-sm text-purple-400">{pack.amount.toLocaleString()} {currencyLabel}</p>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-3 flex flex-col gap-1 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>${pack.usdPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white font-bold text-base mt-1">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment card */}
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Payment Method</p>
          <div className="relative bg-gradient-to-br from-slate-700 via-slate-600 to-slate-500 rounded-2xl p-5 overflow-hidden shadow-xl">
            {/* Background shimmer circles */}
            <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/10" />
            <div className="absolute -bottom-8 -left-4 w-40 h-40 rounded-full bg-white/10" />

            {/* Chip */}
            <div className="w-9 h-7 rounded-md bg-yellow-300/80 mb-4 flex items-center justify-center relative">
              <div className="absolute inset-0 rounded-md border border-yellow-500/40" />
              <div className="w-5 h-3 rounded-sm border border-yellow-600/60 bg-yellow-400/60" />
            </div>

            {/* Card number */}
            <p className="font-mono text-lg tracking-widest text-white/90 mb-4">
              •••• •••• •••• 1111
            </p>

            {/* Bottom row */}
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider mb-0.5">Expires</p>
                <p className="font-mono text-sm text-white/80">04 / 2069</p>
              </div>
              <p className="text-xl font-black italic tracking-tight text-white/90">WISA</p>
            </div>
          </div>
        </div>

        {/* Pay button + back */}
        <div className="flex flex-col gap-3">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5 accent-purple-500 w-4 h-4 shrink-0"
            />
            <span className="text-xs text-gray-400 leading-relaxed">
              By clicking "Pay," I agree to the{' '}
              <span className="text-purple-400 underline cursor-pointer">Terms of Service</span>
              {' '}and confirm this is a simulated purchase with no real monetary value.
            </span>
          </label>
          <HoldButton label={`Pay $${total.toFixed(2)}`} onComplete={handlePay} disabled={!agreedToTerms} />
          <div className="flex items-center justify-center gap-1.5 text-xs text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Secured by WISA Pay
          </div>
          <button
            className="text-sm text-gray-500 hover:text-gray-300 transition-colors text-center"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
        </div>

      </div>

      <style>{`
        @keyframes spark {
          0%   { transform: translate(-50%, -50%) translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -50%) translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
        }
        .spark {
          position: absolute;
          top: 50%; left: 50%;
          width: 7px; height: 7px;
          border-radius: 50%;
          animation: spark 0.9s ease-out forwards infinite;
        }
      `}</style>

      {/* Thank you modal */}
      <Modal open={showThankYou} title="Thank you for your purchase!" className="!max-w-md">
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <span className="text-6xl relative z-10">{currencyIcon}</span>
            {[
              { tx: '0px',    ty: '-52px', color: '#facc15', delay: '0s'    },
              { tx: '37px',   ty: '-37px', color: '#c084fc', delay: '0.1s'  },
              { tx: '52px',   ty: '0px',   color: '#facc15', delay: '0.2s'  },
              { tx: '37px',   ty: '37px',  color: '#fff',    delay: '0.05s' },
              { tx: '0px',    ty: '52px',  color: '#c084fc', delay: '0.15s' },
              { tx: '-37px',  ty: '37px',  color: '#facc15', delay: '0s'    },
              { tx: '-52px',  ty: '0px',   color: '#fff',    delay: '0.1s'  },
              { tx: '-37px',  ty: '-37px', color: '#c084fc', delay: '0.2s'  },
            ].map((s, i) => (
              <span
                key={i}
                className="spark"
                style={{
                  '--tx': s.tx,
                  '--ty': s.ty,
                  backgroundColor: s.color,
                  animationDelay: s.delay,
                } as React.CSSProperties}
              />
            ))}
          </div>
          <div className="text-center">
            <p className="font-semibold text-lg">{pack.name}</p>
            <p className="text-purple-400 font-bold text-2xl mt-1">+{pack.amount.toLocaleString()} {currencyLabel}</p>
          </div>
        </div>
        <button
          className="mt-2 w-full py-2 rounded-lg bg-purple-600 text-white font-semibold"
          onClick={() => { setShowThankYou(false); setShowReceipt(true); }}
        >
          Continue
        </button>
      </Modal>

      {/* Receipt modal */}
      <Modal open={showReceipt} title="Receipt sent!" className="!max-w-md">
        <div className="flex flex-col gap-3 text-sm text-gray-400 py-1">
          <p>A receipt has been sent to the email address associated with your account.</p>
          <p>If you don't see it within a few minutes, check your spam folder or contact <span className="text-purple-400">support@wisa.com</span>.</p>
        </div>
        <button
          className="mt-4 w-full py-2 rounded-lg bg-purple-600 text-white font-semibold"
          onClick={() => navigate('/buy-gems')}
        >
          Close
        </button>
      </Modal>
    </PageShell>
  );
}
