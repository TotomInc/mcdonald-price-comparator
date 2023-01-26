import prisma from "@/lib/prisma";

import { ProductPrices } from "@/components/sections/ProductPrices";

export default async function Home() {
  const products = await prisma.product.findMany();

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="mb-12 bg-gradient-to-r from-pink-500 via-violet-500 to-indigo-500 bg-clip-text text-center text-3xl font-bold text-transparent">
        McDonald&apos;s France Price Comparator
      </h1>

      <ProductPrices products={products} />
    </main>
  );
}
