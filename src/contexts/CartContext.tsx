import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "@/integrations/supabase/client";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
  size?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: number, size?: string) => void;
  updateQuantity: (id: number, quantity: number, size?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "hk_leather_cart";

// Helper to generate unique cart item key
const getItemKey = (id: number, size?: string) => `${id}-${size || "default"}`;

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load cart from local storage on mount (for guests and initial load)
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch {
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
  }, []);

  // Save cart to local storage whenever it changes
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } else {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, [items]);

  // Sync cart with database when user logs in
  useEffect(() => {
    const syncCartWithDatabase = async () => {
      if (!user) return;

      setIsLoading(true);

      // Fetch existing cart from database
      const { data: dbCartItems } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user", user.id);

      if (dbCartItems && dbCartItems.length > 0) {
        // Merge local cart with database cart
        const dbItems: CartItem[] = dbCartItems.map((item) => {
          // Parse product info from the stored JSON string
          try {
            const productInfo = JSON.parse(item.product || "{}");
            return {
              id: item.product_id || 0,
              name: productInfo.name || "Unknown Product",
              price: productInfo.price || 0,
              image: productInfo.image || "",
              category: productInfo.category || "",
              quantity: item.quantity || 1,
              size: productInfo.size,
            };
          } catch {
            return null;
          }
        }).filter(Boolean) as CartItem[];

        // Merge: local items take precedence, add new items from DB
        const mergedItems = [...items];
        dbItems.forEach((dbItem) => {
          const existingIndex = mergedItems.findIndex(
            (item) => getItemKey(item.id, item.size) === getItemKey(dbItem.id, dbItem.size)
          );
          if (existingIndex === -1) {
            mergedItems.push(dbItem);
          }
        });

        setItems(mergedItems);

        // Save merged cart back to database
        await saveCartToDatabase(mergedItems, user.id);
      } else if (items.length > 0) {
        // No DB cart, save local cart to database
        await saveCartToDatabase(items, user.id);
      }

      setIsLoading(false);
    };

    syncCartWithDatabase();
  }, [user?.id]);

  const saveCartToDatabase = async (cartItems: CartItem[], userId: string) => {
    // Clear existing cart items
    await supabase.from("cart_items").delete().eq("user", userId);

    // Insert new cart items
    if (cartItems.length > 0) {
      const dbItems = cartItems.map((item) => ({
        user: userId,
        product_id: item.id,
        product: JSON.stringify({
          name: item.name,
          price: item.price,
          image: item.image,
          category: item.category,
          size: item.size,
        }),
        quantity: item.quantity,
      }));

      await supabase.from("cart_items").insert(dbItems);
    }
  };

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const itemKey = getItemKey(item.id, item.size);
      const existing = prev.find((i) => getItemKey(i.id, i.size) === itemKey);
      
      let newItems: CartItem[];
      if (existing) {
        newItems = prev.map((i) =>
          getItemKey(i.id, i.size) === itemKey
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        newItems = [...prev, { ...item, quantity: 1 }];
      }

      // Sync with database if user is logged in
      if (user) {
        saveCartToDatabase(newItems, user.id);
      }

      return newItems;
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: number, size?: string) => {
    setItems((prev) => {
      const itemKey = getItemKey(id, size);
      const newItems = prev.filter((i) => getItemKey(i.id, i.size) !== itemKey);

      // Sync with database if user is logged in
      if (user) {
        saveCartToDatabase(newItems, user.id);
      }

      return newItems;
    });
  };

  const updateQuantity = (id: number, quantity: number, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(id, size);
      return;
    }
    setItems((prev) => {
      const itemKey = getItemKey(id, size);
      const newItems = prev.map((i) =>
        getItemKey(i.id, i.size) === itemKey ? { ...i, quantity } : i
      );

      // Sync with database if user is logged in
      if (user) {
        saveCartToDatabase(newItems, user.id);
      }

      return newItems;
    });
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);

    // Clear from database if user is logged in
    if (user) {
      supabase.from("cart_items").delete().eq("user", user.id);
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};