import { describe, expect, test } from '@jest/globals';
import { generateCartLineItemData } from '__mock__/generateMockData';
import { DiscountInfo } from 'models/cart';
import {
  calculateTotalDiscounts,
  getMultipleDiscountInfoMap,
  shouldShowOriginalPrice,
} from './discountService';

describe('calculateTotalDiscounts function', () => {
  test('Should return correct the number of total discount', () => {
    const discountInfos: DiscountInfo[] = [
      {
        discountType: 'DiscountedProductPrice',
        resultOrderRow: {
          totalIncludingVat: -450,
          rowType: 'DISCOUNT',
          articleNumber: 'abc-xyz-0',
          quantity: 1,
          rowId: '0',
          discountInfos: [],
        },
      },
      {
        discountType: 'MixAndMatch',
        resultOrderRow: {
          totalIncludingVat: -100,
          rowType: 'DISCOUNT',
          articleNumber: 'abc-xyz-0',
          quantity: 1,
          rowId: '0',
          discountInfos: [],
        },
      },
    ];
    expect(calculateTotalDiscounts(discountInfos)).toBe(-550);
  });
  test('Should return zero with empty data', () => {
    const discountInfos: DiscountInfo[] = [];
    expect(calculateTotalDiscounts(discountInfos)).toBe(0);
  });
});

describe('shouldShowOriginalPrice function', () => {
  describe('Should return true when product has product discount', () => {
    test('with DiscountedProductPrice type', () => {
      const discountInfos: DiscountInfo[] = [
        {
          discountType: 'DiscountedProductPrice',
          resultOrderRow: {
            totalIncludingVat: -450,
            rowType: 'DISCOUNT',
            articleNumber: 'abc-xyz-0',
            quantity: 1,
            rowId: '0',
            discountInfos: [],
          },
        },
        {
          discountType: 'MixAndMatch',
          resultOrderRow: {
            totalIncludingVat: -100,
            rowType: 'DISCOUNT',
            articleNumber: 'abc-xyz-0',
            quantity: 1,
            rowId: '0',
            discountInfos: [],
          },
        },
      ];
      expect(shouldShowOriginalPrice(discountInfos)).toBe(true);
    });

    test('with ProductDiscount type', () => {
      const discountInfos: DiscountInfo[] = [
        {
          discountType: 'ProductDiscount',
          resultOrderRow: {
            totalIncludingVat: -450,
            rowType: 'DISCOUNT',
            articleNumber: 'abc-xyz-0',
            quantity: 1,
            rowId: '0',
            discountInfos: [],
          },
        },
      ];
      expect(shouldShowOriginalPrice(discountInfos)).toBe(true);
    });
  });
  test('Should return false when product has not product discount', () => {
    const discountInfos: DiscountInfo[] = [
      {
        discountType: 'MixAndMatch',
        resultOrderRow: {
          totalIncludingVat: -100,
          rowType: 'DISCOUNT',
          articleNumber: 'abc-xyz-0',
          quantity: 1,
          rowId: '0',
          discountInfos: [],
        },
      },
    ];
    expect(shouldShowOriginalPrice(discountInfos)).toBe(false);
  });
});

describe('getMultipleDiscountInfoMap function', () => {
  test('Should return a map of a line item with "true" value when the line item has multiple discounts applied', () => {
    const productLineItems = generateCartLineItemData(1, 10, 2, true).rows;
    expect(getMultipleDiscountInfoMap(productLineItems)).toStrictEqual({
      'abc-xyz-0': true,
    });
  });
  test('Should return a map of a line item with "false" value when the line item has not multiple discounts applied', () => {
    const productLineItems = generateCartLineItemData(1, 10, 2, false).rows;
    expect(getMultipleDiscountInfoMap(productLineItems)).toStrictEqual({
      'abc-xyz-0': false,
    });
  });
});
