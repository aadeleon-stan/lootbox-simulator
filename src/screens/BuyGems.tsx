import { useNavigate } from 'react-router-dom';
import { currencyPacks } from '../data/currencyPacks';
import PageShell from '../components/PageShell';
import BottomNav from '../components/BottomNav';

export default function BuyGems() {
  const navigate = useNavigate();

  return (
    <PageShell mode="flow" title="Buy Gems &amp; Energy">
      <div className="grid grid-cols-2 gap-3">
        {currencyPacks.map((pack) => (
          <button
            key={pack.id}
            className="flex flex-col items-center gap-1 p-4 border-2 border-white/10 rounded-xl hover:border-purple-400 hover:bg-purple-500/10 transition-colors text-left"
            onClick={() => navigate('/payment', { state: { packId: pack.id } })}
          >
            <span className="text-3xl">{pack.currency === 'gems' ? '💎' : '⚡'}</span>
            <span className="font-semibold text-sm">{pack.name}</span>
            <span className="text-purple-400 font-bold">
              {pack.amount.toLocaleString()} {pack.currency === 'gems' ? 'Gems' : 'Energy'}
            </span>
            <span className="text-gray-500 text-sm">${pack.usdPrice.toFixed(2)}</span>
          </button>
        ))}
      </div>

      <BottomNav back="/main-menu" />
    </PageShell>
  );
}
