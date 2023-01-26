"use client";

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
  return (
    <div className="mt-8 flex flex-col items-center justify-between space-y-4 lg:flex-row lg:items-baseline lg:space-y-0">
      <div className="flex items-center space-x-4">
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

        <p>{currentPage}</p>

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

      <div className="flex items-center">
        <p className="mr-2 whitespace-nowrap text-sm font-bold">Per page:</p>

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
    </div>
  );
}
