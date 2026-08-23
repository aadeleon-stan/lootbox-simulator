import { Link } from 'react-router-dom';

export default function LootRoll() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100svh-52px)] p-4">
      <h2 className="text-2xl font-bold mb-4">Opening Box…</h2>
      {/* TODO: anticipation delay screen (spinner / question mark) */}
      {/* TODO: carousel animation cycling through possible items */}
      {/* TODO: rarity reveal escalation (color flash sequence) then item name reveal */}
      {/* TODO: fanfare based on rarity tier */}
      {/* TODO: "+15 gems" reward notification */}
      <p className="text-gray-500 mb-8">Carousel goes here.</p>
      <Link to="/open-boxes" className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold">
        Open More Boxes
      </Link>
    </div>
  );
}
