import { useState } from 'react';
import { items } from '../data/items';
import Modal from '../components/Modal';
import PageShell from '../components/PageShell';
import BottomNav from '../components/BottomNav';
import type { Item, Rarity } from '../types';

const rarityBg: Record<Rarity, string> = {
  common:    'bg-gray-500',
  uncommon:  'bg-green-500',
  rare:      'bg-blue-500',
  epic:      'bg-purple-500',
  legendary: 'bg-yellow-400',
};

const rarityBorder: Record<Rarity, string> = {
  common:    'border-gray-400',
  uncommon:  'border-green-400',
  rare:      'border-blue-400',
  epic:      'border-purple-400',
  legendary: 'border-yellow-300',
};

const sorted = [...items].sort((a, b) => a.name.localeCompare(b.name));

export default function Compendium() {
  const [selected, setSelected] = useState<Item | null>(null);

  return (
    <PageShell mode="flow" title="Compendium">
      <div className="grid grid-cols-3 gap-2">
        {sorted.map((item) => (
          <button
            key={item.id}
            className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 ${rarityBorder[item.rarity]} bg-white/5 hover:bg-white/10 transition-colors`}
            onClick={() => setSelected(item)}
          >
            <span className="text-3xl">{item.emoji}</span>
            <span className="text-xs font-medium text-center leading-tight">{item.name}</span>
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full text-white ${rarityBg[item.rarity]}`}>
              {item.rarity}
            </span>
          </button>
        ))}
      </div>

      <BottomNav back="/main-menu" />

      <Modal open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="text-6xl">{selected.emoji}</span>
            <div>
              <p className="text-xl font-bold">{selected.name}</p>
              <span className={`inline-block mt-1 text-xs font-bold px-2 py-0.5 rounded-full text-white ${rarityBg[selected.rarity]}`}>
                {selected.rarity}
              </span>
            </div>
            {selected.effect && <p className="text-sm text-gray-500">{selected.effect}</p>}
            {selected.flavorText && <p className="text-sm italic text-gray-400">"{selected.flavorText}"</p>}
          </div>
        )}
      </Modal>
    </PageShell>
  );
}
