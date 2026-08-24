import { useEffect, useRef, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { boxes } from '../data/boxes';
import { items } from '../data/items';
import { rollItem } from '../lib/rollItem';
import { useGameStore } from '../store/gameStore';
import type { Item, Rarity } from '../types';

type Phase = 'carousel' | 'reveal' | 'result';

const rarityColors: Record<Rarity, string> = {
  common:    'bg-gray-500',
  uncommon:  'bg-green-500',
  rare:      'bg-blue-500',
  epic:      'bg-purple-500',
  legendary: 'bg-yellow-400',
};

const rarityTextColors: Record<Rarity, string> = {
  common:    'text-gray-500',
  uncommon:  'text-green-600',
  rare:      'text-blue-600',
  epic:      'text-purple-600',
  legendary: 'text-yellow-600',
};

// Color flash sequence for reveal phase
const revealSequence: string[] = [
  'bg-gray-500',
  'bg-green-500',
  'bg-blue-500',
  'bg-purple-500',
  'bg-yellow-400',
];

export default function LootRoll() {
  const { state } = useLocation();
  const addGems = useGameStore((s) => s.addGems);
  const recordLoot = useGameStore((s) => s.recordLoot);

  const box = boxes.find((b) => b.id === state?.boxId);
  const rolledItem = useRef<Item>(box ? rollItem(box, items) : items[0]);

  const [phase, setPhase] = useState<Phase>('carousel');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [revealBg, setRevealBg] = useState('bg-gray-500');
  const gemsAdded = useRef(false);

  // Phase 1: carousel — decelerating interval over 3000ms
  useEffect(() => {
    if (phase !== 'carousel') return;

    const totalMs = 3000;
    const startInterval = 80;
    const endInterval = 300;
    let elapsed = 0;
    let index = 0;
    let timeout: ReturnType<typeof setTimeout>;

    const schedule = () => {
      const progress = Math.min(elapsed / totalMs, 1);
      const interval = startInterval + (endInterval - startInterval) * progress;

      timeout = setTimeout(() => {
        elapsed += interval;
        index += 1;

        if (elapsed >= totalMs) {
          // Force final item to be rolled result
          const resultIndex = items.indexOf(rolledItem.current);
          setCarouselIndex(resultIndex >= 0 ? resultIndex : 0);
          setPhase('reveal');
          return;
        }

        setCarouselIndex(index % items.length);
        schedule();
      }, interval);
    };

    schedule();
    return () => clearTimeout(timeout);
  }, [phase]);

  // Phase 2: reveal — flash through rarity colors
  useEffect(() => {
    if (phase !== 'reveal') return;

    const targetColor = rarityColors[rolledItem.current.rarity];
    // Find target index in sequence
    const targetIdx = revealSequence.indexOf(targetColor);
    const sequenceToPlay = targetIdx >= 0 ? revealSequence.slice(0, targetIdx + 1) : revealSequence;

    let i = 0;
    const interval = setInterval(() => {
      if (i >= sequenceToPlay.length) {
        clearInterval(interval);
        setRevealBg(targetColor);
        setTimeout(() => setPhase('result'), 200);
        return;
      }
      setRevealBg(sequenceToPlay[i]);
      i++;
    }, 200);

    return () => clearInterval(interval);
  }, [phase]);

  // Phase 3: result — add gems once, record loot
  useEffect(() => {
    if (phase !== 'result' || gemsAdded.current) return;
    gemsAdded.current = true;
    addGems(15);
    recordLoot(rolledItem.current.rarity);
  }, [phase, addGems, recordLoot]);

  if (!box) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100svh-52px)] gap-4">
        <p className="text-gray-500">No box data found.</p>
        <Link to="/open-boxes" className="px-6 py-3 bg-purple-600 text-white rounded-lg">Back</Link>
      </div>
    );
  }

  // --- Render phases ---

  if (phase === 'carousel') {
    const displayed = items[carouselIndex % items.length];
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100svh-52px)] gap-4 p-4">
        <p className="text-gray-400 text-sm uppercase tracking-widest">Rolling…</p>
        <div className="flex flex-col items-center gap-2 p-8 border-2 border-purple-300 rounded-2xl w-full max-w-80">
          <span className="text-6xl">{displayed.emoji}</span>
          <span className="font-semibold text-lg">{displayed.name}</span>
        </div>
      </div>
    );
  }

  if (phase === 'reveal') {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[calc(100svh-52px)] transition-colors duration-200 ${revealBg}`}>
        <span className="text-7xl">{rolledItem.current.emoji}</span>
      </div>
    );
  }

  // result
  const item = rolledItem.current;
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100svh-52px)] p-4 gap-5">
      <div className="w-full max-w-80 flex flex-col items-center gap-5">
      <div className={`flex flex-col items-center gap-3 p-8 rounded-2xl w-full max-w-xs ${rarityColors[item.rarity]}/10 border-2 border-current`}>
        <span className="text-7xl">{item.emoji}</span>
        <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full text-white ${rarityColors[item.rarity]}`}>
          {item.rarity}
        </span>
        <span className={`text-2xl font-bold ${rarityTextColors[item.rarity]}`}>{item.name}</span>
        {item.flavorText && <p className="text-gray-500 text-sm text-center italic">{item.flavorText}</p>}
      </div>

      <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-300 text-yellow-700 font-bold px-4 py-2 rounded-full">
        +15 💎 bonus gems
      </div>

      <Link
        to="/open-boxes"
        className="px-8 py-3 bg-purple-600 text-white rounded-xl font-semibold text-lg"
      >
        Open More Boxes
      </Link>
      </div>
    </div>
  );
}
