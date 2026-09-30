/**
 * LEGACY STATIC DATA — kept for reference / homepage fallback.
 * The main catalogue now fetches products from Supabase/Prisma (see app/products/page.tsx).
 */

import type { Product } from '@/types';

export const products: Product[] = [
  { id: 'gr-001', name: 'Sapphire Solitaire Ring',       sku: 'SJ-GR-001',
    baseMetal: 'gold', category: 'rings', purityOptions: ['14K', '18K'], metalColorOptions: ['Yellow Gold', 'White Gold'], availableStones: ['Blue Sapphire'],
    primaryGemstone: 'Blue Sapphire', weightGrams: 4.2, makingChargeC: 0,
    images: ['/FeaturedProducts/Gemini_Generated_Image_1m21sp1m21sp1m21.png'],
    description: 'Classic blue sapphire in four-prong gold setting.', featured: true },

  { id: 'gr-002', name: 'Twisted Band Ring',             sku: 'SJ-GR-002',
    baseMetal: 'gold', category: 'rings', purityOptions: ['10K', '14K', '18K'], metalColorOptions: ['Yellow Gold'], availableStones: ['None'],
    weightGrams: 3.8, makingChargeC: 0, images: ['/FeaturedProducts/Gemini_Generated_Image_65wmt65wmt65wmt6.png'],
    description: 'Minimalist twisted gold band in multiple karats.', featured: true },

  { id: 'ge-001', name: 'Emerald Drop Earrings',         sku: 'SJ-GE-001',
    baseMetal: 'gold', category: 'earrings', purityOptions: ['18K'], metalColorOptions: ['Yellow Gold'], availableStones: ['Created Emerald'],
    primaryGemstone: 'Created Emerald', weightGrams: 5.1, makingChargeC: 0,
    images: ['/FeaturedProducts/Gemini_Generated_Image_68ptm568ptm568pt.png'],
    description: 'Cascading emerald drops in 18K gold.', featured: true },

  { id: 'ge-002', name: 'White Topaz Stud Earrings',     sku: 'SJ-GE-002',
    baseMetal: 'gold', category: 'earrings', purityOptions: ['14K', '18K'], metalColorOptions: ['Yellow Gold', 'White Gold'], availableStones: ['White Topaz'],
    primaryGemstone: 'White Topaz', weightGrams: 2.4, makingChargeC: 0,
    images: ['/FeaturedProducts/SJIH16346-.png'],
    description: 'Round-cut white topaz studs — timeless.', featured: false },

  { id: 'gp-001', name: 'Amethyst Teardrop Pendant',     sku: 'SJ-GP-001',
    baseMetal: 'gold', category: 'pendants', purityOptions: ['14K', '18K'], metalColorOptions: ['Yellow Gold', 'Rose Gold'], availableStones: ['Amethyst'],
    primaryGemstone: 'Amethyst', weightGrams: 3.2, makingChargeC: 0,
    images: ['/image.png'],
    description: 'Amethyst teardrop pendant in warm gold setting.', featured: false },

  { id: 'gp-002', name: 'Diamond Solitaire Pendant',     sku: 'SJ-GP-002',
    baseMetal: 'gold', category: 'pendants', purityOptions: ['18K'], metalColorOptions: ['White Gold', 'Yellow Gold'], availableStones: ['Diamond'],
    primaryGemstone: 'Diamond', weightGrams: 2.1, makingChargeC: 0,
    images: ['/image.png'],
    description: 'Single round diamond in elegant 18K gold setting.', featured: true },

  { id: 'sr-001', name: 'CZ Cocktail Ring',              sku: 'SJ-SR-001',
    baseMetal: 'silver', category: 'rings', purityOptions: ['925'], metalColorOptions: ['Silver', 'Rhodium Plated'], availableStones: ['CZ', 'None'],
    weightGrams: 5.5, makingChargeC: 0, images: ['/image.png'],
    description: 'Bold cocktail ring in 925 sterling silver with CZ.', featured: true },

  { id: 'sr-002', name: 'Moonstone Band',                sku: 'SJ-SR-002',
    baseMetal: 'silver', category: 'rings', purityOptions: ['925'], metalColorOptions: ['Silver'], availableStones: ['Moonstone'],
    primaryGemstone: 'Moonstone', weightGrams: 4.0, makingChargeC: 0,
    images: ['/image.png'],
    description: 'Dreamy moonstone set in burnished sterling silver.', featured: false },

  { id: 'se-001', name: 'Turquoise Hoop Earrings',       sku: 'SJ-SE-001',
    baseMetal: 'silver', category: 'earrings', purityOptions: ['925'], metalColorOptions: ['Silver', 'Gold Plated'], availableStones: ['Turquoise'],
    primaryGemstone: 'Turquoise', weightGrams: 6.0, makingChargeC: 0,
    images: ['/image.png'],
    description: 'Vibrant turquoise in statement hoop setting.', featured: false },

  { id: 'se-002', name: 'Pearl Drop Earrings',           sku: 'SJ-SE-002',
    baseMetal: 'silver', category: 'earrings', purityOptions: ['925'], metalColorOptions: ['Silver'], availableStones: ['Pearl'],
    primaryGemstone: 'Pearl', weightGrams: 4.8, makingChargeC: 0,
    images: ['/image.png'],
    description: 'Classic freshwater pearl drops in sterling silver.', featured: true },

  { id: 'sb-001', name: 'Oxidised Cuff Bracelet',        sku: 'SJ-SB-001',
    baseMetal: 'silver', category: 'bracelets', purityOptions: ['925'], metalColorOptions: ['Oxidised Silver'], availableStones: ['None'],
    weightGrams: 12.0, makingChargeC: 0, images: ['/image.png'],
    description: 'Oxidised sterling silver cuff with tribal motifs.', featured: false },

  { id: 'sn-001', name: 'Layered Station Necklace',      sku: 'SJ-SN-001',
    baseMetal: 'silver', category: 'necklaces', purityOptions: ['925'], metalColorOptions: ['Silver', 'Gold Plated'], availableStones: ['CZ'],
    weightGrams: 9.5, makingChargeC: 0, images: ['/image.png'],
    description: 'Delicate layered necklace with CZ stations.', featured: false },

  { id: 'bng-001', name: 'Enamel Bangle Set',            sku: 'SJ-BNG-001',
    baseMetal: 'brass', category: 'bangles', purityOptions: ['18K GP'], metalColorOptions: ['Yellow Gold Plated'], availableStones: ['None'],
    weightGrams: 28.0, makingChargeC: 0, images: ['/image.png'],
    description: 'Set of 6 enamel bangles in gold-plated brass.', featured: false },

  { id: 'bng-002', name: 'Kundan Floral Bangle',         sku: 'SJ-BNG-002',
    baseMetal: 'brass', category: 'bangles', purityOptions: ['22K GP'], metalColorOptions: ['Yellow Gold Plated'], availableStones: ['Kundan'],
    primaryGemstone: 'Kundan', weightGrams: 35.0, makingChargeC: 0,
    images: ['/image.png'],
    description: 'Ornate Kundan floral motif bangle in 22K GP.', featured: false },

  { id: 'brb-001', name: 'Charm Bracelet',               sku: 'SJ-BRB-001',
    baseMetal: 'brass', category: 'bracelets', purityOptions: ['18K GP'], metalColorOptions: ['Yellow Gold Plated', 'Rose Gold Plated'], availableStones: ['None', 'CZ'],
    weightGrams: 14.5, makingChargeC: 0, images: ['/image.png'],
    description: 'Playful charm bracelet in gold-plated brass.', featured: false },

  { id: 'spe-001', name: 'Hammered Silver Pendant',      sku: 'SJ-SPE-001',
    baseMetal: 'silver', category: 'pendants', purityOptions: ['925'], metalColorOptions: ['Silver'], availableStones: ['None'],
    weightGrams: 3.5, makingChargeC: 0, images: ['/image.png'],
    description: 'Artisan hammered sterling silver pendant.', featured: false },

  { id: 'gbn-001', name: 'Antique Collar Necklace',      sku: 'SJ-GBN-001',
    baseMetal: 'gold', category: 'necklaces', purityOptions: ['22K'], metalColorOptions: ['Yellow Gold'], availableStones: ['Ruby', 'Emerald', 'None'],
    primaryGemstone: 'Ruby', weightGrams: 22.0, makingChargeC: 0,
    images: ['/image.png'],
    description: 'Heirloom-quality collar necklace in 22K gold.', featured: true },

  { id: 'sbng-001', name: 'Silver Kada Bangle',          sku: 'SJ-SBNG-001',
    baseMetal: 'silver', category: 'bangles', purityOptions: ['925'], metalColorOptions: ['Silver', 'Oxidised'], availableStones: ['None'],
    weightGrams: 18.0, makingChargeC: 0, images: ['/image.png'],
    description: 'Traditional sterling silver kada with engraved patterns.', featured: false },

  { id: 'gre-001', name: 'Ruby Cluster Ring',            sku: 'SJ-GRE-001',
    baseMetal: 'gold', category: 'rings', purityOptions: ['18K'], metalColorOptions: ['White Gold', 'Yellow Gold'], availableStones: ['Ruby'],
    primaryGemstone: 'Ruby', weightGrams: 5.8, makingChargeC: 0,
    images: ['/image.png'],
    description: 'Vivid ruby cluster in intricate gold setting.', featured: false },

  { id: 'bpe-001', name: 'Polki Pendant Earrings Set',   sku: 'SJ-BPE-001',
    baseMetal: 'brass', category: 'earrings', purityOptions: ['22K GP'], metalColorOptions: ['Yellow Gold Plated'], availableStones: ['Polki'],
    primaryGemstone: 'Polki', weightGrams: 8.5, makingChargeC: 0,
    images: ['/image.png'],
    description: 'Traditional Polki pendant earrings in 22K gold plated brass.', featured: false },

  { id: 'sp-001', name: 'Silver Labradorite Pendant',    sku: 'SJ-SP-001',
    baseMetal: 'silver', category: 'pendants', purityOptions: ['925'], metalColorOptions: ['Silver'], availableStones: ['Labradorite'],
    primaryGemstone: 'Labradorite', weightGrams: 4.1, makingChargeC: 0,
    images: ['/image.png'],
    description: 'Mystical labradorite flash in bezel-set silver pendant.', featured: false },
];

export const featuredProducts = products.filter(p => p.featured);
