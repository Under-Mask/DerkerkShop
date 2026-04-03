import Link from "next/link";
import { listProducts } from "@/lib/products";
import { formatKRW } from "@/lib/utils/money";
import { ProductCard } from "@/components/ProductCard";

export default function Home() {
  const productsPromise = listProducts();
  return (
    <div className="container py-10">
      <section className="rounded-3xl border border-border bg-card p-8 sm:p-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="text-xs tracking-[0.35em] text-white/60">BLACK / WHITE</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Minimal commerce, maximal finish.
            </h1>
            <p className="mt-4 text-sm leading-7 text-white/70">
              Supabase에 상품을 저장하고, 장바구니로 담아 토스 결제로 결제 승인까지 이어집니다.
            </p>
          </div>
          <div className="text-sm text-white/70">
            <p className="text-xs">From</p>
            <p className="mt-1 text-lg font-semibold text-white">
              {formatKRW(22000)}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-end justify-between gap-6">
          <h2 className="text-lg font-semibold tracking-tight">New in</h2>
          <Link href="/cart" className="text-sm text-white/70 hover:text-white">
            Go to cart →
          </Link>
        </div>

        <ProductGrid productsPromise={productsPromise} />
      </section>
    </div>
  );
}

async function ProductGrid({ productsPromise }: { productsPromise: ReturnType<typeof listProducts> }) {
  const products = await productsPromise;
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <ProductCard key={p.slug} product={p} />
      ))}
    </div>
  );
}
