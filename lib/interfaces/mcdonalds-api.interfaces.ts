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

interface RestaurantAddress {
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
    pictures: {
      id: number;
      ref: string;
      label?: string;
      url: string;
      activationDate: string;
      types: string[];
    }[];
    workingHoursRef: string[];
  };
}
