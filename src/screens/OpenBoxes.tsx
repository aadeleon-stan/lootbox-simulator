import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { boxes } from '../data/boxes';
import { useGameStore } from '../store/gameStore';
import PageShell from '../components/PageShell';
import BottomNav from '../components/BottomNav';
import { Link } from 'react-router-dom';

const rarityTextColors: Record<string, string> = {
  common: 'text-gray-500',
  uncommon: 'text-green-400',
  rare: 'text-blue-400',
  epic: 'text-purple-400',
  legendary: 'text-yellow-400',
};

export default function OpenBoxes() {
  const inventory = useGameStore((s) => s.inventory);
  const removeBox = useGameStore((s) => s.removeBox);
  const navigate = useNavigate();

  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);

  const ownedBoxes = inventory
    .map((entry) => ({ entry, box: boxes.find((b) => b.id === entry.boxId) }))
    .filter((x): x is { entry: typeof inventory[0]; box: NonNullable<typeof x.box> } => !!x.box)
    .sort((a, b) => boxes.indexOf(a.box) - boxes.indexOf(b.box));

  const handleOpen = () => {
    if (!selectedBoxId) return;
    const success = removeBox(selectedBoxId);
    if (success) {
      const b = boxes.find((x) => x.id === selectedBoxId);
      navigate('/loot-roll', {
        state: { boxId: selectedBoxId, boxEmoji: b?.emoji, boxName: b?.name },
      });
    }
  };

  const selectedBox = boxes.find((b) => b.id === selectedBoxId);

  return (
    <PageShell mode="flow" title="Open Boxes">
      {ownedBoxes.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-12">
          <p className="text-gray-500">Your box inventory is empty.</p>
          <Link to="/buy-boxes" className="px-4 py-2 bg-purple-600 text-white rounded-lg">Buy Boxes</Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {ownedBoxes.map(({ entry, box }) => (
              <button
                key={box.id}
                className={[
                  'flex flex-col items-center gap-2 p-4 border-2 rounded-xl transition-colors',
                  selectedBoxId === box.id
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-white/10 hover:border-purple-300',
                ].join(' ')}
                onClick={() => setSelectedBoxId(box.id)}
              >
                <span className="text-4xl">{box.emoji}</span>
                <span className="font-semibold text-sm">{box.name}</span>
                <span className="bg-purple-500/15 text-purple-400 text-xs font-bold px-2 py-0.5 rounded-full">
                  x{entry.count}
                </span>
              </button>
            ))}
          </div>

          {selectedBox && (
            <div className="border border-white/[0.08] rounded-2xl p-4 mb-4 flex flex-col items-center gap-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedBox.emoji}</span>
                <span className="font-bold text-lg">{selectedBox.name}</span>
              </div>
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
              <button
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-colors"
                onClick={handleOpen}
              >
                Open {selectedBox.name}
              </button>
            </div>
          )}
        </>
      )}

      <BottomNav back="/main-menu" links={[{ to: '/buy-boxes', label: 'Buy Boxes' }]} />
    </PageShell>
  );
}
