import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CustomizationState {
  text: string;
  font: string;
  color: string;
  textSize: number; // 0.5 to 1.5 scale factor
  isEditingText: boolean;
  position: { x: number; y: number };
}

// Customizer Store (Transient state for the editor)
export interface CustomizerStore extends CustomizationState {
  setText: (text: string) => void;
  setFont: (font: string) => void;
  setColor: (color: string) => void;
  setTextSize: (size: number) => void;
  setIsEditingText: (isEditing: boolean) => void;
  setPosition: (position: { x: number; y: number }) => void;
  reset: () => void;
}

export const useCustomizerStore = create<CustomizerStore>((set) => ({
  text: 'Your Name',
  font: 'Playfair Display',
  color: '#D4AF37', // Gold default
  textSize: 1.0, // Default size
  isEditingText: false,
  position: { x: 50, y: 50 }, // Center
  setText: (text) => set({ text }),
  setFont: (font) => set({ font }),
  setColor: (color) => set({ color }),
  setTextSize: (textSize) => set({ textSize }),
  setIsEditingText: (isEditingText) => set({ isEditingText }),
  setPosition: (position) => set({ position }),
  reset: () =>
    set({
      text: 'Your Name',
      font: 'Playfair Display',
      color: '#D4AF37',
      textSize: 1.0,
      isEditingText: false,
      position: { x: 50, y: 50 },
    }),
}));

// Cart Store (Persisted state)
export interface CartItem {
  id: string; // Unique ID for the cart item (product ID + randomization/hash)
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  customization: CustomizationState;
  isCustomized?: boolean;
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
            (item) =>
              item.productId === newItem.productId &&
              JSON.stringify(item.customization) === JSON.stringify(newItem.customization)
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
      // We don't persist 'isOpen' usually, but for simplicity we keep all. 
      // Better to partially persist, but full persist is fine for MVP.
      partialize: (state) => ({ items: state.items }),
    }
  )
);
