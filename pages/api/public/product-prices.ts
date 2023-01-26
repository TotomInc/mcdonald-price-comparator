import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const { productId, take = "100", skip = "0" } = req.query;

    if (
      Array.isArray(productId) ||
      !productId ||
      Array.isArray(take) ||
      Array.isArray(skip)
    ) {
      return res.status(400).json({ message: "Bad request" });
    }

    const productPrices = await prisma.restaurantProduct.findMany({
      where: { product: { id: parseInt(productId, 10) } },
      include: { restaurant: true },
      take: parseInt(take, 10),
      skip: parseInt(skip, 10),
      orderBy: { price: "asc" },
    });

    const count = await prisma.restaurantProduct.count({
      where: { product: { id: parseInt(productId, 10) } },
    });

    return res.status(200).json({ count, products: productPrices });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
}
