import { Link } from 'react-router-dom';

export default function BuyBoxes() {
  return (
    <div className="flex flex-col min-h-[calc(100svh-52px)] p-4">
      <h2 className="text-2xl font-bold mb-1">Buy Boxes</h2>
      {/* TODO: show currency balances */}
      {/* TODO: render box cards with Details + hold-button Buy CTA */}
      <p className="text-gray-500 mt-4">No boxes available yet.</p>
      <div className="mt-auto flex gap-3">
        <Link to="/main-menu" className="px-4 py-2 border border-gray-400 rounded-lg">Back</Link>
        <Link to="/open-boxes" className="px-4 py-2 bg-purple-600 text-white rounded-lg">Open Boxes</Link>
      </div>
    </div>
  );
}
