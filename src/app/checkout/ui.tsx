"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { loadPaymentWidget } from "@tosspayments/payment-widget-sdk";
import { Button } from "@/components/ui/Button";
import { formatKRW } from "@/lib/utils/money";

export default function CheckoutClient() {
  const sp = useSearchParams();
  const orderId = sp.get("orderId") ?? "";
  const amount = Number(sp.get("amount") ?? "0");
  const orderName = sp.get("orderName") ?? "DERKERK Order";

  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const canPay = ready && !!widgets && !!orderId && Number.isFinite(amount) && amount > 0;

  const customerKey = useMemo(() => {
    return `anon_${orderId || "guest"}`;
  }, [orderId]);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      setError(null);
      setReady(false);
      try {
        const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
        if (!clientKey) throw new Error("Missing NEXT_PUBLIC_TOSS_CLIENT_KEY");

        const paymentWidget = await loadPaymentWidget(clientKey, customerKey);
        if (cancelled) return;

        const w = paymentWidget.renderPaymentMethods("#payment-methods", { value: amount });
        paymentWidget.renderAgreement("#agreement");

        setWidgets({ paymentWidget, w });
        setReady(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to init payment widget");
      }
    }

    if (orderId && Number.isFinite(amount) && amount > 0) init();
    return () => {
      cancelled = true;
    };
  }, [amount, customerKey, orderId]);

  async function requestPay() {
    setError(null);
    try {
      if (!widgets?.paymentWidget) throw new Error("Widget not ready");

      const base = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      await widgets.paymentWidget.requestPayment({
        orderId,
        orderName,
        successUrl: `${base}/pay/success`,
        failUrl: `${base}/pay/fail`,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Payment request failed");
    }
  }

  return (
    <div className="container py-10">
      <div className="rounded-3xl border border-border bg-card p-6">
        <p className="text-xs tracking-[0.35em] text-white/60">PAYMENT</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">Checkout</h1>
        <p className="mt-2 text-sm text-white/70">
          주문번호 <span className="text-white">{orderId}</span>
        </p>
        <p className="mt-2 text-sm text-white/70">
          결제금액 <span className="text-white">{formatKRW(amount)}</span>
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <section className="rounded-3xl border border-border bg-card p-6 lg:col-span-2">
          <div id="payment-methods" />
          <div className="mt-6" id="agreement" />
        </section>

        <aside className="rounded-3xl border border-border bg-card p-6">
          {error ? (
            <p className="rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200">
              {error}
            </p>
          ) : null}

          <Button className="mt-2 w-full" onClick={requestPay} disabled={!canPay}>
            {ready ? "Pay with Toss" : "Loading..."}
          </Button>
          <p className="mt-3 text-xs text-white/50">
            성공 페이지에서 서버 승인(Confirm) 후 Supabase에 주문 상태가 저장됩니다.
          </p>
        </aside>
      </div>
    </div>
  );
}

