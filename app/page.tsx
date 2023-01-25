import prisma from "@/lib/prisma";

import { ProductPrices } from "@/components/sections/ProductPrices";

export default async function Home() {
  const products = await prisma.product.findMany();

  return (
    <main className="mx-auto max-w-3xl p-8">
      <ProductPrices products={products} />
    </main>
  );
}
