"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

type CartContextValue = {
  count: number;
  add: (id: string, label?: string) => void;
  lastAdded: string | null;
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  inWishlist: (id: string) => boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

const KEY = "aurum:v1";

/** Cart and wishlist, persisted per browser. Shared by the homepage and the category pages. */
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [toast, setToast] = useState<{ text: string; key: number } | null>(null);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? "{}");
      if (Array.isArray(saved.items)) setItems(saved.items);
      if (Array.isArray(saved.wishlist)) setWishlist(saved.wishlist);
    } catch {
      /* storage unavailable: start empty */
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(KEY, JSON.stringify({ items, wishlist }));
    } catch {
      /* ignore */
    }
  }, [items, wishlist]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const add = useCallback((id: string, label?: string) => {
    setItems((prev) => [...prev, id]);
    if (label) setToast({ text: `${label} added to cart`, key: Date.now() });
  }, []);
  const toggleWishlist = useCallback(
    (id: string) => setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
    [],
  );
  const value = useMemo(
    () => ({
      count: items.length,
      add,
      lastAdded: items.at(-1) ?? null,
      wishlist,
      toggleWishlist,
      inWishlist: (id: string) => wishlist.includes(id),
    }),
    [items, add, wishlist, toggleWishlist],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[90] flex justify-center px-4">
        {toast && (
          <p key={toast.key} className="rounded-2xl bg-ink px-5 py-3 text-sm text-white shadow-[0_16px_40px_-16px_rgba(31,31,36,0.6)] [animation:toast-in_0.35s_ease-out]">
            {toast.text}
          </p>
        )}
      </div>
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
