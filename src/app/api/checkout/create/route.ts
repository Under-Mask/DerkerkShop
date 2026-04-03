import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseAdmin } from "@/lib/supabase/server";

const CartItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  price: z.number().int().nonnegative(),
  imageUrl: z.string().url().optional(),
  qty: z.number().int().positive(),
});

const BodySchema = z.object({
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(1).optional(),
  items: z.array(CartItemSchema).min(1),
});

function makeOrderId() {
  // public id; doesn't leak UUID and is safe for redirects
  return `dk_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const body = parsed.data;
  const amount = body.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const orderId = makeOrderId();

  const supabase = createSupabaseAdmin();
  const { data: orderRow, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_id: orderId,
      customer_name: body.customerName,
      customer_email: body.customerEmail,
      customer_phone: body.customerPhone ?? null,
      amount,
      status: "pending",
      payment_provider: "toss",
      raw: { items: body.items },
    })
    .select("id")
    .single();

  if (orderError || !orderRow) {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    body.items.map((i) => ({
      order_id: orderRow.id,
      product_id: i.productId.startsWith("fallback-") ? null : i.productId,
      name: i.name,
      price: i.price,
      qty: i.qty,
    })),
  );

  if (itemsError) {
    await supabase.from("orders").delete().eq("id", orderRow.id);
    return NextResponse.json({ error: "Failed to create order items" }, { status: 500 });
  }

  return NextResponse.json({ orderId, amount });
}

