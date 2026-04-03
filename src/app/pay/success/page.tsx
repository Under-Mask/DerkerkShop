import { Suspense } from "react";
import PaySuccessClient from "./ui";

export default function PaySuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="container py-14">
          <div className="mx-auto max-w-xl rounded-3xl border border-border bg-card p-8 text-center">
            <p className="text-xs tracking-[0.35em] text-white/60">SUCCESS</p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight">Confirming...</h1>
          </div>
        </div>
      }
    >
      <PaySuccessClient />
    </Suspense>
  );
}

