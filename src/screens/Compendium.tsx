import { Link } from 'react-router-dom';

export default function Compendium() {
  return (
    <div className="flex flex-col min-h-[calc(100svh-52px)] p-4">
      <h2 className="text-2xl font-bold mb-4">Compendium</h2>
      {/* TODO: grid of item cards (name, image, rarity) sorted alphabetically */}
      {/* TODO: clicking a card shows expanded item info modal */}
      <p className="text-gray-500">No items to display yet.</p>
      <div className="mt-auto">
        <Link to="/main-menu" className="px-4 py-2 border border-gray-400 rounded-lg">Main Menu</Link>
      </div>
    </div>
  );
}
