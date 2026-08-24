import { useNavigate, Link } from 'react-router-dom';
import { currencyPacks } from '../data/currencyPacks';

export default function BuyGems() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-[calc(100svh-52px)] p-4">
      <div className="mx-auto w-full max-w-80">
      <h2 className="text-2xl font-bold mb-4">Buy Gems &amp; Energy</h2>

      <div className="grid grid-cols-2 gap-3">
        {currencyPacks.map((pack) => (
          <button
            key={pack.id}
            className="flex flex-col items-center gap-1 p-4 border-2 border-gray-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-colors text-left"
            onClick={() => navigate('/payment', { state: { packId: pack.id } })}
          >
            <span className="text-3xl">{pack.currency === 'gems' ? '💎' : '⚡'}</span>
            <span className="font-semibold text-sm">{pack.name}</span>
            <span className="text-purple-700 font-bold">
              {pack.amount.toLocaleString()} {pack.currency === 'gems' ? 'Gems' : 'Energy'}
            </span>
            <span className="text-gray-500 text-sm">${pack.usdPrice.toFixed(2)}</span>
          </button>
        ))}
      </div>

      <div className="mt-4">
        <Link to="/main-menu" className="px-4 py-2 border border-gray-400 rounded-lg inline-block">Back</Link>
      </div>
      </div>
    </div>
  );
}
