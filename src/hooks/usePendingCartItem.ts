import { create } from 'zustand';

interface CartItemPayload {
  id: number;
  image: string;
  name: string;
  price: number;
  category: string;
}

interface PendingCartItemStore {
  pendingItem: CartItemPayload | null;
  setPendingItem: (item: CartItemPayload | null) => void;
  clearPendingItem: () => void;
}

// Using session storage to persist pending item across page redirects
const STORAGE_KEY = 'pending_cart_item';

const getStoredItem = (): CartItemPayload | null => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const usePendingCartItem = create<PendingCartItemStore>((set) => ({
  pendingItem: getStoredItem(),
  setPendingItem: (item) => {
    if (item) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(item));
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
    set({ pendingItem: item });
  },
  clearPendingItem: () => {
    sessionStorage.removeItem(STORAGE_KEY);
    set({ pendingItem: null });
  },
}));
