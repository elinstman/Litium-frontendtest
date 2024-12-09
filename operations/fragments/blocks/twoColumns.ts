import { gql } from '@apollo/client';
import { IMAGE_BLOCK_FRAGMENT } from './image';
import { TEXT_BLOCK_FRAGMENT } from './text';

export const TWO_COLUMNS_FRAGMENT = gql`
  fragment TwoColumnsBlock on TwoColumnsBlock {
    children {
      ... on IBlockItem {
        systemId
      }
      ...TextBlock
      ...ImageBlock
    }
  }
  ${TEXT_BLOCK_FRAGMENT}
  ${IMAGE_BLOCK_FRAGMENT}
`;

