import { gql } from '@apollo/client';
import { BANNER_BLOCK_FRAGMENT } from './banner';
import { IMAGE_BLOCK_FRAGMENT } from './image';
import { PRODUCTS_BLOCK_FRAGMENT } from './product';
import { TEXT_BLOCK_FRAGMENT } from './text';
import { TWO_COLUMNS_FRAGMENT } from './twoColumns';

export const ALL_BLOCK_TYPES_FRAGMENT = gql`
  fragment AllBlockTypes on IBlock {
    __typename
    ... on IBlockItem {
      systemId
    }

    ...BannerBlock
    ...ProductsBlock
    ...TextBlock
    ...TwoColumnsBlock
    ...ImageBlock
  }

  ${PRODUCTS_BLOCK_FRAGMENT}
   ${TEXT_BLOCK_FRAGMENT}
   ${TWO_COLUMNS_FRAGMENT}
   ${IMAGE_BLOCK_FRAGMENT}
   ${BANNER_BLOCK_FRAGMENT}
`;
