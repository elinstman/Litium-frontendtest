import { gql } from '@apollo/client';

export const IMAGE_FRAGMENT = gql`
  fragment Image on Image {
    dimension {
      height
      width
    }
    url
  }
`;

