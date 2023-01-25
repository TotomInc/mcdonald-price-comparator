"use client";

import type { Product } from "@prisma/client";
import * as React from "react";
import useSWR from "swr";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

// @ts-ignore
const fetcher = (...args) => fetch(...args).then((res) => res.json());

export function ProductPrices({ products }: { products: Product[] }) {
  const [selectedProductId, setSelectedProductId] = React.useState<string>("");

  const { data, isLoading } = useSWR(
    `/api/public/product-prices?productId=${selectedProductId}`,
    fetcher
  );

  const sorted =
    data && data.length ? data.sort((a, b) => a.price - b.price) : [];

  return (
    <>
      <h1 className="mb-12 text-center text-3xl font-bold">Price Comparator</h1>

      <Select onValueChange={(value) => setSelectedProductId(value)}>
        <SelectTrigger className="w-[250px]">
          <SelectValue placeholder="Select a product" />
        </SelectTrigger>

        <SelectContent>
          {products.map((product) => (
            <SelectItem key={product.id} value={product.id.toString()}>
              {product.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isLoading && <p className="mt-4">Loading...</p>}

      {data && sorted ? (
        <div className="mt-8">
          {sorted.map((product) => (
            <div
              key={product.id}
              className="flex space-x-4 border-t border-slate-700 py-4 px-4 font-mono"
            >
              <p>
                {new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                }).format(product.price / 100)}
              </p>

              <p>{product.restaurant.name}</p>

              <p>{product.restaurant.city}</p>

              <p>{product.restaurant.region}</p>
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
}
