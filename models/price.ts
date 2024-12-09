export interface ProductPriceItem {
  currency: string;
  unitPriceIncludingVat: number;
  discountPriceIncludingVat: number | null;
}
