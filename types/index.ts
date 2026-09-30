import type { Currency } from '@/lib/currency';

export interface Product {
  id:                string;
  sku?:              string | null;
  name:              string;
  category:          string; // rings | earrings | pendants | bracelets | bangles | necklaces
  description:       string;
  baseMetal:         string; // gold | silver | brass
  purityOptions:     string[]; // e.g. ["14K","18K"] or ["925"]
  metalColorOptions: string[]; // e.g. ["Yellow Gold","White Gold","Rose Gold"]
  availableStones:   string[]; // e.g. ["Diamond","Ruby","None"]
  primaryGemstone?:  string | null;
  images:            string[]; // R2 keys resolved via getR2AssetUrl()
  featured:          boolean;
  weightGrams?:      number | null;
  makingChargeC:     number; // per-product labour override (L), ₹/g; 0 = use global labourCostPerGram
  gemstoneCount?:    number; // N in formula — number of gemstones per piece; defaults to 1
}

/** Pricing settings loaded from SiteSettings in the DB */
export interface PricingSettings {
  wastageFactor:        number; // default 1.07
  labourCostPerGram:    number; // L, ₹/g
  platingCostFactor:    number; // dimensionless plating factor P
  exchangeRateUSDtoINR: number; // e.g. 83.5
}

/** Stone cost lookup map: stoneName → { priceD (s), satinCost (st) } */
export type StonePriceMap = Record<string, { priceD: number; satinCost: number }>;

export interface MetalPrices {
  gold:      Record<string, number>; // karat → price per gram in INR
  silver:    Record<string, number>; // purity → price per gram in INR
  brass:     Record<string, number>;
  raw?: {
    goldUSDPerGram:   number;
    silverUSDPerGram: number;
    brassUSDPerGram:  number;
  };
  settings:   PricingSettings;
  stonePrices: StonePriceMap;
  /** Site-wide display currency from SiteSettings — "INR" (default) or "USD" */
  displayCurrency?: Currency;
  /** Live/configured USD→INR rate; used to render prices in USD */
  usdToInrRate?:    number;
  updatedAt:  string | null;
}

export interface QuoteItem {
  product:                  Product;
  selectedKarat:            string;
  selectedMetal?:           string;
  selectedStone?:           string;
  selectedSecondaryStone?:  string;
  secondaryGemstoneCount?:  number;
  quantity:                 number;
}

export interface Certificate {
  id:          string;
  name:        string;
  issuingBody: string;
  thumbnail:   string;
  fullImage:   string;
  validity?:   string;
}

export interface ClientAccount {
  id:           string;
  email:        string;
  name:         string;
  company:      string;
  country:      string;
  phone?:       string | null;
  businessType: string;
  status:       'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionNote?: string | null;
  createdAt:    string;
}

export interface StonePrice {
  id:        string;
  stoneName: string;
  priceD:    number; // s — stone cost INR per piece
  satinCost: number; // st — satin/setting cost INR per piece
}

export interface SiteSettings {
  key:   string;
  value: string;
}
