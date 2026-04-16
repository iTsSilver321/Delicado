import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Cart Store (Persisted state)
export interface CartItem {
  id: string; // product id
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      addItem: (newItem) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.id === newItem.id
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === existingItem.id
                  ? { ...item, quantity: item.quantity + newItem.quantity }
                  : item
              ),
              isOpen: true,
            };
          }

          return { items: [...state.items, newItem], isOpen: true };
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      updateQuantity: (id, delta) =>
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id === id) {
              const newQuantity = Math.max(1, item.quantity + delta);
              return { ...item, quantity: newQuantity };
            }
            return item;
          }),
        })),
      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: 'delicado-cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
