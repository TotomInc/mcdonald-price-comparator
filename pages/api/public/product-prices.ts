import type { NextApiRequest, NextApiResponse } from "next";
import type { Prisma } from "@prisma/client";

import type {
  BasicApiResponse,
  ProductPricesResponse as EndpointResponse,
} from "@/lib/interfaces/api.interfaces";
import { stringSearch } from "@/lib/utils";
import { redis, ratelimit } from "@/lib/upstash";
import prisma from "@/lib/prisma";

type SortType = "asc" | "desc";

type PrismaProductPrices = Prisma.PromiseReturnType<
  typeof getPrismaProductPrices
>;

/**
 * Get product prices from Prisma. This is a separate function so that we can
 * extract its return type in `PrismaProductPrices`.
 *
 * @param productId Prisma product ID.
 * @param sortType Sort type.
 * @returns Product prices.
 */
function getPrismaProductPrices(productId: string, sortType: SortType) {
  return prisma.restaurantProduct.findMany({
    where: { product: { id: parseInt(productId, 10) } },
    include: { restaurant: true },
    orderBy: { price: sortType },
  });
}

/**
 * Get product prices from Redis. If the product prices are not in Redis, then
 * fetch them from Prisma and store them in Redis.
 *
 * @param productId Prisma product ID.
 * @param sortType Sort type.
 * @returns Product prices.
 */
async function getProductPrices(
  productId: string,
  sortType: SortType
): Promise<PrismaProductPrices> {
  const key = `product-price:${productId}:${sortType}`;
  let productPrices: PrismaProductPrices | null = await redis.get(key);

  if (!productPrices) {
    productPrices = await getPrismaProductPrices(productId, sortType);
    await redis.set(key, productPrices, { ex: 60 * 60 * 24 });
  }

  return productPrices;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BasicApiResponse | EndpointResponse>
) {
  try {
    if (req.method !== "GET") {
      res.setHeader("Access-Control-Allow-Headers", "GET");
      return res.status(405).json({ message: "Method not allowed" });
    }

    const ratelimitResponse = await ratelimit.limit("product-prices");

    res.setHeader("X-RateLimit-Limit", ratelimitResponse.limit);
    res.setHeader("X-RateLimit-Remaining", ratelimitResponse.remaining);
    res.setHeader("X-RateLimit-Reset", ratelimitResponse.reset);

    // Block request if rate-limit is exceeded.
    if (!ratelimitResponse.success) {
      return res.status(429).json({ message: "Too many requests" });
    }

    const {
      productId,
      restaurantQuery,
      zipcodes,
      take = "100",
      skip = "0",
    } = req.query;

    if (
      !productId ||
      Array.isArray(productId) ||
      Array.isArray(restaurantQuery) ||
      Array.isArray(zipcodes) ||
      Array.isArray(take) ||
      Array.isArray(skip)
    ) {
      return res.status(400).json({ message: "Bad request" });
    }

    // Load all product prices.
    const allProductPrices = await getProductPrices(productId, "asc");

    // Copy the array so that we don't mutate the original.
    // This is the array manipulated by filters and returned in the response.
    let productPrices = [...allProductPrices];

    // Filter products by restaurant zipcode.
    // This should be used to localize close restaurants after `/near-me` endpoint being called.
    if (zipcodes) {
      const codes = zipcodes.split(",");

      productPrices = productPrices.filter((productPrice) =>
        codes.includes(productPrice.restaurant.zipcode)
      );
    }

    // Filter by restaurant name, region, address, city and zipcode.
    if (restaurantQuery) {
      productPrices = productPrices.filter((productPrice) => {
        const { name, region, address, city, zipcode } =
          productPrice.restaurant;

        return (
          stringSearch(name, restaurantQuery) ||
          stringSearch(region, restaurantQuery) ||
          stringSearch(address, restaurantQuery) ||
          stringSearch(city, restaurantQuery) ||
          stringSearch(zipcode, restaurantQuery)
        );
      });
    }

    // Get the current count of product prices before mutating the array for the pagination.
    const count = productPrices.length;

    // Apply pagination filters.
    productPrices = productPrices.slice(
      parseInt(skip, 10),
      parseInt(skip, 10) + parseInt(take, 10)
    );

    return res.status(200).json({ count, products: productPrices });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
}
