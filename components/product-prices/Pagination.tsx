"use client";

import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronFirst,
  ChevronLast,
} from "lucide-react";

import type { ProductPricesResponse } from "@/lib/interfaces/api.interfaces";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { PaginationButton } from "./PaginationButton";

type PaginationProps = {
  isLoading: boolean;
  skip: number;
  setSkip: React.Dispatch<React.SetStateAction<number>>;
  take: number;
  setTake: React.Dispatch<React.SetStateAction<number>>;
  currentPage: number;
  data: ProductPricesResponse | undefined;
};

export function Pagination({
  isLoading,
  skip,
  setSkip,
  take,
  setTake,
  currentPage,
  data,
}: PaginationProps) {
  const [count, setCount] = React.useState<number>(0);
  const [maxPage, setMaxPage] = React.useState<number>(1);

  // On data change, make sure to update the cached count and maxPage values.
  // This is done to avoid CLS issues and stale rendered values.
  React.useEffect(() => {
    if (data) {
      setCount(data.count);
      setMaxPage(Math.ceil(data.count / take));
    }
  }, [data, take]);

  return (
    <div className="mt-8 flex flex-col items-end lg:flex-row lg:items-center lg:justify-between">
      <p className="order-2 mr-auto mt-4 text-sm font-medium text-slate-300 lg:order-1 lg:mt-0 lg:mr-0">
        <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
          {count}
        </span>{" "}
        products.
      </p>

      <div className="order-1 flex flex-col items-center justify-end space-y-4 lg:order-2 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-8">
        <div className="flex items-center">
          <p className="mr-4 whitespace-nowrap text-sm font-bold">
            Rows per page:
          </p>

          <Select
            onValueChange={(value) => setTake(parseInt(value, 10))}
            defaultValue="10"
            disabled={!data || isLoading}
          >
            <SelectTrigger className="max-w-[180px]">
              <SelectValue placeholder="Select a value" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
              <SelectItem value="250">250</SelectItem>
              <SelectItem value="500">500</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-3">
          {/* Go to first page. */}
          <PaginationButton
            onClick={() => setSkip(0)}
            disabled={isLoading || skip === 0}
          >
            <ChevronFirst />
          </PaginationButton>

          {/* Go to previous page. */}
          <PaginationButton
            onClick={() => setSkip(skip - take)}
            disabled={isLoading || skip === 0}
          >
            <ChevronLeft />
          </PaginationButton>

          <p>
            {currentPage} of {maxPage}
          </p>

          {/* Go to next page. */}
          <PaginationButton
            onClick={() => setSkip(skip + take)}
            disabled={!data || isLoading || data?.count <= skip + take}
          >
            <ChevronRight />
          </PaginationButton>

          {/* Go to last page. */}
          <PaginationButton
            onClick={() => setSkip(data!.count - take)}
            disabled={!data || isLoading || data?.count <= skip + take}
          >
            <ChevronLast />
          </PaginationButton>
        </div>
      </div>
    </div>
  );
}
