import type { NextApiRequest, NextApiResponse } from "next";

import type {
  RestaurantCategoryProductsResponse as EndpointResponse,
  BasicApiResponse,
} from "@/lib/interfaces/api.interfaces";
import type { RestaurantCategoryProductsResponse } from "@/lib/interfaces/mcdonalds-api.interfaces";
import { DEFAULT_HEADERS } from "@/lib/constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BasicApiResponse | EndpointResponse>
) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const { id, categoryId } = req.query;

    if (Array.isArray(id) || typeof id !== "string") {
      return res.status(400).json({ error: "Invalid id" });
    }

    if (Array.isArray(categoryId) || typeof categoryId !== "string") {
      return res.status(400).json({ error: "Invalid categoryId" });
    }

    const response = await fetch(
      `https://ws.mcdonalds.fr/api/catalog/${categoryId}/products?eatType=TAKE_OUT&responseGroups=RG.PRODUCT.DEFAULT&responseGroups=RG.PRODUCT.WORKING_HOURS&responseGroups=RG.PRODUCT.PICTURES&responseGroups=RG.PRODUCT.RESTAURANT_STATUS&restaurantRef=${id}`,
      { headers: { ...DEFAULT_HEADERS } }
    );

    if (!response.ok) {
      return res.status(500).json({
        error: `ws.mcdonalds.fr status error-code ${response.status}`,
      });
    }

    const data =
      (await response.json()) as RestaurantCategoryProductsResponse[];

    const products = data.map((product) => ({
      ref: product.ref,
      name: product.label,
      designation: product.designation,
      description: product.description,
      pictures: product.pictures,
      price: product.price,
    }));

    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
}
