import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { boxes } from '../data/boxes';
import { items } from '../data/items';
import { rollItem } from '../lib/rollItem';
import { generateReel, WINNER_INDEX } from '../lib/generateReel';
import { useGameStore } from '../store/gameStore';
import type { Item, Rarity } from '../types';

type Phase = 'intro' | 'carousel' | 'reveal';

const CELL_SIZE = 112;
const CELL_GAP = 10;
const CELL_STEP = CELL_SIZE + CELL_GAP;
const SPIN_DURATION = 10000;

const rarityColors: Record<Rarity, string> = {
  common:    '#6b7280',
  uncommon:  '#22c55e',
  rare:      '#3b82f6',
  epic:      '#a855f7',
  legendary: '#eab308',
};

const rarityBgClass: Record<Rarity, string> = {
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

function easeOutQuint(t: number): number {
  return 1 - Math.pow(1 - t, 5);
}

export default function LootRoll() {
  const { state } = useLocation();
  const addGems = useGameStore((s) => s.addGems);
  const recordLoot = useGameStore((s) => s.recordLoot);

  const box = boxes.find((b) => b.id === state?.boxId);
  const rolledItem = useRef<Item>(box ? rollItem(box, items) : items[0]);

  const reel = useMemo(
    () => (box ? generateReel(box, items, rolledItem.current) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [phase, setPhase] = useState<Phase>('intro');
  const stripRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const gemsAdded = useRef(false);

  // Reveal sub-states (staggered)
  const [showGlow, setShowGlow] = useState(false);
  const [showShake, setShowShake] = useState(false);
  const [stripFaded, setStripFaded] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [showName, setShowName] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [showResultInfo, setShowResultInfo] = useState(false);

  // Particles for epic/legendary
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; color: string }[]
  >([]);

  // --- Intro → carousel ---
  useEffect(() => {
    if (phase !== 'intro') return;
    const timer = setTimeout(() => setPhase('carousel'), 1000);
    return () => clearTimeout(timer);
  }, [phase]);

  // --- Carousel: animate strip ---
  useEffect(() => {
    if (phase !== 'carousel' || !stripRef.current || !containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const centerOffset = containerWidth / 2 - CELL_SIZE / 2;
    const targetX = WINNER_INDEX * CELL_STEP - centerOffset;

    let startTime: number | null = null;
    let rafId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / SPIN_DURATION, 1);
      const eased = easeOutQuint(progress);

      const currentX = eased * targetX;
      if (stripRef.current) {
        stripRef.current.style.transform = `translateX(${-currentX}px)`;
      }

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        if (stripRef.current) {
          stripRef.current.style.transform = `translateX(${-targetX}px)`;
        }
        setPhase('reveal');
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [phase]);

  // --- Reveal: staggered timeline ---
  useEffect(() => {
    if (phase !== 'reveal') return;

    const rarity = rolledItem.current.rarity;
    const isSpecial = rarity === 'epic' || rarity === 'legendary';

    if (isSpecial) {
      setShowShake(true);
      setTimeout(() => setShowShake(false), 600);

      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 200,
        color: rarityColors[rarity],
      }));
      setParticles(newParticles);
      setTimeout(() => setParticles([]), 1000);
    }

    // Timeline:
    // 0.1s  — glow + pulse on winner card in strip
    // 1.0s  — strip fades out (700ms transition)
    // 1.7s  — result card scales in (after strip is gone)
    // 2.2s  — rarity badge fades in
    // 2.5s  — item name fades in
    // 3.2s  — gems + button fade in, record loot
    const t1 = setTimeout(() => setShowGlow(true), 100);
    const t2 = setTimeout(() => setStripFaded(true), 1000);
    const t3 = setTimeout(() => setShowCard(true), 1700);
    const t4 = setTimeout(() => setShowBadge(true), 2200);
    const t5 = setTimeout(() => setShowName(true), 2500);
    const t6 = setTimeout(() => setShowResultInfo(true), 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, [phase]);

  // --- Add gems once when result info appears ---
  useEffect(() => {
    if (!showResultInfo || gemsAdded.current) return;
    gemsAdded.current = true;
    addGems(15);
    recordLoot(rolledItem.current.rarity);
  }, [showResultInfo, addGems, recordLoot]);

  if (!box) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100svh-52px)] gap-4">
        <p className="text-gray-500">No box data found.</p>
        <Link to="/open-boxes" className="px-6 py-3 bg-purple-600 text-white rounded-lg">
          Back
        </Link>
      </div>
    );
  }

  // === INTRO ===
  if (phase === 'intro') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100svh-52px)] gap-4 p-4">
        <p className="text-gray-400 text-sm uppercase tracking-widest">Opening…</p>
        <span className="text-8xl animate-[boxPulse_0.4s_ease-in-out_infinite_alternate]">
          {box.emoji}
        </span>
        <p className="text-lg font-semibold text-gray-600">{box.name}</p>
        <style>{`
          @keyframes boxPulse {
            from { transform: scale(1) rotate(-2deg); }
            to   { transform: scale(1.15) rotate(2deg); }
          }
        `}</style>
      </div>
    );
  }

  // === CAROUSEL / REVEAL (unified) ===
  const item = rolledItem.current;
  const isReveal = phase === 'reveal';
  const color = rarityColors[item.rarity];

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-[calc(100svh-52px)] gap-6 p-4 ${
        showShake ? 'animate-[screenShake_0.1s_ease-in-out_6]' : ''
      }`}
    >
      {/* Header text */}
      <p
        className="text-gray-400 text-sm uppercase tracking-widest transition-opacity duration-700"
        style={{ opacity: stripFaded ? 0 : 1 }}
      >
        {isReveal ? 'You got…' : 'Rolling…'}
      </p>

      {/* Flapper — fades with strip */}
      <div
        className="text-purple-500 text-2xl leading-none select-none transition-opacity duration-700"
        style={{ opacity: stripFaded ? 0 : 1 }}
      >
        ▼
      </div>

      {/* Carousel + expanded card wrapper */}
      <div className="w-full max-w-[480px] flex flex-col items-center">
        {/* Strip — fades out, collapses height when done */}
        <div
          ref={containerRef}
          className="w-full relative transition-all duration-700"
          style={{
            height: stripFaded ? 0 : CELL_SIZE + 16,
            opacity: stripFaded ? 0 : 1,
            overflowX: 'clip',
            overflowY: 'visible',
          }}
        >
          {/* Fade masks */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 z-10 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 z-10 bg-gradient-to-l from-white to-transparent" />

          <div
            ref={stripRef}
            className="flex items-center py-2"
            style={{ gap: CELL_GAP, willChange: 'transform' }}
          >
            {reel.map((reelItem, i) => {
              const cellColor = rarityColors[reelItem.rarity];
              const isWinner = i === WINNER_INDEX;
              const winnerActive = isWinner && isReveal;

              return (
                <div
                  key={i}
                  className={`flex-shrink-0 flex items-center justify-center rounded-xl transition-all duration-500 ${
                    winnerActive && showGlow
                      ? 'scale-[1.35] z-30 animate-[winnerPulse_0.6s_ease-in-out_infinite_alternate]'
                      : ''
                  }`}
                  style={{
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                    borderColor: cellColor,
                    borderWidth: winnerActive && showGlow ? 3 : 2,
                    backgroundColor: winnerActive && showGlow ? 'white' : `${cellColor}15`,
                    '--winner-color': cellColor,
                    '--winner-color-60': `${cellColor}60`,
                  } as React.CSSProperties}
                >
                  <span className="text-5xl leading-none">{reelItem.emoji}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Expanded result card — appears after strip fades */}
        <div
          className="flex flex-col items-center gap-3 p-8 rounded-2xl w-full max-w-xs border-2 transition-all duration-700"
          style={{
            borderColor: color,
            backgroundColor: `${color}10`,
            opacity: showCard ? 1 : 0,
            transform: showCard ? 'scale(1)' : 'scale(0.8)',
            maxHeight: showCard ? 400 : 0,
            paddingBlock: showCard ? undefined : 0,
            boxShadow: `0 0 30px ${color}40, 0 0 60px ${color}20`,
          }}
        >
          <span className="text-7xl">{item.emoji}</span>
          {showBadge && (
            <span
              className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full text-white ${rarityBgClass[item.rarity]} animate-[fadeInUp_0.3s_ease-out]`}
            >
              {item.rarity}
            </span>
          )}
          {showName && (
            <span
              className={`text-2xl font-bold ${rarityTextColors[item.rarity]} animate-[fadeInUp_0.3s_ease-out]`}
            >
              {item.name}
            </span>
          )}
          {item.flavorText && showName && (
            <p className="text-gray-500 text-sm text-center italic animate-[fadeInUp_0.3s_ease-out]">
              {item.flavorText}
            </p>
          )}
        </div>
      </div>

      {/* Particles */}
      {particles.length > 0 && (
        <div className="relative">
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute w-2.5 h-2.5 rounded-full animate-[particleBurst_0.8s_ease-out_forwards]"
              style={{
                backgroundColor: p.color,
                '--px': `${p.x}px`,
                '--py': `${p.y}px`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}

      {/* Result info — fades in below */}
      <div
        className="flex flex-col items-center gap-4 transition-all duration-700"
        style={{
          opacity: showResultInfo ? 1 : 0,
          transform: showResultInfo ? 'translateY(0)' : 'translateY(12px)',
          pointerEvents: showResultInfo ? 'auto' : 'none',
        }}
      >
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

      <style>{`
        @keyframes screenShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px) rotate(-0.5deg); }
          75% { transform: translateX(4px) rotate(0.5deg); }
        }
        @keyframes winnerPulse {
          from { box-shadow: 0 0 12px var(--winner-color), 0 0 24px var(--winner-color-60); }
          to   { box-shadow: 0 0 24px var(--winner-color), 0 0 48px var(--winner-color-60); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes particleBurst {
          from { opacity: 1; transform: translate(0, 0) scale(1); }
          to   { opacity: 0; transform: translate(var(--px), var(--py)) scale(0); }
        }
      `}</style>
    </div>
  );
}
