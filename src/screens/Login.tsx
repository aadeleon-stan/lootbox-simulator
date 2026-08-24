import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';

export default function Login() {
  const [name, setName] = useState('');
  const setUsername = useGameStore((s) => s.setUsername);
  const addBox = useGameStore((s) => s.addBox);
  const navigate = useNavigate();

  function handleLogin() {
    const trimmed = name.trim();
    if (!trimmed) return;
    setUsername(trimmed);
    addBox('bronze'); // daily login bonus box
    navigate('/main-menu');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100svh-52px)] p-4">
      <h1 className="text-5xl font-bold mb-2">
        <span className="text-purple-300">Empty</span><span className="text-yellow-300">Full</span>
      </h1>
      <p className="text-purple-500 mb-8 text-sm">a free lootbox experience</p>
      <input
        className="w-full max-w-xs bg-gray-900 border border-purple-800 rounded-lg px-4 py-3 mb-4 text-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
        type="text"
        placeholder="Enter your username"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
        autoFocus
      />
      <button
        onClick={handleLogin}
        disabled={!name.trim()}
        className="w-full max-w-xs px-6 py-3 bg-purple-700 hover:bg-purple-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Log In
      </button>
    </div>
  );
}
