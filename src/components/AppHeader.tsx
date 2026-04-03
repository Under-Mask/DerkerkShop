"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";

export function AppHeader() {
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/75 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="tracking-[0.35em] text-xs font-semibold">
          DERKERK
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link href="/" className="text-white/80 hover:text-white">
            Shop
          </Link>
          <Link href="/cart" className="text-white/80 hover:text-white">
            Cart{count > 0 ? ` (${count})` : ""}
          </Link>
        </nav>
      </div>
    </header>
  );
}

