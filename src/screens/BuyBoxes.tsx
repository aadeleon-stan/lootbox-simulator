import { useState } from 'react';
import { Link } from 'react-router-dom';
import { boxes } from '../data/boxes';
import { useGameStore } from '../store/gameStore';
import HoldButton from '../components/HoldButton';
import Modal from '../components/Modal';
import type { Box } from '../types';

const rarityTextColors: Record<string, string> = {
  common: 'text-gray-500',
  uncommon: 'text-green-600',
  rare: 'text-blue-600',
  epic: 'text-purple-600',
  legendary: 'text-yellow-600',
};

export default function BuyBoxes() {
  const gems = useGameStore((s) => s.gems);
  const energy = useGameStore((s) => s.energy);
  const inventory = useGameStore((s) => s.inventory);
  const spendGems = useGameStore((s) => s.spendGems);
  const spendEnergy = useGameStore((s) => s.spendEnergy);
  const addBox = useGameStore((s) => s.addBox);

  const [openOddsId, setOpenOddsId] = useState<string | null>(null);
  const [insufficientBox, setInsufficientBox] = useState<Box | null>(null);

  const getCount = (boxId: string) => inventory.find((e) => e.boxId === boxId)?.count ?? 0;

  const handleBuy = (box: Box) => {
    const success = box.currency === 'gems' ? spendGems(box.price) : spendEnergy(box.price);
    if (success) addBox(box.id);
    else setInsufficientBox(box);
  };

  return (
    <div className="flex flex-col min-h-[calc(100svh-52px)] p-4">
      <div className="mx-auto w-full max-w-80">
        <h2 className="text-2xl font-bold mb-2">Buy Boxes</h2>

        {/* Currency banner */}
        <div className="flex gap-4 mb-3 text-sm font-semibold">
          <span>💎 <span className="text-purple-700">{gems.toLocaleString()}</span></span>
          <span>⚡ <span className="text-yellow-600">{energy.toLocaleString()}</span></span>
        </div>

        <div className="flex flex-col gap-3">
          {boxes.map((box) => {
            const count = getCount(box.id);
            const icon = box.currency === 'gems' ? '💎' : '⚡';
            const bal = box.currency === 'gems' ? gems : energy;
            const oddsOpen = openOddsId === box.id;

            return (
              <div key={box.id} className="border-2 border-gray-200 rounded-xl p-3 flex flex-col gap-2">
                {/* Header row */}
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{box.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm leading-tight">{box.name}</p>
                    <button
                      className="text-xs text-gray-400 underline underline-offset-2"
                      onClick={() => setOpenOddsId(oddsOpen ? null : box.id)}
                    >
                      {oddsOpen ? 'hide odds' : 'odds'}
                    </button>
                  </div>
                  {count > 0 && (
                    <span className="bg-purple-100 text-purple-700 text-xs font-bold px-1.5 py-0.5 rounded-full shrink-0">
                      ×{count}
                    </span>
                  )}
                </div>

                {/* Inline odds */}
                {oddsOpen && (
                  <table className="w-full text-xs border-t pt-1 mt-0.5">
                    <tbody>
                      {(Object.entries(box.rarityDistribution) as [string, number][]).map(([rarity, pct]) => (
                        <tr key={rarity}>
                          <td className={`py-0.5 capitalize font-medium ${rarityTextColors[rarity]}`}>{rarity}</td>
                          <td className="py-0.5 text-right text-gray-400">{pct}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                <HoldButton
                  label={`Buy (${box.price} ${icon})`}
                  onComplete={() => handleBuy(box)}
                  disabled={bal < box.price}
                />
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex gap-3">
          <Link to="/main-menu" className="px-4 py-2 border border-gray-400 rounded-lg text-sm">Back</Link>
          <Link to="/open-boxes" className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm">Open Boxes</Link>
        </div>
      </div>

      <Modal open={!!insufficientBox} onClose={() => setInsufficientBox(null)} title="Not enough currency!">
        {insufficientBox && (
          <>
            <p className="text-gray-600 text-sm mb-3">
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
    </div>
  );
}
