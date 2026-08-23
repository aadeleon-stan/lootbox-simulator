import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { InventoryEntry } from '../types';

interface GameState {
  username: string;
  gems: number;
  energy: number;
  inventory: InventoryEntry[];
  // Actions
  setUsername: (name: string) => void;
  addGems: (amount: number) => void;
  spendGems: (amount: number) => boolean;
  addEnergy: (amount: number) => void;
  spendEnergy: (amount: number) => boolean;
  addBox: (boxId: string, count?: number) => void;
  removeBox: (boxId: string) => boolean;
  reset: () => void;
}

const INITIAL_STATE = {
  username: '',
  gems: 0,
  energy: 0,
  inventory: [] as InventoryEntry[],
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      setUsername: (name) => set({ username: name }),

      addGems: (amount) => set((s) => ({ gems: s.gems + amount })),

      spendGems: (amount) => {
        const { gems } = get();
        if (gems < amount) return false;
        set((s) => ({ gems: s.gems - amount }));
        return true;
      },

      addEnergy: (amount) => set((s) => ({ energy: s.energy + amount })),

      spendEnergy: (amount) => {
        const { energy } = get();
        if (energy < amount) return false;
        set((s) => ({ energy: s.energy - amount }));
        return true;
      },

      addBox: (boxId, count = 1) =>
        set((s) => {
          const existing = s.inventory.find((e) => e.boxId === boxId);
          if (existing) {
            return {
              inventory: s.inventory.map((e) =>
                e.boxId === boxId ? { ...e, count: e.count + count } : e
              ),
            };
          }
          return { inventory: [...s.inventory, { boxId, count }] };
        }),

      removeBox: (boxId) => {
        const entry = get().inventory.find((e) => e.boxId === boxId);
        if (!entry || entry.count === 0) return false;
        set((s) => ({
          inventory: s.inventory
            .map((e) => (e.boxId === boxId ? { ...e, count: e.count - 1 } : e))
            .filter((e) => e.count > 0),
        }));
        return true;
      },

      reset: () => set(INITIAL_STATE),
    }),
    { name: 'emptyfull-game-state' }
  )
);
