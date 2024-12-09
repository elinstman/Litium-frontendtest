
import BannerBlock from 'components/blocks/BannerBlock';
import BlockTemplateBlock from 'components/blocks/BlockTemplateBlock';
import FooterColumnBlock from 'components/blocks/FooterColumnBlock';
import ImageBlock from 'components/blocks/ImageBlock';
import NavigationLinksBlock from 'components/blocks/NavigationLinksBlock';
import OrganizationBlock from 'components/blocks/OrganizationBlock';
import PrimaryNavigationBannerBlock from 'components/blocks/PrimaryNavigationBannerBlock';
import PrimaryNavigationCategoriesBlock from 'components/blocks/PrimaryNavigationCategoriesBlock';
import PrimaryNavigationColumnBlock from 'components/blocks/PrimaryNavigationColumnBlock';
import PrimaryNavigationLinkBlock from 'components/blocks/PrimaryNavigationLinkBlock';
import ProductsBlock from 'components/blocks/ProductsBlock';
import SecondaryNavigationLinkBlock from 'components/blocks/SecondaryNavigationLinkBlock';
import TextBlock from 'components/blocks/TextBlock';
import TwoColumnsBlock from 'components/blocks/TwoColumnsBlock';

/**
 * Gets a Block component by its type.
 * @param typename Component's type name, for example: BannerBlock.
 * @returns a Block component.
 */
export function getComponent(
  typename: string
): (props: any) => JSX.Element | Promise<JSX.Element> {
  return Components[typename];
}

const Components: {
  [typename: string]: (props: any) => JSX.Element | Promise<JSX.Element>;
} = {
  BannerBlock,
  BlockTemplateBlock,
  FooterColumnBlock,
  ImageBlock,
  NavigationLinksBlock,
  OrganizationBlock,
  PrimaryNavigationBannerBlock,
  PrimaryNavigationCategoriesBlock,
  PrimaryNavigationColumnBlock,
  PrimaryNavigationLinkBlock,
  ProductsBlock,
  SecondaryNavigationLinkBlock,
  TextBlock,
  TwoColumnsBlock,
};
