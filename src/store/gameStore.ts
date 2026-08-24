import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { InventoryEntry, Rarity } from '../types';

interface GameState {
  username: string;
  gems: number;
  energy: number;
  inventory: InventoryEntry[];
  lastLoginDate: string;
  totalSpent: number;
  lootCounts: Record<Rarity, number>;
  // Actions
  setUsername: (name: string) => void;
  addGems: (amount: number) => void;
  spendGems: (amount: number) => boolean;
  addEnergy: (amount: number) => void;
  spendEnergy: (amount: number) => boolean;
  addBox: (boxId: string, count?: number) => void;
  removeBox: (boxId: string) => boolean;
  claimDailyBonus: () => boolean;
  recordSpend: (usd: number) => void;
  recordLoot: (rarity: Rarity) => void;
  reset: () => void;
}

const INITIAL_STATE = {
  username: '',
  gems: 0,
  energy: 0,
  inventory: [] as InventoryEntry[],
  lastLoginDate: '',
  totalSpent: 0,
  lootCounts: { common: 0, uncommon: 0, rare: 0, epic: 0, legendary: 0 } as Record<Rarity, number>,
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

      recordSpend: (usd) => set((s) => ({ totalSpent: s.totalSpent + usd })),

      recordLoot: (rarity) => set((s) => ({
        lootCounts: { ...s.lootCounts, [rarity]: s.lootCounts[rarity] + 1 },
      })),

      claimDailyBonus: () => {
        const today = new Date().toISOString().slice(0, 10);
        if (get().lastLoginDate === today) return false;
        set((s) => {
          const existing = s.inventory.find((e) => e.boxId === 'bronze');
          return {
            lastLoginDate: today,
            inventory: existing
              ? s.inventory.map((e) => e.boxId === 'bronze' ? { ...e, count: e.count + 1 } : e)
              : [...s.inventory, { boxId: 'bronze', count: 1 }],
          };
        });
        return true;
      },

      reset: () => set(INITIAL_STATE),
    }),
    { name: 'emptyfull-game-state' }
  )
);
