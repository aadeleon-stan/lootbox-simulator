export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export type CurrencyType = 'gems' | 'energy';

export interface Item {
  id: string;
  name: string;
  image?: string;
  emoji?: string;
  rarity: Rarity;
  effect?: string;
  flavorText?: string;
}

export interface RarityDistribution {
  common: number;
  uncommon: number;
  rare: number;
  epic: number;
  legendary: number;
}

export interface Box {
  id: string;
  name: string;
  image?: string;
  emoji?: string;
  currency: CurrencyType;
  price: number;
  rarityDistribution: RarityDistribution;
}

export interface CurrencyPack {
  id: string;
  name: string;
  currency: CurrencyType;
  amount: number;
  usdPrice: number;
}

export interface InventoryEntry {
  boxId: string;
  count: number;
}
