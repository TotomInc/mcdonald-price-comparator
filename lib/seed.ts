import type { Product } from "@prisma/client";
import consola from "consola";

// ws.mcdonalds.fr burger category "ref".
let cachedBurgerCategoryRef: string | null = null;

// Cached products from database.
let cachedProducts: Product[] = [];

/**
 * Find the "ref" of the burger category.
 *
 * @returns Burger category "ref" from ws.mcdonalds.fr.
 */
export async function findBurgerCategory() {
  if (cachedBurgerCategoryRef) {
    return cachedBurgerCategoryRef;
  }

  consola.warn(
    "Initial request for findBurgerCategory, loading from database and caching for future requests"
  );

  const categories = await prisma.category.findMany();

  const burgerCategory = categories.find((category) =>
    category.name.toLowerCase().includes("burgers")
  );

  if (burgerCategory) {
    cachedBurgerCategoryRef = burgerCategory.ref;
    return cachedBurgerCategoryRef;
  }

  consola.error("Unable to find a burgerCategory in findBurgerCategory");

  return null;
}

/**
 * Retrieve all products, load from database if not cached.
 *
 * @returns Products.
 */
export async function getProducts() {
  if (cachedProducts.length > 0) {
    return cachedProducts;
  }

  consola.warn(
    "Initial request for getProducts, loading from database and caching for future requests"
  );

  cachedProducts = await prisma.product.findMany();

  return cachedProducts;
}
