"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useCart } from "@/lib/cart";
import { formatKRW } from "@/lib/utils/money";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function CartPage() {
  const cart = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canCheckout = cart.items.length > 0 && !loading;

  const orderName = useMemo(() => {
    if (cart.items.length === 0) return "DERKERK Order";
    if (cart.items.length === 1) return cart.items[0].name;
    return `${cart.items[0].name} 외 ${cart.items.length - 1}개`;
  }, [cart.items]);

  async function startCheckout(formData: FormData) {
    setError(null);
    setLoading(true);
    try {
      const customerName = String(formData.get("customerName") ?? "").trim();
      const customerEmail = String(formData.get("customerEmail") ?? "").trim();
      const customerPhone = String(formData.get("customerPhone") ?? "").trim();

      const res = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone: customerPhone || undefined,
          items: cart.items,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Checkout create failed");
      }

      const data: { orderId: string; amount: number } = await res.json();
      const qs = new URLSearchParams({
        orderId: data.orderId,
        amount: String(data.amount),
        orderName,
      });
      window.location.href = `/checkout?${qs.toString()}`;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container py-10">
      <div className="flex items-end justify-between gap-6">
        <h1 className="text-2xl font-semibold tracking-tight">Cart</h1>
        <Link href="/" className="text-sm text-white/70 hover:text-white">
          Continue shopping →
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <section className="rounded-3xl border border-border bg-card p-6 lg:col-span-2">
          {cart.items.length === 0 ? (
            <p className="text-sm text-white/70">Your cart is empty.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {cart.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-border p-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{item.name}</p>
                    <p className="mt-1 text-xs text-white/60">
                      {formatKRW(item.price)} · {item.qty}개
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => cart.setQty(item.productId, item.qty - 1)}
                    >
                      −
                    </Button>
                    <div className="w-10 text-center text-sm">{item.qty}</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => cart.setQty(item.productId, item.qty + 1)}
                    >
                      +
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => cart.removeItem(item.productId)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <aside className="rounded-3xl border border-border bg-card p-6">
          <p className="text-xs tracking-[0.35em] text-white/60">CHECKOUT</p>
          <p className="mt-3 text-sm text-white/70">Subtotal</p>
          <p className="mt-1 text-2xl font-semibold">{formatKRW(cart.subtotal)}</p>

          <form
            className="mt-6 flex flex-col gap-3"
            action={(fd) => startCheckout(fd)}
          >
            <Input name="customerName" placeholder="이름" required />
            <Input name="customerEmail" placeholder="이메일" type="email" required />
            <Input name="customerPhone" placeholder="휴대폰 (선택)" />

            {error ? (
              <p className="rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200">
                {error}
              </p>
            ) : null}

            <Button type="submit" disabled={!canCheckout}>
              {loading ? "Preparing..." : "Proceed to payment"}
            </Button>
            <p className="text-xs text-white/50">
              결제는 토스페이먼츠로 진행되며, 승인 결과는 서버에서 검증 후 주문이 저장됩니다.
            </p>
          </form>
        </aside>
      </div>
    </div>
  );
}

