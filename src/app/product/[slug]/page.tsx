import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import { formatKRW } from "@/lib/utils/money";
import { AddToCartButton } from "@/components/product/AddToCartButton";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return notFound();

  return (
    <div className="container py-10">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-6">
          <div className="flex aspect-square items-center justify-center rounded-2xl border border-border bg-black">
            <div className="text-center">
              <p className="text-xs tracking-[0.35em] text-white/60">DERKERK</p>
              <p className="mt-2 text-2xl font-semibold">{product.name}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6">
          <p className="text-xs tracking-[0.35em] text-white/60">PRODUCT</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">{product.name}</h1>
          <p className="mt-4 text-sm leading-7 text-white/70">{product.description}</p>

          <div className="mt-8 flex items-center justify-between gap-4">
            <p className="text-xl font-semibold">{formatKRW(product.price)}</p>
            <AddToCartButton product={product} />
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 text-xs text-white/60">
            <div className="rounded-2xl border border-border p-4">
              <p className="text-white/80">Shipping</p>
              <p className="mt-2">KR only · 1–3 days</p>
            </div>
            <div className="rounded-2xl border border-border p-4">
              <p className="text-white/80">Returns</p>
              <p className="mt-2">7 days · unused</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

