import { Suspense } from "react";
import CheckoutClient from "./ui";

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="container py-10">
          <div className="rounded-3xl border border-border bg-card p-6">
            <p className="text-xs tracking-[0.35em] text-white/60">PAYMENT</p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight">Checkout</h1>
            <p className="mt-2 text-sm text-white/70">Loading...</p>
          </div>
        </div>
      }
    >
      <CheckoutClient />
    </Suspense>
  );
}

