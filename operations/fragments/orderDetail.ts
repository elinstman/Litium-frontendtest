import { gql } from '@apollo/client';

export const ORDER_DETAIL_FRAGMENT = gql`
  fragment OrderDetail on Order {
    id
    orderDate
    totalFeesIncludingVat
    totalPromotionsAndDiscountsIncludingVat
    shippingCostIncludingVat
    productTotalIncludingVat
    tags
    currency {
      code
    }
    orderNumber
    shippingAddress {
      ...OrderAddress
    }
    discountInfos {
      discountType
      resultOrderRow {
        totalIncludingVat
      }
    }
    grandTotal
    totalVat
    rows {
      rowType
      rowId
      articleNumber
      quantity
      totalIncludingVat
      product {
        ... on IContentItem {
          id
          url
        }
        ... on IProductItem {
          name
          smallImages: images(max: { height: 80, width: 80 }) {
            ...Image
          }
        }
      }
      discountInfos {
        discountType
        resultOrderRow {
          totalIncludingVat
        }
      }
    }
    status
  }
`;
