import type { Box, Item, Rarity } from '../types';

const REEL_LENGTH = 50;
const WINNER_INDEX = 42;

const rarities: Rarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

/**
 * Build a reel of items for the carousel strip.
 * Uses a flattened rarity distribution (sqrt of true weights + minimum floor)
 * so rarer items appear more often visually while the actual roll is unaffected.
 */
export function generateReel(
  box: Box,
  allItems: Item[],
  winner: Item,
  totalLength = REEL_LENGTH,
  winnerIndex = WINNER_INDEX,
): Item[] {
  // Build flattened weights: sqrt of true weight, with a minimum floor of 3
  const dist = box.rarityDistribution;
  const flatWeights: Record<Rarity, number> = {} as Record<Rarity, number>;
  for (const r of rarities) {
    flatWeights[r] = Math.max(Math.sqrt(dist[r]), dist[r] > 0 ? 3 : 0);
  }

  const totalWeight = Object.values(flatWeights).reduce((a, b) => a + b, 0);

  const pickRandom = (): Item => {
    let roll = Math.random() * totalWeight;
    let rarity: Rarity = 'common';
    for (const r of rarities) {
      roll -= flatWeights[r];
      if (roll <= 0) {
        rarity = r;
        break;
      }
    }
    const pool = allItems.filter((i) => i.rarity === rarity);
    if (pool.length === 0) return allItems[Math.floor(Math.random() * allItems.length)];
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const reel: Item[] = [];
  for (let i = 0; i < totalLength; i++) {
    if (i === winnerIndex) {
      reel.push(winner);
    } else {
      reel.push(pickRandom());
    }
  }

  return reel;
}

export { WINNER_INDEX };
