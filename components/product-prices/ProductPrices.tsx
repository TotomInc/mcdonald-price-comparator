"use client";

import type { Product } from "@prisma/client";
import * as React from "react";
import useSWR from "swr";

import type { ProductPricesResponse } from "@/lib/interfaces/api.interfaces";
import { fetcher } from "@/lib/utils";

import { ProductSelect } from "./ProductSelect";
import { Pagination } from "./Pagination";
import { ProductSkeleton } from "./ProductSkeleton";
import { ProductItem } from "./ProductItem";

export function ProductPrices({ products }: { products: Product[] }) {
  const [selectedProductId, setSelectedProductId] = React.useState<string>("");
  const [take, setTake] = React.useState<number>(10);
  const [skip, setSkip] = React.useState<number>(0);

  const { data, isLoading } = useSWR<ProductPricesResponse>(
    selectedProductId
      ? `/api/public/product-prices?productId=${selectedProductId}&take=${take}&skip=${skip}`
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const currentPage = Math.floor(skip / take) + 1;

  // If the user selects a product, reset the skip value.
  const handleSetSelectedProductId: React.Dispatch<
    React.SetStateAction<string>
  > = (productId) => {
    setSelectedProductId(productId);
    setSkip(0);
  };

  return (
    <section>
      <ProductSelect
        isLoading={isLoading}
        products={products}
        setSelectedProductId={handleSetSelectedProductId}
      />

      <Pagination
        isLoading={isLoading}
        skip={skip}
        setSkip={setSkip}
        take={take}
        setTake={setTake}
        currentPage={currentPage}
        data={data}
      />

      {(isLoading || data?.products) && (
        <div className="mt-8">
          <div className="flex justify-between px-8 py-4">
            <p className="text-sm font-semibold">Restaurant</p>

            <p className="text-sm font-semibold">Price (in €)</p>
          </div>

          {isLoading &&
            [...Array(10)].map((_, index) => (
              <ProductSkeleton key={`skeleton-${index}`} />
            ))}

          {!isLoading &&
            data?.products &&
            data?.products.map((product) => (
              <ProductItem key={product.id} product={product} />
            ))}
        </div>
      )}

      {data && data.count !== undefined && (
        <p className="mt-4 px-8 text-sm font-medium text-slate-300">
          <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
            {data.count}
          </span>{" "}
          products.
        </p>
      )}
    </section>
  );
}
