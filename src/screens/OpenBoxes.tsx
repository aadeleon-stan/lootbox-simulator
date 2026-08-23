import { Link } from 'react-router-dom';

export default function OpenBoxes() {
  return (
    <div className="flex flex-col min-h-[calc(100svh-52px)] p-4">
      <h2 className="text-2xl font-bold mb-4">Open Boxes</h2>
      {/* TODO: render inventory grid; hold-button CTA to open selected box */}
      <p className="text-gray-500">Your box inventory is empty.</p>
      <div className="mt-auto flex gap-3">
        <Link to="/main-menu" className="px-4 py-2 border border-gray-400 rounded-lg">Back</Link>
        <Link to="/buy-boxes" className="px-4 py-2 bg-purple-600 text-white rounded-lg">Buy Boxes</Link>
      </div>
    </div>
  );
}
