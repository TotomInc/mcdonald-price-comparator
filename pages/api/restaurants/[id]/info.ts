import type { NextApiRequest, NextApiResponse } from "next";

import type { RestaurantInfoResponse } from "@/lib/interfaces/mcdonalds-api.interfaces";
import type {
  RestaurantInfoResponse as EndpointResponse,
  BasicApiResponse,
} from "@/lib/interfaces/api.interfaces";
import { DEFAULT_HEADERS } from "@/lib/constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BasicApiResponse | EndpointResponse>
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
      `https://ws.mcdonalds.fr/api/restaurant/${id}?responseGroups=RG.RESTAURANT.FACILITIES`,
      { headers: { ...DEFAULT_HEADERS } }
    );

    if (!response.ok) {
      return res.status(500).json({
        error: `ws.mcdonalds.fr status error-code ${response.status}`,
      });
    }

    const data = (await response.json()) as RestaurantInfoResponse;

    return res.status(200).json({
      id: data.ref,
      name: data.name,
      region: data.region,
      status: data.status,
      saleTypes: data.saleTypes,
      address: data.restaurantAddress,
    });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
}
