export const WOOSMAP_KEY = "woos-77bec2e5-8f40-35ba-b483-67df0d5401be";

export const DEFAULT_HEADERS = {
  origin: "https://www.mcdonalds.fr",
  referrer: "https://www.mcdonalds.fr/",
};

export const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://mcdonald-price-comparator.vercel.app";
