import { NextResponse } from "next/server";
import { z } from "zod";
import { confirmTossPayment } from "@/lib/toss";
import { createSupabaseAdmin } from "@/lib/supabase/server";

const BodySchema = z.object({
  paymentKey: z.string().min(1),
  orderId: z.string().min(1),
  amount: z.number().int().positive(),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const { paymentKey, orderId, amount } = parsed.data;

  const supabase = createSupabaseAdmin();
  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .select("id, amount, status")
    .eq("order_id", orderId)
    .maybeSingle();

  if (orderErr || !order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  if (order.amount !== amount) {
    return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
  }

  const confirm = await confirmTossPayment({ paymentKey, orderId, amount }).catch((e) => {
    return { __error: e instanceof Error ? e.message : "confirm failed" } as const;
  });

  if (typeof confirm === "object" && confirm && "__error" in confirm) {
    await supabase
      .from("orders")
      .update({ status: "failed", payment_key: paymentKey, raw: { error: (confirm as any).__error } })
      .eq("id", order.id);
    return NextResponse.json({ error: (confirm as any).__error }, { status: 502 });
  }

  await supabase
    .from("orders")
    .update({ status: "paid", payment_key: paymentKey, raw: confirm })
    .eq("id", order.id);

  return NextResponse.json({ ok: true });
}

