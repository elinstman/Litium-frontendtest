import { gql } from '@apollo/client';
import OrderConfirmation from 'components/OrderConfirmation';
import PaymentWidget from 'components/checkout/payments/PaymentWidget';
import { Heading1 } from 'components/elements/Heading';
import { Metadata } from 'next';
import { Fragment } from 'react';
import { mutateServer, queryServer } from 'services/dataService.server';
import { createMetadataFromUrl } from 'services/metadataService.server';
import ClearCart from './ClearCart';

export default async function Page({ params }: { params: any }) {
  const result = await getReceipt();

  if (!result?.receipt) {
    return (
      <Heading1
        className="text-center"
        translationKey="orderconfirmationpage.order.notexisted"
      />
    );
  }

  await clearCart();
  if (result?.receipt?.htmlSnippet) {
    return (
      <Fragment>
        <ClearCart />
        <PaymentWidget responseString={result?.receipt?.htmlSnippet} />
      </Fragment>
    );
  }

  return (
    <div className="mx-auto w-full md:w-[30rem]">
      <ClearCart />
      <OrderConfirmation
        receipt={result?.receipt?.order}
        myPagesPageUrl={
          result.channel.website.fields.myPagesPage[0].item.url ?? '/'
        }
      />
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: any;
}): Promise<Metadata> {
  return await createMetadataFromUrl(params.slug?.join('/'));
}

async function getReceipt() {
  return await queryServer({
    query: GET_RECEIPT,
  });
}

const GET_RECEIPT = gql`
  query GetReceipt {
    channel {
      ... on DefaultChannelFieldTemplateChannel {
        id
        website {
          ... on AcceleratorWebsiteWebsite {
            id
            fields {
              myPagesPage {
                item {
                  url
                  id
                }
              }
            }
          }
        }
      }
    }
    receipt {
      order {
        customerDetails {
          email
          phone
        }
        orderNumber
        shippingAddress {
          ...OrderAddress
        }
        discountInfos {
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
      htmlSnippet
    }
  }
`;

async function clearCart() {
  await mutateServer({
    mutation: CLEAR_CART,
  });
}

const CLEAR_CART = gql`
  mutation clearCart {
    clearCart {
      cart {
        __typename
      }
    }
  }
`;
