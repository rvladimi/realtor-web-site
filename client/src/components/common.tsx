import { createContext } from "react";

export type DataContextType = {
  data: RealtyObject[] | null;
  setData: (data: RealtyObject[] | null) => void;
};
export const DataContext = createContext<DataContextType | null>(null);

export type MobileContextType = {
  mobile: boolean;
  setMobile: (mobile: boolean) => void;
};
export const MobileContext = createContext<MobileContextType | null>(null);

export function correspondence(realtyType: string | undefined): string {
  let typeToShow: string;
  switch (realtyType) {
    case "flat":
      typeToShow = "квартира";
      break;
    case "townhouse":
      typeToShow = "таунхаус";
      break;
    case "room":
      typeToShow = "комната";
      break;
    case "cottage":
      typeToShow = "дом";
      break;
    case "dacha":
      typeToShow = "дача";
      break;
    case "land":
      typeToShow = "участок";
      break;
    case "garage":
      typeToShow = "гараж";
      break;
    case "commercial":
      typeToShow = "коммерческая";
      break;
    default:
      typeToShow = "квартира";
  }
  return typeToShow;
}

export function detectBrowser() {
  const userAgent = navigator.userAgent.toLowerCase();

  if (userAgent.indexOf("firefox") > -1) {
    return "Firefox";
  } else if (userAgent.indexOf("chrome") > -1) {
    return "Chrome";
  } else if (userAgent.indexOf("safari") > -1) {
    return "Safari";
  } else if (userAgent.indexOf("opera") > -1 || userAgent.indexOf("opr") > -1) {
    return "Opera";
  } else if (
    userAgent.indexOf("msie") > -1 ||
    userAgent.indexOf("trident") > -1
  ) {
    return "Internet Explorer";
  } else {
    return "Unknown";
  }
}

export type RealtyType =
  | "choice"
  | "flat"
  | "room"
  | "land"
  | "garage"
  | "cottage"
  | "dacha"
  | "townhouse"
  | "commercial";

export type RealtyObject = {
  id?: string;
  type?: string; // forSale or forRent
  infoType: RealtyType; //type of a realty object
  //markerSign?: string; // one letter displayed on the pin (marker). "1" means 1-bedroom flat, "Д" - a cottage, and so on
  shortDescription?: string; // text under a card in the left menu, and also within popup, which is tied with a pin
  //infoName?: string; // header for realty object page
  infoPrice?: string;
  infoAddress?: string;
  position: [number, number]; // LatLngExpression;
  //latitude?: number;
  //longitude?: number;
  infoArea?: string;
  infoDescription?: string; // (detailed) description of a realty object on it's page
  infoDetails?: {
    // for now the info is related to the flat type objects only
    totalArea: string;
    numberOfRooms?: number;
    residentialArea?: string; // жилая площадь
    kitchenArea?: string;
    landArea?: string; // участок для таунхауса или дома
    floor?: number;
    totalFloors?: number;
  };
  images?: string[];
};
