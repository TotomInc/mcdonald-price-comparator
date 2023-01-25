import type { NextApiRequest, NextApiResponse } from "next";

import type { RestaurantCategoriesResponse } from "@/lib/interfaces/mcdonalds-api.interfaces";
import { DEFAULT_HEADERS } from "@/lib/constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const { id } = req.query;

    if (Array.isArray(id) || typeof id !== "string") {
      return res.status(400).json({ error: "Invalid id" });
    }

    const response = await fetch(
      `https://ws.mcdonalds.fr/api/catalog/gomcdo/firstlevel?eatType=TAKE_OUT&responseGroups=RG.CATEGORY.DEFAULT&responseGroups=RG.CATEGORY.PICTURES&restaurantRef=${id}`,
      { headers: { ...DEFAULT_HEADERS } }
    );

    if (!response.ok) {
      return res.status(500).json({
        error: `ws.mcdonalds.fr status error-code ${response.status}`,
      });
    }

    const data = (await response.json()) as RestaurantCategoriesResponse;

    const categories = Object.entries(data).map(([key, value]) => ({
      id: key,
      ref: value.ref,
      title: value.title,
      signature: value.signature,
      pictures: value.pictures,
    }));

    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
}
