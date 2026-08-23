import { Link } from 'react-router-dom';

export default function BuyGems() {
  return (
    <div className="flex flex-col min-h-[calc(100svh-52px)] p-4">
      <h2 className="text-2xl font-bold mb-4">Buy Gems & Energy</h2>
      {/* TODO: render currency pack cards; clicking navigates to Payment screen */}
      <p className="text-gray-500">No packs available yet.</p>
      <div className="mt-auto">
        <Link to="/main-menu" className="px-4 py-2 border border-gray-400 rounded-lg">Back</Link>
      </div>
    </div>
  );
}
