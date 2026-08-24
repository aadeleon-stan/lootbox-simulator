import type { Box, Item, Rarity } from '../types';

export function rollItem(box: Box, allItems: Item[]): Item {
  const dist = box.rarityDistribution;
  const total = dist.common + dist.uncommon + dist.rare + dist.epic + dist.legendary;
  let roll = Math.random() * total;

  let rarity: Rarity;
  if ((roll -= dist.common) < 0)    rarity = 'common';
  else if ((roll -= dist.uncommon) < 0) rarity = 'uncommon';
  else if ((roll -= dist.rare) < 0)     rarity = 'rare';
  else if ((roll -= dist.epic) < 0)     rarity = 'epic';
  else                                   rarity = 'legendary';

  const pool = allItems.filter((i) => i.rarity === rarity);
  if (pool.length === 0) {
    // Fallback: pick any item
    return allItems[Math.floor(Math.random() * allItems.length)];
  }
  return pool[Math.floor(Math.random() * pool.length)];
}
