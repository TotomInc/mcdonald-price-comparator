import type { NextApiRequest, NextApiResponse } from "next";

type WoosmapGridData = {
  data: { [key: string]: { store_id: string } };
  grid: string[];
  keys: string[];
};

const WOOSMAP_KEY = "woos-77bec2e5-8f40-35ba-b483-67df0d5401be";

const GRIDS = [
  "6-31-23",
  "6-31-22",
  "6-31-21",
  "6-32-23",
  "6-32-22",
  "6-32-21",
  "6-33-23",
  "6-33-22",
  "6-33-21",
];

const DEFAULT_HEADERS = {
  origin: "https://www.mcdonalds.fr",
  referrer: "https://www.mcdonalds.fr/",
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    // Get Woosmap `updated` key used in future requests.
    const woosmap = await fetch(
      `https://api.woosmap.com/project/config?key=${WOOSMAP_KEY}`,
      { headers: { ...DEFAULT_HEADERS } }
    );

    if (!woosmap.ok) {
      return res
        .status(500)
        .json({ error: `Woosmap status error-code ${woosmap.status}` });
    }

    const { updated } = (await woosmap.json()) as { updated: number };

    const promises = GRIDS.map(async (grid) => {
      const response = await fetch(
        `https://api.woosmap.com/tiles/${grid}.grid.json?key=${WOOSMAP_KEY}&_${updated}`,
        { headers: { ...DEFAULT_HEADERS } }
      );

      if (!response.ok) {
        throw new Error(
          `Woosmap status error-code ${response.status} for grid ${grid}`
        );
      }

      return response.json() as Promise<WoosmapGridData>;
    });

    // Retrieve all stores from all grids, flatten the result and sort store_id by ascending order.
    const allStoresId = await Promise.all(promises).then((data) => {
      const grids = data.map((grid) => grid.data);
      const stores: string[] = [];

      grids.forEach((grid) => {
        const values = Object.values(grid);
        stores.push(...values.map((value) => value.store_id));
      });

      const sortedStores = stores.sort((a, b) =>
        a.localeCompare(b, "fr-FR", { numeric: true })
      );

      return sortedStores;
    });

    return res.status(200).json({ data: allStoresId });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
}
