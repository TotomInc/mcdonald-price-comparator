"use client";

import { Input } from "@/components/ui/Input";

type ProductSearchProps = {
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  disabled: boolean;
};

export function ProductSearch({
  setSearchQuery,
  disabled,
}: ProductSearchProps) {
  return (
    <Input
      type="text"
      placeholder="Filter by restaurant"
      className="max-w-[250px]"
      onChange={(event) => setSearchQuery(event.target.value)}
      disabled={disabled}
    />
  );
}
