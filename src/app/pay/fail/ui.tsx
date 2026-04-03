"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function PayFailClient() {
  const sp = useSearchParams();
  const code = sp.get("code");
  const message = sp.get("message");
  const orderId = sp.get("orderId");

  return (
    <div className="container py-14">
      <div className="mx-auto max-w-xl rounded-3xl border border-border bg-card p-8 text-center">
        <p className="text-xs tracking-[0.35em] text-white/60">FAILED</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">Payment failed</h1>
        <p className="mt-3 text-sm text-white/70">
          결제가 완료되지 않았습니다. 다시 시도하거나 장바구니로 돌아가세요.
        </p>

        <div className="mt-6 rounded-2xl border border-border p-4 text-left text-xs text-white/70">
          <p>
            <span className="text-white/50">orderId</span> {orderId ?? "-"}
          </p>
          <p className="mt-2">
            <span className="text-white/50">code</span> {code ?? "-"}
          </p>
          <p className="mt-2">
            <span className="text-white/50">message</span> {message ?? "-"}
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <Link href="/cart">
            <Button className="w-full">Back to cart</Button>
          </Link>
          <Link href="/">
            <Button className="w-full" variant="ghost">
              Back to shop
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

