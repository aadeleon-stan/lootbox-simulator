import { Link } from 'react-router-dom';

interface BottomNavProps {
  back: string;
  links?: { to: string; label: string }[];
}

export default function BottomNav({ back, links }: BottomNavProps) {
  return (
    <div className="mt-4 pt-4 border-t border-white/[0.08] flex gap-3">
      <Link
        to={back}
        className="px-4 py-2 border border-white/10 rounded-lg text-sm text-gray-400 hover:text-white hover:border-white/20 transition-colors"
      >
        Back
      </Link>
      {links?.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-semibold transition-colors"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
