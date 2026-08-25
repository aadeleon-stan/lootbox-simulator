import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import Modal from '../components/Modal';
import PageShell from '../components/PageShell';
import type { Rarity } from '../types';

const RARITY_ORDER: Rarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
const RARITY_COLORS: Record<Rarity, string> = {
  common:    'text-gray-400',
  uncommon:  'text-green-400',
  rare:      'text-blue-400',
  epic:      'text-purple-400',
  legendary: 'text-yellow-400',
};

export default function MainMenu() {
  const navigate = useNavigate();
  const inventory = useGameStore((s) => s.inventory);
  const claimDailyBonus = useGameStore((s) => s.claimDailyBonus);
  const totalSpent = useGameStore((s) => s.totalSpent);
  const lootCounts = useGameStore((s) => s.lootCounts);
  const reset = useGameStore((s) => s.reset);
  const totalBoxes = inventory.reduce((sum, e) => sum + e.count, 0);

  const [showDailyBonus, setShowDailyBonus] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    if (claimDailyBonus()) setShowDailyBonus(true);
  }, []);

  return (
    <PageShell mode="centered">
      <div className="flex flex-col items-center gap-4">
      <h1 className="text-5xl font-bold mb-1">
        <span className="text-purple-300">Empty</span><span className="text-yellow-300">Full</span>
      </h1>
      <p className="text-purple-500 mb-6 text-sm">a free experience</p>
      <Link to="/open-boxes" className="w-full text-center px-6 py-3 bg-purple-700 hover:bg-purple-600 text-white rounded-lg font-semibold transition-colors">
        Open Boxes ({totalBoxes})
      </Link>
      <Link to="/buy-boxes" className="w-full text-center px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors">
        Buy Boxes
      </Link>
      <Link to="/buy-gems" className="w-full text-center px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors">
        Buy Gems & Energy
      </Link>
      <Link to="/compendium" className="w-full text-center px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors">
        View Compendium
      </Link>
      <button
        className="w-full px-6 py-3 border border-gray-700 rounded-lg text-gray-500 hover:text-gray-300 hover:border-gray-500 transition-colors mt-2"
        onClick={() => setShowConfirm(true)}
      >
        Log Out
      </button>

      <style>{`
        @keyframes spark {
          0%   { transform: translate(-50%, -50%) translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -50%) translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
        }
        .spark {
          position: absolute;
          top: 50%; left: 50%;
          width: 8px; height: 8px;
          border-radius: 50%;
          animation: spark 1s ease-out forwards infinite;
        }
      `}</style>

      {/* Logout confirm modal */}
      <Modal open={showConfirm} className="!max-w-sm text-center">
        <h3 className="text-xl font-bold text-white mb-2">Log out?</h3>
        <p className="text-gray-400 text-sm mb-6">Your session summary will be shown before you go.</p>
        <div className="flex flex-col gap-3">
          <button
            className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold transition-colors"
            onClick={() => { setShowConfirm(false); setShowSummary(true); }}
          >
            Log Out
          </button>
          <button
            className="w-full py-2.5 rounded-xl border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
            onClick={() => setShowConfirm(false)}
          >
            Cancel
          </button>
        </div>
      </Modal>

      {/* Session summary modal */}
      <Modal open={showSummary} className="!max-w-md text-center">
        <div className="flex flex-col items-center gap-5 pt-2 pb-1">

          {/* Trophy with sparks */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            <span className="text-7xl relative z-10">🏆</span>
            {[
              { tx: '0px',   ty: '-62px', color: '#facc15', delay: '0s'    },
              { tx: '44px',  ty: '-44px', color: '#c084fc', delay: '0.12s' },
              { tx: '62px',  ty: '0px',   color: '#facc15', delay: '0.24s' },
              { tx: '44px',  ty: '44px',  color: '#a3e635', delay: '0.06s' },
              { tx: '0px',   ty: '62px',  color: '#c084fc', delay: '0.18s' },
              { tx: '-44px', ty: '44px',  color: '#facc15', delay: '0s'    },
              { tx: '-62px', ty: '0px',   color: '#fff',    delay: '0.12s' },
              { tx: '-44px', ty: '-44px', color: '#c084fc', delay: '0.24s' },
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

          <div>
            <h3 className="text-3xl font-black text-white">You crushed it.</h3>
            <p className="text-gray-500 text-sm mt-1">Another legendary session. Absolutely free.</p>
          </div>

          {/* Money saved */}
          <div className="w-full bg-yellow-400/10 border border-yellow-400/30 rounded-2xl px-6 py-4 flex flex-col items-center gap-1">
            <p className="text-xs uppercase tracking-widest text-yellow-500 font-bold">Money saved</p>
            <p className="text-6xl font-black text-yellow-400 leading-none">${totalSpent.toFixed(2)}</p>
            <p className="text-yellow-600 text-xs mt-1">that's real cash that stayed in your wallet</p>
          </div>

          {/* Loot breakdown */}
          {RARITY_ORDER.some((r) => lootCounts[r] > 0) && (() => {
            const total = RARITY_ORDER.reduce((s, r) => s + lootCounts[r], 0);
            return (
              <div className="w-full flex flex-col items-center gap-3">
                <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold">
                  {total} item{total !== 1 ? 's' : ''} unboxed
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {RARITY_ORDER.filter((r) => lootCounts[r] > 0).map((r) => (
                    <span
                      key={r}
                      className={`px-3 py-1.5 rounded-full text-sm font-bold border ${RARITY_COLORS[r]} border-current bg-current/10`}
                    >
                      {lootCounts[r]}× {r.charAt(0).toUpperCase() + r.slice(1)}
                    </span>
                  ))}
                </div>
              </div>
            );
          })()}

        </div>

        <button
          className="mt-6 w-full py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-black text-xl transition-colors"
          onClick={() => { reset(); navigate('/login'); }}
        >
          Let's go!! 🎉
        </button>
      </Modal>

      <Modal open={showDailyBonus} className="!max-w-md text-center">
        <div className="flex flex-col items-center gap-1 pt-2 pb-1">
          <p className="text-xs uppercase tracking-widest text-yellow-400 font-semibold mb-2">Daily Login Bonus</p>
          <h3 className="text-2xl font-bold text-white mb-4">You've got a gift!</h3>

          <div className="relative w-24 h-24 flex items-center justify-center mb-2">
            <span className="text-7xl relative z-10">📦</span>
            {[
              { tx: '0px',   ty: '-62px', color: '#facc15', delay: '0s'    },
              { tx: '44px',  ty: '-44px', color: '#c084fc', delay: '0.12s' },
              { tx: '62px',  ty: '0px',   color: '#facc15', delay: '0.24s' },
              { tx: '44px',  ty: '44px',  color: '#fff',    delay: '0.06s' },
              { tx: '0px',   ty: '62px',  color: '#c084fc', delay: '0.18s' },
              { tx: '-44px', ty: '44px',  color: '#facc15', delay: '0s'    },
              { tx: '-62px', ty: '0px',   color: '#fff',    delay: '0.12s' },
              { tx: '-44px', ty: '-44px', color: '#c084fc', delay: '0.24s' },
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

          <p className="text-white font-semibold text-lg">1× Bronze Box</p>
          <p className="text-gray-500 text-sm mt-1">Come back tomorrow for another one.</p>
        </div>

        <button
          className="mt-6 w-full py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-lg transition-colors"
          onClick={() => setShowDailyBonus(false)}
        >
          Claim!
        </button>
      </Modal>
    </div>
    </PageShell>
  );
}
