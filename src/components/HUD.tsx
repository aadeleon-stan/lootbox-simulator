import { useGameStore } from '../store/gameStore';

export default function HUD() {
  const username = useGameStore((s) => s.username);
  const gems = useGameStore((s) => s.gems);
  const energy = useGameStore((s) => s.energy);

  if (!username) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-3 bg-purple-950/80 backdrop-blur-sm border-b border-purple-800">
      <span className="font-bold text-base text-purple-200">{username}</span>
      <div className="flex gap-5 text-base font-semibold">
        <span className="text-yellow-300">💎 {gems.toLocaleString()}</span>
        <span className="text-cyan-300">⚡ {energy.toLocaleString()}</span>
      </div>
    </div>
  );
}
