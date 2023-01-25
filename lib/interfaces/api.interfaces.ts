import { Picture, RestaurantAddress } from "./mcdonalds-api.interfaces";

export type BasicApiResponse =
  | {
      message: string;
    }
  | {
      error: string;
    };

export type RestaurantInfoResponse = {
  id: string;
  name: string;
  region: string;
  status: string;
  saleTypes: string[];
  address: RestaurantAddress[];
};

export type RestaurantCategoriesResponse = {
  id: string;
  ref: string;
  title: string;
  signature: boolean;
  pictures: Picture[];
}[];

export type RestaurantCategoryProductsResponse = {
  ref: string;
  name: string;
  designation: string;
  description: string;
  pictures: Picture[];
  price: number;
}[];
