"use client";

import type { Product } from "@prisma/client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

type ProductSelectProps = {
  products: Product[];
  isLoading: boolean;
  setSelectedProductId: React.Dispatch<React.SetStateAction<string>>;
};

export function ProductSelect({
  products,
  isLoading,
  setSelectedProductId,
}: ProductSelectProps) {
  return (
    <Select
      onValueChange={(value) => setSelectedProductId(value)}
      disabled={isLoading}
    >
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
  );
}
