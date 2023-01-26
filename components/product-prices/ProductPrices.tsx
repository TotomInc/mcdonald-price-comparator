"use client";

import type { Product } from "@prisma/client";
import * as React from "react";
import useSWR from "swr";
import { useDebounce } from "use-debounce";

import type {
  ProductPricesResponse,
  RestaurantsNearMeResponse,
} from "@/lib/interfaces/api.interfaces";
import { fetcher } from "@/lib/utils";

import { ProductSelect } from "./ProductSelect";
import { ProductSearch } from "./ProductSearch";
import { ProductLocate } from "./ProductLocate";
import { ProductSkeleton } from "./ProductSkeleton";
import { ProductItem } from "./ProductItem";
import { Pagination } from "./Pagination";

export function ProductPrices({ products }: { products: Product[] }) {
  const [selectedProductId, setSelectedProductId] = React.useState<string>("");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [take, setTake] = React.useState<number>(10);
  const [skip, setSkip] = React.useState<number>(0);
  // In this order: lat, long.
  const [coords, setCoords] = React.useState<[number, number]>([0, 0]);

  const [debouncedSearchQuery] = useDebounce(searchQuery, 750);

  const { data: nearMeData, isLoading: isLoadingNearMe } =
    useSWR<RestaurantsNearMeResponse>(
      coords[0] && coords[1]
        ? `/api/public/near-me?lat=${coords[0]}&lng=${coords[1]}`
        : null,
      fetcher,
      {
        revalidateOnFocus: false,
        onSuccess: () => setSkip(0),
      }
    );

  // Compute zipcodes from near-me restaurants data. Return `undefined` when no
  // coords are set.
  const nearMeZipcodes = React.useMemo(
    () =>
      !!coords[0] && !!coords[1]
        ? nearMeData?.stores.map((store) => store.zipcode)
        : undefined,
    [nearMeData, coords]
  );

  // Can have only one parameter active: `zipcodes` or `restaurantQuery`.
  const searchQueryParam = React.useMemo(() => {
    if (nearMeZipcodes) {
      return `zipcodes=${nearMeZipcodes}`;
    }

    return `restaurantQuery=${debouncedSearchQuery}`;
  }, [nearMeZipcodes, debouncedSearchQuery]);

  const { data, isLoading } = useSWR<ProductPricesResponse>(
    selectedProductId
      ? `/api/public/product-prices?productId=${selectedProductId}&take=${take}&skip=${skip}&${searchQueryParam}`
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  // If the user selects a product, reset the skip value.
  const handleSetSelectedProductId: React.Dispatch<
    React.SetStateAction<string>
  > = (productId) => {
    setSelectedProductId(productId);
    setSkip(0);
  };

  const handleSetSearchQuery: React.Dispatch<React.SetStateAction<string>> = (
    query
  ) => {
    setSearchQuery(query);
    setSkip(0);
    setCoords([0, 0]);
  };

  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:justify-between">
        <ProductSelect
          isLoading={isLoading || isLoadingNearMe}
          products={products}
          setSelectedProductId={handleSetSelectedProductId}
        />

        <div className="mt-4 flex justify-between space-x-4 sm:mt-0">
          <ProductSearch
            setSearchQuery={handleSetSearchQuery}
            disabled={isLoading || isLoadingNearMe || !data?.products}
          />

          <ProductLocate
            setCoords={setCoords}
            disabled={isLoading || isLoadingNearMe || !data?.products}
            isActive={!!coords[0] && !!coords[1]}
          />
        </div>
      </div>

      {(isLoading || isLoadingNearMe || data?.products) && (
        <div className="mt-8">
          <div className="flex justify-between px-4 py-4 sm:px-8">
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

      <Pagination
        isLoading={isLoading || isLoadingNearMe}
        skip={skip}
        setSkip={setSkip}
        take={take}
        setTake={setTake}
        data={data}
      />
    </section>
  );
}
