import type { Box } from '../types';

export const boxes: Box[] = [
  {
    id: 'bronze',
    name: 'Bronze Box',
    currency: 'gems',
    price: 150,
    emoji: '📦',
    rarityDistribution: { common: 70, uncommon: 20, rare: 8, epic: 2, legendary: 0 },
  },
  {
    id: 'silver',
    name: 'Silver Box',
    currency: 'gems',
    price: 350,
    emoji: '🥈',
    rarityDistribution: { common: 50, uncommon: 30, rare: 15, epic: 4, legendary: 1 },
  },
  {
    id: 'gold',
    name: 'Gold Box',
    currency: 'gems',
    price: 800,
    emoji: '🥇',
    rarityDistribution: { common: 30, uncommon: 30, rare: 25, epic: 12, legendary: 3 },
  },
  {
    id: 'prestige',
    name: 'Prestige Box',
    currency: 'energy',
    price: 300,
    emoji: '💎',
    rarityDistribution: { common: 0, uncommon: 20, rare: 40, epic: 30, legendary: 10 },
  },
];
