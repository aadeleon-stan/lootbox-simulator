import { Link } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';

export default function MainMenu() {
  const inventory = useGameStore((s) => s.inventory);
  const totalBoxes = inventory.reduce((sum, e) => sum + e.count, 0);

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
    </div>
  );
}
