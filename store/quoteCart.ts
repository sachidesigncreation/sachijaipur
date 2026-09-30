import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';

export interface QuoteItem {
  product:                  Product;
  selectedKarat:            string;
  selectedMetal?:           string;
  selectedStone?:           string;
  selectedSecondaryStone?:  string;
  secondaryGemstoneCount?:  number;
  quantity:                 number;
}

interface QuoteCartStore {
  items: QuoteItem[];
  isOpen: boolean;
  addItem:        (product: Product, karat: string, metal: string, stone: string, qty?: number, secondaryStone?: string, secondaryCount?: number) => void;
  removeItem:     (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart:      () => void;
  openCart:       () => void;
  closeCart:      () => void;
}

export const useQuoteCart = create<QuoteCartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, karat, metal, stone, qty = 1, secondaryStone, secondaryCount) => {
        const existing = get().items.find(
          i =>
            i.product.id === product.id &&
            i.selectedKarat === karat &&
            i.selectedMetal === metal &&
            i.selectedStone === stone &&
            i.selectedSecondaryStone === secondaryStone
        );
        if (existing) {
          set(s => ({
            items: s.items.map(i =>
              i.product.id === product.id &&
              i.selectedKarat === karat &&
              i.selectedMetal === metal &&
              i.selectedStone === stone &&
              i.selectedSecondaryStone === secondaryStone
                ? { ...i, quantity: i.quantity + qty }
                : i
            ),
          }));
        } else {
          set(s => ({
            items: [
              ...s.items,
              {
                product,
                selectedKarat:           karat,
                selectedMetal:           metal,
                selectedStone:           stone,
                selectedSecondaryStone:  secondaryStone,
                secondaryGemstoneCount:  secondaryCount,
                quantity:                qty,
              },
            ],
          }));
        }
      },

      removeItem: (productId) =>
        set(s => ({ items: s.items.filter(i => i.product.id !== productId) })),

      updateQuantity: (productId, qty) =>
        set(s => ({
          items: s.items.map(i => i.product.id === productId ? { ...i, quantity: qty } : i),
        })),

      clearCart:  () => set({ items: [] }),
      openCart:   () => set({ isOpen: true }),
      closeCart:  () => set({ isOpen: false }),
    }),
    { name: 'sachi-quote-cart' }
  )
);
