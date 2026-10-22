"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type CartContextValue = { count: number; add: (id: string) => void; lastAdded: string | null };

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>([]);
  const add = useCallback((id: string) => setItems((prev) => [...prev, id]), []);
  const value = useMemo(
    () => ({ count: items.length, add, lastAdded: items.at(-1) ?? null }),
    [items, add],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
