"use client";

import type { ProductPricesResponse } from "@/lib/interfaces/api.interfaces";
import { capitalizeWords } from "@/lib/utils";

export function ProductItem({
  product,
}: {
  product: ProductPricesResponse["products"][0];
}) {
  return (
    <div className="flex items-center justify-between space-x-4 border-t border-slate-700 py-4 px-8">
      <div className="flex flex-col">
        <p className="font-medium">
          {capitalizeWords(product.restaurant.name)}
        </p>

        <p className="text-sm text-slate-400">
          {capitalizeWords(product.restaurant.city)}&nbsp;
          <span>({capitalizeWords(product.restaurant.region)})</span>
        </p>
      </div>

      <p className="text-lg font-medium">
        {new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "EUR",
        }).format(product.price / 100)}
      </p>
    </div>
  );
}
