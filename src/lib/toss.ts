import { requireTossServerEnv } from "@/lib/env";

function toBasicAuth(secretKey: string) {
  // Toss Payments: base64("{secretKey}:")
  const raw = `${secretKey}:`;
  return Buffer.from(raw).toString("base64");
}

export async function confirmTossPayment(input: {
  paymentKey: string;
  orderId: string;
  amount: number;
}) {
  const env = requireTossServerEnv();
  const auth = toBasicAuth(env.TOSS_SECRET_KEY);

  const res = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const text = await res.text();
  let json: unknown = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = text;
  }

  if (!res.ok) {
    const msg = typeof json === "object" && json && "message" in json ? (json as any).message : text;
    throw new Error(`Toss confirm failed (${res.status}): ${msg}`);
  }

  return json;
}

