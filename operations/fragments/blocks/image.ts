import { gql } from '@apollo/client';

export const IMAGE_BLOCK_FRAGMENT = gql`
  fragment ImageBlock on ImageBlock {
    fields {
      blockImagePointer {
        item(max: { height: 800, width: 1600 }) {
          ...Image
        } 
      }
    }
  } 
`;
