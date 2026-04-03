import Link from "next/link";
import type { Product } from "@/lib/products";
import { formatKRW } from "@/lib/utils/money";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group rounded-3xl border border-border bg-card p-5 transition-colors hover:bg-white/5"
    >
      <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-border bg-black">
        <div className="text-center">
          <p className="text-xs tracking-[0.35em] text-white/60">DERKERK</p>
          <p className="mt-2 text-lg font-semibold">{product.name}</p>
        </div>
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium">{product.name}</p>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/60">
            {product.description}
          </p>
        </div>
        <p className="text-sm font-semibold">{formatKRW(product.price)}</p>
      </div>
    </Link>
  );
}

