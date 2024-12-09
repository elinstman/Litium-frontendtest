import { gql } from '@apollo/client';
import ProductDetail from 'components/products/ProductDetail';
import { Metadata } from 'next';
import { queryServer } from 'services/dataService.server';
import { createMetadata } from 'services/metadataService.server';

export default async function Page({ params }: { params: any }) {
  const content = await getContent({ params });
  return <ProductDetail {...content}></ProductDetail>;
}

export async function generateMetadata({
  params,
}: {
  params: any;
}): Promise<Metadata> {
  const content = await getContent({ params });
  return createMetadata(content.metadata);
}

async function getContent({ params }: { params: any }) {
  return (
    await queryServer({
      query: GET_CONTENT,
      url: params.slug?.join('/'),
    })
  ).content;
}

const GET_CONTENT = gql`
  query GetProductWithVariantsProduct {
    content {
      ...Metadata
      ...Product
      ... on ProductWithVariantsProduct {
        fields {
          brand {
            name
          }
          color {
            name
          }
          size {
            name
          }
        }
        parent {
          ... on ICategoryItem {
            name
            url
            id
          }
        }
        relationships {
          similarProducts {
            name
            items {
              nodes {
                ...ProductCard
                ...Id
              }
            }
          }
          accessory {
            name
            items {
              nodes {
                ...ProductCard
                ...Id
              }
            }
          }
        }
        rawData {
          variants {
            fields {
              color {
                name
              }
              size {
                name
              }
            }
            url
            id
          }
        }
        fieldGroups {
          fieldGroupId
          name
          fields {
            ...FieldValues
          }
        }
      }
    }
  }
`;
