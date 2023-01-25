/* eslint no-await-in-loop: "off", no-console: "off" */
import type { NextApiRequest, NextApiResponse } from "next";
import type { Product } from "@prisma/client";
import { performance } from "node:perf_hooks";

import type {
  RestaurantInfoResponse,
  RestaurantCategoriesResponse,
  RestaurantCategoryProductsResponse,
} from "@/lib/interfaces/api.interfaces";
import { BASE_URL } from "@/lib/constants";
import prisma from "@/lib/prisma";

let cachedBurgerCategoryRef: string | null = null;
let cachedProducts: Product[] = [];

async function findBurgerCategory() {
  if (cachedBurgerCategoryRef) {
    return cachedBurgerCategoryRef;
  }

  const categories = await prisma.category.findMany();

  const burgerCategory = categories.find((category) =>
    category.name.toLowerCase().includes("burgers")
  );

  if (burgerCategory) {
    cachedBurgerCategoryRef = burgerCategory.ref;
    return cachedBurgerCategoryRef;
  }

  return null;
}

async function createRestaurant(restaurantRef: string) {
  const restaurantInfo = await fetch(
    `${BASE_URL}/api/restaurants/${restaurantRef}/info`
  ).then((response) => response.json() as Promise<RestaurantInfoResponse>);

  const createdOrUpdatedRestaurant = await prisma.restaurant.upsert({
    where: { storeId: restaurantRef },
    update: {},
    create: {
      storeId: restaurantRef,
      name: restaurantInfo.name,
      country: "FR",
      region: restaurantInfo.region,
      city: restaurantInfo.address[0]?.city || "Unknown",
      address: restaurantInfo.address[0]?.address1 || "Unknown",
      zipcode: restaurantInfo.address[0]?.zipCode || "Unknown",
    },
  });

  return createdOrUpdatedRestaurant;
}

async function createCategories(restaurantRef: string) {
  const categories = await fetch(
    `${BASE_URL}/api/restaurants/${restaurantRef}/categories`
  ).then(
    (response) => response.json() as Promise<RestaurantCategoriesResponse>
  );

  // Create or update all categories.
  for (let i = 0; i < categories.length; i += 1) {
    const category = categories[i];

    await prisma.category.upsert({
      where: { ref: category.ref },
      update: { name: category.title },
      create: {
        ref: category.ref,
        name: category.title,
      },
    });
  }
}

async function createProducts(restaurantRef: string) {
  const burgerCategoryRef = await findBurgerCategory();

  if (burgerCategoryRef) {
    const products = await fetch(
      `${BASE_URL}/api/restaurants/${restaurantRef}/category-products?categoryId=${burgerCategoryRef}`
    ).then(
      (response) =>
        response.json() as Promise<RestaurantCategoryProductsResponse>
    );

    await prisma.product.deleteMany();

    await prisma.product.createMany({
      data: products.map((product) => ({
        ref: product.ref,
        name: product.name,
        designation: product.designation,
        description: "No description yet",
      })),
    });

    cachedProducts = await prisma.product.findMany();
  } else {
    throw new Error(
      "Products could not be created because no burger category was found"
    );
  }
}

async function createRestaurantProducts(
  restaurantRef: string,
  restaurantId: number
) {
  const burgerCategoryRef = await findBurgerCategory();

  if (burgerCategoryRef) {
    const products = await fetch(
      `${BASE_URL}/api/restaurants/${restaurantRef}/category-products?categoryId=${burgerCategoryRef}`
    ).then(
      (response) =>
        response.json() as Promise<RestaurantCategoryProductsResponse>
    );

    // Delete all existing restaurant products.
    await prisma.restaurantProduct.deleteMany({ where: { restaurantId } });

    await prisma.restaurantProduct.createMany({
      data: products.map((product) => ({
        restaurantId,
        productId:
          cachedProducts.find((p) => p.ref === product.ref)?.id ||
          cachedProducts[0].id,
        price: product.price,
      })),
    });
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (process.env.CAN_SEED_DATABASE !== "true") {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    let hasCreatedCategories = false;
    let hasCreatedProducts = false;

    const stores = await fetch(`${BASE_URL}/api/stores`).then(
      (response) => response.json() as Promise<{ data: string[] }>
    );

    for (let i = 0; i < stores.data.length; i += 1) {
      const start = performance.now();
      const restaurantRef = stores.data[i];

      const restaurant = await createRestaurant(restaurantRef);

      if (!hasCreatedCategories) {
        await createCategories(restaurantRef);
        hasCreatedCategories = true;
      }

      if (!hasCreatedProducts) {
        await createProducts(restaurantRef);
        hasCreatedProducts = true;
      }

      await createRestaurantProducts(restaurantRef, restaurant.id);

      const stop = performance.now();

      console.log(`Restaurant ${restaurantRef} created in ${stop - start}ms`);
    }

    return res.status(200).json({ message: "OK" });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ error: "Something went wrong" });
  }
}
