import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { boxes } from '../data/boxes';
import { useGameStore } from '../store/gameStore';
import HoldButton from '../components/HoldButton';

export default function OpenBoxes() {
  const inventory = useGameStore((s) => s.inventory);
  const removeBox = useGameStore((s) => s.removeBox);
  const navigate = useNavigate();

  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);

  const ownedBoxes = inventory
    .map((entry) => ({ entry, box: boxes.find((b) => b.id === entry.boxId) }))
    .filter((x): x is { entry: typeof inventory[0]; box: NonNullable<typeof x.box> } => !!x.box);

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
    <div className="flex flex-col min-h-[calc(100svh-52px)] p-4">
      <div className="mx-auto w-full max-w-80 flex flex-col flex-1">
      <h2 className="text-2xl font-bold mb-4">Open Boxes</h2>

      {ownedBoxes.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
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
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300',
                ].join(' ')}
                onClick={() => setSelectedBoxId(box.id)}
              >
                <span className="text-4xl">{box.emoji}</span>
                <span className="font-semibold text-sm">{box.name}</span>
                <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  x{entry.count}
                </span>
              </button>
            ))}
          </div>

          {selectedBox && (
            <div className="mb-4">
              <HoldButton
                label={`Open ${selectedBox.name}`}
                onComplete={handleOpen}
              />
            </div>
          )}
        </>
      )}

      <div className="mt-auto flex gap-3">
        <Link to="/main-menu" className="px-4 py-2 border border-gray-400 rounded-lg">Back</Link>
        <Link to="/buy-boxes" className="px-4 py-2 bg-purple-600 text-white rounded-lg">Buy Boxes</Link>
      </div>
      </div>
    </div>
  );
}
