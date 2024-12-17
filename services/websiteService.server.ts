import { gql } from '@apollo/client';
import { Website } from 'models/website';
import 'server-only';
import { queryServer } from './dataService.server';

/**
 * Gets current website configuration.
 * @param contextPath an optional relative context path to override the default one.
 * @returns website configuration object.
 */
export async function get(contextPath?: string): Promise<Website> {
  const content = await queryServer({
    query: GET_WEBSITE,
    url: contextPath,
    fetchPolicy: "no-cache",
  });
  const { channel } = content;
  return {
    homePageUrl: channel.url ?? '',
    myPagesPageUrl: channel.website.fields.myPagesPage[0]?.item?.url ?? '',
    searchResultPageUrl:
      channel.website.fields.searchResultPage[0]?.item?.url ?? '',
    checkoutPageUrl: channel.website.fields.checkoutPage[0]?.item?.url ?? '',
    receiptPageUrl:
      channel.website.fields.orderConfirmationPage[0]?.item?.url ?? '',
    notFoundPageUrl: channel.website.fields.pageNotFound[0]?.item?.url ?? '',
    generalErrorPageUrl:
      channel.website.fields.generalError[0]?.item?.url ?? '',
    countries: channel.deliveryCountries,
    filters: channel.website.fields.productFilterFields,
    imageServerUrl:
      process.env.RUNTIME_IMAGE_SERVER_URL ??
      process.env.RUNTIME_LITIUM_SERVER_URL ??
      '',
    loginPageUrl: channel.website.fields.loginPage[0]?.item?.url ?? '',
    orderPageUrl: channel.website.fields.orderPage[0]?.item?.url ?? '',
    culture: channel.culture,
    texts: channel.website.texts,
    logoTypeMain: channel.website.fields.logotypeMain?.item,
  };
}

export const GET_WEBSITE = gql`
  query GetWebsite {
    channel {
      ... on DefaultChannelFieldTemplateChannel {
        id
        url
        culture {
          code
        } 
        website {
          ... on AcceleratorWebsiteWebsite {
            id
            texts {
              key
              value
            }
            fields {
              logotypeMain {
                item(max: { height: 60, width: 244 }) {
                  ...Image
                }
              }
              loginPage {
                item {
                  id
                  url
                }
              }
              myPagesPage {
                item {
                  id
                  url
                }
              }
              pageNotFound {
                item {
                  id
                  url
                }
              }
              generalError {
                item {
                  url
                  id
                }
              }
              searchResultPage {
                item {
                  id
                  url
                }
              }
              checkoutPage {
                item {
                  id
                  url
                }
              }
              orderConfirmationPage {
                item {
                  id
                  url
                }
              }
              orderPage {
                item {
                  id
                  url
                }
              }
              productFilterFields {
                field
              }
            }
          }
        }
        deliveryCountries {
          code
          name
        }
      }
    }
  }
`;
