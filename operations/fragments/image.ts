import { gql } from '@apollo/client';

export const IMAGE_FRAGMENT = gql`
  fragment Image on ImageItem {
    dimension {
      height
      width
    }
    url
  }
`;
