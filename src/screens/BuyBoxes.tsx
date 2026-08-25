import { useState } from 'react';
import { boxes } from '../data/boxes';
import { useGameStore } from '../store/gameStore';
import Modal from '../components/Modal';
import PageShell from '../components/PageShell';
import BottomNav from '../components/BottomNav';
import { Link } from 'react-router-dom';
import type { Box } from '../types';

const rarityTextColors: Record<string, string> = {
  common: 'text-gray-500',
  uncommon: 'text-green-400',
  rare: 'text-blue-400',
  epic: 'text-purple-400',
  legendary: 'text-yellow-400',
};

export default function BuyBoxes() {
  const gems = useGameStore((s) => s.gems);
  const energy = useGameStore((s) => s.energy);
  const inventory = useGameStore((s) => s.inventory);
  const spendGems = useGameStore((s) => s.spendGems);
  const spendEnergy = useGameStore((s) => s.spendEnergy);
  const addBox = useGameStore((s) => s.addBox);

  const [selectedBox, setSelectedBox] = useState<Box | null>(null);
  const [insufficientBox, setInsufficientBox] = useState<Box | null>(null);

  const getCount = (boxId: string) => inventory.find((e) => e.boxId === boxId)?.count ?? 0;

  const handleBuy = (box: Box, qty: number) => {
    const totalCost = box.price * qty;
    const spend = box.currency === 'gems' ? spendGems : spendEnergy;
    if (spend(totalCost)) {
      for (let i = 0; i < qty; i++) addBox(box.id);
      setSelectedBox(null);
    } else {
      setSelectedBox(null);
      setInsufficientBox(box);
    }
  };

  return (
    <PageShell mode="flow" title="Buy Boxes">
      <div className="flex flex-col gap-3">
        {boxes.map((box) => {
          const count = getCount(box.id);
          const icon = box.currency === 'gems' ? '💎' : '⚡';

          return (
            <button
              key={box.id}
              className="border-2 border-white/10 rounded-xl p-3 flex items-center gap-3 hover:border-purple-500/40 transition-colors text-left"
              onClick={() => setSelectedBox(box)}
            >
              <span className="text-2xl">{box.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm leading-tight">{box.name}</p>
                <p className="text-xs text-gray-400">{box.price} {icon}</p>
              </div>
              {count > 0 && (
                <span className="bg-purple-500/15 text-purple-400 text-xs font-bold px-1.5 py-0.5 rounded-full shrink-0">
                  ×{count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <BottomNav back="/main-menu" links={[{ to: '/open-boxes', label: 'Open Boxes' }, { to: '/buy-gems', label: 'Add 💎 ⚡' }]} />

      {/* Buy modal */}
      <Modal open={!!selectedBox} className="!max-w-xs">
        {selectedBox && (() => {
          const icon = selectedBox.currency === 'gems' ? '💎' : '⚡';
          const bal = selectedBox.currency === 'gems' ? gems : energy;
          return (
            <div className="flex flex-col items-center gap-4">
              <span className="text-5xl">{selectedBox.emoji}</span>
              <p className="text-xl font-bold">{selectedBox.name}</p>

              <table className="w-full text-sm">
                <tbody>
                  {(Object.entries(selectedBox.rarityDistribution) as [string, number][]).map(([rarity, pct]) => (
                    <tr key={rarity}>
                      <td className={`py-0.5 capitalize font-medium ${rarityTextColors[rarity]}`}>{rarity}</td>
                      <td className="py-0.5 text-right text-gray-400">{pct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="w-full flex flex-col gap-2">
                <button
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-colors disabled:opacity-40 disabled:pointer-events-none"
                  disabled={bal < selectedBox.price}
                  onClick={() => handleBuy(selectedBox, 1)}
                >
                  Buy ({selectedBox.price} {icon})
                </button>
                <button
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-colors disabled:opacity-40 disabled:pointer-events-none"
                  disabled={bal < selectedBox.price * 10}
                  onClick={() => handleBuy(selectedBox, 10)}
                >
                  Buy 10 ({(selectedBox.price * 10).toLocaleString()} {icon})
                </button>
              </div>

              <button
                className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                onClick={() => setSelectedBox(null)}
              >
                Cancel
              </button>
            </div>
          );
        })()}
      </Modal>

      {/* Insufficient funds modal */}
      <Modal open={!!insufficientBox} onClose={() => setInsufficientBox(null)} title="Not enough currency!">
        {insufficientBox && (
          <>
            <p className="text-gray-400 text-sm mb-3">
              You need {insufficientBox.price} {insufficientBox.currency} to buy a {insufficientBox.name}.
            </p>
            <Link
              to="/buy-gems"
              className="block w-full text-center py-2 rounded-lg bg-purple-600 text-white font-semibold"
              onClick={() => setInsufficientBox(null)}
            >
              Buy {insufficientBox.currency === 'gems' ? 'Gems' : 'Energy'}
            </Link>
          </>
        )}
      </Modal>
    </PageShell>
  );
}
