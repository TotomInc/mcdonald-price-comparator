import prisma from "@/lib/prisma";

import { ProductPrices } from "@/components/product-prices/ProductPrices";

export default async function Home() {
  const products = await prisma.product.findMany();

  return (
    <main className="mx-auto max-w-3xl px-8 py-12">
      <h1 className="mb-6 text-center text-3xl font-bold tracking-tight text-slate-100 lg:text-4xl">
        <span className="bg-gradient-to-r from-pink-500 via-violet-500 to-indigo-500 bg-clip-text text-transparent">
          McDonald&apos;s
        </span>{" "}
        France Price Comparator
      </h1>

      <p className="mb-8 text-center text-lg font-medium text-slate-300">
        Find out which McDonald&apos;s restaurant in France has the best prices.
      </p>

      <p className="mb-8 text-sm font-medium text-slate-500">
        <span className="bg-gradient-to-r from-pink-500 via-violet-500 to-indigo-500 bg-clip-text text-transparent">
          Tip
        </span>
        : find the cheapest nearby McDonald&apos;s restaurant by using the
        geolocation button.
      </p>

      <ProductPrices products={products} />
    </main>
  );
}
