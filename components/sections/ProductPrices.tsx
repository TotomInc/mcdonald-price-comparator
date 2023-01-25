"use client";

import type { Product } from "@prisma/client";
import * as React from "react";
import useSWR from "swr";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { capitalizeWords } from "@/lib/utils";

type ProductPricesResponse = {
  id: number;
  price: number;
  productId: number;
  restaurantId: number;
  restaurant: {
    id: number;
    city: string;
    country: string;
    name: string;
    region: string;
    storeId: string;
    zipcode: string;
  };
}[];

// @ts-ignore
const fetcher = (...args) => fetch(...args).then((res) => res.json());

export function ProductPrices({ products }: { products: Product[] }) {
  const [selectedProductId, setSelectedProductId] = React.useState<string>("");

  const { data, isLoading } = useSWR<ProductPricesResponse>(
    `/api/public/product-prices?productId=${selectedProductId}`,
    fetcher
  );

  const sorted =
    data && data.length ? data.sort((a, b) => a.price - b.price) : [];

  return (
    <>
      <h1 className="mb-12 bg-gradient-to-r from-pink-500 via-violet-500 to-indigo-500 bg-clip-text text-center text-3xl font-bold text-transparent">
        McDonald&apos;s France Price Comparator
      </h1>

      <Select onValueChange={(value) => setSelectedProductId(value)}>
        <SelectTrigger className="max-w-[250px]">
          <SelectValue placeholder="Select a product" />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectLabel>Burgers</SelectLabel>

            {products.map((product) => (
              <SelectItem key={product.id} value={product.id.toString()}>
                {product.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {isLoading && <p className="mt-4">Loading...</p>}

      {data && sorted ? (
        <div className="mt-8">
          <div className="flex justify-between px-8 py-4">
            <p className="text-sm font-semibold">Restaurant</p>

            <p className="text-sm font-semibold">Price (in €)</p>
          </div>

          {sorted.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between space-x-4 border-t border-slate-700 py-4 px-8"
            >
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
          ))}
        </div>
      ) : null}
    </>
  );
}
