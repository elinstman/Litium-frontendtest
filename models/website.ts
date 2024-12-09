import { Country } from './address';
import { Image } from './image';

export interface Website {
  homePageUrl: string;
  myPagesPageUrl: string;
  notFoundPageUrl: string;
  generalErrorPageUrl: string;
  searchResultPageUrl: string;
  checkoutPageUrl: string;
  receiptPageUrl: string;
  countries: Country[];
  filters: { field: string }[];
  imageServerUrl?: string;
  loginPageUrl: string;
  orderPageUrl: string;
  culture: {
    code: string;
  };
  texts: WebsiteText[];
  logoTypeMain: Image;
}

export interface WebsiteText {
  key: string;
  value: string;
}

export interface WebsiteText {
  key: string;
  value: string;
}
