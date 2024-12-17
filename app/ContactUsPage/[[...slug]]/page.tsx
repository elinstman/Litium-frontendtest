import { gql } from '@apollo/client';
import BlockContainer from 'components/blocks/BlockContainer';
import { Metadata } from 'next';
import { queryServer } from 'services/dataService.server';
import { createMetadata } from 'services/metadataService.server';

export default async function Page({ params }: { params: any }) {
  const content = await getContent({ params });
  console.log('content in contact us page - main ', content.blocks.main);
  return (
    <BlockContainer
      priority
      blocks={content.blocks.main}
      className="mb-4"
    ></BlockContainer>
  );
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
  console.log('params in contact us page', params);
  return (
    await queryServer({
      query: GET_CONTENT,
      url: params.slug?.join('/') ?? '/',
    })
  ).content;
}

const GET_CONTENT = gql`
  query GetContactUsPage {
    content {
      ... on ContactUsPage {
        ...Metadata
        id
        fields {
          editor
        }
        blocks {
          main {
            ...AllBlockTypes
          }
        }
      }
    }
  }
`;
