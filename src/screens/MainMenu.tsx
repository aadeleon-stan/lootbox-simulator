import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import Modal from '../components/Modal';

export default function MainMenu() {
  const inventory = useGameStore((s) => s.inventory);
  const claimDailyBonus = useGameStore((s) => s.claimDailyBonus);
  const totalBoxes = inventory.reduce((sum, e) => sum + e.count, 0);

  const [showDailyBonus, setShowDailyBonus] = useState(false);

  useEffect(() => {
    if (claimDailyBonus()) setShowDailyBonus(true);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100svh-52px)] p-4 gap-4">
      <h1 className="text-5xl font-bold mb-1">
        <span className="text-purple-300">Empty</span><span className="text-yellow-300">Full</span>
      </h1>
      <p className="text-purple-500 mb-6 text-sm">a free experience</p>
      <Link to="/open-boxes" className="w-full max-w-xs text-center px-6 py-3 bg-purple-700 hover:bg-purple-600 text-white rounded-lg font-semibold transition-colors">
        Open Boxes ({totalBoxes})
      </Link>
      <Link to="/buy-boxes" className="w-full max-w-xs text-center px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors">
        Buy Boxes
      </Link>
      <Link to="/buy-gems" className="w-full max-w-xs text-center px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors">
        Buy Gems & Energy
      </Link>
      <Link to="/compendium" className="w-full max-w-xs text-center px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors">
        View Compendium
      </Link>
      <button className="w-full max-w-xs px-6 py-3 border border-gray-700 rounded-lg text-gray-600 cursor-not-allowed mt-2">
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
  );
}
