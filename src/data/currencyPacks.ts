import type { CurrencyPack } from '../types';

export const currencyPacks: CurrencyPack[] = [
  { id: 'gem-pot',      name: 'Gem Pot',      currency: 'gems',   amount: 100,  usdPrice: 1.00  },
  { id: 'gem-cache',    name: 'Gem Cache',    currency: 'gems',   amount: 1000, usdPrice: 7.49  },
  { id: 'energy-pouch', name: 'Energy Pouch', currency: 'energy', amount: 200,  usdPrice: 4.99  },
  { id: 'energy-pack',  name: 'Energy Pack',  currency: 'energy', amount: 1000, usdPrice: 19.99 },
];
