import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { currencyPacks } from '../data/currencyPacks';
import { useGameStore } from '../store/gameStore';
import HoldButton from '../components/HoldButton';
import Modal from '../components/Modal';

export default function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const addGems = useGameStore((s) => s.addGems);
  const addEnergy = useGameStore((s) => s.addEnergy);

  const pack = currencyPacks.find((p) => p.id === state?.packId);

  const [showThankYou, setShowThankYou] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  if (!pack) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100svh-52px)] p-4 gap-4">
        <p className="text-gray-500">No pack selected.</p>
        <button className="px-4 py-2 border border-gray-400 rounded-lg" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  // Fake tax: add a few cents
  const tax = 0.09;
  const total = pack.usdPrice + tax;
  const currencyIcon = pack.currency === 'gems' ? '💎' : '⚡';

  const handlePay = () => {
    if (pack.currency === 'gems') addGems(pack.amount);
    else addEnergy(pack.amount);
    setShowThankYou(true);
  };

  return (
    <div className="flex flex-col min-h-[calc(100svh-52px)] p-4">
      <div className="mx-auto w-full max-w-80">
      <h2 className="text-2xl font-bold mb-4">Payment</h2>

      {/* Pack summary */}
      <div className="border border-gray-200 rounded-xl p-4 mb-4 flex items-center gap-3">
        <span className="text-4xl">{currencyIcon}</span>
        <div>
          <p className="font-semibold">{pack.name}</p>
          <p className="text-purple-700 font-bold">{pack.amount.toLocaleString()} {pack.currency === 'gems' ? 'Gems' : 'Energy'}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-sm text-gray-500">${pack.usdPrice.toFixed(2)} + ${tax.toFixed(2)} tax</p>
          <p className="font-bold text-lg">${total.toFixed(2)}</p>
        </div>
      </div>

      {/* Fake WISA card */}
      <div className="border border-gray-300 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-500 mb-1">Saved payment method</p>
        <p className="font-semibold">WISA •••• 1111</p>
        <p className="text-sm text-gray-500">Expires 04/2069</p>
      </div>

      <HoldButton label={`Pay $${total.toFixed(2)}`} onComplete={handlePay} />

      <div className="mt-4">
        <button className="px-4 py-2 border border-gray-400 rounded-lg" onClick={() => navigate(-1)}>Go Back</button>
      </div>
      </div>

      {/* Thank you modal */}
      <Modal open={showThankYou} title="Thank you for your purchase!">
        <div className="flex flex-col items-center gap-2 py-2">
          <span className="text-5xl">{currencyIcon}</span>
          <p className="font-semibold text-lg">{pack.name}</p>
          <p className="text-purple-700 font-bold text-xl">+{pack.amount.toLocaleString()} {pack.currency === 'gems' ? 'Gems' : 'Energy'}</p>
        </div>
        <button
          className="mt-4 w-full py-2 rounded-lg bg-purple-600 text-white font-semibold"
          onClick={() => { setShowThankYou(false); setShowReceipt(true); }}
        >
          Continue
        </button>
      </Modal>

      {/* Receipt modal */}
      <Modal open={showReceipt} title="Receipt sent!">
        <p className="text-gray-600 text-sm">Check your inbox! A receipt has been sent to <span className="font-semibold">player@wisa.com</span></p>
        <button
          className="mt-4 w-full py-2 rounded-lg bg-purple-600 text-white font-semibold"
          onClick={() => navigate('/main-menu')}
        >
          Back to Menu
        </button>
      </Modal>
    </div>
  );
}
