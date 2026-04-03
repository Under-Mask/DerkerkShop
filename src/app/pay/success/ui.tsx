"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function PaySuccessClient() {
  const sp = useSearchParams();
  const paymentKey = sp.get("paymentKey") ?? "";
  const orderId = sp.get("orderId") ?? "";
  const amount = Number(sp.get("amount") ?? "0");

  const [status, setStatus] = useState<"idle" | "confirming" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setStatus("confirming");
      setError(null);
      try {
        const res = await fetch("/api/toss/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentKey, orderId, amount }),
        });
        const text = await res.text();
        if (!res.ok) throw new Error(text || "Confirm failed");
        if (!cancelled) setStatus("done");
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Unknown error");
        setStatus("error");
      }
    }

    if (paymentKey && orderId && Number.isFinite(amount) && amount > 0) run();
    else {
      setStatus("error");
      setError("Missing payment parameters.");
    }

    return () => {
      cancelled = true;
    };
  }, [amount, orderId, paymentKey]);

  return (
    <div className="container py-14">
      <div className="mx-auto max-w-xl rounded-3xl border border-border bg-card p-8 text-center">
        <p className="text-xs tracking-[0.35em] text-white/60">SUCCESS</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">
          {status === "done" ? "Payment confirmed" : "Confirming payment..."}
        </h1>
        <p className="mt-3 text-sm text-white/70">
          주문 승인 검증(서버 Confirm)이 완료되면 주문 상태가 paid로 저장됩니다.
        </p>

        {status === "error" ? (
          <p className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-left text-xs text-red-200">
            {error}
          </p>
        ) : null}

        <div className="mt-8 flex flex-col gap-2">
          <Link href="/">
            <Button className="w-full">Back to shop</Button>
          </Link>
          <Link href="/cart">
            <Button className="w-full" variant="ghost">
              View cart
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

