import { gql } from '@apollo/client';

export const CART_FRAGMENT = gql`
  fragment Cart on Cart {
    currency {
      code
    }
    discountInfos {
      discountType
      resultOrderRow {
        totalIncludingVat
      }
    }
    discountCodes
    productCount
    grandTotal
    productTotalIncludingVat
    rows {
      rowType
      rowId
      articleNumber
      quantity
      totalIncludingVat
      product {
        id
        name
        smallImages: images(max: { height: 80, width: 80 }) {
          ...Image
        }
      }
      discountInfos {
        discountType
        resultOrderRow {
          totalIncludingVat
        }
      }
    }
  }
`;
