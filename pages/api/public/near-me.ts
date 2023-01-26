import type { NextApiRequest, NextApiResponse } from "next";

import type { WoosmapStoreGeolocResponse } from "@/lib/interfaces/mcdonalds-api.interfaces";
import type {
  BasicApiResponse,
  RestaurantsNearMeResponse as EndpointResponse,
} from "@/lib/interfaces/api.interfaces";
import { WOOSMAP_KEY, DEFAULT_HEADERS } from "@/lib/constants";
import { ratelimit } from "@/lib/upstash";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BasicApiResponse | EndpointResponse>
) {
  try {
    if (req.method !== "GET") {
      res.setHeader("Access-Control-Allow-Headers", "GET");
      return res.status(405).json({ message: "Method not allowed" });
    }

    const ratelimitResponse = await ratelimit.limit("geoloc");

    res.setHeader("X-RateLimit-Limit", ratelimitResponse.limit);
    res.setHeader("X-RateLimit-Remaining", ratelimitResponse.remaining);
    res.setHeader("X-RateLimit-Reset", ratelimitResponse.reset);

    // Block request if rate-limit is exceeded.
    if (!ratelimitResponse.success) {
      return res.status(429).json({ message: "Too many requests" });
    }

    const { lat, lng } = req.query;

    if (!lat || !lng || Array.isArray(lat) || Array.isArray(lng)) {
      return res.status(400).json({ error: "Bad request" });
    }

    const geolocResponse = await fetch(
      `https://api.woosmap.com/stores/search?key=${WOOSMAP_KEY}&lat=${lat}&lng=${lng}&max_distance=50000&stores_by_page=20&limit=20&page=1`,
      { headers: { ...DEFAULT_HEADERS } }
    );

    if (!geolocResponse.ok) {
      return res.status(500).json({
        error: `Something went wrong with Woosmap API, status-code ${geolocResponse.status}`,
      });
    }

    const json = (await geolocResponse.json()) as WoosmapStoreGeolocResponse;

    const stores: EndpointResponse["stores"] = json.features.map((store) => ({
      storeId: store.properties.store_id,
      name: store.properties.name,
      country: "FR",
      city: store.properties.address.city,
      address: store.properties.address.lines[0],
      zipcode: store.properties.address.zipcode,
      distance: store.properties.distance,
      isOpen: store.properties.open.open_now,
      coordinates: store.geometry.coordinates,
    }));

    return res.status(200).json({ stores });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
}
