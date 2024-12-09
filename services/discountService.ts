import { DiscountInfo } from 'models/cart';
import { OrderRow } from 'models/order';
import { DiscountType } from 'utils/constants';

const hasProductDiscount = (discountTypes: string[]) => {
  return (
    discountTypes.includes(DiscountType.DiscountedProductPrice) ||
    discountTypes.includes(DiscountType.ProductDiscount)
  );
};

const hasOrderDiscount = (discountTypes: string[]) => {
  return (
    discountTypes.includes(DiscountType.BuyXGetCheapestDiscount) ||
    discountTypes.includes(DiscountType.MixAndMatch)
  );
};

/**
 * The function calculates the total discount amount
 * @param discountInfos an array of discount info.
 * @returns total discount amount
 */
export function calculateTotalDiscounts(discountInfos: DiscountInfo[]) {
  return discountInfos.reduce((accumulator, currentValue) => {
    if (currentValue?.discountType === DiscountType.FreeGift) {
      return accumulator;
    }
    return accumulator + currentValue?.resultOrderRow?.totalIncludingVat || 0;
  }, 0);
}

/**
 * The function is used to check when the original price is displayed. Only show original price when product has product discount.
 * @param discountInfos an array of discount info.
 * @returns a boolean to show/hide original price
 */
export function shouldShowOriginalPrice(discountInfos: DiscountInfo[]) {
  return (
    discountInfos.length > 0 &&
    (discountInfos[0].discountType === DiscountType.DiscountedProductPrice ||
      discountInfos[0].discountType === DiscountType.ProductDiscount)
  );
}

/**
 * Produces a map of a line item and a flag if the line item has multiple discounts applied.
 * @param productLineItems an array of product line items
 * @returns a map to get multiple discount info
 */
export function getMultipleDiscountInfoMap(productLineItems: OrderRow[]): {
  [key: string]: boolean;
} {
  let tmp: { [key: string]: boolean } = {};
  productLineItems.forEach((item) => {
    if (item.discountInfos.length <= 1) {
      tmp[item.articleNumber] = false;
    } else {
      const allDiscounts: string[] = Array.from(
        new Set(item.discountInfos.map((d: DiscountInfo) => d.discountType))
      );
      tmp[item.articleNumber] =
        hasProductDiscount(allDiscounts) && hasOrderDiscount(allDiscounts);
    }
  });
  return tmp;
}
