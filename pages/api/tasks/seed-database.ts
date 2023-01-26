/*
  eslint
    no-await-in-loop: "off",
    no-console: "off",
    no-underscore-dangle: "off",
    @typescript-eslint/naming-convention: "off"
*/
import type { NextApiRequest, NextApiResponse } from "next";
import { performance } from "node:perf_hooks";
import consola from "consola";

import type {
  RestaurantInfoResponse,
  RestaurantCategoriesResponse,
  RestaurantCategoryProductsResponse,
} from "@/lib/interfaces/api.interfaces";
import { BASE_URL } from "@/lib/constants";
import { findBurgerCategory, getProducts } from "@/lib/seed";
import prisma from "@/lib/prisma";

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

  if (!burgerCategoryRef) {
    return consola.error(
      `Something went wrong in createRestaurantProducts, no burgerCategoryRef found for restaurantRef ${restaurantRef} or restaurantId ${restaurantId}`
    );
  }

  // Get all products for this specific restaurant.
  const storeProductsResponse = await fetch(
    `${BASE_URL}/api/restaurants/${restaurantRef}/category-products?categoryId=${burgerCategoryRef}`
  );

  if (!storeProductsResponse.ok) {
    return consola.error(
      `Something went wrong in createRestaurantProducts, /api/restaurants/${restaurantRef}/category-products?categoryId=${burgerCategoryRef} didn't returned a successful response: ${storeProductsResponse.status}`
    );
  }

  // Retrieve global products.
  const products = await getProducts();
  const storeProducts =
    (await storeProductsResponse.json()) as RestaurantCategoryProductsResponse;

  // Filter out unknown products, this is to prevent unknown products from being added
  // without being created first in the `Product` model.
  const storeProductsToCreate = storeProducts.filter((storeProduct) =>
    products.find((product) => product.ref === storeProduct.ref)
  );

  // Retrieve separately unknown products in order to notify us that they need to be created.
  const unknownStoreProducts = storeProducts.filter(
    (storeProduct) =>
      !products.find((product) => product.ref === storeProduct.ref)
  );

  if (unknownStoreProducts.length > 0) {
    consola.warn(
      `Some unknown products were found for the restaurantRef ${restaurantRef}:`,
      unknownStoreProducts.map((unknownProduct) => ({
        name: unknownProduct.name,
        ref: unknownProduct.ref,
      }))
    );
  }

  // Delete all existing restaurant products.
  await prisma.restaurantProduct.deleteMany({ where: { restaurantId } });

  const { count } = await prisma.restaurantProduct.createMany({
    data: storeProductsToCreate.map((storeProduct) => ({
      restaurantId,
      productId: products.find((p) => p.ref === storeProduct.ref)!.id,
      price: storeProduct.price,
    })),
  });

  return count;
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

    let hasCreatedCategories = true;
    let hasCreatedProducts = true;

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
        consola.success("Initial categories created");
      }

      if (!hasCreatedProducts) {
        await createProducts(restaurantRef);
        hasCreatedProducts = true;
        consola.success("Initial products created");
      }

      const count = await createRestaurantProducts(
        restaurantRef,
        restaurant.id
      );

      const stop = performance.now();
      const duration = Math.round(stop - start);

      consola.success(
        `Restaurant ref ${restaurantRef} created ${count} product(s) in ${duration}ms`
      );
    }

    consola.success(`Database successfully seeded`);

    return res.status(200).json({ message: "OK" });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ error: "Something went wrong" });
  }
}
