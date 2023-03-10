interface Coordinates {
  latitude: number;
  longitude: number;
}

interface StoreConcept {
  ref: string;
  label: string;
  description: string;
  conceptType: ConceptType;
}

interface ConceptType {
  ref: string;
  label: string;
  description: string;
}

export interface RestaurantAddress {
  address1: string;
  zipCode: string;
  city: string;
  country: string;
  label: string;
  addressType: string;
  id: number;
  type: string;
}

interface Facility {
  ref: string;
  facilityTypes: string[];
  label: string;
  description: string;
  timeRequired: boolean;
  customerDisplayable: boolean;
  filterStoreLocator: boolean;
  openingHours: OpeningHour[];
  status: boolean;
  position?: number;
  openedNow: boolean;
  childFacilitiesRefs: string[];
  parentFacilitiesRefs: string[];
  activationDate?: string;
}

interface OpeningHour {
  day: number;
  beginHour: string;
  endHour: string;
  active: boolean;
  slotDetails: SlotDetail[];
  exceptionalDay: boolean;
}

interface SlotDetail {
  beginHour: string;
  endHour: string;
}

interface OpeningHour2 {
  day: number;
  beginHour: string;
  endHour: string;
  active: boolean;
  slotDetails: SlotDetail2[];
  exceptionalDay: boolean;
}

interface SlotDetail2 {
  beginHour: string;
  endHour: string;
}

export interface Picture {
  id: number;
  ref: string;
  label?: string;
  url: string;
  activationDate: string;
  types: string[];
}

export interface RestaurantInfoResponse {
  name: string;
  phone: string;
  fax: string;
  companyName: string;
  coordinates: Coordinates;
  region: string;
  storeConcepts: StoreConcept[];
  openDate: string;
  closeDate: string;
  status: string;
  originals: boolean;
  cashRegisterType: string;
  kioskType: string;
  email: string;
  saleTypes: string[];
  ref: string;
  nationalPromotionOptin: boolean;
  restaurantAddress: RestaurantAddress[];
  facilities: Facility[];
  openingHours: OpeningHour2[];
  donationOptin: boolean;
  selectiveSorting: boolean;
  actualMaxAmountCAndC: number;
  actualMaxAmountMcDelivery: number;
}

export interface RestaurantCategoriesResponse {
  [key: string]: {
    ref: string;
    title: string;
    description: string;
    signature: boolean;
    pictures: Picture[];
    workingHoursRef: string[];
  };
}

export interface RestaurantCategoryProductsResponse {
  type: string;
  ref: string;
  label: string;
  designation: string;
  description: string;
  marketingGroup: string;
  pictures: Picture[];
  available: boolean;
  eligible: boolean;
  price: number;
  foodType: string;
  soda: boolean;
  orderableToZero: boolean;
  delivery: boolean;
  nutriscore: string;
  specificNutritionalCalculation: boolean;
  workingHoursRefs: string[];
  loyaltyMarketingGroup: string;
  permanent: boolean;
  canAdd: boolean;
  cgi: boolean;
}

export interface WoosmapStoreGeolocResponse {
  type: "FeatureCollection";
  pagination: {
    page: number;
    pageCount: number;
  };
  features: {
    type: "Feature";
    properties: {
      store_id: string;
      name: string;
      contact: {
        email: string | null;
        phone: string | null;
        website: string;
      };
      address: {
        lines: string[];
        country_code: string;
        city: string;
        zipcode: string;
      };
      user_properties: {
        [key: string]: string;
      };
      tags: string[];
      types: string[];
      last_updated: Date;
      distance: number;
      open: {
        open_now: boolean;
        open_hours: {
          end: string;
          start: string;
        }[];
        week_day: number;
        current_slice: {
          end: string;
          start: string;
        };
      };
      weekly_opening: any;
      opening_hours: any;
    };
    geometry: {
      type: "Point";
      coordinates: [number, number];
    };
  }[];
}
