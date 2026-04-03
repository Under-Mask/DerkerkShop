"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { z } from "zod";

const CartItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  price: z.number().int().nonnegative(),
  imageUrl: z.string().url().optional(),
  qty: z.number().int().positive(),
});

export type CartItem = z.infer<typeof CartItemSchema>;

const CartSchema = z.array(CartItemSchema);

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "derkerk.cart.v1";

function safeParseCart(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    const res = CartSchema.safeParse(parsed);
    return res.success ? res.data : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(safeParseCart(localStorage.getItem(STORAGE_KEY)));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, i) => sum + i.qty, 0);
    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);

    const addItem: CartContextValue["addItem"] = (item, qty = 1) => {
      setItems((prev) => {
        const next = [...prev];
        const idx = next.findIndex((x) => x.productId === item.productId);
        if (idx >= 0) {
          next[idx] = { ...next[idx], qty: next[idx].qty + qty };
          return next;
        }
        return [...next, { ...item, qty }];
      });
    };

    const setQty: CartContextValue["setQty"] = (productId, qty) => {
      if (!Number.isFinite(qty)) return;
      if (qty <= 0) {
        setItems((prev) => prev.filter((x) => x.productId !== productId));
        return;
      }
      setItems((prev) => prev.map((x) => (x.productId === productId ? { ...x, qty } : x)));
    };

    const removeItem: CartContextValue["removeItem"] = (productId) => {
      setItems((prev) => prev.filter((x) => x.productId !== productId));
    };

    const clear = () => setItems([]);

    return { items, count, subtotal, addItem, setQty, removeItem, clear };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

