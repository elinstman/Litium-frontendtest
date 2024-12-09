import { OrderRow } from './order';

export interface Cart {
  discountInfos: DiscountInfo[];
  rows: OrderRow[];
  grandTotal: number;
  productCount: number;
  discountCodes: string[];
  productTotalIncludingVat: number;
  currency: {
    code: string;
  };
}

export interface DiscountInfo {
  resultOrderRow: OrderRow;
  discountType: string;
}
