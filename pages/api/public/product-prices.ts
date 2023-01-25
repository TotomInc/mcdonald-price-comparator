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

    const { productId } = req.query;

    if (Array.isArray(productId) || !productId) {
      return res.status(400).json({ message: "Bad request" });
    }

    const productPrices = await prisma.restaurantProduct.findMany({
      where: { product: { id: parseInt(productId, 10) } },
      include: { restaurant: true },
    });

    return res.status(200).json(productPrices);
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
}
