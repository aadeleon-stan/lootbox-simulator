import { Link } from 'react-router-dom';

export default function Payment() {
  return (
    <div className="flex flex-col min-h-[calc(100svh-52px)] p-4">
      <h2 className="text-2xl font-bold mb-4">Payment</h2>
      {/* Fake saved payment method: WISA card ending 1111, exp 04/2069 */}
      {/* TODO: display pack summary, saved card, hold-button Pay CTA */}
      {/* TODO: on success: Thank you modal → fake email receipt modal */}
      <div className="border border-gray-300 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-500 mb-1">Saved payment method</p>
        <p className="font-semibold">WISA •••• 1111</p>
        <p className="text-sm text-gray-500">Expires 04/2069</p>
      </div>
      {/* TODO: hold-button Pay CTA */}
      <div className="mt-auto">
        <Link to="/buy-gems" className="px-4 py-2 border border-gray-400 rounded-lg">Go Back</Link>
      </div>
    </div>
  );
}
