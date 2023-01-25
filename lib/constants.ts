export const DEFAULT_HEADERS = {
  origin: "https://www.mcdonalds.fr",
  referrer: "https://www.mcdonalds.fr/",
};

export const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://mcdonald-price-comparator.vercel.app";
