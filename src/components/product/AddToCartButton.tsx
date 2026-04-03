"use client";

import { Button } from "@/components/ui/Button";
import type { Product } from "@/lib/products";
import { useCart } from "@/lib/cart";

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <Button
      onClick={() =>
        addItem({
          productId: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.image_url ?? undefined,
        })
      }
    >
      Add to cart
    </Button>
  );
}

